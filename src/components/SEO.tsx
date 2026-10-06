import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const SITE_URL = "https://dscsociety.org";

type SEOConfig = {
  title: string;
  description: string;
  noindex?: boolean;
};

const seoByPath: Record<string, SEOConfig> = {
  "/": {
    title: "DSC Society | Environmental Protection & Community Development",
    description:
      "Dharitree Samrakshana Chaitanyam (DSC) Society promotes environmental protection, sustainability, waste management, community service and youth participation.",
  },
  "/about": {
    title: "About DSC Society | Environmental Protection & Community Development",
    description:
      "Learn about Dharitree Samrakshana Chaitanyam (DSC) Society, its mission, environmental initiatives and commitment to community development.",
  },
  "/activities": {
    title: "DSC Society Activities | Environmental & Community Initiatives",
    description:
      "Explore DSC Society activities focused on environmental protection, sustainability, waste management and community participation.",
  },
  "/events": {
    title: "DSC Society Events | Environmental & Community Programs",
    description:
      "Discover upcoming and completed DSC Society events, programs and community initiatives.",
  },
  "/focus-areas": {
    title: "DSC Society Focus Areas | Environment & Sustainability",
    description:
      "Explore the key focus areas of DSC Society, including environmental protection, sustainability, waste management and community development.",
  },
  "/gallery": {
    title: "DSC Society Gallery | Environmental & Community Initiatives",
    description:
      "View photographs and highlights from DSC Society environmental, community and social responsibility initiatives.",
  },
  "/join-us": {
    title: "Join DSC Society | Volunteer & Internship Opportunities",
    description:
      "Join DSC Society as a volunteer or intern and contribute to environmental protection, sustainability and community development.",
  },
  "/contact": {
    title: "Contact DSC Society | Get in Touch",
    description:
      "Contact DSC Society for volunteering, internships, environmental initiatives, partnerships and community programs.",
  },
};

const defaultSEO: SEOConfig = {
  title: "DSC Society | Environmental Protection & Community Development",
  description:
    "Dharitree Samrakshana Chaitanyam (DSC) Society promotes environmental protection, sustainability, waste management, community service and youth participation.",
};

const setMeta = (name: string, content: string) => {
  let element = document.querySelector(
    `meta[name="${name}"]`
  ) as HTMLMetaElement | null;

  if (!element) {
    element = document.createElement("meta");
    element.setAttribute("name", name);
    document.head.appendChild(element);
  }

  element.setAttribute("content", content);
};

const setPropertyMeta = (property: string, content: string) => {
  let element = document.querySelector(
    `meta[property="${property}"]`
  ) as HTMLMetaElement | null;

  if (!element) {
    element = document.createElement("meta");
    element.setAttribute("property", property);
    document.head.appendChild(element);
  }

  element.setAttribute("content", content);
};

const setCanonical = (url: string) => {
  let element = document.querySelector(
    'link[rel="canonical"]'
  ) as HTMLLinkElement | null;

  if (!element) {
    element = document.createElement("link");
    element.setAttribute("rel", "canonical");
    document.head.appendChild(element);
  }

  element.setAttribute("href", url);
};

const SEO = () => {
  const location = useLocation();

  useEffect(() => {
    const pathname = location.pathname;

    const isAdminRoute = pathname.startsWith("/admin");
    const config =
      seoByPath[pathname] ??
      (pathname.startsWith("/team/")
        ? {
            title: "DSC Society Team | Environmental & Community Leadership",
            description:
              "Meet the team members contributing to DSC Society's environmental and community development initiatives.",
          }
        : defaultSEO);

    const noindex = isAdminRoute || pathname === "/404";

    const canonicalUrl = `${SITE_URL}${
      pathname === "/" ? "/" : pathname
    }`;

    document.title = config.title;

    setMeta("description", config.description);
    setMeta(
      "robots",
      noindex ? "noindex, nofollow" : "index, follow"
    );

    setPropertyMeta("og:title", config.title);
    setPropertyMeta("og:description", config.description);
    setPropertyMeta("og:url", canonicalUrl);
    setPropertyMeta("og:type", "website");
    setPropertyMeta(
      "og:image",
      `${SITE_URL}/dsc-preview.png`
    );

    setMeta("twitter:title", config.title);
    setMeta("twitter:description", config.description);
    setMeta(
      "twitter:image",
      `${SITE_URL}/dsc-preview.png`
    );

    setCanonical(canonicalUrl);
  }, [location.pathname]);

  return null;
};

export default SEO;
