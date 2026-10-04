
import { useEffect, useRef, useState } from "react";
import { supabase } from "../../lib/supabase";

type EventStatus = "draft" | "published" | "completed" | "cancelled";

type EventItem = {
  id: string;
  title: string;
  description: string | null;
  event_date: string;
  venue: string | null;
  image_url: string | null;
  status: EventStatus;
  created_at: string;
};

type EventForm = {
  title: string;
  description: string;
  event_date: string;
  venue: string;
  image_url: string;
  status: EventStatus;
};

const initialForm: EventForm = {
  title: "",
  description: "",
  event_date: "",
  venue: "",
  image_url: "",
  status: "draft",
};

const BUCKET = "dsc-media 5";

const statusStyles: Record<EventStatus, string> = {
  draft: "bg-amber-100 text-amber-800",
  published: "bg-emerald-100 text-emerald-800",
  completed: "bg-blue-100 text-blue-800",
  cancelled: "bg-red-100 text-red-800",
};

export default function AdminEvents() {
  const [events, setEvents] = useState<EventItem[]>([]);
  const [form, setForm] = useState<EventForm>(initialForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    void loadEvents();
  }, []);

  useEffect(() => {
    return () => {
      if (previewUrl.startsWith("blob:")) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  async function loadEvents() {
    setLoading(true);
    setError("");

    const { data, error } = await supabase
      .from("events")
      .select("*")
      .order("event_date", { ascending: false });

    if (error) {
      setError(error.message);
    } else {
      setEvents((data ?? []) as EventItem[]);
    }

    setLoading(false);
  }

  function handleImageChange(file?: File) {
    if (!file) return;

    if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
      setError("Please select a JPG, PNG, or WEBP image.");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError("Image size must be less than 5 MB.");
      return;
    }

    setError("");
    setSelectedImage(file);
    setPreviewUrl(URL.createObjectURL(file));
  }

  function resetForm() {
    setForm(initialForm);
    setEditingId(null);
    setSelectedImage(null);
    setPreviewUrl("");

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }

  function editEvent(event: EventItem) {
    setEditingId(event.id);

    setForm({
      title: event.title,
      description: event.description ?? "",
      event_date: event.event_date,
      venue: event.venue ?? "",
      image_url: event.image_url ?? "",
      status: event.status,
    });

    setSelectedImage(null);
    setPreviewUrl(event.image_url ?? "");
    setError("");
    setSuccess("");

    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function uploadImage(): Promise<string | null> {
    if (!selectedImage) return form.image_url || null;

    const extension =
      selectedImage.name.split(".").pop()?.toLowerCase() || "jpg";

    const filePath = `events/${crypto.randomUUID()}.${extension}`;

    const { error: uploadError } = await supabase.storage
      .from(BUCKET)
      .upload(filePath, selectedImage, {
        cacheControl: "3600",
        upsert: false,
        contentType: selectedImage.type,
      });

    if (uploadError) {
      throw new Error(`Image upload failed: ${uploadError.message}`);
    }

    const { data } = supabase.storage
      .from(BUCKET)
      .getPublicUrl(filePath);

    return data.publicUrl;
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setError("");
    setSuccess("");

    if (!form.title.trim() || !form.event_date) {
      setError("Event title and date are required.");
      return;
    }

    setSaving(true);

    try {
      const imageUrl = await uploadImage();

      const payload = {
        title: form.title.trim(),
        description: form.description.trim() || null,
        event_date: form.event_date,
        venue: form.venue.trim() || null,
        image_url: imageUrl,
        status: form.status,
      };

      if (editingId) {
        const { error } = await supabase
          .from("events")
          .update(payload)
          .eq("id", editingId);

        if (error) throw error;

        setSuccess("Event updated successfully.");
      } else {
        const { error } = await supabase
          .from("events")
          .insert(payload);

        if (error) throw error;

        setSuccess("Event created successfully.");
      }

      resetForm();
      await loadEvents();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Something went wrong."
      );
    } finally {
      setSaving(false);
    }
  }

  async function updateStatus(event: EventItem, status: EventStatus) {
    const { error } = await supabase
      .from("events")
      .update({ status })
      .eq("id", event.id);

    if (error) {
      setError(error.message);
      return;
    }

    setSuccess(`Event status changed to ${status}.`);
    await loadEvents();
  }

  async function deleteEvent(event: EventItem) {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${event.title}"?`
    );

    if (!confirmed) return;

    const { error } = await supabase
      .from("events")
      .delete()
      .eq("id", event.id);

    if (error) {
      setError(error.message);
      return;
    }

    setSuccess("Event deleted successfully.");

    if (editingId === event.id) {
      resetForm();
    }

    await loadEvents();
  }

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-8 sm:px-6 lg:px-10">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8">
          <p className="text-sm font-semibold uppercase tracking-wider text-emerald-700">
            DSC Society Admin
          </p>

          <h1 className="mt-2 text-3xl font-bold text-slate-900">
            Events Management
          </h1>

          <p className="mt-2 text-slate-600">
            Create, update, and manage your society events.
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

        <div className="grid gap-8 lg:grid-cols-[380px_1fr]">
          <section className="h-fit rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="mb-5 text-xl font-semibold text-slate-900">
              {editingId ? "Edit Event" : "Create Event"}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">
                  Event Title *
                </label>
                <input
                  required
                  value={form.title}
                  onChange={(e) =>
                    setForm({ ...form, title: e.target.value })
                  }
                  placeholder="Enter event title"
                  className="w-full rounded-lg border border-slate-300 px-3 py-2.5 outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">
                  Description
                </label>
                <textarea
                  rows={5}
                  value={form.description}
                  onChange={(e) =>
                    setForm({ ...form, description: e.target.value })
                  }
                  placeholder="Describe the event..."
                  className="w-full resize-y rounded-lg border border-slate-300 px-3 py-2.5 outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">
                  Event Date *
                </label>
                <input
                  type="date"
                  required
                  value={form.event_date}
                  onChange={(e) =>
                    setForm({ ...form, event_date: e.target.value })
                  }
                  className="w-full rounded-lg border border-slate-300 px-3 py-2.5 outline-none focus:border-emerald-600"
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">
                  Venue
                </label>
                <input
                  value={form.venue}
                  onChange={(e) =>
                    setForm({ ...form, venue: e.target.value })
                  }
                  placeholder="Event venue"
                  className="w-full rounded-lg border border-slate-300 px-3 py-2.5 outline-none focus:border-emerald-600"
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">
                  Event Poster / Photograph
                </label>

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  onChange={(e) =>
                    handleImageChange(e.target.files?.[0])
                  }
                  className="w-full rounded-lg border border-slate-300 p-2 text-sm"
                />

                <p className="mt-1 text-xs text-slate-500">
                  JPG, PNG or WEBP · Maximum 5 MB
                </p>

                {previewUrl && (
                  <div className="mt-3">
                    <img
                      src={previewUrl}
                      alt="Event preview"
                      className="max-h-48 w-full rounded-xl object-cover"
                    />

                    <button
                      type="button"
                      onClick={() => {
                        setSelectedImage(null);
                        setPreviewUrl("");
                        setForm({ ...form, image_url: "" });

                        if (fileInputRef.current) {
                          fileInputRef.current.value = "";
                        }
                      }}
                      className="mt-2 text-sm font-medium text-red-600 hover:text-red-700"
                    >
                      Remove image
                    </button>
                  </div>
                )}
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">
                  Event Status
                </label>

                <select
                  value={form.status}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      status: e.target.value as EventStatus,
                    })
                  }
                  className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5"
                >
                  <option value="draft">Draft</option>
                  <option value="published">Published</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 rounded-lg bg-emerald-700 px-4 py-3 font-semibold text-white transition hover:bg-emerald-800 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {saving
                    ? "Saving..."
                    : editingId
                    ? "Update Event"
                    : "Create Event"}
                </button>

                {editingId && (
                  <button
                    type="button"
                    onClick={resetForm}
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
              <h2 className="text-xl font-semibold text-slate-900">
                All Events
              </h2>

              <span className="rounded-full bg-emerald-100 px-3 py-1 text-sm font-medium text-emerald-800">
                {events.length} Events
              </span>
            </div>

            {loading ? (
              <div className="rounded-xl border bg-white p-8 text-center text-slate-500">
                Loading events...
              </div>
            ) : events.length === 0 ? (
              <div className="rounded-xl border border-dashed border-slate-300 bg-white p-10 text-center">
                <p className="font-medium text-slate-700">
                  No events created yet.
                </p>
                <p className="mt-1 text-sm text-slate-500">
                  Use the form to create your first event.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {events.map((event) => (
                  <article
                    key={event.id}
                    className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"
                  >
                    <div className="flex flex-col sm:flex-row">
                      {event.image_url && (
                        <img
                          src={event.image_url}
                          alt={event.title}
                          className="h-48 w-full object-cover sm:h-auto sm:w-44"
                        />
                      )}

                      <div className="min-w-0 flex-1 p-5">
                        <div className="flex flex-wrap items-start justify-between gap-2">
                          <h3 className="font-semibold text-slate-900">
                            {event.title}
                          </h3>

                          <span
                            className={`rounded-full px-2.5 py-1 text-xs font-medium ${statusStyles[event.status]}`}
                          >
                            {event.status}
                          </span>
                        </div>

                        <p className="mt-2 text-sm text-slate-600">
                          <span className="font-medium text-slate-700">
                            Date:
                          </span>{" "}
                          {new Date(
                            `${event.event_date.slice(0, 10)}T00:00:00`
                          ).toLocaleDateString("en-IN", {
                            day: "numeric",
                            month: "long",
                            year: "numeric",
                          })}
                        </p>

                        {event.venue && (
                          <p className="mt-1 text-sm text-slate-600">
                            <span className="font-medium text-slate-700">
                              Venue:
                            </span>{" "}
                            {event.venue}
                          </p>
                        )}

                        <p className="mt-2 line-clamp-3 text-sm text-slate-600">
                          {event.description || "No description added."}
                        </p>

                        <div className="mt-4 flex flex-wrap gap-2">
                          <button
                            type="button"
                            onClick={() => editEvent(event)}
                            className="rounded-lg border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
                          >
                            Edit
                          </button>

                          {event.status !== "published" && (
                            <button
                              type="button"
                              onClick={() =>
                                void updateStatus(event, "published")
                              }
                              className="rounded-lg border border-emerald-200 px-3 py-2 text-sm font-medium text-emerald-700 hover:bg-emerald-50"
                            >
                              Publish
                            </button>
                          )}

                          {event.status !== "completed" && (
                            <button
                              type="button"
                              onClick={() =>
                                void updateStatus(event, "completed")
                              }
                              className="rounded-lg border border-blue-200 px-3 py-2 text-sm font-medium text-blue-700 hover:bg-blue-50"
                            >
                              Mark Completed
                            </button>
                          )}

                          {event.status !== "cancelled" && (
                            <button
                              type="button"
                              onClick={() =>
                                void updateStatus(event, "cancelled")
                              }
                              className="rounded-lg border border-amber-200 px-3 py-2 text-sm font-medium text-amber-700 hover:bg-amber-50"
                            >
                              Cancel Event
                            </button>
                          )}

                          {event.status !== "draft" && (
                            <button
                              type="button"
                              onClick={() =>
                                void updateStatus(event, "draft")
                              }
                              className="rounded-lg border border-slate-300 px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50"
                            >
                              Move to Draft
                            </button>
                          )}

                          <button
                            type="button"
                            onClick={() => void deleteEvent(event)}
                            className="rounded-lg border border-red-200 px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}
