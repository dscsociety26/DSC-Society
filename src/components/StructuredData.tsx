import { useEffect } from "react";

const SITE_URL = "https://dscsociety.org";

const StructuredData = () => {
  useEffect(() => {
    const existing = document.getElementById("dsc-structured-data");

    if (existing) {
      existing.remove();
    }

    const script = document.createElement("script");
    script.id = "dsc-structured-data";
    script.type = "application/ld+json";

    script.textContent = JSON.stringify({
      "@context": "https://schema.org",
      "@graph": [
        {
          "@type": "Organization",
          "@id": `${SITE_URL}/#organization`,
          name: "Dharitree Samrakshana Chaitanyam (DSC) Society",
          alternateName: "DSC Society",
          url: SITE_URL,
          description:
            "A youth-driven environmental organization promoting environmental protection, sustainability, waste management, community service and youth participation.",
          logo: {
            "@type": "ImageObject",
            url: `${SITE_URL}/dsc-preview.png`,
          },
        },
        {
          "@type": "WebSite",
          "@id": `${SITE_URL}/#website`,
          url: SITE_URL,
          name: "DSC Society",
          description:
            "Environmental protection, sustainability, waste management, community service and youth participation.",
          publisher: {
            "@id": `${SITE_URL}/#organization`,
          },
        },
      ],
    });

    document.head.appendChild(script);

    return () => {
      script.remove();
    };
  }, []);

  return null;
};

export default StructuredData;
