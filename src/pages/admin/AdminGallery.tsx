
import { useEffect, useMemo, useRef, useState } from "react";
import type { FormEvent } from "react";
import { supabase } from "../../lib/supabase";

type GalleryStatus = "draft" | "published";

type GalleryItem = {
  id: string;
  title: string;
  image_url: string;
  caption: string | null;
  activity_id: string | null;
  display_order: number;
  status: GalleryStatus;
  created_at: string;
};

type ActivityOption = {
  id: string;
  title: string;
};

type GalleryForm = {
  title: string;
  image_url: string;
  caption: string;
  activity_id: string;
  display_order: number;
  status: GalleryStatus;
};

const initialForm: GalleryForm = {
  title: "",
  image_url: "",
  caption: "",
  activity_id: "",
  display_order: 0,
  status: "draft",
};

const BUCKET = "dsc-media 5";
const MAX_FILE_SIZE = 5 * 1024 * 1024;
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"];

const statusStyles: Record<GalleryStatus, string> = {
  draft: "bg-amber-100 text-amber-800",
  published: "bg-emerald-100 text-emerald-800",
};

export default function AdminGallery() {
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [activities, setActivities] = useState<ActivityOption[]>([]);
  const [form, setForm] = useState<GalleryForm>(initialForm);

  const [editingId, setEditingId] = useState<string | null>(null);
  const [selectedImages, setSelectedImages] = useState<File[]>([]);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadProgress, setUploadProgress] = useState("");

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const fileInputRef = useRef<HTMLInputElement>(null);

  const previews = useMemo(
    () =>
      selectedImages.map((file) => ({
        file,
        url: URL.createObjectURL(file),
      })),
    [selectedImages]
  );

  useEffect(() => {
    return () => {
      previews.forEach((preview) => URL.revokeObjectURL(preview.url));
    };
  }, [previews]);

  useEffect(() => {
    void loadData();
  }, []);

  async function loadData() {
    setLoading(true);
    setError("");

    const [galleryResult, activityResult] = await Promise.all([
      supabase
        .from("gallery")
        .select("*")
        .order("display_order", { ascending: true })
        .order("created_at", { ascending: false }),

      supabase
        .from("activities")
        .select("id, title")
        .order("title", { ascending: true }),
    ]);

    if (galleryResult.error) {
      setError(galleryResult.error.message);
    } else {
      setItems((galleryResult.data ?? []) as GalleryItem[]);
    }

    if (activityResult.error) {
      setError(activityResult.error.message);
    } else {
      setActivities(activityResult.data ?? []);
    }

    setLoading(false);
  }

  function handleImageChange(fileList: FileList | null) {
    if (!fileList) return;

    const files = Array.from(fileList);

    if (files.length === 0) return;

    if (editingId && files.length > 1) {
      setError("When editing an image, please select only one photo.");
      return;
    }

    const invalidType = files.find(
      (file) => !ALLOWED_TYPES.includes(file.type)
    );

    if (invalidType) {
      setError(
        `${invalidType.name} is not supported. Please use JPG, PNG, or WEBP.`
      );
      return;
    }

    const oversizedFile = files.find(
      (file) => file.size > MAX_FILE_SIZE
    );

    if (oversizedFile) {
      setError(`${oversizedFile.name} exceeds the 5 MB limit.`);
      return;
    }

    setError("");
    setSuccess("");
    setSelectedImages(files);
  }

  function removeSelectedImage(index: number) {
    setSelectedImages((current) =>
      current.filter((_, i) => i !== index)
    );

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }

  function resetForm() {
    setForm(initialForm);
    setEditingId(null);
    setSelectedImages([]);
    setUploadProgress("");

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }

  function editItem(item: GalleryItem) {
    setEditingId(item.id);

    setForm({
      title: item.title,
      image_url: item.image_url,
      caption: item.caption ?? "",
      activity_id: item.activity_id ?? "",
      display_order: item.display_order ?? 0,
      status: item.status,
    });

    setSelectedImages([]);
    setError("");
    setSuccess("");

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }

    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function uploadImage(file: File): Promise<string> {
    const extension =
      file.name.split(".").pop()?.toLowerCase() || "jpg";

    const filePath = `gallery/${crypto.randomUUID()}.${extension}`;

    const { error: uploadError } = await supabase.storage
      .from(BUCKET)
      .upload(filePath, file, {
        cacheControl: "3600",
        upsert: false,
        contentType: file.type,
      });

    if (uploadError) {
      throw new Error(
        `Failed to upload ${file.name}: ${uploadError.message}`
      );
    }

    const { data } = supabase.storage
      .from(BUCKET)
      .getPublicUrl(filePath);

    return data.publicUrl;
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setError("");
    setSuccess("");
    setUploadProgress("");

    if (!form.title.trim()) {
      setError("Event or gallery title is required.");
      return;
    }

    if (editingId && !selectedImages.length && !form.image_url) {
      setError("Please select an image.");
      return;
    }

    if (!editingId && selectedImages.length === 0) {
      setError("Please select at least one image.");
      return;
    }

    setSaving(true);

    try {
      if (editingId) {
        let imageUrl = form.image_url;

        if (selectedImages.length > 0) {
          setUploadProgress("Uploading replacement image...");
          imageUrl = await uploadImage(selectedImages[0]);
        }

        const payload = {
          title: form.title.trim(),
          image_url: imageUrl,
          caption: form.caption.trim() || null,
          activity_id: form.activity_id || null,
          display_order: Number(form.display_order) || 0,
          status: form.status,
        };

        const { error: updateError } = await supabase
          .from("gallery")
          .update(payload)
          .eq("id", editingId);

        if (updateError) throw updateError;

        setSuccess("Gallery image updated successfully.");
      } else {
        const uploadedUrls: string[] = [];

        for (let i = 0; i < selectedImages.length; i++) {
          const file = selectedImages[i];

          setUploadProgress(
            `Uploading image ${i + 1} of ${selectedImages.length}: ${file.name}`
          );

          const imageUrl = await uploadImage(file);
          uploadedUrls.push(imageUrl);
        }

        setUploadProgress("Saving gallery records...");

        const records = uploadedUrls.map((imageUrl, index) => ({
          title: form.title.trim(),
          image_url: imageUrl,
          caption: form.caption.trim() || null,
          activity_id: form.activity_id || null,
          display_order:
            (Number(form.display_order) || 0) + index,
          status: form.status,
        }));

        const { error: insertError } = await supabase
          .from("gallery")
          .insert(records);

        if (insertError) throw insertError;

        setSuccess(
          `Successfully added ${records.length} photos to the gallery.`
        );
      }

      resetForm();
      await loadData();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong while saving."
      );
    } finally {
      setSaving(false);
      setUploadProgress("");
    }
  }

  async function updateStatus(
    item: GalleryItem,
    status: GalleryStatus
  ) {
    setError("");
    setSuccess("");

    const { error } = await supabase
      .from("gallery")
      .update({ status })
      .eq("id", item.id);

    if (error) {
      setError(error.message);
      return;
    }

    setSuccess(`Gallery image changed to ${status}.`);
    await loadData();
  }

  async function deleteItem(item: GalleryItem) {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${item.title}"?`
    );

    if (!confirmed) return;

    const { error } = await supabase
      .from("gallery")
      .delete()
      .eq("id", item.id);

    if (error) {
      setError(error.message);
      return;
    }

    setSuccess("Gallery record deleted successfully.");

    if (editingId === item.id) {
      resetForm();
    }

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
            Gallery Management
          </h1>

          <p className="mt-2 text-slate-600">
            Upload and organize multiple photographs from the same DSC Society event.
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

        <div className="grid gap-8 lg:grid-cols-[390px_1fr]">
          <section className="h-fit rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="mb-2 text-xl font-semibold text-slate-900">
              {editingId ? "Edit Gallery Image" : "Bulk Photo Upload"}
            </h2>

            <p className="mb-5 text-sm text-slate-500">
              {editingId
                ? "Update an existing gallery photograph."
                : "Select multiple photos and add them to one event collection."}
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">
                  Event / Gallery Title *
                </label>

                <input
                  required
                  value={form.title}
                  onChange={(e) =>
                    setForm({ ...form, title: e.target.value })
                  }
                  placeholder="e.g. Plant Protection Challenge"
                  className="w-full rounded-lg border border-slate-300 px-3 py-2.5 outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">
                  Common Caption
                </label>

                <textarea
                  rows={3}
                  value={form.caption}
                  onChange={(e) =>
                    setForm({ ...form, caption: e.target.value })
                  }
                  placeholder="Describe the event or photographs..."
                  className="w-full resize-y rounded-lg border border-slate-300 px-3 py-2.5 outline-none focus:border-emerald-600"
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">
                  Related Activity
                </label>

                <select
                  value={form.activity_id}
                  onChange={(e) =>
                    setForm({ ...form, activity_id: e.target.value })
                  }
                  className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5"
                >
                  <option value="">No activity linked</option>

                  {activities.map((activity) => (
                    <option key={activity.id} value={activity.id}>
                      {activity.title}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">
                  Starting Display Order
                </label>

                <input
                  type="number"
                  min="0"
                  value={form.display_order}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      display_order: Number(e.target.value),
                    })
                  }
                  className="w-full rounded-lg border border-slate-300 px-3 py-2.5"
                />

                <p className="mt-1 text-xs text-slate-500">
                  Each subsequent photo receives the next display order.
                </p>
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">
                  {editingId ? "Replace Photograph" : "Select Photographs *"}
                </label>

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  multiple={!editingId}
                  onChange={(e) => handleImageChange(e.target.files)}
                  className="w-full rounded-lg border border-slate-300 p-2 text-sm"
                />

                <p className="mt-1 text-xs text-slate-500">
                  JPG, PNG or WEBP · Maximum 5 MB per image.
                  {!editingId && " You can select multiple files."}
                </p>
              </div>

              {editingId && form.image_url && selectedImages.length === 0 && (
                <div>
                  <p className="mb-2 text-sm font-medium text-slate-700">
                    Current Photograph
                  </p>

                  <img
                    src={form.image_url}
                    alt="Current gallery item"
                    className="max-h-56 w-full rounded-xl object-cover"
                  />
                </div>
              )}

              {previews.length > 0 && (
                <div className="rounded-xl border border-emerald-200 bg-emerald-50/50 p-3">
                  <div className="mb-3 flex items-center justify-between">
                    <p className="text-sm font-semibold text-slate-800">
                      Selected Photos
                    </p>

                    <span className="rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-semibold text-emerald-800">
                      {previews.length} selected
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    {previews.map((preview, index) => (
                      <div
                        key={`${preview.file.name}-${preview.file.lastModified}-${index}`}
                        className="overflow-hidden rounded-lg border border-slate-200 bg-white"
                      >
                        <img
                          src={preview.url}
                          alt={preview.file.name}
                          className="h-28 w-full object-cover"
                        />

                        <div className="p-2">
                          <p className="truncate text-xs font-medium text-slate-700">
                            {preview.file.name}
                          </p>

                          <p className="text-xs text-slate-500">
                            {(preview.file.size / (1024 * 1024)).toFixed(2)} MB
                          </p>

                          <button
                            type="button"
                            disabled={saving}
                            onClick={() => removeSelectedImage(index)}
                            className="mt-2 text-xs font-medium text-red-600 hover:text-red-700 disabled:opacity-50"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">
                  Publication Status
                </label>

                <select
                  value={form.status}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      status: e.target.value as GalleryStatus,
                    })
                  }
                  className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5"
                >
                  <option value="draft">Draft</option>
                  <option value="published">Published</option>
                </select>
              </div>

              {uploadProgress && (
                <div
                  role="status"
                  className="rounded-lg bg-emerald-50 px-3 py-3 text-sm font-medium text-emerald-800"
                >
                  {uploadProgress}
                </div>
              )}

              <div className="flex gap-3 pt-2">
                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 rounded-lg bg-emerald-700 px-4 py-3 font-semibold text-white transition hover:bg-emerald-800 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {saving
                    ? "Please wait..."
                    : editingId
                    ? "Update Image"
                    : `Upload ${selectedImages.length || ""} ${
                        selectedImages.length === 1 ? "Photo" : "Photos"
                      }`}
                </button>

                {editingId && (
                  <button
                    type="button"
                    onClick={resetForm}
                    disabled={saving}
                    className="rounded-lg border border-slate-300 px-4 py-3 font-medium text-slate-700 hover:bg-slate-50"
                  >
                    Cancel
                  </button>
                )}
              </div>
            </form>
          </section>

          <section>
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold text-slate-900">
                  Gallery Collection
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Photos are stored as individual records and can share the same event title.
                </p>
              </div>

              <span className="shrink-0 rounded-full bg-emerald-100 px-3 py-1 text-sm font-medium text-emerald-800">
                {items.length} Images
              </span>
            </div>

            {loading ? (
              <div className="rounded-xl border bg-white p-8 text-center text-slate-500">
                Loading gallery...
              </div>
            ) : items.length === 0 ? (
              <div className="rounded-xl border border-dashed border-slate-300 bg-white p-10 text-center">
                <p className="font-medium text-slate-700">
                  No gallery images added yet.
                </p>

                <p className="mt-1 text-sm text-slate-500">
                  Select multiple photographs to create your first collection.
                </p>
              </div>
            ) : (
              <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
                {items.map((item) => {
                  const activity = activities.find(
                    (a) => a.id === item.activity_id
                  );

                  return (
                    <article
                      key={item.id}
                      className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"
                    >
                      <img
                        src={item.image_url}
                        alt={item.title}
                        loading="lazy"
                        className="h-52 w-full object-cover"
                      />

                      <div className="p-4">
                        <div className="flex items-start justify-between gap-2">
                          <h3 className="font-semibold text-slate-900">
                            {item.title}
                          </h3>

                          <span
                            className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-medium ${statusStyles[item.status]}`}
                          >
                            {item.status}
                          </span>
                        </div>

                        {item.caption && (
                          <p className="mt-2 line-clamp-3 text-sm text-slate-600">
                            {item.caption}
                          </p>
                        )}

                        {activity && (
                          <p className="mt-2 text-xs text-slate-500">
                            Activity: {activity.title}
                          </p>
                        )}

                        <p className="mt-1 text-xs text-slate-500">
                          Display order: {item.display_order}
                        </p>

                        <div className="mt-4 flex flex-wrap gap-2">
                          <button
                            type="button"
                            onClick={() => editItem(item)}
                            className="rounded-lg border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
                          >
                            Edit
                          </button>

                          {item.status !== "published" && (
                            <button
                              type="button"
                              onClick={() =>
                                void updateStatus(item, "published")
                              }
                              className="rounded-lg border border-emerald-200 px-3 py-2 text-sm font-medium text-emerald-700 hover:bg-emerald-50"
                            >
                              Publish
                            </button>
                          )}

                          {item.status !== "draft" && (
                            <button
                              type="button"
                              onClick={() =>
                                void updateStatus(item, "draft")
                              }
                              className="rounded-lg border border-amber-200 px-3 py-2 text-sm font-medium text-amber-700 hover:bg-amber-50"
                            >
                              Unpublish
                            </button>
                          )}

                          <button
                            type="button"
                            onClick={() => void deleteItem(item)}
                            className="rounded-lg border border-red-200 px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}
