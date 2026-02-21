import { useState, useEffect } from "react";
import {
  getContactSubmissions,
  updateContactSubmission,
  deleteContactSubmission,
} from "../../api";
import type { ContactSubmission } from "../../types";

export default function ContactSubmissionsManager() {
  const [submissions, setSubmissions] = useState<ContactSubmission[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState<
    "new" | "reviewed" | "responded" | "all"
  >("all");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadSubmissions();
  }, []);

  const loadSubmissions = async () => {
    try {
      setIsLoading(true);
      const data = await getContactSubmissions();
      setSubmissions(data);
      setError(null);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to load submissions",
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleStatusUpdate = async (
    id: string,
    status: "new" | "reviewed" | "responded",
  ) => {
    try {
      await updateContactSubmission(id, status);
      await loadSubmissions();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to update submission",
      );
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this submission?")) return;
    try {
      await deleteContactSubmission(id);
      await loadSubmissions();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to delete submission",
      );
    }
  };

  const filteredSubmissions =
    filter === "all"
      ? submissions
      : submissions.filter((s) => s.status === filter);

  if (isLoading) {
    return (
      <div className="p-4 text-center text-gray-600">
        Loading submissions...
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-light text-gray-900">
          Contact Submissions
        </h2>
        <div className="mt-4 flex gap-2 flex-wrap">
          {(["all", "new", "reviewed", "responded"] as const).map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-4 py-2 rounded-md text-sm font-medium ${
                filter === status
                  ? "bg-gray-900 text-white"
                  : "border border-gray-300 text-gray-700 hover:bg-gray-50"
              }`}
            >
              {status === "all"
                ? "All"
                : status.charAt(0).toUpperCase() + status.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-md text-red-700">
          {error}
        </div>
      )}

      <div className="space-y-4">
        {filteredSubmissions.length === 0 ? (
          <p className="p-4 text-center text-gray-600">No submissions.</p>
        ) : (
          filteredSubmissions.map((submission) => (
            <div
              key={submission.id}
              className="p-6 border rounded-lg hover:shadow-md transition"
            >
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <p className="text-xs uppercase tracking-[0.1em] text-gray-500">
                    Name
                  </p>
                  <p className="font-medium text-gray-900">{submission.name}</p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-[0.1em] text-gray-500">
                    Email
                  </p>
                  <a
                    href={`mailto:${submission.email}`}
                    className="font-medium text-gray-900 hover:text-blue-600"
                  >
                    {submission.email}
                  </a>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-[0.1em] text-gray-500">
                    Organization
                  </p>
                  <p className="font-medium text-gray-900">
                    {submission.organization || "—"}
                  </p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-[0.1em] text-gray-500">
                    Service
                  </p>
                  <p className="font-medium text-gray-900">
                    {submission.service}
                  </p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-[0.1em] text-gray-500">
                    Event Date
                  </p>
                  <p className="font-medium text-gray-900">
                    {submission.eventDate || "—"}
                  </p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-[0.1em] text-gray-500">
                    Submitted
                  </p>
                  <p className="font-medium text-gray-900">
                    {submission.submittedAt
                      ? new Date(submission.submittedAt).toLocaleDateString()
                      : "—"}
                  </p>
                </div>
              </div>

              <div className="mb-4 p-4 bg-gray-50 rounded">
                <p className="text-xs uppercase tracking-[0.1em] text-gray-500 mb-2">
                  Message
                </p>
                <p className="text-gray-700 text-sm whitespace-pre-wrap">
                  {submission.message}
                </p>
              </div>

              <div className="flex gap-2">
                <select
                  value={submission.status || "new"}
                  onChange={(e) =>
                    handleStatusUpdate(
                      submission.id!,
                      e.target.value as "new" | "reviewed" | "responded",
                    )
                  }
                  className="text-sm px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-gray-900"
                >
                  <option value="new">New</option>
                  <option value="reviewed">Reviewed</option>
                  <option value="responded">Responded</option>
                </select>
                <button
                  onClick={() => handleDelete(submission.id!)}
                  className="text-sm px-3 py-2 border border-red-200 text-red-700 rounded-md hover:bg-red-50"
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
