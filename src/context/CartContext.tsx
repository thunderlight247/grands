"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  useSyncExternalStore,
  type ReactNode,
} from "react";
import { getMenuItem, type MenuItem } from "@/data/menuData";

const STORAGE_KEY = "grand-gees-cart-v1";
const MAX_QUANTITY = 50;

interface CartLine {
  id: string;
  quantity: number;
}

export interface CartItem extends MenuItem {
  quantity: number;
}

/* ------------------------------------------------------------------ */
/* localStorage-backed external store                                 */
/* ------------------------------------------------------------------ */

const EMPTY: readonly CartLine[] = [];
let lines: readonly CartLine[] = EMPTY;
let loaded = false;
const listeners = new Set<() => void>();

function isCartLine(value: unknown): value is CartLine {
  if (typeof value !== "object" || value === null) return false;
  const record = value as Record<string, unknown>;
  return (
    typeof record.id === "string" &&
    typeof record.quantity === "number" &&
    Number.isInteger(record.quantity) &&
    record.quantity > 0
  );
}

function readStorage(): readonly CartLine[] {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return EMPTY;
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return EMPTY;
    // Drop lines for dishes that were removed from the menu or sold out.
    return parsed
      .filter(isCartLine)
      .filter((line) => getMenuItem(line.id)?.available === true)
      .map((line) => ({ id: line.id, quantity: Math.min(line.quantity, MAX_QUANTITY) }));
  } catch {
    return EMPTY;
  }
}

function emit() {
  listeners.forEach((listener) => listener());
}

function writeLines(next: readonly CartLine[]) {
  lines = next;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  } catch {
    // Storage full or blocked (private mode): keep the in-memory cart.
  }
  emit();
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  const onStorage = (event: StorageEvent) => {
    if (event.key === STORAGE_KEY) {
      lines = readStorage();
      emit();
    }
  };
  window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", onStorage);
  };
}

function getSnapshot(): readonly CartLine[] {
  if (!loaded) {
    loaded = true;
    lines = readStorage();
  }
  return lines;
}

function getServerSnapshot(): readonly CartLine[] {
  return EMPTY;
}

/* ------------------------------------------------------------------ */
/* React context                                                       */
/* ------------------------------------------------------------------ */

interface CartContextValue {
  items: readonly CartItem[];
  itemCount: number;
  subtotal: number;
  getQuantity: (id: string) => number;
  addItem: (id: string) => void;
  increment: (id: string) => void;
  decrement: (id: string) => void;
  removeItem: (id: string) => void;
  clearCart: () => void;
  isDrawerOpen: boolean;
  openDrawer: () => void;
  closeDrawer: () => void;
}

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const cartLines = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const [isDrawerOpen, setDrawerOpen] = useState(false);

  const items = useMemo<CartItem[]>(
    () =>
      cartLines.flatMap((line) => {
        const item = getMenuItem(line.id);
        return item ? [{ ...item, quantity: line.quantity }] : [];
      }),
    [cartLines],
  );

  const setQuantity = useCallback((id: string, quantity: number) => {
    const current = getSnapshot();
    const clamped = Math.max(0, Math.min(quantity, MAX_QUANTITY));
    if (clamped === 0) {
      writeLines(current.filter((line) => line.id !== id));
      return;
    }
    const exists = current.some((line) => line.id === id);
    writeLines(
      exists
        ? current.map((line) => (line.id === id ? { ...line, quantity: clamped } : line))
        : [...current, { id, quantity: clamped }],
    );
  }, []);

  const getQuantity = useCallback(
    (id: string) => cartLines.find((line) => line.id === id)?.quantity ?? 0,
    [cartLines],
  );

  const value = useMemo<CartContextValue>(
    () => ({
      items,
      itemCount: items.reduce((sum, item) => sum + item.quantity, 0),
      subtotal: items.reduce((sum, item) => sum + item.price * item.quantity, 0),
      getQuantity,
      addItem: (id) => {
        if (getMenuItem(id)?.available) setQuantity(id, getQuantity(id) + 1);
      },
      increment: (id) => setQuantity(id, getQuantity(id) + 1),
      decrement: (id) => setQuantity(id, getQuantity(id) - 1),
      removeItem: (id) => setQuantity(id, 0),
      clearCart: () => writeLines(EMPTY),
      isDrawerOpen,
      openDrawer: () => setDrawerOpen(true),
      closeDrawer: () => setDrawerOpen(false),
    }),
    [items, getQuantity, setQuantity, isDrawerOpen],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartContextValue {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used inside <CartProvider>.");
  }
  return context;
}
