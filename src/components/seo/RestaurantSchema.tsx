import { businessInfo } from "@/data/businessInfo";
import { MENU_CATEGORIES, menuItems } from "@/data/menuData";

interface OpeningHoursSpecification {
  "@type": "OpeningHoursSpecification";
  dayOfWeek: string[];
  opens: string;
  closes: string;
}

interface RestaurantJsonLd {
  "@context": "https://schema.org";
  "@type": "Restaurant";
  "@id": string;
  name: string;
  description: string;
  url: string;
  image: string[];
  telephone: string;
  priceRange: string;
  currenciesAccepted: string;
  servesCuisine: string[];
  hasMap: string;
  address: {
    "@type": "PostalAddress";
    streetAddress: string;
    addressLocality: string;
    addressRegion: string;
    addressCountry: string;
  };
  geo: { "@type": "GeoCoordinates"; latitude: number; longitude: number };
  openingHoursSpecification: OpeningHoursSpecification[];
  amenityFeature: { "@type": "LocationFeatureSpecification"; name: string; value: boolean }[];
  hasMenu: {
    "@type": "Menu";
    url: string;
    inLanguage: string;
    hasMenuSection: {
      "@type": "MenuSection";
      name: string;
      hasMenuItem: {
        "@type": "MenuItem";
        name: string;
        description: string;
        image: string;
        offers: { "@type": "Offer"; price: string; priceCurrency: string; availability: string };
      }[];
    }[];
  };
}

/** Amenities are physical services; ordering channels are not amenities. */
const NON_AMENITY_SERVICES = new Set(["WhatsApp Ordering"]);

function buildSchema(): RestaurantJsonLd {
  const site = businessInfo.siteUrl.replace(/\/$/, "");
  const { address, hours } = businessInfo;

  return {
    "@context": "https://schema.org",
    "@type": "Restaurant",
    "@id": `${site}/#restaurant`,
    name: businessInfo.name,
    description: businessInfo.description,
    url: site,
    image: menuItems.filter((item) => item.signature).map((item) => `${site}${item.image}`),
    telephone: businessInfo.phoneE164,
    priceRange: businessInfo.priceRangeSchema,
    currenciesAccepted: businessInfo.currency,
    servesCuisine: [...businessInfo.cuisines],
    hasMap: businessInfo.googleMapsUrl,
    address: {
      "@type": "PostalAddress",
      streetAddress: address.streetAddress,
      addressLocality: address.locality,
      addressRegion: address.region,
      addressCountry: address.countryCode,
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: businessInfo.geo.latitude,
      longitude: businessInfo.geo.longitude,
    },
    // schema.org expresses after-midnight closing as a "closes" earlier than "opens".
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: [...hours.days],
        opens: hours.opens,
        closes: hours.closes,
      },
    ],
    amenityFeature: businessInfo.services
      .filter((service) => !NON_AMENITY_SERVICES.has(service))
      .map((service) => ({
        "@type": "LocationFeatureSpecification",
        name: service,
        value: true,
      })),
    hasMenu: {
      "@type": "Menu",
      url: `${site}/#menu`,
      inLanguage: "en",
      hasMenuSection: MENU_CATEGORIES.map((category) => ({
        "@type": "MenuSection" as const,
        name: category,
        hasMenuItem: menuItems
          .filter((item) => item.category === category)
          .map((item) => ({
            "@type": "MenuItem" as const,
            name: item.name,
            description: item.description,
            image: `${site}${item.image}`,
            offers: {
              "@type": "Offer" as const,
              price: item.price.toFixed(2),
              priceCurrency: businessInfo.currency,
              availability: item.available ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
            },
          })),
      })).filter((section) => section.hasMenuItem.length > 0),
    },
  };
}

export default function RestaurantSchema() {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(buildSchema()).replace(/</g, "\\u003c"),
      }}
    />
  );
}
