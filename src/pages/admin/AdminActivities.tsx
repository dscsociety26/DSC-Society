
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Plus,
  Pencil,
  Trash2,
  Archive,
  Eye,
  Loader2,
  Upload,
  Image as ImageIcon,
  X,
} from "lucide-react";

type Activity = {
  id: string;
  title: string;
  slug: string;
  description: string;
  image_url: string | null;
  activity_date: string | null;
  location: string | null;
  status: "draft" | "published" | "archived";
  created_at: string;
};

const initialForm = {
  title: "",
  description: "",
  image_url: "",
  activity_date: "",
  location: "",
  status: "draft" as "draft" | "published",
};

const createSlug = (value: string) =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

const AdminActivities = () => {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [form, setForm] = useState(initialForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    return () => {
      if (previewUrl.startsWith("blob:")) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  const fetchActivities = async () => {
    setLoading(true);
    setError("");

    const { data, error } = await supabase
      .from("activities")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      setError(error.message);
    } else {
      setActivities((data ?? []) as Activity[]);
    }

    setLoading(false);
  };

  useEffect(() => {
    void fetchActivities();
  }, []);

  const handleImageChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];

    if (!file) return;

    if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
      setError("Please select a JPG, PNG, or WEBP image.");
      event.target.value = "";
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError("Image size must be less than 5 MB.");
      event.target.value = "";
      return;
    }

    setError("");
    setSelectedImage(file);
    setPreviewUrl(URL.createObjectURL(file));
  };

  const removeSelectedImage = () => {
    setSelectedImage(null);
    setPreviewUrl("");
  };

  const uploadImage = async (): Promise<string | null> => {
    if (!selectedImage) return form.image_url.trim() || null;

    setUploading(true);

    const extension =
      selectedImage.name.split(".").pop()?.toLowerCase() || "jpg";

    const filePath = `activities/${crypto.randomUUID()}.${extension}`;

    const { error: uploadError } = await supabase.storage
      .from("dsc-media 5")
      .upload(filePath, selectedImage, {
        cacheControl: "3600",
        upsert: false,
        contentType: selectedImage.type,
      });

    if (uploadError) {
      setUploading(false);
      throw new Error(uploadError.message);
    }

    const { data } = supabase.storage
      .from("dsc-media 5")
      .getPublicUrl(filePath);

    setUploading(false);
    return data.publicUrl;
  };

  const handleSubmit = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();
    setSaving(true);
    setError("");
    setSuccess("");

    try {
      const imageUrl = await uploadImage();

      const payload = {
        title: form.title.trim(),
        slug: createSlug(form.title),
        description: form.description.trim(),
        image_url: imageUrl,
        activity_date: form.activity_date || null,
        location: form.location.trim() || null,
        status: form.status,
      };

      if (!payload.title || !payload.slug || !payload.description) {
        throw new Error("Please enter a title and description.");
      }

      const result = editingId
        ? await supabase
            .from("activities")
            .update(payload)
            .eq("id", editingId)
        : await supabase.from("activities").insert(payload);

      if (result.error) {
        throw new Error(result.error.message);
      }

      setSuccess(
        editingId
          ? "Activity updated successfully."
          : "Activity created successfully."
      );

      setForm(initialForm);
      setEditingId(null);
      setSelectedImage(null);
      setPreviewUrl("");

      await fetchActivities();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong. Please try again."
      );
    } finally {
      setSaving(false);
      setUploading(false);
    }
  };

  const handleEdit = (activity: Activity) => {
    setEditingId(activity.id);
    setForm({
      title: activity.title,
      description: activity.description,
      image_url: activity.image_url ?? "",
      activity_date: activity.activity_date ?? "",
      location: activity.location ?? "",
      status:
        activity.status === "published" ? "published" : "draft",
    });

    setSelectedImage(null);
    setPreviewUrl(activity.image_url ?? "");
    setError("");
    setSuccess("");

    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleStatus = async (
    id: string,
    status: Activity["status"]
  ) => {
    setError("");
    setSuccess("");

    const { error } = await supabase
      .from("activities")
      .update({ status })
      .eq("id", id);

    if (error) {
      setError(error.message);
    } else {
      setSuccess(`Activity marked as ${status}.`);
      await fetchActivities();
    }
  };

  const handleDelete = async (id: string) => {
    const confirmed = window.confirm(
      "Are you sure you want to permanently delete this activity?"
    );

    if (!confirmed) return;

    setError("");
    setSuccess("");

    const { error } = await supabase
      .from("activities")
      .delete()
      .eq("id", id);

    if (error) {
      setError(error.message);
    } else {
      setSuccess("Activity deleted successfully.");
      await fetchActivities();
    }
  };

  const cancelEdit = () => {
    setEditingId(null);
    setForm(initialForm);
    setSelectedImage(null);
    setPreviewUrl("");
    setError("");
    setSuccess("");
  };

  return (
    <div className="min-h-screen bg-background px-4 py-8 md:px-8">
      <div className="mx-auto max-w-6xl space-y-8">
        <div className="space-y-5">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">
                Activities Management
              </h1>

              <p className="mt-2 text-muted-foreground">
                Create and manage DSC Society activities.
              </p>
            </div>

            <div className="rounded-lg border bg-white px-4 py-3 text-sm shadow-sm">
              Total Activities: <strong>{activities.length}</strong>
            </div>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Plus size={20} />
              {editingId ? "Edit Activity" : "Add New Activity"}
            </CardTitle>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="title">Activity Title *</Label>
                <Input
                  id="title"
                  value={form.title}
                  onChange={(e) =>
                    setForm({ ...form, title: e.target.value })
                  }
                  placeholder="e.g. Plantation Drive"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description *</Label>
                <Textarea
                  id="description"
                  value={form.description}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      description: e.target.value,
                    })
                  }
                  placeholder="Describe the activity..."
                  rows={5}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label>Activity Photograph</Label>

                <div className="rounded-xl border-2 border-dashed p-5">
                  {previewUrl ? (
                    <div className="space-y-3">
                      <img
                        src={previewUrl}
                        alt="Activity preview"
                        className="max-h-64 w-full rounded-lg object-cover"
                      />

                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-sm text-muted-foreground">
                          {selectedImage
                            ? selectedImage.name
                            : "Current activity image"}
                        </span>

                        <Button
                          type="button"
                          size="sm"
                          variant="outline"
                          onClick={removeSelectedImage}
                        >
                          <X size={15} className="mr-1" />
                          Remove
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center gap-3 py-5 text-center">
                      <ImageIcon
                        size={36}
                        className="text-muted-foreground"
                      />
                      <p className="text-sm text-muted-foreground">
                        Select an activity photograph
                      </p>
                    </div>
                  )}

                  <div className="mt-4">
                    <Label
                      htmlFor="activity-image"
                      className="inline-flex cursor-pointer items-center gap-2 rounded-md border px-4 py-2 text-sm font-medium hover:bg-muted"
                    >
                      <Upload size={16} />
                      Choose Image
                    </Label>

                    <Input
                      id="activity-image"
                      type="file"
                      accept="image/jpeg,image/png,image/webp"
                      onChange={handleImageChange}
                      className="hidden"
                    />

                    <p className="mt-2 text-xs text-muted-foreground">
                      JPG, PNG, or WEBP. Maximum size: 5 MB.
                    </p>
                  </div>
                </div>

                <p className="text-xs text-muted-foreground">
                  Alternatively, enter an existing image URL below.
                </p>

                <Input
                  type="url"
                  value={form.image_url}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      image_url: e.target.value,
                    })
                  }
                  placeholder="https://..."
                  disabled={!!selectedImage}
                />
              </div>

              <div className="grid gap-5 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="activity_date">Activity Date</Label>
                  <Input
                    id="activity_date"
                    type="date"
                    value={form.activity_date}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        activity_date: e.target.value,
                      })
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    value={form.location}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        location: e.target.value,
                      })
                    }
                    placeholder="Acharya Nagarjuna University"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="status">Publication Status</Label>
                <select
                  id="status"
                  value={form.status}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      status: e.target.value as
                        | "draft"
                        | "published",
                    })
                  }
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                >
                  <option value="draft">Save as Draft</option>
                  <option value="published">Publish</option>
                </select>
              </div>

              {error && (
                <p role="alert" className="text-sm text-destructive">
                  {error}
                </p>
              )}

              {success && (
                <p role="status" className="text-sm text-green-600">
                  {success}
                </p>
              )}

              <div className="flex flex-wrap gap-3">
                <Button type="submit" disabled={saving}>
                  {saving ? (
                    <Loader2 className="mr-2 animate-spin" size={16} />
                  ) : (
                    <Plus className="mr-2" size={16} />
                  )}

                  {uploading
                    ? "Uploading Image..."
                    : saving
                      ? "Saving..."
                      : editingId
                        ? "Update Activity"
                        : "Save Activity"}
                </Button>

                {editingId && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={cancelEdit}
                  >
                    Cancel
                  </Button>
                )}
              </div>
            </form>
          </CardContent>
        </Card>

        <section className="space-y-4">
          <h2 className="text-xl font-semibold">
            Existing Activities
          </h2>

          {loading ? (
            <div className="flex items-center gap-2 py-8 text-muted-foreground">
              <Loader2 className="animate-spin" size={18} />
              Loading activities...
            </div>
          ) : activities.length === 0 ? (
            <Card>
              <CardContent className="py-10 text-center text-muted-foreground">
                No activities found. Create your first activity above.
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4">
              {activities.map((activity) => (
                <Card key={activity.id}>
                  <CardContent className="flex flex-col gap-4 p-5 md:flex-row md:items-center md:justify-between">
                    <div className="min-w-0 flex-1 space-y-2">
                      {activity.image_url && (
                        <img
                          src={activity.image_url}
                          alt={activity.title}
                          className="mb-3 h-40 w-full max-w-xs rounded-lg object-cover"
                        />
                      )}

                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="font-semibold">
                          {activity.title}
                        </h3>

                        <span className="rounded-full border px-2.5 py-1 text-xs capitalize">
                          {activity.status}
                        </span>
                      </div>

                      <p className="line-clamp-2 text-sm text-muted-foreground">
                        {activity.description}
                      </p>

                      <div className="flex flex-wrap gap-3 text-xs text-muted-foreground">
                        {activity.activity_date && (
                          <span>{activity.activity_date}</span>
                        )}
                        {activity.location && (
                          <span>{activity.location}</span>
                        )}
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleEdit(activity)}
                      >
                        <Pencil size={15} className="mr-1" />
                        Edit
                      </Button>

                      {activity.status !== "published" && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() =>
                            handleStatus(activity.id, "published")
                          }
                        >
                          <Eye size={15} className="mr-1" />
                          Publish
                        </Button>
                      )}

                      {activity.status !== "archived" && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() =>
                            handleStatus(activity.id, "archived")
                          }
                        >
                          <Archive size={15} className="mr-1" />
                          Archive
                        </Button>
                      )}

                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleDelete(activity.id)}
                      >
                        <Trash2 size={15} className="mr-1" />
                        Delete
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default AdminActivities;
