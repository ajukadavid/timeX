"use client";

import { useState } from "react";
import { useConvexAuth, useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import type { Id } from "@/convex/_generated/dataModel";
import { Button } from "@/components/ui/Button";
import { FormField } from "@/components/ui/FormField";
import { XModal } from "@/components/XModal";
import { toast } from "@/lib/toast";

type StatusFilter = "all" | "pending" | "approved" | "rejected";

function statusBadge(status: string) {
  if (status === "approved") return "bg-green-50 text-green-700";
  if (status === "rejected") return "bg-red-50 text-red-700";
  return "bg-yellow-50 text-yellow-700";
}

export default function LeaveRequestsPage() {
  const { isAuthenticated } = useConvexAuth();
  const myAdminOrg = useQuery(api.organizations.getMyAdminOrg, isAuthenticated ? {} : "skip");
  const organizationId = myAdminOrg?._id;

  const [filter, setFilter] = useState<StatusFilter>("pending");
  const [reviewingId, setReviewingId] = useState<Id<"leaveRequests"> | null>(null);
  const [reviewNote, setReviewNote] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const requests = useQuery(
    api.leave.listOrgLeaveRequests,
    isAuthenticated && organizationId
      ? { organizationId, status: filter === "all" ? undefined : filter }
      : "skip"
  );

  const reviewLeave = useMutation(api.leave.reviewLeave);

  async function handleReview(decision: "approved" | "rejected") {
    if (!reviewingId) return;
    setSubmitting(true);
    try {
      await reviewLeave({ requestId: reviewingId, decision, reviewNote: reviewNote || undefined });
      toast(`Leave request ${decision}`, "success");
      setReviewingId(null);
      setReviewNote("");
    } catch (e) {
      toast(e instanceof Error ? e.message : "Failed to review", "error");
    } finally {
      setSubmitting(false);
    }
  }

  const reviewingRequest = reviewingId ? requests?.find((r) => r._id === reviewingId) : null;

  const filterTabs: { label: string; value: StatusFilter }[] = [
    { label: "Pending", value: "pending" },
    { label: "Approved", value: "approved" },
    { label: "Rejected", value: "rejected" },
    { label: "All", value: "all" },
  ];

  return (
    <main className="min-h-full bg-white p-4 md:p-10">
      <div className="max-w-5xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Leave Requests</h1>
          <p className="text-sm text-gray-500 mt-1">
            Review and manage staff leave requests for {myAdminOrg?.name ?? "your organisation"}.
          </p>
        </div>

        {/* Filter tabs */}
        <div className="flex gap-2 mb-6 border-b border-gray-200">
          {filterTabs.map((tab) => (
            <button
              key={tab.value}
              onClick={() => setFilter(tab.value)}
              className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                filter === tab.value
                  ? "border-purple-600 text-purple-700"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Table */}
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          {requests === undefined ? (
            <div className="p-8 text-center text-gray-400 text-sm">Loading…</div>
          ) : requests.length === 0 ? (
            <div className="p-8 text-center text-gray-400 text-sm">
              No {filter !== "all" ? filter : ""} leave requests.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200">
                    <th className="text-left py-3 px-4 text-gray-600 font-semibold">Staff</th>
                    <th className="text-left py-3 px-4 text-gray-600 font-semibold">Type</th>
                    <th className="text-left py-3 px-4 text-gray-600 font-semibold">From</th>
                    <th className="text-left py-3 px-4 text-gray-600 font-semibold">To</th>
                    <th className="text-left py-3 px-4 text-gray-600 font-semibold">Days</th>
                    <th className="text-left py-3 px-4 text-gray-600 font-semibold">Reason</th>
                    <th className="text-left py-3 px-4 text-gray-600 font-semibold">Status</th>
                    <th className="py-3 px-4" />
                  </tr>
                </thead>
                <tbody>
                  {requests.map((req) => (
                    <tr key={req._id} className="border-b border-gray-50 hover:bg-gray-50/50">
                      <td className="py-3 px-4 font-medium text-gray-900">{req.staffName}</td>
                      <td className="py-3 px-4 capitalize text-gray-700">{req.type}</td>
                      <td className="py-3 px-4 text-gray-600">{req.startDate}</td>
                      <td className="py-3 px-4 text-gray-600">{req.endDate}</td>
                      <td className="py-3 px-4 text-gray-600">{req.daysRequested}</td>
                      <td className="py-3 px-4 text-gray-500 max-w-[160px] truncate">{req.reason ?? "—"}</td>
                      <td className="py-3 px-4">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${statusBadge(req.status)}`}>
                          {req.status.charAt(0).toUpperCase() + req.status.slice(1)}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        {req.status === "pending" && (
                          <button
                            onClick={() => { setReviewingId(req._id); setReviewNote(""); }}
                            className="text-xs text-purple-600 hover:text-purple-800 font-medium"
                          >
                            Review
                          </button>
                        )}
                        {req.reviewNote && req.status !== "pending" && (
                          <span className="text-xs text-gray-400 italic" title={req.reviewNote}>
                            Note ℹ️
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Review Modal */}
      <XModal
        open={!!reviewingId}
        onClose={() => setReviewingId(null)}
        title="Review Leave Request"
        size="md"
        footer={
          <div className="flex justify-end gap-3">
            <Button color="gray" variant="soft" onClick={() => setReviewingId(null)}>Cancel</Button>
            <Button color="red" loading={submitting} onClick={() => handleReview("rejected")}>Reject</Button>
            <Button loading={submitting} onClick={() => handleReview("approved")}>Approve</Button>
          </div>
        }
      >
        {reviewingRequest && (
          <div className="space-y-4">
            <div className="bg-gray-50 rounded-lg p-4 text-sm space-y-2">
              <p><span className="text-gray-500">Staff:</span> <strong>{reviewingRequest.staffName}</strong></p>
              <p><span className="text-gray-500">Type:</span> <span className="capitalize">{reviewingRequest.type}</span></p>
              <p><span className="text-gray-500">Dates:</span> {reviewingRequest.startDate} → {reviewingRequest.endDate} ({reviewingRequest.daysRequested} day{reviewingRequest.daysRequested !== 1 ? "s" : ""})</p>
              {reviewingRequest.reason && <p><span className="text-gray-500">Reason:</span> {reviewingRequest.reason}</p>}
            </div>
            <FormField label="Review Note (optional)" name="reviewNote">
              <textarea
                value={reviewNote}
                onChange={(e) => setReviewNote(e.target.value)}
                rows={3}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
                placeholder="e.g. Approved. Enjoy your time off!"
              />
            </FormField>
          </div>
        )}
      </XModal>
    </main>
  );
}
