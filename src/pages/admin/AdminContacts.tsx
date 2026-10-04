import { useCallback, useEffect, useMemo, useState } from "react";
import { supabase } from "../../lib/supabase";

type ContactStatus = "unread" | "read" | "resolved";

type ContactSubmission = {
  id: string;
  full_name: string;
  email: string;
  subject: string;
  message: string;
  status: ContactStatus;
  created_at: string;
};

const statusStyles: Record<ContactStatus, string> = {
  unread: "bg-amber-100 text-amber-800",
  read: "bg-blue-100 text-blue-800",
  resolved: "bg-emerald-100 text-emerald-800",
};

const formatDate = (date: string) =>
  new Date(date).toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

export default function AdminContacts() {
  const [contacts, setContacts] = useState<ContactSubmission[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"all" | ContactStatus>("all");
  const [selected, setSelected] = useState<ContactSubmission | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const fetchContacts = useCallback(async () => {
    setLoading(true);
    setError("");

    const { data, error } = await supabase
      .from("contact_submissions")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      setError(error.message);
      setContacts([]);
    } else {
      setContacts((data ?? []) as ContactSubmission[]);
    }

    setLoading(false);
  }, []);

  useEffect(() => {
    void fetchContacts();
  }, [fetchContacts]);

  const counts = useMemo(
    () => ({
      all: contacts.length,
      unread: contacts.filter((item) => item.status === "unread").length,
      read: contacts.filter((item) => item.status === "read").length,
      resolved: contacts.filter((item) => item.status === "resolved").length,
    }),
    [contacts]
  );

  const filteredContacts = useMemo(() => {
    const query = search.trim().toLowerCase();

    return contacts.filter((item) => {
      const matchesStatus = filter === "all" || item.status === filter;

      const matchesSearch =
        !query ||
        item.full_name.toLowerCase().includes(query) ||
        item.email.toLowerCase().includes(query) ||
        item.subject.toLowerCase().includes(query) ||
        item.message.toLowerCase().includes(query);

      return matchesStatus && matchesSearch;
    });
  }, [contacts, filter, search]);

  const updateStatus = async (
    id: string,
    status: ContactStatus
  ) => {
    setUpdatingId(id);
    setError("");

    const { error } = await supabase
      .from("contact_submissions")
      .update({ status })
      .eq("id", id);

    if (error) {
      setError(error.message);
    } else {
      setContacts((previous) =>
        previous.map((item) =>
          item.id === id ? { ...item, status } : item
        )
      );

      setSelected((previous) =>
        previous?.id === id ? { ...previous, status } : previous
      );
    }

    setUpdatingId(null);
  };

  const deleteContact = async (contact: ContactSubmission) => {
    const confirmed = window.confirm(
      `Delete the message from ${contact.full_name}? This action cannot be undone.`
    );

    if (!confirmed) return;

    setUpdatingId(contact.id);
    setError("");

    const { error } = await supabase
      .from("contact_submissions")
      .delete()
      .eq("id", contact.id);

    if (error) {
      setError(error.message);
    } else {
      setContacts((previous) =>
        previous.filter((item) => item.id !== contact.id)
      );

      if (selected?.id === contact.id) {
        setSelected(null);
      }
    }

    setUpdatingId(null);
  };

  const openContact = async (contact: ContactSubmission) => {
    setSelected(contact);

    if (contact.status === "unread") {
      await updateStatus(contact.id, "read");
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <a
              href="/admin/dashboard"
              className="mb-3 inline-flex text-sm font-medium text-slate-500 hover:text-emerald-700"
            >
              ← Back to Dashboard
            </a>

            <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
              Contact Submissions
            </h1>

            <p className="mt-1 text-sm text-slate-500">
              Review and manage messages received through the DSC Society
              website.
            </p>
          </div>

          <button
            onClick={() => void fetchContacts()}
            disabled={loading}
            className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-100 disabled:opacity-50"
          >
            {loading ? "Refreshing..." : "↻ Refresh"}
          </button>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-5 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            {error}
          </div>
        )}

        {/* Statistics */}
        <div className="mb-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
          {[
            {
              label: "Total Messages",
              value: counts.all,
              color: "text-slate-900",
            },
            {
              label: "Unread",
              value: counts.unread,
              color: "text-amber-600",
            },
            {
              label: "Read",
              value: counts.read,
              color: "text-blue-600",
            },
            {
              label: "Resolved",
              value: counts.resolved,
              color: "text-emerald-600",
            },
          ].map((item) => (
            <div
              key={item.label}
              className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
            >
              <p className="text-sm font-medium text-slate-500">
                {item.label}
              </p>
              <p className={`mt-2 text-3xl font-bold ${item.color}`}>
                {item.value}
              </p>
            </div>
          ))}
        </div>

        {/* Search and filter */}
        <div className="mb-5 flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:flex-row">
          <input
            type="search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search name, email, subject or message..."
            className="min-w-0 flex-1 rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
          />

          <select
            value={filter}
            onChange={(event) =>
              setFilter(event.target.value as "all" | ContactStatus)
            }
            className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-emerald-500"
          >
            <option value="all">All Messages</option>
            <option value="unread">Unread</option>
            <option value="read">Read</option>
            <option value="resolved">Resolved</option>
          </select>
        </div>

        {/* Messages */}
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-100 px-5 py-4">
            <h2 className="font-semibold text-slate-900">
              Messages ({filteredContacts.length})
            </h2>
          </div>

          {loading ? (
            <div className="p-12 text-center text-sm text-slate-500">
              Loading contact submissions...
            </div>
          ) : filteredContacts.length === 0 ? (
            <div className="p-12 text-center">
              <div className="mb-3 text-3xl">✉</div>
              <p className="font-medium text-slate-800">
                No messages found
              </p>
              <p className="mt-1 text-sm text-slate-500">
                Try changing your search or status filter.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {filteredContacts.map((contact) => (
                <div
                  key={contact.id}
                  className="flex flex-col gap-4 p-5 transition hover:bg-slate-50 sm:flex-row sm:items-center sm:justify-between"
                >
                  <button
                    onClick={() => void openContact(contact)}
                    className="min-w-0 flex-1 text-left"
                  >
                    <div className="mb-2 flex flex-wrap items-center gap-2">
                      <h3 className="font-semibold text-slate-900">
                        {contact.full_name}
                      </h3>

                      <span
                        className={`rounded-full px-2.5 py-1 text-xs font-semibold capitalize ${statusStyles[contact.status]}`}
                      >
                        {contact.status}
                      </span>
                    </div>

                    <p className="text-sm text-slate-600">
                      {contact.email}
                    </p>

                    <p className="mt-2 truncate text-sm font-medium text-slate-800">
                      {contact.subject}
                    </p>

                    <p className="mt-1 line-clamp-2 text-sm text-slate-500">
                      {contact.message}
                    </p>

                    <p className="mt-3 text-xs text-slate-400">
                      {formatDate(contact.created_at)}
                    </p>
                  </button>

                  <div className="flex shrink-0 flex-wrap gap-2">
                    <button
                      onClick={() => void openContact(contact)}
                      className="rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100"
                    >
                      View
                    </button>

                    <a
                      href={`mailto:${contact.email}?subject=${encodeURIComponent(
                        `Re: ${contact.subject}`
                      )}`}
                      className="rounded-lg bg-emerald-600 px-3 py-2 text-sm font-medium text-white hover:bg-emerald-700"
                    >
                      Reply
                    </a>

                    <button
                      onClick={() => void deleteContact(contact)}
                      disabled={updatingId === contact.id}
                      className="rounded-lg border border-red-200 px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 disabled:opacity-50"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Message detail modal */}
      {selected && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              setSelected(null);
            }
          }}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="contact-modal-title"
            className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white shadow-2xl"
          >
            <div className="flex items-start justify-between border-b border-slate-100 p-5 sm:p-6">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-emerald-700">
                  Contact Message
                </p>
                <h2
                  id="contact-modal-title"
                  className="mt-1 text-xl font-bold text-slate-900"
                >
                  {selected.subject}
                </h2>
              </div>

              <button
                onClick={() => setSelected(null)}
                aria-label="Close message"
                className="rounded-lg p-2 text-xl text-slate-400 hover:bg-slate-100 hover:text-slate-700"
              >
                ×
              </button>
            </div>

            <div className="space-y-5 p-5 sm:p-6">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <p className="text-xs font-medium uppercase text-slate-400">
                    Sender
                  </p>
                  <p className="mt-1 font-semibold text-slate-800">
                    {selected.full_name}
                  </p>
                </div>

                <div>
                  <p className="text-xs font-medium uppercase text-slate-400">
                    Email
                  </p>
                  <a
                    href={`mailto:${selected.email}`}
                    className="mt-1 block break-all font-medium text-emerald-700 hover:underline"
                  >
                    {selected.email}
                  </a>
                </div>

                <div>
                  <p className="text-xs font-medium uppercase text-slate-400">
                    Received
                  </p>
                  <p className="mt-1 text-sm text-slate-700">
                    {formatDate(selected.created_at)}
                  </p>
                </div>

                <div>
                  <p className="text-xs font-medium uppercase text-slate-400">
                    Current Status
                  </p>
                  <span
                    className={`mt-1 inline-flex rounded-full px-3 py-1 text-xs font-semibold capitalize ${statusStyles[selected.status]}`}
                  >
                    {selected.status}
                  </span>
                </div>
              </div>

              <div className="border-t border-slate-100 pt-5">
                <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Message
                </p>
                <div className="whitespace-pre-wrap rounded-xl bg-slate-50 p-4 text-sm leading-7 text-slate-700">
                  {selected.message}
                </div>
              </div>

              <div>
                <label
                  htmlFor="contact-status"
                  className="mb-2 block text-sm font-semibold text-slate-700"
                >
                  Update Status
                </label>

                <select
                  id="contact-status"
                  value={selected.status}
                  disabled={updatingId === selected.id}
                  onChange={(event) =>
                    void updateStatus(
                      selected.id,
                      event.target.value as ContactStatus
                    )
                  }
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-emerald-500 disabled:opacity-50"
                >
                  <option value="unread">Unread</option>
                  <option value="read">Read</option>
                  <option value="resolved">Resolved</option>
                </select>
              </div>

              <div className="flex flex-col-reverse gap-3 border-t border-slate-100 pt-5 sm:flex-row sm:justify-between">
                <button
                  onClick={() => void deleteContact(selected)}
                  disabled={updatingId === selected.id}
                  className="rounded-xl border border-red-200 px-4 py-3 text-sm font-semibold text-red-600 hover:bg-red-50 disabled:opacity-50"
                >
                  Delete Message
                </button>

                <div className="flex gap-3">
                  <button
                    onClick={() => setSelected(null)}
                    className="flex-1 rounded-xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50 sm:flex-none"
                  >
                    Close
                  </button>

                  <a
                    href={`mailto:${selected.email}?subject=${encodeURIComponent(
                      `Re: ${selected.subject}`
                    )}`}
                    className="flex-1 rounded-xl bg-emerald-600 px-4 py-3 text-center text-sm font-semibold text-white hover:bg-emerald-700 sm:flex-none"
                  >
                    Reply by Email
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}