interface XSummaryProps {
  totalEmployees?: number;
  presentToday?: number;
  onTimeToday?: number;
  lateToday?: number;
  absentToday?: number;
}

function StatBox({ label, value, sub }: { label: string; value: number; sub?: string }) {
  return (
    <div className="flex flex-col items-center min-w-[72px]">
      <span className="text-sm text-gray-600">{label}</span>
      <span className="font-semibold text-xl text-gray-900">{value}</span>
      {sub && <span className="text-xs text-gray-400 mt-0.5">{sub}</span>}
    </div>
  );
}

export function XSummary({
  totalEmployees = 0,
  presentToday = 0,
  onTimeToday = 0,
  lateToday = 0,
  absentToday = 0,
}: XSummaryProps) {
  return (
    <div className="flex flex-wrap gap-4 mb-6">
      <div className="border flex space-y-6 rounded-md flex-col border-gray-300 px-5 py-4 bg-white">
        <span className="text-gray-500 font-medium text-sm">Overall Summary</span>
        <div className="flex justify-center space-x-6">
          <StatBox label="Total employees" value={totalEmployees} />
          <div className="h-12 w-px bg-gray-200 self-center" />
          <StatBox label="Present today" value={presentToday} sub={`${totalEmployees > 0 ? Math.round((presentToday / totalEmployees) * 100) : 0}%`} />
        </div>
      </div>

      <div className="border flex space-y-6 rounded-md flex-col border-gray-300 px-5 py-4 bg-white">
        <span className="text-gray-500 font-medium text-sm">Attendance Breakdown</span>
        <div className="flex justify-center space-x-6">
          <StatBox label="On time" value={onTimeToday} />
          <div className="h-12 w-px bg-gray-200 self-center" />
          <StatBox label="Late" value={lateToday} />
          <div className="h-12 w-px bg-gray-200 self-center" />
          <StatBox label="Absent" value={absentToday} />
        </div>
      </div>
    </div>
  );
}
