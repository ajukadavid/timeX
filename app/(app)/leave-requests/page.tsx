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

const LEAVE_TYPE_STYLES: Record<string, { bg: string; color: string }> = {
  annual: { bg: "#b0f0d6", color: "#0b513d" },
  sick: { bg: "#ffdbd0", color: "#832600" },
  emergency: { bg: "#ffdad6", color: "#93000a" },
  unpaid: { bg: "#ebefec", color: "#404944" },
  maternity: { bg: "#bbf37c", color: "#1c3400" },
  paternity: { bg: "#bbf37c", color: "#1c3400" },
  other: { bg: "#ebefec", color: "#404944" },
};

const STATUS_STYLES: Record<string, { bg: string; color: string; dot: string }> = {
  pending: { bg: "#ffdbd0", color: "#832600", dot: "#ac3400" },
  approved: { bg: "#b0f0d6", color: "#0b513d", dot: "#003527" },
  rejected: { bg: "#ffdad6", color: "#93000a", dot: "#ba1a1a" },
};

function initials(name: string) {
  return name.split(" ").map((w) => w[0] ?? "").slice(0, 2).join("").toUpperCase();
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
      setReviewingId(null); setReviewNote("");
    } catch (e) {
      toast(e instanceof Error ? e.message : "Failed to review", "error");
    } finally { setSubmitting(false); }
  }

  const reviewingRequest = reviewingId ? requests?.find((r) => r._id === reviewingId) : null;

  const filterTabs: { label: string; value: StatusFilter; count?: number }[] = [
    { label: "Pending", value: "pending" },
    { label: "Approved", value: "approved" },
    { label: "Rejected", value: "rejected" },
    { label: "All", value: "all" },
  ];

  const pendingCount = filter === "pending" ? (requests?.length ?? 0) : 0;

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#f6faf7" }}>
      {/* Header */}
      <header className="sticky top-0 z-40 border-b" style={{ backgroundColor: "#f6faf7", borderColor: "rgba(191,201,195,0.4)", boxShadow: "0 1px 12px rgba(6,78,59,0.04)" }}>
        <div className="flex items-center justify-between h-16 px-6">
          <div>
            <h1 className="font-bold text-xl leading-none" style={{ color: "#003527", fontFamily: "var(--font-hanken, sans-serif)" }}>
              Leave Management
            </h1>
            {myAdminOrg && <p className="text-xs mt-0.5" style={{ fontFamily: "var(--font-jetbrains, monospace)", color: "#707974" }}>{myAdminOrg.name}</p>}
          </div>
        </div>
      </header>

      <div className="p-6 space-y-6">
        {/* Summary bento cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Pending count */}
          <div className="rounded-xl border-l-4 p-6" style={{ backgroundColor: "#ffffff", borderColor: "#ac3400", boxShadow: "0 2px 10px rgba(6,78,59,0.04)" }}>
            <p className="text-xs uppercase tracking-wider mb-3" style={{ fontFamily: "var(--font-jetbrains, monospace)", color: "#707974" }}>Pending</p>
            <p className="text-4xl font-bold" style={{ color: "#ac3400", fontFamily: "var(--font-hanken, sans-serif)" }}>
              {filter === "pending" ? (requests?.length ?? "—") : "—"}
            </p>
            <p className="text-sm mt-2" style={{ color: "#707974" }}>Awaiting review</p>
          </div>
          {/* Quick tip */}
          <div className="rounded-xl p-6 relative overflow-hidden" style={{ backgroundColor: "#064e3b" }}>
            <p className="text-xs uppercase tracking-wider mb-2" style={{ fontFamily: "var(--font-jetbrains, monospace)", color: "#80bea6" }}>Policy Tip</p>
            <p className="text-sm" style={{ color: "#b0f0d6" }}>Review leave promptly to maintain healthy team capacity.</p>
            <div className="absolute bottom-0 right-0 opacity-10" style={{ transform: "translate(25%, 25%)" }}>
              <span className="material-symbols-outlined text-white" style={{ fontSize: "80px", fontVariationSettings: "'FILL' 1" }}>eco</span>
            </div>
          </div>
          {/* Capacity indicator */}
          <div className="rounded-xl border p-6" style={{ backgroundColor: "#ffffff", borderColor: "rgba(191,201,195,0.3)" }}>
            <p className="text-xs uppercase tracking-wider mb-3" style={{ fontFamily: "var(--font-jetbrains, monospace)", color: "#707974" }}>Status</p>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: "#003527" }} />
              <p className="font-semibold text-sm" style={{ color: "#003527" }}>Leave system active</p>
            </div>
            <p className="text-xs mt-2" style={{ color: "#707974" }}>Staff can request leave from their portal.</p>
          </div>
        </div>

        {/* Filter tabs */}
        <div className="flex gap-1 p-1 rounded-xl" style={{ backgroundColor: "#ebefec" }}>
          {filterTabs.map((tab) => (
            <button
              key={tab.value}
              onClick={() => setFilter(tab.value)}
              className="flex-1 py-2 rounded-lg text-sm font-medium transition-all"
              style={
                filter === tab.value
                  ? { backgroundColor: "#ffffff", color: "#003527", fontWeight: "700", boxShadow: "0 1px 3px rgba(6,78,59,0.08)" }
                  : { color: "#707974" }
              }
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Requests table */}
        <div className="rounded-xl border overflow-hidden" style={{ backgroundColor: "#ffffff", borderColor: "rgba(191,201,195,0.3)" }}>
          <div className="px-6 py-4 border-b flex items-center justify-between" style={{ borderColor: "rgba(191,201,195,0.2)", backgroundColor: "#f6faf7" }}>
            <h3 className="font-bold" style={{ color: "#003527", fontFamily: "var(--font-hanken, sans-serif)" }}>
              {filter === "pending" ? "Pending Approvals" : filter === "approved" ? "Approved Leave" : filter === "rejected" ? "Rejected Requests" : "All Requests"}
            </h3>
            {filter === "pending" && (requests?.length ?? 0) > 0 && (
              <span className="text-xs font-mono px-2 py-0.5 rounded-full" style={{ backgroundColor: "#ffdbd0", color: "#832600" }}>
                {requests!.length} pending
              </span>
            )}
          </div>

          {requests === undefined ? (
            <div className="py-16 flex flex-col items-center gap-3">
              <span className="material-symbols-outlined text-[40px] animate-spin" style={{ color: "#003527" }}>progress_activity</span>
              <p className="text-sm" style={{ fontFamily: "var(--font-jetbrains, monospace)", color: "#707974" }}>Loading…</p>
            </div>
          ) : requests.length === 0 ? (
            <div className="py-16 flex flex-col items-center gap-3">
              <span className="material-symbols-outlined text-[48px]" style={{ color: "#bfc9c3", fontVariationSettings: "'FILL' 1" }}>event_busy</span>
              <p className="font-semibold" style={{ color: "#003527" }}>No {filter !== "all" ? filter : ""} requests</p>
              <p className="text-sm" style={{ color: "#707974" }}>No leave requests found for this filter.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr style={{ backgroundColor: "rgba(241,245,242,0.6)", borderBottom: "1px solid rgba(191,201,195,0.2)" }}>
                    {["Staff Member", "Leave Type", "Dates", "Duration", "Status", "Actions"].map((h) => (
                      <th key={h} className="px-6 py-4" style={{ fontFamily: "var(--font-jetbrains, monospace)", fontSize: "11px", letterSpacing: "0.06em", color: "#707974", textTransform: "uppercase" }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {requests.map((req) => {
                    const statusStyle = STATUS_STYLES[req.status] ?? STATUS_STYLES.pending;
                    const typeStyle = LEAVE_TYPE_STYLES[req.type] ?? LEAVE_TYPE_STYLES.other;
                    return (
                      <tr
                        key={req._id}
                        className="border-b transition-colors"
                        style={{ borderColor: "rgba(191,201,195,0.15)" }}
                        onMouseEnter={(e) => { (e.currentTarget as HTMLTableRowElement).style.backgroundColor = "rgba(241,245,242,0.5)"; }}
                        onMouseLeave={(e) => { (e.currentTarget as HTMLTableRowElement).style.backgroundColor = "transparent"; }}
                      >
                        <td className="px-6 py-5">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold shrink-0" style={{ backgroundColor: "#b0f0d6", color: "#003527" }}>
                              {initials(req.staffName)}
                            </div>
                            <div>
                              <p className="font-semibold text-sm" style={{ color: "#181d1b" }}>{req.staffName}</p>
                              {req.reason && (
                                <p className="text-xs mt-0.5 max-w-[140px] truncate" style={{ color: "#707974" }}>{req.reason}</p>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-5">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-mono font-bold uppercase" style={{ backgroundColor: typeStyle.bg, color: typeStyle.color }}>
                            {req.type}
                          </span>
                        </td>
                        <td className="px-6 py-5">
                          <p className="text-sm font-mono" style={{ color: "#181d1b" }}>{req.startDate}</p>
                          <p className="text-xs mt-0.5 font-mono" style={{ color: "#707974" }}>→ {req.endDate}</p>
                        </td>
                        <td className="px-6 py-5">
                          <span className="text-sm" style={{ color: "#404944" }}>{req.daysRequested} day{req.daysRequested !== 1 ? "s" : ""}</span>
                        </td>
                        <td className="px-6 py-5">
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-mono" style={{ backgroundColor: statusStyle.bg, color: statusStyle.color }}>
                            <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: statusStyle.dot }} />
                            {req.status.charAt(0).toUpperCase() + req.status.slice(1)}
                          </span>
                        </td>
                        <td className="px-6 py-5">
                          {req.status === "pending" ? (
                            <button
                              onClick={() => { setReviewingId(req._id); setReviewNote(""); }}
                              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all"
                              style={{ backgroundColor: "#003527", color: "#ffffff" }}
                            >
                              <span className="material-symbols-outlined text-[14px]">rate_review</span>
                              Review
                            </button>
                          ) : (
                            req.reviewNote ? (
                              <span className="text-xs italic" style={{ color: "#bfc9c3" }} title={req.reviewNote}>Has note</span>
                            ) : (
                              <span className="text-xs" style={{ color: "#bfc9c3" }}>—</span>
                            )
                          )}
                        </td>
                      </tr>
                    );
                  })}
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
          <div className="space-y-4 p-2">
            <div className="rounded-xl p-4 space-y-3" style={{ backgroundColor: "#f6faf7" }}>
              {[
                ["Staff", reviewingRequest.staffName],
                ["Type", reviewingRequest.type.charAt(0).toUpperCase() + reviewingRequest.type.slice(1)],
                ["Dates", `${reviewingRequest.startDate} → ${reviewingRequest.endDate} (${reviewingRequest.daysRequested} day${reviewingRequest.daysRequested !== 1 ? "s" : ""})`],
                ...(reviewingRequest.reason ? [["Reason", reviewingRequest.reason]] : []),
              ].map(([label, value]) => (
                <div key={label} className="flex items-start gap-2">
                  <span className="text-xs uppercase tracking-wider w-16 shrink-0 mt-0.5" style={{ fontFamily: "var(--font-jetbrains, monospace)", color: "#707974" }}>{label}</span>
                  <span className="text-sm font-medium" style={{ color: "#181d1b" }}>{value}</span>
                </div>
              ))}
            </div>
            <FormField label="Review Note (optional)" name="reviewNote">
              <textarea
                value={reviewNote}
                onChange={(e) => setReviewNote(e.target.value)}
                rows={3}
                className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none resize-none"
                style={{ borderColor: "rgba(191,201,195,0.5)", backgroundColor: "#f6faf7", color: "#181d1b" }}
                placeholder="e.g. Approved. Enjoy your time off!"
              />
            </FormField>
          </div>
        )}
      </XModal>
    </div>
  );
}
