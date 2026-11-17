import { businessInfo } from "@/data/businessInfo";
import { menuItems } from "@/data/menuData";

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
  acceptsReservations: boolean;
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
}

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
    acceptsReservations: true,
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
    amenityFeature: businessInfo.services.map((service) => ({
      "@type": "LocationFeatureSpecification",
      name: service,
      value: true,
    })),
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
