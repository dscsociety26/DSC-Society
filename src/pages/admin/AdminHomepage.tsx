import { useEffect, useRef, useState } from "react";
import type { FormEvent } from "react";
import { supabase } from "../../lib/supabase";

type Status = "draft" | "published";

type MediaType = "image" | "video";

type HeroSlide = {
  id: string;
  title: string | null;
  subtitle: string | null;
  description: string | null;
  media_type: MediaType;
  image_url: string | null;
  video_url: string | null;
  poster_url: string | null;
  button_text: string | null;
  button_link: string | null;
  display_order: number;
  status: Status;
  created_at: string;
  updated_at: string;
};

type Statistic = {
  id: string;
  value: number;
  suffix: string;
  label: string;
  display_order: number;
  status: Status;
  created_at: string;
  updated_at: string;
};

type HeroForm = {
  title: string;
  subtitle: string;
  description: string;
  media_type: MediaType;
  image_url: string;
  video_url: string;
  poster_url: string;
  button_text: string;
  button_link: string;
  display_order: number;
  status: Status;
};

type StatisticForm = {
  value: string;
  suffix: string;
  label: string;
  display_order: number;
  status: Status;
};

const BUCKET = "dsc-media 5";
const MAX_FILE_SIZE = 5 * 1024 * 1024;
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"];

const initialHeroForm: HeroForm = {
  title: "",
  subtitle: "",
  description: "",
  media_type: "image",
  image_url: "",
  video_url: "",
  poster_url: "",
  button_text: "",
  button_link: "",
  display_order: 0,
  status: "draft",
};

const initialStatisticForm: StatisticForm = {
  value: "",
  suffix: "+",
  label: "",
  display_order: 0,
  status: "draft",
};

const statusStyles: Record<Status, string> = {
  draft: "bg-amber-100 text-amber-800",
  published: "bg-emerald-100 text-emerald-800",
};

