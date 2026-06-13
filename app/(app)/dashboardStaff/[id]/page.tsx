"use client";

import { use, useEffect, useState } from "react";
import { useConvexAuth, useMutation, useQuery } from "convex/react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { saveAs } from "file-saver";
import { api } from "@/convex/_generated/api";
import type { Id } from "@/convex/_generated/dataModel";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { FormField } from "@/components/ui/FormField";
import { XTable } from "@/components/XTable";
import { toast } from "@/lib/toast";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const columns = [
  { key: "entryDate", label: "Date", id: "entryDate" },
  { key: "entryTime", label: "Sign in Time", id: "entryTime" },
  { key: "status", label: "Status", id: "status" },
];

const paginationData = { page: 1, count: 1, total: 0 };

const chartOptions = {
  responsive: true,
  scales: {
    y: { beginAtZero: true, ticks: { stepSize: 1 }, title: { display: true, text: "Number of Days", font: { size: 14 } } },
    x: { title: { display: true, text: "Months", font: { size: 14 } } },
  },
  plugins: {
    legend: { display: true, position: "top" as const },
    title: { display: true, text: "Staff Attendance Trends", font: { size: 16, weight: "bold" as const }, padding: 20 },
    tooltip: {
      callbacks: {
        label: (ctx: any) => `${ctx.dataset.label}: ${ctx.parsed.y} day${ctx.parsed.y !== 1 ? "s" : ""}`,
      },
    },
  },
  elements: { line: { tension: 0.4 }, point: { radius: 5, hoverRadius: 7 } },
  interaction: { intersect: false, mode: "index" as const },
};

interface LogEntry {
  entryDate: Date;
  entryTime: Date;
  late?: boolean;
  status?: string;
  _originalEntryDate?: Date;
  _originalEntryTime?: Date;
  [key: string]: unknown;
}

function todayString() {
  return new Date().toISOString().slice(0, 10);
}

