
import { useEffect, useRef, useState } from "react";
import { supabase } from "../../lib/supabase";

type TeamMember = {
  id: string;
  name: string;
  slug: string;
  designation: string;
  short_bio: string | null;
  bio: string | null;
  origin: string | null;
  interests: string[] | null;
  image_url: string | null;
  display_order: number;
  status: "draft" | "published";
  created_at: string;
};

type FormData = {
  name: string;
  slug: string;
  designation: string;
  short_bio: string;
  bio: string;
  origin: string;
  interests: string;
  image_url: string;
  display_order: number;
  status: "draft" | "published";
};

const initialForm: FormData = {
  name: "",
  slug: "",
  designation: "",
  short_bio: "",
  bio: "",
  origin: "",
  interests: "",
  image_url: "",
  display_order: 0,
  status: "draft",
};

const BUCKET = "dsc-media 5";

export default function AdminTeam() {
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [form, setForm] = useState<FormData>(initialForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    void loadMembers();
  }, []);

  useEffect(() => {
    return () => {
      if (previewUrl.startsWith("blob:")) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  async function loadMembers() {
    setLoading(true);
    setError("");

    const { data, error } = await supabase
      .from("team_members")
      .select("*")
      .order("display_order", { ascending: true })
      .order("created_at", { ascending: false });

    if (error) {
      setError(error.message);
    } else {
      setMembers((data ?? []) as TeamMember[]);
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

  function editMember(member: TeamMember) {
    setEditingId(member.id);

    setForm({
      name: member.name,
      slug: member.slug,
      designation: member.designation,
      short_bio: member.short_bio ?? "",
      bio: member.bio ?? "",
      origin: member.origin ?? "",
      interests: member.interests?.join(", ") ?? "",
      image_url: member.image_url ?? "",
      display_order: member.display_order ?? 0,
      status: member.status,
    });

    setSelectedImage(null);
    setPreviewUrl(member.image_url ?? "");
    setError("");
    setSuccess("");

    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function uploadImage(): Promise<string | null> {
    if (!selectedImage) return form.image_url || null;

    const extension = selectedImage.name.split(".").pop()?.toLowerCase() || "jpg";
    const filePath = `team/${crypto.randomUUID()}.${extension}`;

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

    if (!form.name.trim() || !form.designation.trim()) {
      setError("Name and designation are required.");
      return;
    }

    setSaving(true);

    try {
      const imageUrl = await uploadImage();

      const generatedSlug = form.name
        .trim()
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");

      const slug = (form.slug.trim() || generatedSlug)
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");

      if (!slug) {
        throw new Error("A valid profile slug is required.");
      }

      const interests = form.interests
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean);

      const payload = {
        name: form.name.trim(),
        slug,
        designation: form.designation.trim(),
        short_bio: form.short_bio.trim() || null,
        bio: form.bio.trim() || null,
        origin: form.origin.trim() || null,
        interests,
        image_url: imageUrl,
        display_order: Number(form.display_order) || 0,
        status: form.status,
      };

      if (editingId) {
        const { error } = await supabase
          .from("team_members")
          .update(payload)
          .eq("id", editingId);

        if (error) throw error;

        setSuccess("Team member updated successfully.");
      } else {
        const { error } = await supabase
          .from("team_members")
          .insert(payload);

        if (error) throw error;

        setSuccess("Team member added successfully.");
      }

      resetForm();
      await loadMembers();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Something went wrong."
      );
    } finally {
      setSaving(false);
    }
  }

  async function toggleStatus(member: TeamMember) {
    const nextStatus =
      member.status === "published" ? "draft" : "published";

    const { error } = await supabase
      .from("team_members")
      .update({ status: nextStatus })
      .eq("id", member.id);

    if (error) {
      setError(error.message);
      return;
    }

    setSuccess(`Member moved to ${nextStatus}.`);
    await loadMembers();
  }

  async function deleteMember(member: TeamMember) {
    const confirmed = window.confirm(
      `Are you sure you want to delete ${member.name}?`
    );

    if (!confirmed) return;

    const { error } = await supabase
      .from("team_members")
      .delete()
      .eq("id", member.id);

    if (error) {
      setError(error.message);
      return;
    }

    setSuccess("Team member deleted successfully.");

    if (editingId === member.id) {
      resetForm();
    }

    await loadMembers();
  }

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-8 sm:px-6 lg:px-10">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8">
          <p className="text-sm font-semibold uppercase tracking-wider text-emerald-700">
            DSC Society Admin
          </p>

          <h1 className="mt-2 text-3xl font-bold text-slate-900">
            Team Members
          </h1>

          <p className="mt-2 text-slate-600">
            Manage your society's leadership, team profiles, and photographs.
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
              {editingId ? "Edit Team Member" : "Add Team Member"}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">
                  Full Name *
                </label>
                <input
                  required
                  value={form.name}
                  onChange={(e) =>
                    setForm({ ...form, name: e.target.value })
                  }
                  placeholder="Enter full name"
                  className="w-full rounded-lg border border-slate-300 px-3 py-2.5 outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">
                  Designation *
                </label>
                <input
                  required
                  value={form.designation}
                  onChange={(e) =>
                    setForm({ ...form, designation: e.target.value })
                  }
                  placeholder="e.g. President, Secretary"
                  className="w-full rounded-lg border border-slate-300 px-3 py-2.5 outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">
                  Profile Slug
                </label>
                <input
                  value={form.slug}
                  onChange={(e) =>
                    setForm({ ...form, slug: e.target.value })
                  }
                  placeholder="e.g. sai-charan-gupta"
                  className="w-full rounded-lg border border-slate-300 px-3 py-2.5 outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
                />
                <p className="mt-1 text-xs text-slate-500">
                  Used in the team profile URL.
                </p>
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">
                  Short Bio
                </label>
                <textarea
                  rows={3}
                  value={form.short_bio}
                  onChange={(e) =>
                    setForm({ ...form, short_bio: e.target.value })
                  }
                  placeholder="Short introduction shown on the team card..."
                  className="w-full resize-y rounded-lg border border-slate-300 px-3 py-2.5 outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">
                  Origin
                </label>
                <input
                  value={form.origin}
                  onChange={(e) =>
                    setForm({ ...form, origin: e.target.value })
                  }
                  placeholder="e.g. Guntur, Andhra Pradesh"
                  className="w-full rounded-lg border border-slate-300 px-3 py-2.5 outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">
                  Interests
                </label>
                <input
                  value={form.interests}
                  onChange={(e) =>
                    setForm({ ...form, interests: e.target.value })
                  }
                  placeholder="Environment, Social Service, Education"
                  className="w-full rounded-lg border border-slate-300 px-3 py-2.5 outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
                />
                <p className="mt-1 text-xs text-slate-500">
                  Separate multiple interests with commas.
                </p>
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">
                  Biography
                </label>
                <textarea
                  rows={5}
                  value={form.bio}
                  onChange={(e) =>
                    setForm({ ...form, bio: e.target.value })
                  }
                  placeholder="Write the full biography..."
                  className="w-full resize-y rounded-lg border border-slate-300 px-3 py-2.5 outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">
                  Profile Photograph
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
                  <div className="mt-3 flex items-center gap-3">
                    <img
                      src={previewUrl}
                      alt="Team member preview"
                      className="h-20 w-20 rounded-xl object-cover"
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
                      className="text-sm font-medium text-red-600 hover:text-red-700"
                    >
                      Remove photo
                    </button>
                  </div>
                )}
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">
                  Display Order
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
                  className="w-full rounded-lg border border-slate-300 px-3 py-2.5 outline-none focus:border-emerald-600"
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">
                  Status
                </label>
                <select
                  value={form.status}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      status: e.target.value as FormData["status"],
                    })
                  }
                  className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5"
                >
                  <option value="draft">Draft</option>
                  <option value="published">Published</option>
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
                    ? "Update Member"
                    : "Add Member"}
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
                All Team Members
              </h2>
              <span className="rounded-full bg-emerald-100 px-3 py-1 text-sm font-medium text-emerald-800">
                {members.length} Members
              </span>
            </div>

            {loading ? (
              <div className="rounded-xl border bg-white p-8 text-center text-slate-500">
                Loading team members...
              </div>
            ) : members.length === 0 ? (
              <div className="rounded-xl border border-dashed border-slate-300 bg-white p-10 text-center">
                <p className="font-medium text-slate-700">
                  No team members added yet.
                </p>
                <p className="mt-1 text-sm text-slate-500">
                  Use the form to add your first team member.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {members.map((member) => (
                  <article
                    key={member.id}
                    className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:flex-row sm:items-center"
                  >
                    {member.image_url ? (
                      <img
                        src={member.image_url}
                        alt={member.name}
                        className="h-24 w-24 shrink-0 rounded-xl object-cover"
                      />
                    ) : (
                      <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-3xl font-bold text-emerald-700">
                        {member.name.charAt(0).toUpperCase()}
                      </div>
                    )}

                    <div className="min-w-0 flex-1">
                      <h3 className="font-semibold text-slate-900">
                        {member.name}
                      </h3>

                      <p className="text-sm font-medium text-emerald-700">
                        {member.designation}
                      </p>

                      <p className="mt-1 line-clamp-2 text-sm text-slate-600">
                        {member.bio || "No biography added."}
                      </p>

                      <div className="mt-2 flex flex-wrap items-center gap-2">
                        <span
                          className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                            member.status === "published"
                              ? "bg-emerald-100 text-emerald-800"
                              : "bg-amber-100 text-amber-800"
                          }`}
                        >
                          {member.status}
                        </span>

                        <span className="text-xs text-slate-500">
                          Order: {member.display_order}
                        </span>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2 sm:flex-col">
                      <button
                        type="button"
                        onClick={() => editMember(member)}
                        className="rounded-lg border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
                      >
                        Edit
                      </button>

                      <button
                        type="button"
                        onClick={() => void toggleStatus(member)}
                        className="rounded-lg border border-emerald-200 px-3 py-2 text-sm font-medium text-emerald-700 hover:bg-emerald-50"
                      >
                        {member.status === "published"
                          ? "Unpublish"
                          : "Publish"}
                      </button>

                      <button
                        type="button"
                        onClick={() => void deleteMember(member)}
                        className="rounded-lg border border-red-200 px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50"
                      >
                        Delete
                      </button>
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
