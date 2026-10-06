import { useEffect, useState } from "react";
import { X } from "lucide-react";
import SectionFadeIn from "../components/SectionFadeIn";
import { supabase } from "../lib/supabase";

type GalleryItem = {
  id: string;
  title: string;
  image_url: string;
  caption: string | null;
  category: string | null;
  display_order: number;
};

type GalleryCategory = {
  id: string;
  name: string;
  slug: string;
  display_order: number;
  status: string;
};

export default function Gallery() {
  const [images, setImages] = useState<GalleryItem[]>([]);
  const [categories, setCategories] = useState<GalleryCategory[]>([]);
  const [filter, setFilter] = useState("All");
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadGallery = async () => {
      setLoading(true);
      setError("");

      const [galleryResult, categoryResult] = await Promise.all([
        supabase
          .from("gallery")
          .select(
            "id, title, image_url, caption, category, display_order"
          )
          .eq("status", "published")
          .not("category", "is", null)
          .order("display_order", { ascending: true }),

        supabase
          .from("gallery_categories")
          .select("id, name, slug, display_order, status")
          .eq("status", "active")
          .order("display_order", { ascending: true }),
      ]);

      if (galleryResult.error) {
        console.error("Gallery load error:", galleryResult.error);
        setError("Unable to load gallery.");
        setImages([]);
      } else {
        setImages(galleryResult.data ?? []);
      }

      if (categoryResult.error) {
        console.error(
          "Gallery categories load error:",
          categoryResult.error
        );
        setError("Unable to load gallery categories.");
        setCategories([]);
      } else {
        setCategories(categoryResult.data ?? []);
      }

      setLoading(false);
    };

    void loadGallery();
  }, []);

  const categoryNames = [
    "All",
    ...categories.map((category) => category.name),
  ];

  const filtered =
    filter === "All"
      ? images
      : images.filter((image) => image.category === filter);

  const heroImage = images[0]?.image_url;

  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <section className="relative flex min-h-[55vh] items-center justify-center overflow-hidden">
        {heroImage ? (
          <img
            src={heroImage}
            alt="DSC Society Gallery"
            className="absolute inset-0 h-full w-full object-cover"
          />
        ) : (
          <div className="absolute inset-0 bg-slate-900" />
        )}

        <div className="absolute inset-0 bg-black/55" />

        <div className="relative z-10 mx-auto max-w-4xl px-6 text-center text-white">
          <SectionFadeIn>
            <p className="mb-4 text-sm font-semibold uppercase tracking-[0.3em] text-white/80">
              DSC Society
            </p>

            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
              Our Gallery
            </h1>

            <p className="mx-auto mt-6 max-w-2xl text-base leading-7 text-white/85 sm:text-lg">
              Moments from our environmental, social responsibility and
              community initiatives.
            </p>
          </SectionFadeIn>
        </div>
      </section>

      {/* Gallery */}
      <section className="px-6 py-16 sm:px-10 lg:px-16">
        <div className="mx-auto max-w-7xl">
          {/* Filters */}
          <div className="mb-10 flex flex-wrap justify-center gap-3">
            {categoryNames.map((category) => (
              <button
                key={category}
                type="button"
                onClick={() => setFilter(category)}
                className={`rounded-full px-5 py-2.5 text-sm font-medium transition ${
                  filter === category
                    ? "bg-black text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {category}
              </button>
            ))}
          </div>

          {loading && (
            <div className="py-20 text-center text-gray-500">
              Loading gallery...
            </div>
          )}

          {!loading && error && (
            <div className="py-20 text-center text-red-600">
              {error}
            </div>
          )}

          {!loading && !error && filtered.length === 0 && (
            <div className="py-20 text-center text-gray-500">
              No gallery images available.
            </div>
          )}

          {!loading && !error && filtered.length > 0 && (
            <div className="columns-1 gap-5 sm:columns-2 lg:columns-3">
              {filtered.map((image, index) => (
                <button
                  key={image.id}
                  type="button"
                  onClick={() => setSelectedImage(image.image_url)}
                  className="group mb-5 block w-full overflow-hidden rounded-2xl text-left"
                >
                  <img
                    src={image.image_url}
                    alt={
                      image.caption ||
                      image.title ||
                      image.category ||
                      "DSC Society Gallery"
                    }
                    loading={index < 6 ? "eager" : "lazy"}
                    className="h-auto w-full object-cover transition duration-500 group-hover:scale-[1.02]"
                  />

                  {image.caption && (
                    <div className="px-1 pt-2">
                      <p className="text-sm text-gray-600">
                        {image.caption}
                      </p>
                    </div>
                  )}
                </button>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Lightbox */}
      {selectedImage && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4"
          onClick={() => setSelectedImage(null)}
        >
          <button
            type="button"
            onClick={() => setSelectedImage(null)}
            className="absolute right-5 top-5 rounded-full bg-white/10 p-2 text-white transition hover:bg-white/20"
            aria-label="Close image"
          >
            <X size={28} />
          </button>

          <img
            src={selectedImage}
            alt="Gallery preview"
            className="max-h-[90vh] max-w-[95vw] rounded-lg object-contain"
            onClick={(event) => event.stopPropagation()}
          />
        </div>
      )}
    </div>
  );
}