export default function StaffDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { isAuthenticated } = useConvexAuth();
  const me = useQuery(api.users.getCurrentUser, isAuthenticated ? {} : "skip");
  const isAdmin = me?.role === "admin";
  const isOwnDashboard = me?._id === id;

  const staffData = useQuery(api.staff.getStaffDetail, { staffUserId: id as Id<"users"> });
  const todayEntry = useQuery(
    api.attendance.getTodayEntry,
    isOwnDashboard ? { staffUserId: id as Id<"users">, today: todayString() } : "skip"
  );
  const clockIn = useMutation(api.attendance.clockIn);

  const [allLogs, setAllLogs] = useState<LogEntry[]>([]);
  const [filtered, setFiltered] = useState<LogEntry[]>([]);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [chartData, setChartData] = useState<{ labels: string[]; datasets: any[] }>({ labels: [], datasets: [] });
  const [signingIn, setSigningIn] = useState(false);

  useEffect(() => {
    const today = new Date();
    const ago30 = new Date();
    ago30.setDate(today.getDate() - 30);
    setEndDate(today.toISOString().split("T")[0]!);
    setStartDate(ago30.toISOString().split("T")[0]!);
  }, []);

  useEffect(() => {
    if (!staffData) return;
    const formatted: LogEntry[] = staffData.entryLogs.map((val: any) => {
      const entryDate = new Date(val.entryDate);
      const entryTime = new Date(val.entryTime);
      return {
        ...val,
        _originalEntryDate: entryDate,
        _originalEntryTime: entryTime,
        entryDate: entryDate.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" }),
        entryTime: entryTime.toLocaleTimeString("en-US", { hour: "numeric", minute: "numeric", hour12: true }),
        status: val.late ? "Late" : "On Time",
      };
    });
    setAllLogs(formatted);
  }, [staffData]);

  useEffect(() => {
    if (!startDate || !endDate) { setFiltered(allLogs); return; }
    const s = new Date(startDate); s.setHours(0, 0, 0, 0);
    const e = new Date(endDate); e.setHours(23, 59, 59, 999);
    const f = allLogs.filter((l) => { const d = l._originalEntryDate!; return d >= s && d <= e; });
    setFiltered(f);
  }, [startDate, endDate, allLogs]);

  useEffect(() => {
    const stats = filtered.reduce<Record<string, { early: number; late: number }>>((acc, log) => {
      const d = log._originalEntryDate!;
      const key = d.toLocaleString("en-US", { month: "long", year: "numeric" });
      if (!acc[key]) acc[key] = { early: 0, late: 0 };
      if (log.late) acc[key]!.late += 1;
      else acc[key]!.early += 1;
      return acc;
    }, {});
    setChartData({
      labels: Object.keys(stats),
      datasets: [
        { label: "Early Arrivals (Before 9 AM)", backgroundColor: "#4CAF50", borderColor: "#4CAF50", data: Object.values(stats).map((s) => s.early), fill: false },
        { label: "Late Arrivals (After 9 AM)", backgroundColor: "#FF5252", borderColor: "#FF5252", data: Object.values(stats).map((s) => s.late), fill: false },
      ],
    });
  }, [filtered]);

  const staffName = staffData ? `${staffData.staff.firstName || ""} ${staffData.staff.lastName || ""}`.trim() : "";

  const handleClockIn = async () => {
    setSigningIn(true);
    try {
      await clockIn({ today: todayString() });
      toast("Signed in successfully!", "success");
    } catch (e) {
      toast(e instanceof Error ? e.message : "Failed to sign in", "error");
    } finally {
      setSigningIn(false);
    }
  };

  const exportToCSV = () => {
    if (filtered.length === 0) { alert("No data to export."); return; }
    const headers = ["Date", "Sign in Time", "Status"];
    const rows = [...filtered]
      .sort((a, b) => b._originalEntryDate!.getTime() - a._originalEntryDate!.getTime())
      .map((row) => {
        const d = row._originalEntryDate!.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
        const t = row._originalEntryTime!.toLocaleTimeString("en-US", { hour: "numeric", minute: "numeric", hour12: true });
        return [d, t, row.late ? "Late" : "On Time"].map((f) => (String(f).includes(",") ? `"${f}"` : f)).join(",");
      });
    const csv = [headers.join(","), ...rows].join("\n");
    const filename = `${staffName.replace(/\s+/g, "_")}_attendance_${startDate || "all"}_to_${endDate || "all"}.csv`;
    saveAs(new Blob([csv], { type: "text/csv;charset=utf-8;" }), filename);
  };

  return (
    <div className="w-full p-2 sm:p-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <h1 className="text-2xl font-semibold">{staffName} Attendance Summary</h1>
          <div className="flex flex-wrap gap-3">
            {isOwnDashboard && (
              todayEntry === undefined ? null : todayEntry ? (
                <span className="inline-flex items-center px-4 py-2 rounded-lg bg-green-50 text-green-700 text-sm font-medium border border-green-200">
                  Signed in today at{" "}
                  {new Date(todayEntry.entryTime).toLocaleTimeString("en-US", {
                    hour: "numeric",
                    minute: "numeric",
                    hour12: true,
                  })}
                  {todayEntry.late ? " (Late)" : " (On Time)"}
                </span>
              ) : (
                <Button loading={signingIn} onClick={handleClockIn} color="primary" size="md">
                  Sign In Now
                </Button>
              )
            )}
          <Button onClick={exportToCSV} color="primary" size="md" className="flex items-center gap-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Export to CSV
          </Button>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-4 mb-6">
          <div className="flex flex-col sm:flex-row gap-4 items-end">
            <div className="flex-1">
              <FormField label="Start Date" name="startDate">
                <Input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} size="md" />
              </FormField>
            </div>
            <div className="flex-1">
              <FormField label="End Date" name="endDate">
                <Input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} size="md" />
              </FormField>
            </div>
            <Button onClick={() => { setStartDate(""); setEndDate(""); }} color="gray" variant="outline" size="md">
              Clear
            </Button>
          </div>
          {filtered.length > 0 && (
            <p className="text-sm text-gray-600 mt-3">
              Showing {filtered.length} record{filtered.length !== 1 ? "s" : ""}
              {startDate && endDate && ` from ${new Date(startDate).toLocaleDateString()} to ${new Date(endDate).toLocaleDateString()}`}
            </p>
          )}
        </div>

        {isAdmin && chartData.labels.length > 0 && (
          <div className="bg-white rounded-lg shadow p-3 sm:p-6 mb-8">
            <div className="h-[300px] md:h-[400px] lg:h-[500px]">
              <Line data={chartData} options={chartOptions} />
            </div>
          </div>
        )}

        <XTable columns={columns} tableData={filtered as Record<string, unknown>[]} paginationData={paginationData} />
      </div>
    </div>
  );
}
