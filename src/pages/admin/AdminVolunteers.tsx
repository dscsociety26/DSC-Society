
import { useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
import { supabase } from "../../lib/supabase";

type VolunteerStatus =
  | "new"
  | "reviewed"
  | "approved"
  | "rejected";

type Volunteer = {
  id: string;
  full_name: string;
  email: string;
  phone: string | null;
  college: string | null;
  interests: string[] | string | null;
  message: string | null;
  status: VolunteerStatus;
  created_at: string;
};

type StatusFilter = "all" | VolunteerStatus;

const statusStyles: Record<VolunteerStatus, string> = {
  new: "bg-blue-100 text-blue-800",
  reviewed: "bg-amber-100 text-amber-800",
  approved: "bg-emerald-100 text-emerald-800",
  rejected: "bg-red-100 text-red-800",
};

const statusOptions: VolunteerStatus[] = [
  "new",
  "reviewed",
  "approved",
  "rejected",
];

function formatDate(value: string) {
  return new Date(value).toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function formatInterests(
  interests: Volunteer["interests"]
): string {
  if (Array.isArray(interests)) {
    return interests.join(", ");
  }

  return interests || "Not specified";
}

export default function AdminVolunteers() {
  const [volunteers, setVolunteers] = useState<Volunteer[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] =
    useState<StatusFilter>("all");

  const [selectedVolunteer, setSelectedVolunteer] =
    useState<Volunteer | null>(null);

  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    void loadVolunteers();
  }, []);

  async function loadVolunteers(isRefresh = false) {
    if (isRefresh) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }

    setError("");

    const { data, error: fetchError } = await supabase
      .from("volunteer_registrations")
      .select("*")
      .order("created_at", { ascending: false });

    if (fetchError) {
      setError(fetchError.message);
    } else {
      setVolunteers((data ?? []) as Volunteer[]);
    }

    setLoading(false);
    setRefreshing(false);
  }

  const counts = useMemo(() => {
    return {
      all: volunteers.length,
      new: volunteers.filter((v) => v.status === "new").length,
      reviewed: volunteers.filter((v) => v.status === "reviewed").length,
      approved: volunteers.filter((v) => v.status === "approved").length,
      rejected: volunteers.filter((v) => v.status === "rejected").length,
    };
  }, [volunteers]);

  const filteredVolunteers = useMemo(() => {
    const query = search.trim().toLowerCase();

    return volunteers.filter((volunteer) => {
      const matchesStatus =
        statusFilter === "all" ||
        volunteer.status === statusFilter;

      const searchableText = [
        volunteer.full_name,
        volunteer.email,
        volunteer.phone ?? "",
        volunteer.college ?? "",
      ]
        .join(" ")
        .toLowerCase();

      const matchesSearch =
        !query || searchableText.includes(query);

      return matchesStatus && matchesSearch;
    });
  }, [volunteers, search, statusFilter]);

  async function updateStatus(
    volunteer: Volunteer,
    status: VolunteerStatus
  ) {
    setUpdatingId(volunteer.id);
    setError("");
    setSuccess("");

    const { error: updateError } = await supabase
      .from("volunteer_registrations")
      .update({ status })
      .eq("id", volunteer.id);

    if (updateError) {
      setError(updateError.message);
      setUpdatingId(null);
      return;
    }

    setVolunteers((current) =>
      current.map((item) =>
        item.id === volunteer.id
          ? { ...item, status }
          : item
      )
    );

    setSelectedVolunteer((current) =>
      current?.id === volunteer.id
        ? { ...current, status }
        : current
    );

    setSuccess(
      `${volunteer.full_name}'s application status updated to ${status}.`
    );

    setUpdatingId(null);
  }

  async function deleteVolunteer(volunteer: Volunteer) {
    const confirmed = window.confirm(
      `Are you sure you want to permanently delete the registration of ${volunteer.full_name}?`
    );

    if (!confirmed) return;

    setError("");
    setSuccess("");

    const { error: deleteError } = await supabase
      .from("volunteer_registrations")
      .delete()
      .eq("id", volunteer.id);

    if (deleteError) {
      setError(deleteError.message);
      return;
    }

    setVolunteers((current) =>
      current.filter((item) => item.id !== volunteer.id)
    );

    if (selectedVolunteer?.id === volunteer.id) {
      setSelectedVolunteer(null);
    }

    setSuccess("Volunteer registration deleted successfully.");
  }

  function StatCard({
    title,
    count,
    color,
    onClick,
    active,
  }: {
    title: string;
    count: number;
    color: string;
    onClick: () => void;
    active: boolean;
  }) {
    return (
      <button
        type="button"
        onClick={onClick}
        className={`rounded-2xl border bg-white p-5 text-left shadow-sm transition hover:-translate-y-0.5 hover:shadow-md ${
          active
            ? "border-emerald-500 ring-2 ring-emerald-100"
            : "border-slate-200"
        }`}
      >
        <p className="text-sm font-medium text-slate-500">
          {title}
        </p>

        <p className={`mt-2 text-3xl font-bold ${color}`}>
          {count}
        </p>
      </button>
    );
  }

  function DetailRow({
    label,
    children,
  }: {
    label: string;
    children: ReactNode;
  }) {
    return (
      <div className="border-b border-slate-100 py-3 last:border-0">
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
          {label}
        </p>

        <div className="mt-1 break-words text-sm text-slate-800">
          {children}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-8 sm:px-6 lg:px-10">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 space-y-5">
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
            <div>
              <p className="text-sm font-semibold uppercase tracking-wider text-emerald-700">
                DSC Society Admin
              </p>

            <h1 className="mt-2 text-3xl font-bold text-slate-900">
              Volunteer Registrations
            </h1>

              <p className="mt-2 text-slate-600">
                Review applications and manage volunteer participation.
              </p>
            </div>

            <button
            type="button"
            onClick={() => void loadVolunteers(true)}
            disabled={refreshing || loading}
            className="rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm hover:bg-slate-50 disabled:opacity-50"
          >
            {refreshing ? "Refreshing..." : "↻ Refresh"}
            </button>
          </div>
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

        <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          <StatCard
            title="Total Applications"
            count={counts.all}
            color="text-slate-900"
            active={statusFilter === "all"}
            onClick={() => setStatusFilter("all")}
          />

          <StatCard
            title="New"
            count={counts.new}
            color="text-blue-700"
            active={statusFilter === "new"}
            onClick={() => setStatusFilter("new")}
          />

          <StatCard
            title="Reviewed"
            count={counts.reviewed}
            color="text-amber-700"
            active={statusFilter === "reviewed"}
            onClick={() => setStatusFilter("reviewed")}
          />

          <StatCard
            title="Approved"
            count={counts.approved}
            color="text-emerald-700"
            active={statusFilter === "approved"}
            onClick={() => setStatusFilter("approved")}
          />

          <StatCard
            title="Rejected"
            count={counts.rejected}
            color="text-red-700"
            active={statusFilter === "rejected"}
            onClick={() => setStatusFilter("rejected")}
          />
        </div>

        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-200 p-5">
            <div className="flex flex-col gap-3 md:flex-row">
              <div className="flex-1">
                <label
                  htmlFor="volunteer-search"
                  className="sr-only"
                >
                  Search volunteers
                </label>

                <input
                  id="volunteer-search"
                  type="search"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search name, email, phone or college..."
                  className="w-full rounded-lg border border-slate-300 px-4 py-3 text-sm outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
                />
              </div>

              <select
                value={statusFilter}
                onChange={(e) =>
                  setStatusFilter(e.target.value as StatusFilter)
                }
                className="rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm"
                aria-label="Filter by application status"
              >
                <option value="all">All Statuses</option>
                <option value="new">New</option>
                <option value="reviewed">Reviewed</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>

            <p className="mt-3 text-sm text-slate-500">
              Showing {filteredVolunteers.length} of {volunteers.length} registrations
            </p>
          </div>

          {loading ? (
            <div className="p-12 text-center text-slate-500">
              Loading volunteer registrations...
            </div>
          ) : filteredVolunteers.length === 0 ? (
            <div className="p-12 text-center">
              <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-xl">
                <span aria-hidden="true">♧</span>
              </div>

              <h3 className="font-semibold text-slate-800">
                No registrations found
              </h3>

              <p className="mt-1 text-sm text-slate-500">
                Try changing your search or status filter.
              </p>
            </div>
          ) : (
            <>
              <div className="hidden overflow-x-auto md:block">
                <table className="w-full text-left">
                  <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                    <tr>
                      <th className="px-5 py-4 font-semibold">
                        Volunteer
                      </th>
                      <th className="px-5 py-4 font-semibold">
                        Contact
                      </th>
                      <th className="px-5 py-4 font-semibold">
                        College
                      </th>
                      <th className="px-5 py-4 font-semibold">
                        Applied On
                      </th>
                      <th className="px-5 py-4 font-semibold">
                        Status
                      </th>
                      <th className="px-5 py-4 font-semibold">
                        Actions
                      </th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-slate-100">
                    {filteredVolunteers.map((volunteer) => (
                      <tr
                        key={volunteer.id}
                        className="transition hover:bg-slate-50"
                      >
                        <td className="px-5 py-4">
                          <p className="font-semibold text-slate-900">
                            {volunteer.full_name}
                          </p>

                          <p className="mt-1 max-w-48 truncate text-xs text-slate-500">
                            {formatInterests(volunteer.interests)}
                          </p>
                        </td>

                        <td className="px-5 py-4">
                          <p className="text-sm text-slate-700">
                            {volunteer.email}
                          </p>

                          <p className="mt-1 text-xs text-slate-500">
                            {volunteer.phone || "No phone"}
                          </p>
                        </td>

                        <td className="px-5 py-4 text-sm text-slate-600">
                          {volunteer.college || "Not specified"}
                        </td>

                        <td className="whitespace-nowrap px-5 py-4 text-sm text-slate-500">
                          {formatDate(volunteer.created_at)}
                        </td>

                        <td className="px-5 py-4">
                          <span
                            className={`rounded-full px-3 py-1 text-xs font-semibold capitalize ${statusStyles[volunteer.status]}`}
                          >
                            {volunteer.status}
                          </span>
                        </td>

                        <td className="px-5 py-4">
                          <button
                            type="button"
                            onClick={() =>
                              setSelectedVolunteer(volunteer)
                            }
                            className="rounded-lg border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-white"
                          >
                            View
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="grid gap-4 p-4 md:hidden">
                {filteredVolunteers.map((volunteer) => (
                  <article
                    key={volunteer.id}
                    className="rounded-xl border border-slate-200 p-4"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h3 className="font-semibold text-slate-900">
                          {volunteer.full_name}
                        </h3>

                        <p className="mt-1 break-all text-sm text-slate-500">
                          {volunteer.email}
                        </p>
                      </div>

                      <span
                        className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-semibold capitalize ${statusStyles[volunteer.status]}`}
                      >
                        {volunteer.status}
                      </span>
                    </div>

                    <div className="mt-3 space-y-1 text-sm text-slate-600">
                      <p>{volunteer.phone || "No phone"}</p>
                      <p>{volunteer.college || "College not specified"}</p>
                      <p className="text-xs text-slate-400">
                        {formatDate(volunteer.created_at)}
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => setSelectedVolunteer(volunteer)}
                      className="mt-4 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                    >
                      View Application
                    </button>
                  </article>
                ))}
              </div>
            </>
          )}
        </section>

        {selectedVolunteer && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4"
            onMouseDown={(e) => {
              if (e.target === e.currentTarget) {
                setSelectedVolunteer(null);
              }
            }}
          >
            <section
              role="dialog"
              aria-modal="true"
              aria-labelledby="volunteer-dialog-title"
              className="max-h-[90vh] w-full max-w-xl overflow-y-auto rounded-2xl bg-white shadow-2xl"
            >
              <div className="sticky top-0 flex items-center justify-between border-b border-slate-200 bg-white p-5">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-emerald-700">
                    Application Details
                  </p>

                  <h2
                    id="volunteer-dialog-title"
                    className="mt-1 text-xl font-bold text-slate-900"
                  >
                    {selectedVolunteer.full_name}
                  </h2>
                </div>

                <button
                  type="button"
                  onClick={() => setSelectedVolunteer(null)}
                  aria-label="Close application details"
                  className="rounded-lg px-3 py-2 text-xl text-slate-500 hover:bg-slate-100"
                >
                  ×
                </button>
              </div>

              <div className="p-5">
                <DetailRow label="Full Name">
                  {selectedVolunteer.full_name}
                </DetailRow>

                <DetailRow label="Email">
                  <a
                    href={`mailto:${selectedVolunteer.email}`}
                    className="text-emerald-700 hover:underline"
                  >
                    {selectedVolunteer.email}
                  </a>
                </DetailRow>

                <DetailRow label="Phone">
                  {selectedVolunteer.phone || "Not provided"}
                </DetailRow>

                <DetailRow label="College">
                  {selectedVolunteer.college || "Not provided"}
                </DetailRow>

                <DetailRow label="Interests">
                  {formatInterests(selectedVolunteer.interests)}
                </DetailRow>

                <DetailRow label="Message">
                  <p className="whitespace-pre-wrap">
                    {selectedVolunteer.message || "No message provided"}
                  </p>
                </DetailRow>

                <DetailRow label="Registration Date">
                  {formatDate(selectedVolunteer.created_at)}
                </DetailRow>

                <div className="mt-5">
                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    Application Status
                  </label>

                  <select
                    value={selectedVolunteer.status}
                    disabled={updatingId === selectedVolunteer.id}
                    onChange={(e) =>
                      void updateStatus(
                        selectedVolunteer,
                        e.target.value as VolunteerStatus
                      )
                    }
                    className="w-full rounded-lg border border-slate-300 bg-white px-3 py-3 text-sm disabled:opacity-50"
                  >
                    {statusOptions.map((status) => (
                      <option key={status} value={status}>
                        {status.charAt(0).toUpperCase() + status.slice(1)}
                      </option>
                    ))}
                  </select>

                  {updatingId === selectedVolunteer.id && (
                    <p className="mt-2 text-xs text-slate-500">
                      Updating status...
                    </p>
                  )}
                </div>

                <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                  <a
                    href={`mailto:${selectedVolunteer.email}`}
                    className="flex-1 rounded-lg bg-emerald-700 px-4 py-3 text-center text-sm font-semibold text-white hover:bg-emerald-800"
                  >
                    Contact Volunteer
                  </a>

                  <button
                    type="button"
                    onClick={() =>
                      void deleteVolunteer(selectedVolunteer)
                    }
                    className="rounded-lg border border-red-200 px-4 py-3 text-sm font-semibold text-red-600 hover:bg-red-50"
                  >
                    Delete Registration
                  </button>
                </div>
              </div>
            </section>
          </div>
        )}
      </div>
    </div>
  );
}
