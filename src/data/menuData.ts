export type MenuCategory = "Soups & Swallow" | "Stews & Yam" | "Rice & Platters";

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  category: MenuCategory;
  /** Price in Ghana cedis (GHS). */
  price: number;
  /** Local path under /public. */
  image: string;
  /** Intrinsic pixel size of the image file, used by next/image. */
  imageWidth: number;
  imageHeight: number;
  imageAlt: string;
  available: boolean;
  /** Highlighted as a house favourite. */
  signature?: boolean;
}

/** Order the category tabs appear in. Empty categories are hidden automatically. */
export const MENU_CATEGORIES: readonly MenuCategory[] = [
  "Rice & Platters",
  "Soups & Swallow",
  "Stews & Yam",
];

/**
 * Prices are starting points inside the GHS 100–150 average range.
 * Confirm each price against the current in-house menu before launch.
 */
export const menuItems: readonly MenuItem[] = [
  {
    id: "grand-mixed-platter",
    name: "Grand Mixed Platter",
    description:
      "Smoky party jollof, vegetable fried rice and stir-fried spaghetti with peppered beef, fried plantain and a spicy grilled chicken wing.",
    category: "Rice & Platters",
    price: 150,
    image: "/images/hero-mixed-platter.jpg",
    imageWidth: 720,
    imageHeight: 718,
    imageAlt:
      "Plate of jollof rice, vegetable fried rice, spaghetti with peppers, fried plantain, peppered beef and grilled chicken",
    available: true,
    signature: true,
  },
  {
    id: "seafood-okra-soup",
    name: "Seafood Okra Soup",
    description:
      "Fresh chopped okra and greens simmered in palm-oil broth with jumbo prawns, ponmo and tender beef.",
    category: "Soups & Swallow",
    price: 140,
    image: "/images/okra-soup-seafood.jpg",
    imageWidth: 720,
    imageHeight: 713,
    imageAlt: "Bowl of okra soup with prawns, ponmo, beef and leafy greens",
    available: true,
    signature: true,
  },
  {
    id: "fufu-goat-light-soup",
    name: "Fufu & Goat Light Soup",
    description:
      "Smooth pounded fufu in a peppery tomato light soup loaded with goat meat and garden eggs.",
    category: "Soups & Swallow",
    price: 120,
    image: "/images/fufu-goat-light-soup.jpg",
    imageWidth: 720,
    imageHeight: 719,
    imageAlt: "Fufu served in an earthenware bowl of light soup with goat meat",
    available: true,
    signature: true,
  },
  {
    id: "egusi-pounded-yam",
    name: "Egusi Soup & Pounded Yam",
    description:
      "Rich melon-seed egusi with bitter leaf and assorted meat, served with soft pounded yam.",
    category: "Soups & Swallow",
    price: 130,
    image: "/images/egusi-soup-pounded-yam.jpg",
    imageWidth: 720,
    imageHeight: 837,
    imageAlt: "Egusi soup with assorted meat beside portions of pounded yam",
    available: true,
  },
  {
    id: "afang-soup-eba",
    name: "Afang Soup & Eba",
    description:
      "Afang and waterleaf soup cooked down with periwinkle, stockfish and assorted meat, with eba on the side.",
    category: "Soups & Swallow",
    price: 140,
    image: "/images/afang-soup-eba.jpg",
    imageWidth: 720,
    imageHeight: 846,
    imageAlt: "Dark green afang soup with assorted meat next to a bowl of eba",
    available: true,
  },
  {
    id: "ewedu-stew-swallow",
    name: "Ewedu, Stew & Swallow",
    description:
      "Silky ewedu with spicy tomato-pepper stew and cow foot, served with a smooth white swallow.",
    category: "Soups & Swallow",
    price: 110,
    image: "/images/swallow-ewedu-stew.jpg",
    imageWidth: 720,
    imageHeight: 715,
    imageAlt: "White swallow with ewedu soup, red pepper stew and cow foot",
    available: true,
  },
  {
    id: "assorted-pepper-soup",
    name: "Assorted Pepper Soup with Yam",
    description:
      "Hot, aromatic pepper soup with tripe, kidney and assorted meat, finished with scent leaf and boiled yam.",
    category: "Soups & Swallow",
    price: 120,
    image: "/images/assorted-pepper-soup.jpg",
    imageWidth: 720,
    imageHeight: 735,
    imageAlt: "Bowl of assorted meat pepper soup with chunks of yam and scent leaf",
    available: true,
  },
  {
    id: "efo-riro",
    name: "Efo Riro",
    description:
      "Rich spinach stew with locust beans, peppers and assorted beef. Pairs with any swallow or rice.",
    category: "Stews & Yam",
    price: 120,
    image: "/images/efo-riro.jpg",
    imageWidth: 720,
    imageHeight: 724,
    imageAlt: "White bowl of efo riro spinach stew with assorted meat",
    available: true,
  },
  {
    id: "egusi-smoked-fish",
    name: "Egusi Stew with Smoked Fish",
    description:
      "Palm-oil egusi stew loaded with smoked mackerel and dried fish. Bold, smoky and generously portioned.",
    category: "Stews & Yam",
    price: 130,
    image: "/images/egusi-smoked-fish.jpg",
    imageWidth: 720,
    imageHeight: 669,
    imageAlt: "Close-up of orange egusi stew with smoked mackerel and dried fish",
    available: true,
  },
  {
    id: "yam-palava-sauce",
    name: "Yam, Palava Sauce & Avocado",
    description:
      "Boiled yam with kontomire-egusi palava sauce, smoked fish, garden eggs and fresh avocado slices.",
    category: "Stews & Yam",
    price: 100,
    image: "/images/yam-palava-sauce-avocado.jpg",
    imageWidth: 720,
    imageHeight: 899,
    imageAlt:
      "Earthenware bowl of boiled yam slices, avocado, palava sauce with smoked fish and peppers",
    available: true,
  },
];

const menuById = new Map<string, MenuItem>(menuItems.map((item) => [item.id, item]));

export function getMenuItem(id: string): MenuItem | undefined {
  return menuById.get(id);
}
