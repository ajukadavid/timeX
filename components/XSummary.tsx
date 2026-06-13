interface XSummaryProps {
  totalEmployees?: number;
  presentToday?: number;
  lateToday?: number;
  absentToday?: number;
}

export function XSummary({ totalEmployees = 0, presentToday = 0, lateToday = 0, absentToday = 0 }: XSummaryProps) {
  return (
    <div className="flex flex-wrap gap-4 mb-6">
      <div className="border flex space-y-8 rounded-md flex-col border-gray-300 px-5 py-3 bg-white">
        <span className="text-gray-500 font-medium">Overall Summary</span>
        <div className="flex justify-center space-x-3">
          <div className="flex flex-col">
            <span className="text-sm text-gray-600">Total employees</span>
            <span className="font-semibold text-xl text-gray-900">{totalEmployees}</span>
            <div className="flex text-xs space-x-1 justify-center">
              <span className="text-blue-500">+2</span><span className="text-gray-500">vs yesterday</span>
            </div>
          </div>
          <div className="h-20 w-px bg-gray-300" />
          <div className="flex flex-col">
            <span className="text-sm text-gray-600">Active today</span>
            <span className="font-semibold text-xl text-gray-900">{presentToday}</span>
            <div className="flex text-xs space-x-1 justify-center">
              <span className="text-red-500">-5</span><span className="text-gray-500">vs yesterday</span>
            </div>
          </div>
        </div>
      </div>

      <div className="border flex space-y-8 rounded-md flex-col border-gray-300 px-5 py-3 bg-white">
        <span className="text-gray-500 font-medium">Attendance Summary</span>
        <div className="flex justify-center space-x-3">
          <div className="flex flex-col">
            <span className="text-sm text-gray-600">On time</span>
            <span className="font-semibold text-xl text-gray-900">{presentToday}</span>
            <div className="flex text-xs space-x-1 justify-center">
              <span className="text-blue-500">+2</span><span className="text-gray-500">vs yesterday</span>
            </div>
          </div>
          <div className="h-20 w-px bg-gray-300" />
          <div className="flex flex-col">
            <span className="text-sm text-gray-600">Late</span>
            <span className="font-semibold text-xl text-gray-900">{lateToday}</span>
            <div className="flex text-xs space-x-1 justify-center">
              <span className="text-yellow-500">+1</span><span className="text-gray-500">vs yesterday</span>
            </div>
          </div>
          <div className="h-20 w-px bg-gray-300" />
          <div className="flex flex-col">
            <span className="text-sm text-gray-600">Absent</span>
            <span className="font-semibold text-xl text-gray-900">{absentToday}</span>
            <div className="flex text-xs space-x-1 justify-center">
              <span className="text-red-500">-3</span><span className="text-gray-500">vs yesterday</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