export default function AdminHomepage() {
  const [slides, setSlides] = useState<HeroSlide[]>([]);
  const [statistics, setStatistics] = useState<Statistic[]>([]);

  const [heroForm, setHeroForm] = useState<HeroForm>(initialHeroForm);
  const [statisticForm, setStatisticForm] =
    useState<StatisticForm>(initialStatisticForm);

  const [editingSlideId, setEditingSlideId] = useState<string | null>(null);
  const [editingStatisticId, setEditingStatisticId] =
    useState<string | null>(null);

  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [selectedPoster, setSelectedPoster] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [posterPreviewUrl, setPosterPreviewUrl] = useState("");
  const [galleryImages, setGalleryImages] = useState<
    { id: string; title: string; image_url: string; caption: string | null }[]
  >([]);
  const [showGalleryPicker, setShowGalleryPicker] = useState(false);
  const [showPosterGalleryPicker, setShowPosterGalleryPicker] = useState(false);

  const [loading, setLoading] = useState(true);
  const [savingHero, setSavingHero] = useState(false);
  const [savingStatistic, setSavingStatistic] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    void loadData();
  }, []);

  useEffect(() => {
    return () => {
      if (previewUrl.startsWith("blob:")) {
        URL.revokeObjectURL(previewUrl);
      }

      if (posterPreviewUrl.startsWith("blob:")) {
        URL.revokeObjectURL(posterPreviewUrl);
      }
    };
  }, [previewUrl, posterPreviewUrl]);

  async function loadData() {
    setLoading(true);
    setError("");

    const [slidesResult, statisticsResult, galleryResult] =
      await Promise.all([
        supabase
          .from("homepage_slides")
          .select("*")
          .order("display_order", { ascending: true })
          .order("created_at", { ascending: false }),

        supabase
          .from("homepage_statistics")
          .select("*")
          .order("display_order", { ascending: true })
          .order("created_at", { ascending: false }),

        supabase
          .from("gallery")
          .select("id, title, image_url, caption")
          .eq("status", "published")
          .order("display_order", { ascending: true })
          .order("created_at", { ascending: false }),
      ]);

    if (slidesResult.error) {
      setError(slidesResult.error.message);
    } else {
      setSlides((slidesResult.data ?? []) as HeroSlide[]);
    }

    if (statisticsResult.error) {
      setError(statisticsResult.error.message);
    } else {
      setStatistics((statisticsResult.data ?? []) as Statistic[]);
    }

    if (galleryResult.error) {
      setError(galleryResult.error.message);
    } else {
      setGalleryImages(galleryResult.data ?? []);
    }

    setLoading(false);
  }

  function handleImageChange(file: File | undefined) {
    if (!file) return;

    if (!ALLOWED_TYPES.includes(file.type)) {
      setError("Please select a JPG, PNG, or WEBP image.");
      return;
    }

    if (file.size > MAX_FILE_SIZE) {
      setError("Image size must be less than 5 MB.");
      return;
    }

    setError("");
    setSuccess("");

    setSelectedImage(file);
    setPreviewUrl(URL.createObjectURL(file));
  }

  function handlePosterChange(file: File | undefined) {
    if (!file) return;

    if (!ALLOWED_TYPES.includes(file.type)) {
      setError("Please select a JPG, PNG, or WEBP poster image.");
      return;
    }

    if (file.size > MAX_FILE_SIZE) {
      setError("Poster image size must be less than 5 MB.");
      return;
    }

    setError("");
    setSuccess("");

    setSelectedPoster(file);
    setPosterPreviewUrl(URL.createObjectURL(file));
  }

  function resetHeroForm() {
    setHeroForm(initialHeroForm);
    setEditingSlideId(null);
    setSelectedImage(null);
    setSelectedPoster(null);
    setPreviewUrl("");
    setPosterPreviewUrl("");
    setShowGalleryPicker(false);
    setShowPosterGalleryPicker(false);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }

  function editSlide(slide: HeroSlide) {
    setEditingSlideId(slide.id);

    setHeroForm({
      title: slide.title,
      subtitle: slide.subtitle ?? "",
      description: slide.description ?? "",
      media_type: slide.media_type ?? "image",
      image_url: slide.image_url ?? "",
      video_url: slide.video_url ?? "",
      poster_url: slide.poster_url ?? "",
      button_text: slide.button_text ?? "",
      button_link: slide.button_link ?? "",
      display_order: slide.display_order,
      status: slide.status,
    });

    setSelectedImage(null);
    setSelectedPoster(null);
    setPreviewUrl(slide.image_url ?? "");
    setPosterPreviewUrl(slide.poster_url ?? "");
    setShowGalleryPicker(false);
    setShowPosterGalleryPicker(false);
    setError("");
    setSuccess("");

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }

    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function isValidVideoUrl(value: string): boolean {
    try {
      const url = new URL(value.trim());

      if (!["http:", "https:"].includes(url.protocol)) {
        return false;
      }

      const hostname = url.hostname.toLowerCase();

      if (
        hostname === "youtube.com" ||
        hostname === "www.youtube.com" ||
        hostname === "m.youtube.com" ||
        hostname === "youtu.be" ||
        hostname === "www.youtu.be" ||
        hostname === "youtube-nocookie.com" ||
        hostname === "www.youtube-nocookie.com"
      ) {
        return true;
      }

      const pathname = url.pathname.toLowerCase();

      return (
        pathname.endsWith(".mp4") ||
        pathname.endsWith(".webm") ||
        pathname.endsWith(".ogg")
      );
    } catch {
      return false;
    }
  }

  async function uploadImageFile(
    file: File,
    prefix: string
  ): Promise<string> {
    const extension =
      file.name.split(".").pop()?.toLowerCase() || "jpg";

    const filePath = `${prefix}/${crypto.randomUUID()}.${extension}`;

    const { error: uploadError } = await supabase.storage
      .from(BUCKET)
      .upload(filePath, file, {
        cacheControl: "3600",
        upsert: false,
        contentType: file.type,
      });

    if (uploadError) {
      throw new Error(`Image upload failed: ${uploadError.message}`);
    }

    const { data } = supabase.storage
      .from(BUCKET)
      .getPublicUrl(filePath);

    return data.publicUrl;
  }

  async function uploadHeroImage(): Promise<string> {
    if (!selectedImage) {
      if (heroForm.image_url) {
        return heroForm.image_url;
      }

      throw new Error("Please select a hero image.");
    }

    return uploadImageFile(selectedImage, "homepage");
  }

  async function uploadPosterImage(): Promise<string> {
    if (!selectedPoster) {
      return heroForm.poster_url.trim();
    }

    return uploadImageFile(selectedPoster, "homepage/posters");
  }


  async function handleHeroSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setError("");
    setSuccess("");

    const title = heroForm.title.trim();
    const mediaType = heroForm.media_type;
    const videoUrl = heroForm.video_url.trim();

    if (mediaType === "image") {
      if (!selectedImage && !heroForm.image_url.trim()) {
        setError("Please select a hero image or choose an image from the gallery.");
        return;
      }
    }

    if (mediaType === "video") {
      if (!videoUrl) {
        setError("Please provide a video URL.");
        return;
      }

      if (!isValidVideoUrl(videoUrl)) {
        setError(
          "Please enter a valid YouTube URL or a direct MP4, WebM, or OGG video URL."
        );
        return;
      }
    }

    if (heroForm.button_text.trim() && !heroForm.button_link.trim()) {
      setError("Please provide a button link when button text is entered.");
      return;
    }

    if (heroForm.button_link.trim() && !heroForm.button_text.trim()) {
      setError("Please provide button text when a button link is entered.");
      return;
    }

    setSavingHero(true);

    try {
      let imageUrl: string | null = null;
      let posterUrl: string | null = null;

      if (mediaType === "image") {
        imageUrl = await uploadHeroImage();
      } else {
        posterUrl = await uploadPosterImage();

        if (!posterUrl && heroForm.poster_url.trim()) {
          posterUrl = heroForm.poster_url.trim();
        }
      }

      const payload = {
        title,
        subtitle: heroForm.subtitle.trim() || null,
        description: heroForm.description.trim() || null,
        media_type: mediaType,
        image_url: imageUrl,
        video_url: mediaType === "video" ? videoUrl : null,
        poster_url: posterUrl,
        button_text: heroForm.button_text.trim() || null,
        button_link: heroForm.button_link.trim() || null,
        display_order: Number(heroForm.display_order) || 0,
        status: heroForm.status,
      };

      if (editingSlideId) {
        const { error: updateError } = await supabase
          .from("homepage_slides")
          .update(payload)
          .eq("id", editingSlideId);

        if (updateError) {
          throw new Error(updateError.message);
        }

        setSuccess("Hero slide updated successfully.");
      } else {
        const { error: insertError } = await supabase
          .from("homepage_slides")
          .insert(payload);

        if (insertError) {
          throw new Error(insertError.message);
        }

        setSuccess("Hero slide created successfully.");
      }

      resetHeroForm();
      await loadData();
    } catch (submitError) {
      setError(
        submitError instanceof Error
          ? submitError.message
          : "Failed to save hero slide."
      );
    } finally {
      setSavingHero(false);
    }
  }


  function editStatistic(statistic: Statistic) {
    setEditingStatisticId(statistic.id);

    setStatisticForm({
      value: String(statistic.value),
      suffix: statistic.suffix,
      label: statistic.label,
      display_order: statistic.display_order,
      status: statistic.status,
    });

    setError("");
    setSuccess("");

    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function handleStatisticSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setError("");
    setSuccess("");

    const value = Number(statisticForm.value);
    const label = statisticForm.label.trim();
    const suffix = statisticForm.suffix.trim();

    if (!Number.isInteger(value) || value < 0) {
      setError("Statistic value must be a whole number greater than or equal to 0.");
      return;
    }

    if (!label) {
      setError("Statistic label is required.");
      return;
    }

    if (label.length > 100) {
      setError("Statistic label must be 100 characters or less.");
      return;
    }

    setSavingStatistic(true);

    try {
      const payload = {
        value,
        suffix: suffix || "+",
        label,
        display_order: Number(statisticForm.display_order) || 0,
        status: statisticForm.status,
      };

      if (editingStatisticId) {
        const { error: updateError } = await supabase
          .from("homepage_statistics")
          .update(payload)
          .eq("id", editingStatisticId);

        if (updateError) throw updateError;

        setSuccess("Impact statistic updated successfully.");
      } else {
        const { error: insertError } = await supabase
          .from("homepage_statistics")
          .insert(payload);

        if (insertError) throw insertError;

        setSuccess("Impact statistic added successfully.");
      }

      resetStatisticForm();
      await loadData();
    } catch (err) {
      console.error("Statistic save error:", err);
      setError(
        err instanceof Error
          ? err.message
          : "Unable to save the impact statistic."
      );
    } finally {
      setSavingStatistic(false);
    }
  }

  async function updateStatisticStatus(
    statistic: Statistic,
    status: Status
  ) {
    setError("");
    setSuccess("");

    const { error: updateError } = await supabase
      .from("homepage_statistics")
      .update({ status })
      .eq("id", statistic.id);

    if (updateError) {
      setError(updateError.message);
      return;
    }

    setSuccess(`"${statistic.label}" changed to ${status}.`);
    await loadData();
  }

  async function deleteStatistic(statistic: Statistic) {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${statistic.label}"?`
    );

    if (!confirmed) return;

    setError("");
    setSuccess("");

    const { error: deleteError } = await supabase
      .from("homepage_statistics")
      .delete()
      .eq("id", statistic.id);

    if (deleteError) {
      setError(deleteError.message);
      return;
    }

    if (editingStatisticId === statistic.id) {
      resetStatisticForm();
    }

    setSuccess("Impact statistic deleted successfully.");
    await loadData();
  }

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-8 sm:px-6 lg:px-10">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8">
          <p className="text-sm font-semibold uppercase tracking-wider text-emerald-700">
            DSC Society Admin
          </p>

          <h1 className="mt-2 text-3xl font-bold text-slate-900">
            Homepage Management
          </h1>

          <p className="mt-2 max-w-3xl text-slate-600">
            Manage the homepage hero slider and impact statistics displayed to
            website visitors.
          </p>
        </div>

        {(error || success) && (
          <div
            role="status"
            className={`mb-6 rounded-xl border p-4 text-sm ${
              error
                ? "border-red-200 bg-red-50 text-red-700"
                : "border-emerald-200 bg-emerald-50 text-emerald-700"
            }`}
          >
            {error || success}
          </div>
        )}

        {loading ? (
          <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center text-slate-500 shadow-sm">
            Loading homepage content...
          </div>
        ) : (
          <div className="space-y-10">
            {/* HERO SLIDER */}
            <section>
              <div className="mb-5">
                <h2 className="text-2xl font-bold text-slate-900">
                  Hero Slider
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  Add and manage the large visual slides shown at the top of
                  the homepage.
                </p>
              </div>

              <div className="grid gap-8 lg:grid-cols-[390px_1fr]">
                <section className="h-fit rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                  <h3 className="mb-5 text-xl font-semibold text-slate-900">
                    {editingSlideId ? "Edit Hero Slide" : "Add Hero Slide"}
                  </h3>

                  <form onSubmit={handleHeroSubmit} className="space-y-4">
                    <div>
                      <label className="mb-1 block text-sm font-medium text-slate-700">
                        Title
                      </label>
                      <input
                        maxLength={160}
                        value={heroForm.title}
                        onChange={(event) =>
                          setHeroForm({
                            ...heroForm,
                            title: event.target.value,
                          })
                        }
                        placeholder="Building a Greener Future"
                        className="w-full rounded-lg border border-slate-300 px-3 py-2.5 outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
                      />
                    </div>

                    <div>
                      <label className="mb-1 block text-sm font-medium text-slate-700">
                        Subtitle
                      </label>
                      <input
                        maxLength={160}
                        value={heroForm.subtitle}
                        onChange={(event) =>
                          setHeroForm({
                            ...heroForm,
                            subtitle: event.target.value,
                          })
                        }
                        placeholder="Environmental action for communities"
                        className="w-full rounded-lg border border-slate-300 px-3 py-2.5 outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
                      />
                    </div>

                    <div>
                      <label className="mb-1 block text-sm font-medium text-slate-700">
                        Description
                      </label>
                      <textarea
                        rows={4}
                        maxLength={500}
                        value={heroForm.description}
                        onChange={(event) =>
                          setHeroForm({
                            ...heroForm,
                            description: event.target.value,
                          })
                        }
                        placeholder="Short description for this hero slide"
                        className="w-full resize-y rounded-lg border border-slate-300 px-3 py-2.5 outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
                      />
                    </div>

                    <div>
                      <label className="mb-2 block text-sm font-medium text-slate-700">
                        Hero Media *
                      </label>

                      <div className="grid grid-cols-2 gap-2 rounded-xl bg-slate-100 p-1">
                        <button
                          type="button"
                          onClick={() =>
                            setHeroForm({
                              ...heroForm,
                              media_type: "image",
                            })
                          }
                          className={`rounded-lg px-3 py-2 text-sm font-semibold transition ${
                            heroForm.media_type === "image"
                              ? "bg-white text-emerald-700 shadow-sm"
                              : "text-slate-600 hover:text-slate-900"
                          }`}
                        >
                          Image
                        </button>

                        <button
                          type="button"
                          onClick={() =>
                            setHeroForm({
                              ...heroForm,
                              media_type: "video",
                            })
                          }
                          className={`rounded-lg px-3 py-2 text-sm font-semibold transition ${
                            heroForm.media_type === "video"
                              ? "bg-white text-emerald-700 shadow-sm"
                              : "text-slate-600 hover:text-slate-900"
                          }`}
                        >
                          Video
                        </button>
                      </div>

                      {heroForm.media_type === "image" ? (
                        <div className="mt-4 space-y-3">
                          <input
                            ref={fileInputRef}
                            type="file"
                            accept=".jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp"
                            onChange={(event) =>
                              handleImageChange(event.target.files?.[0])
                            }
                            className="block w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
                          />

                          <div className="flex flex-wrap gap-2">
                            <button
                              type="button"
                              onClick={() => setShowGalleryPicker(true)}
                              className="rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm font-semibold text-emerald-700 transition hover:bg-emerald-100"
                            >
                              Choose from Gallery
                            </button>

                            {heroForm.image_url && (
                              <button
                                type="button"
                                onClick={() => {
                                  setHeroForm({
                                    ...heroForm,
                                    image_url: "",
                                  });
                                  setPreviewUrl("");
                                  setSelectedImage(null);
                                }}
                                className="rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50"
                              >
                                Clear Selected Image
                              </button>
                            )}
                          </div>

                          <p className="text-xs text-slate-500">
                            Upload JPG, PNG or WEBP up to 5 MB, or reuse a
                            published Gallery image.
                          </p>

                          {previewUrl && (
                            <img
                              src={previewUrl}
                              alt="Hero preview"
                              className="aspect-video w-full rounded-xl object-cover"
                            />
                          )}

                          {showGalleryPicker && (
                            <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
                              <div className="mb-3 flex items-center justify-between">
                                <h4 className="text-sm font-semibold text-slate-800">
                                  Select Gallery Image
                                </h4>

                                <button
                                  type="button"
                                  onClick={() => setShowGalleryPicker(false)}
                                  className="text-xs font-medium text-slate-500 hover:text-slate-900"
                                >
                                  Close
                                </button>
                              </div>

                              {galleryImages.length === 0 ? (
                                <p className="py-5 text-center text-sm text-slate-500">
                                  No published gallery images available.
                                </p>
                              ) : (
                                <div className="grid max-h-72 grid-cols-2 gap-3 overflow-y-auto sm:grid-cols-3">
                                  {galleryImages.map((image) => (
                                    <button
                                      key={image.id}
                                      type="button"
                                      onClick={() => {
                                        setHeroForm({
                                          ...heroForm,
                                          image_url: image.image_url,
                                        });
                                        setSelectedImage(null);
                                        setPreviewUrl(image.image_url);
                                        setShowGalleryPicker(false);

                                        if (fileInputRef.current) {
                                          fileInputRef.current.value = "";
                                        }
                                      }}
                                      className="overflow-hidden rounded-lg border border-slate-200 bg-white text-left transition hover:border-emerald-500 hover:ring-2 hover:ring-emerald-100"
                                    >
                                      <img
                                        src={image.image_url}
                                        alt={image.title}
                                        className="aspect-video w-full object-cover"
                                      />
                                      <span className="block truncate px-2 py-1.5 text-xs font-medium text-slate-700">
                                        {image.title}
                                      </span>
                                    </button>
                                  ))}
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      ) : (
                        <div className="mt-4 space-y-4">
                          <div>
                            <label className="mb-1 block text-xs font-medium text-slate-600">
                              Video URL *
                            </label>
                            <input
                              type="url"
                              maxLength={500}
                              value={heroForm.video_url}
                              onChange={(event) =>
                                setHeroForm({
                                  ...heroForm,
                                  video_url: event.target.value,
                                })
                              }
                              placeholder="https://www.youtube.com/watch?v=... or https://example.com/video.mp4"
                              className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
                            />
                            <p className="mt-1 text-xs text-slate-500">
                              YouTube or direct MP4, WebM, or OGG video URL.
                            </p>
                          </div>

                          <div>
                            <label className="mb-1 block text-xs font-medium text-slate-600">
                              Video Poster <span className="font-normal">(optional)</span>
                            </label>

                            <input
                              type="file"
                              accept=".jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp"
                              onChange={(event) =>
                                handlePosterChange(event.target.files?.[0])
                              }
                              className="block w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
                            />

                            <div className="mt-2 flex flex-wrap gap-2">
                              <button
                                type="button"
                                onClick={() =>
                                  setShowPosterGalleryPicker(true)
                                }
                                className="rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm font-semibold text-emerald-700 transition hover:bg-emerald-100"
                              >
                                Choose Poster from Gallery
                              </button>
                            </div>

                            <p className="mt-1 text-xs text-slate-500">
                              Optional image displayed while the video loads.
                            </p>

                            {posterPreviewUrl && (
                              <img
                                src={posterPreviewUrl}
                                alt="Video poster preview"
                                className="mt-3 aspect-video w-full rounded-xl object-cover"
                              />
                            )}

                            {showPosterGalleryPicker && (
                              <div className="mt-3 rounded-xl border border-slate-200 bg-slate-50 p-3">
                                <div className="mb-3 flex items-center justify-between">
                                  <h4 className="text-sm font-semibold text-slate-800">
                                    Select Poster Image
                                  </h4>

                                  <button
                                    type="button"
                                    onClick={() =>
                                      setShowPosterGalleryPicker(false)
                                    }
                                    className="text-xs font-medium text-slate-500 hover:text-slate-900"
                                  >
                                    Close
                                  </button>
                                </div>

                                {galleryImages.length === 0 ? (
                                  <p className="py-5 text-center text-sm text-slate-500">
                                    No published gallery images available.
                                  </p>
                                ) : (
                                  <div className="grid max-h-72 grid-cols-2 gap-3 overflow-y-auto sm:grid-cols-3">
                                    {galleryImages.map((image) => (
                                      <button
                                        key={image.id}
                                        type="button"
                                        onClick={() => {
                                          setHeroForm({
                                            ...heroForm,
                                            poster_url: image.image_url,
                                          });
                                          setSelectedPoster(null);
                                          setPosterPreviewUrl(image.image_url);
                                          setShowPosterGalleryPicker(false);
                                        }}
                                        className="overflow-hidden rounded-lg border border-slate-200 bg-white text-left transition hover:border-emerald-500 hover:ring-2 hover:ring-emerald-100"
                                      >
                                        <img
                                          src={image.image_url}
                                          alt={image.title}
                                          className="aspect-video w-full object-cover"
                                        />
                                        <span className="block truncate px-2 py-1.5 text-xs font-medium text-slate-700">
                                          {image.title}
                                        </span>
                                      </button>
                                    ))}
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2">
                      <div>
                        <label className="mb-1 block text-sm font-medium text-slate-700">
                          Button Text
                        </label>
                        <input
                          maxLength={60}
                          value={heroForm.button_text}
                          onChange={(event) =>
                            setHeroForm({
                              ...heroForm,
                              button_text: event.target.value,
                            })
                          }
                          placeholder="Learn More"
                          className="w-full rounded-lg border border-slate-300 px-3 py-2.5 outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
                        />
                      </div>

                      <div>
                        <label className="mb-1 block text-sm font-medium text-slate-700">
                          Button Link
                        </label>
                        <input
                          maxLength={300}
                          value={heroForm.button_link}
                          onChange={(event) =>
                            setHeroForm({
                              ...heroForm,
                              button_link: event.target.value,
                            })
                          }
                          placeholder="/activities"
                          className="w-full rounded-lg border border-slate-300 px-3 py-2.5 outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
                        />
                      </div>
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2">
                      <div>
                        <label className="mb-1 block text-sm font-medium text-slate-700">
                          Display Order
                        </label>
                        <input
                          type="number"
                          min="0"
                          value={heroForm.display_order}
                          onChange={(event) =>
                            setHeroForm({
                              ...heroForm,
                              display_order: Number(event.target.value),
                            })
                          }
                          className="w-full rounded-lg border border-slate-300 px-3 py-2.5 outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
                        />
                      </div>

                      <div>
                        <label className="mb-1 block text-sm font-medium text-slate-700">
                          Status
                        </label>
                        <select
                          value={heroForm.status}
                          onChange={(event) =>
                            setHeroForm({
                              ...heroForm,
                              status: event.target.value as Status,
                            })
                          }
                          className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
                        >
                          <option value="draft">Draft</option>
                          <option value="published">Published</option>
                        </select>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-3 pt-2">
                      <button
                        type="submit"
                        disabled={savingHero}
                        className="rounded-lg bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        {savingHero
                          ? "Saving..."
                          : editingSlideId
                            ? "Update Slide"
                            : "Add Slide"}
                      </button>

                      {editingSlideId && (
                        <button
                          type="button"
                          onClick={resetHeroForm}
                          className="rounded-lg border border-slate-300 px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                        >
                          Cancel
                        </button>
                      )}
                    </div>
                  </form>
                </section>

                <section className="space-y-4">
                  {slides.length === 0 ? (
                    <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center text-slate-500">
                      No hero slides added yet.
                    </div>
                  ) : (
                    slides.map((slide) => (
                      <article
                        key={slide.id}
                        className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"
                      >
                        <div className="grid md:grid-cols-[240px_1fr]">
                          <div className="relative min-h-48 overflow-hidden bg-slate-100">
                            {slide.media_type === "video" ? (
                              slide.poster_url ? (
                                <img
                                  src={slide.poster_url}
                                  alt={
                                    slide.title ||
                                    "Hero video poster"
                                  }
                                  className="h-full min-h-48 w-full object-cover"
                                />
                              ) : (
                                <div className="flex h-full min-h-48 items-center justify-center bg-slate-800 text-white">
                                  <div className="text-center">
                                    <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-white/15 text-xl">
                                      ▶
                                    </div>
                                    <p className="text-xs font-medium text-white/80">
                                      Video Hero
                                    </p>
                                  </div>
                                </div>
                              )
                            ) : slide.image_url ? (
                              <img
                                src={slide.image_url}
                                alt={slide.title || "Hero slide"}
                                className="h-full min-h-48 w-full object-cover"
                              />
                            ) : (
                              <div className="flex h-full min-h-48 items-center justify-center text-sm text-slate-400">
                                No media
                              </div>
                            )}

                            <div className="absolute left-3 top-3">
                              <span className="rounded-full bg-slate-900/80 px-2.5 py-1 text-xs font-bold uppercase tracking-wide text-white backdrop-blur">
                                {slide.media_type === "video"
                                  ? "Video"
                                  : "Image"}
                              </span>
                            </div>
                          </div>

                          <div className="p-5">
                            <div className="flex flex-wrap items-start justify-between gap-3">
                              <div className="min-w-0">
                                <div className="mb-2 flex flex-wrap items-center gap-2">
                                  <span
                                    className={`rounded-full px-2.5 py-1 text-xs font-semibold ${statusStyles[slide.status]}`}
                                  >
                                    {slide.status}
                                  </span>

                                  <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-600">
                                    Order {slide.display_order}
                                  </span>

                                  <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700">
                                    {slide.media_type === "video"
                                      ? "Hero Video"
                                      : "Hero Image"}
                                  </span>
                                </div>

                                <h3 className="text-lg font-bold text-slate-900">
                                  {slide.title?.trim() || "Untitled slide"}
                                </h3>

                                {slide.subtitle && (
                                  <p className="mt-1 text-sm font-medium text-emerald-700">
                                    {slide.subtitle}
                                  </p>
                                )}

                                {slide.description && (
                                  <p className="mt-2 text-sm leading-relaxed text-slate-600">
                                    {slide.description}
                                  </p>
                                )}
                              </div>
                            </div>

                            <div className="mt-5 flex flex-wrap gap-2">
                              <button
                                type="button"
                                onClick={() => editSlide(slide)}
                                className="rounded-lg border border-slate-300 px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                              >
                                Edit
                              </button>

                              <button
                                type="button"
                                onClick={() =>
                                  updateSlideStatus(
                                    slide,
                                    slide.status === "published"
                                      ? "draft"
                                      : "published"
                                  )
                                }
                                className="rounded-lg border border-emerald-200 px-3 py-2 text-sm font-semibold text-emerald-700 hover:bg-emerald-50"
                              >
                                {slide.status === "published"
                                  ? "Move to Draft"
                                  : "Publish"}
                              </button>

                              <button
                                type="button"
                                onClick={() => deleteSlide(slide)}
                                className="rounded-lg border border-red-200 px-3 py-2 text-sm font-semibold text-red-700 hover:bg-red-50"
                              >
                                Delete
                              </button>
                            </div>
                          </div>
                        </div>
                      </article>
                    ))
                  )}
                </section>
              </div>
            </section>

            {/* IMPACT STATISTICS */}
            <section>
              <div className="mb-5">
                <h2 className="text-2xl font-bold text-slate-900">
                  Impact Statistics
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  Manage the numbers displayed in the homepage impact section.
                </p>
              </div>

              <div className="grid gap-8 lg:grid-cols-[390px_1fr]">
                <section className="h-fit rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                  <h3 className="mb-5 text-xl font-semibold text-slate-900">
                    {editingStatisticId
                      ? "Edit Impact Statistic"
                      : "Add Impact Statistic"}
                  </h3>

                  <form
                    onSubmit={handleStatisticSubmit}
                    className="space-y-4"
                  >
                    <div>
                      <label className="mb-1 block text-sm font-medium text-slate-700">
                        Value *
                      </label>
                      <input
                        required
                        type="number"
                        min="0"
                        step="1"
                        value={statisticForm.value}
                        onChange={(event) =>
                          setStatisticForm({
                            ...statisticForm,
                            value: event.target.value,
                          })
                        }
                        placeholder="3500"
                        className="w-full rounded-lg border border-slate-300 px-3 py-2.5 outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
                      />
                    </div>

                    <div>
                      <label className="mb-1 block text-sm font-medium text-slate-700">
                        Suffix
                      </label>
                      <input
                        maxLength={10}
                        value={statisticForm.suffix}
                        onChange={(event) =>
                          setStatisticForm({
                            ...statisticForm,
                            suffix: event.target.value,
                          })
                        }
                        placeholder="+"
                        className="w-full rounded-lg border border-slate-300 px-3 py-2.5 outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
                      />
                    </div>

                    <div>
                      <label className="mb-1 block text-sm font-medium text-slate-700">
                        Label *
                      </label>
                      <input
                        required
                        maxLength={100}
                        value={statisticForm.label}
                        onChange={(event) =>
                          setStatisticForm({
                            ...statisticForm,
                            label: event.target.value,
                          })
                        }
                        placeholder="Students Engaged"
                        className="w-full rounded-lg border border-slate-300 px-3 py-2.5 outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
                      />
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2">
                      <div>
                        <label className="mb-1 block text-sm font-medium text-slate-700">
                          Display Order
                        </label>
                        <input
                          type="number"
                          min="0"
                          value={statisticForm.display_order}
                          onChange={(event) =>
                            setStatisticForm({
                              ...statisticForm,
                              display_order: Number(event.target.value),
                            })
                          }
                          className="w-full rounded-lg border border-slate-300 px-3 py-2.5 outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
                        />
                      </div>

                      <div>
                        <label className="mb-1 block text-sm font-medium text-slate-700">
                          Status
                        </label>
                        <select
                          value={statisticForm.status}
                          onChange={(event) =>
                            setStatisticForm({
                              ...statisticForm,
                              status: event.target.value as Status,
                            })
                          }
                          className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
                        >
                          <option value="draft">Draft</option>
                          <option value="published">Published</option>
                        </select>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-3 pt-2">
                      <button
                        type="submit"
                        disabled={savingStatistic}
                        className="rounded-lg bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        {savingStatistic
                          ? "Saving..."
                          : editingStatisticId
                            ? "Update Statistic"
                            : "Add Statistic"}
                      </button>

                      {editingStatisticId && (
                        <button
                          type="button"
                          onClick={resetStatisticForm}
                          className="rounded-lg border border-slate-300 px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                        >
                          Cancel
                        </button>
                      )}
                    </div>
                  </form>
                </section>

                <section className="grid gap-4 sm:grid-cols-2">
                  {statistics.length === 0 ? (
                    <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center text-slate-500 sm:col-span-2">
                      No impact statistics added yet.
                    </div>
                  ) : (
                    statistics.map((statistic) => (
                      <article
                        key={statistic.id}
                        className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <span
                              className={`rounded-full px-2.5 py-1 text-xs font-semibold ${statusStyles[statistic.status]}`}
                            >
                              {statistic.status}
                            </span>

                            <p className="mt-4 text-4xl font-bold text-slate-900">
                              {statistic.value}
                              {statistic.suffix}
                            </p>

                            <h3 className="mt-2 font-semibold text-slate-700">
                              {statistic.label}
                            </h3>

                            <p className="mt-1 text-xs text-slate-500">
                              Display order: {statistic.display_order}
                            </p>
                          </div>
                        </div>

                        <div className="mt-5 flex flex-wrap gap-2">
                          <button
                            type="button"
                            onClick={() => editStatistic(statistic)}
                            className="rounded-lg border border-slate-300 px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                          >
                            Edit
                          </button>

                          <button
                            type="button"
                            onClick={() =>
                              updateStatisticStatus(
                                statistic,
                                statistic.status === "published"
                                  ? "draft"
                                  : "published"
                              )
                            }
                            className="rounded-lg border border-emerald-200 px-3 py-2 text-sm font-semibold text-emerald-700 hover:bg-emerald-50"
                          >
                            {statistic.status === "published"
                              ? "Move to Draft"
                              : "Publish"}
                          </button>

                          <button
                            type="button"
                            onClick={() => deleteStatistic(statistic)}
                            className="rounded-lg border border-red-200 px-3 py-2 text-sm font-semibold text-red-700 hover:bg-red-50"
                          >
                            Delete
                          </button>
                        </div>
                      </article>
                    ))
                  )}
                </section>
              </div>
            </section>
          </div>
        )}
      </div>
    </div>
  );
}
