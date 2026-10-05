import { getSiteUrl, SITE_OG_IMAGE_URL } from "@/lib/site";

/**
 * Hotel structured data for search engines. Rendered as JSON-LD only,
 * so it does not appear on the page.
 */
export default function HotelJsonLd() {
  const siteUrl = getSiteUrl();
  const data = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": `${siteUrl}/#website`,
        url: siteUrl,
        name: "Lemach Hotel Kilifi",
        alternateName: "Lemach Hotel & Accommodations",
        description:
          "Lemach Hotel is a place to stay in Kilifi, Kenya, with rooms, dining, and events just off the B69 Highway.",
        inLanguage: "en-KE",
        publisher: { "@id": `${siteUrl}/#hotel` },
      },
      {
        "@type": ["Hotel", "LodgingBusiness"],
        "@id": `${siteUrl}/#hotel`,
        name: "Lemach Hotel",
        alternateName: [
          "Lemach Hotel Kilifi",
          "Le Mach Hotel",
          "Lemach Hotel & Accommodations",
        ],
        description:
          "Lemach Hotel in Kilifi County, Kenya. Rooms, a restaurant and bar, conference space, gardens, and a swimming pool, just off the B69 Highway.",
        url: siteUrl,
        image: SITE_OG_IMAGE_URL,
        telephone: "+254721929446",
        email: "lemachstudios@gmail.com",
        foundingDate: "2010",
        checkinTime: "14:00",
        checkoutTime: "11:00",
        currenciesAccepted: "KES",
        paymentAccepted: "M-Pesa",
        address: {
          "@type": "PostalAddress",
          streetAddress: "B69 Highway",
          addressLocality: "Kilifi",
          addressRegion: "Kilifi County",
          addressCountry: "KE",
        },
        areaServed: {
          "@type": "AdministrativeArea",
          name: "Kilifi County",
        },
        containedInPlace: {
          "@type": "City",
          name: "Kilifi",
          containedInPlace: {
            "@type": "AdministrativeArea",
            name: "Kilifi County",
            containedInPlace: {
              "@type": "Country",
              name: "Kenya",
            },
          },
        },
        amenityFeature: [
          "Free WiFi",
          "Air conditioning",
          "Private bathroom",
          "Swimming pool",
          "Restaurant",
          "Bar",
          "Conference rooms",
          "Gardens",
        ].map((name) => ({
          "@type": "LocationFeatureSpecification",
          name,
          value: true,
        })),
        award: "Best Hotel in Kilifi County, Tourism Excellence Awards 2023",
        potentialAction: {
          "@type": "ReserveAction",
          name: "Check availability at Lemach Hotel Kilifi",
          target: {
            "@type": "EntryPoint",
            urlTemplate: `${siteUrl}/booking`,
            actionPlatform: [
              "http://schema.org/DesktopWebPlatform",
              "http://schema.org/MobileWebPlatform",
            ],
          },
        },
      },
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data).replace(/</g, "\\u003c"),
      }}
    />
  );
}
