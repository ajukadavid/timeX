<script lang="ts" setup>
import { getStaff } from '@/composables/services/data/data';
import { useUserStore } from '@/store/userStore';
import { Line } from 'vue-chartjs'
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js'
import { saveAs } from 'file-saver';
import Button from '@/components/ui/Button.vue';
import Input from '@/components/ui/Input.vue';
import FormField from '@/components/ui/FormField.vue';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend)

const store = useUserStore();
const $route = useRoute();

definePageMeta({
  // layout: computed(() => userType.value === 'employer' ? 'default' : 'staff')
})

const allEntryLogs = ref<any[]>([]); // Store original unfiltered data
const staffTableData = ref<any[]>([]);

const paginationData = {
  page: 1,        
  count: 5,       
  total: 10,       
  prev: null,      
  next: 2      
};

const columns = [
  {
    key: "entryDate",
    label: "Date",
    id: "entryDate",
  },
  {
    key: "entryTime",
    label: "Sign in Time",
    id: "entryTime",
  },
  {
    key: "status",
    label: "Status",
    id: "status",
  },
];

const items = (row: any) => [
  [
    { "id": "18:00", "name": "" },
  ]
];

// Date filter state
const startDate = ref<string>('');
const endDate = ref<string>('');

// Set default date range (last 30 days)
const setDefaultDateRange = () => {
  const today = new Date();
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(today.getDate() - 30);
  
  endDate.value = today.toISOString().split('T')[0];
  startDate.value = thirtyDaysAgo.toISOString().split('T')[0];
};

// Filter data based on date range
const filterDataByDateRange = () => {
  if (!startDate.value || !endDate.value) {
    staffTableData.value = allEntryLogs.value;
    return;
  }

  const start = new Date(startDate.value);
  start.setHours(0, 0, 0, 0); // Start of day
  const end = new Date(endDate.value);
  end.setHours(23, 59, 59, 999); // End of day

  staffTableData.value = allEntryLogs.value.filter((log: any) => {
    const entryDate = log._originalEntryDate || new Date(log.entryDate);
    return entryDate >= start && entryDate <= end;
  });
  
  // Update chart with filtered data
  updateChart();
};

// Watch for date changes
watch([startDate, endDate], () => {
  filterDataByDateRange();
});

const chartData = ref<{
  labels: string[];
  datasets: {
    label: string;
    backgroundColor: string;
    borderColor: string;
    data: number[];
    fill: boolean;
  }[];
}>({
  labels: [],
  datasets: []
});

const chartOptions = {
  responsive: true,
  scales: {
    y: {
      beginAtZero: true,
      ticks: {
        stepSize: 1
      },
      title: {
        display: true,
        text: 'Number of Days',
        font: {
          size: 14
        }
      }
    },
    x: {
      title: {
        display: true,
        text: 'Months',
        font: {
          size: 14
        }
      }
    }
  },
  plugins: {
    legend: {
      display: true,
      position: 'top' as const,
      labels: {
        padding: 20,
        font: {
          size: 12
        }
      }
    },
    title: {
      display: true,
      text: 'Staff Attendance Trends',
      font: {
        size: 16,
        weight: 'bold' as const
      },
      padding: 20
    },
    tooltip: {
      callbacks: {
        label: (context: any) => {
          const label = context.dataset.label || '';
          const value = context.parsed.y;
          return `${label}: ${value} day${value !== 1 ? 's' : ''}`;
        },
        title: (tooltipItems: any[]) => {
          return tooltipItems[0].label;
        }
      }
    }
  },
  elements: {
    line: {
      tension: 0.4
    },
    point: {
      radius: 5,
      hoverRadius: 7
    }
  },
  interaction: {
    intersect: false,
    mode: 'index' as const
  }
};

const exportToCSV = () => {
  if (staffTableData.value.length === 0) {
    alert('No data to export. Please select a date range with data.');
    return;
  }

  // Create CSV headers
  const headers = ['Date', 'Sign in Time', 'Status'];
  
  // Convert filtered data to CSV format - sort by date descending
  const sortedData = [...staffTableData.value].sort((a, b) => {
    const dateA = a._originalEntryDate || new Date(a.entryDate);
    const dateB = b._originalEntryDate || new Date(b.entryDate);
    return dateB.getTime() - dateA.getTime(); // Newest first
  });
  
  const csvData = sortedData.map(row => {
    // Use original dates for CSV (formatted nicely)
    const dateStr = row._originalEntryDate 
      ? row._originalEntryDate.toLocaleDateString('en-US', { 
          month: 'long', 
          day: 'numeric', 
          year: 'numeric' 
        })
      : row.entryDate;
    const timeStr = row._originalEntryTime
      ? row._originalEntryTime.toLocaleTimeString('en-US', { 
          hour: 'numeric', 
          minute: 'numeric', 
          hour12: true 
        })
      : row.entryTime;
    
    return [
      dateStr || '',
      timeStr || '',
      row.late ? 'Late' : 'On Time'
    ].map(field => {
      // Escape commas and quotes in CSV
      const stringField = String(field);
      if (stringField.includes(',') || stringField.includes('"') || stringField.includes('\n')) {
        return `"${stringField.replace(/"/g, '""')}"`;
      }
      return stringField;
    }).join(',');
  });
  
  // Combine headers and data
  const csvContent = [headers.join(','), ...csvData].join('\n');
  
  // Create filename with date range and staff name
  const startStr = startDate.value || 'all';
  const endStr = endDate.value || 'all';
  const staffName = staff.value.replace(/\s+/g, '_');
  const filename = `${staffName}_attendance_${startStr}_to_${endStr}.csv`;
  
  // Create and download the file
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  saveAs(blob, filename);
};

const clearFilters = () => {
  startDate.value = '';
  endDate.value = '';
  filterDataByDateRange();
};

const updateChart = () => {
  // Process data for chart (using filtered data)
  const monthlyStats = staffTableData.value.reduce((acc: any, log: any) => {
    const date = log._originalEntryDate || new Date(log.entryDate);
    const monthYear = date.toLocaleString('en-US', { month: 'long', year: 'numeric' });
    
    if (!acc[monthYear]) {
      acc[monthYear] = { early: 0, late: 0 };
    }
    
    if (!log.late) {
      acc[monthYear].early += 1;
    } else {
      acc[monthYear].late += 1;
    }
    
    return acc;
  }, {});

  chartData.value = {
    labels: Object.keys(monthlyStats),
    datasets: [
      {
        label: 'Early Arrivals (Before 9 AM)',
        backgroundColor: '#4CAF50',
        borderColor: '#4CAF50',
        data: (Object.values(monthlyStats) as { early: number; late: number }[]).map(stat => stat.early),
        fill: false
      },
      {
        label: 'Late Arrivals (After 9 AM)',
        backgroundColor: '#FF5252',
        borderColor: '#FF5252',
        data: (Object.values(monthlyStats) as { early: number; late: number }[]).map(stat => stat.late),
        fill: false
      }
    ]
  };
};

const staff = ref('')
onMounted(async () => {
  setDefaultDateRange();
  
  const staffData = await getStaff($route.params.id);
  staff.value = staffData.staff.firstName + ' ' + staffData.staff.lastName;
  
  // Store original data with formatted dates for display
  const formattedLogs = staffData.entryLogs.map((val: any) => {
    const originalEntryDate = new Date(val.entryDate);
    const originalEntryTime = new Date(val.entryTime);
    
    return {
      ...val,
      entryDate: originalEntryDate.toLocaleDateString('en-US', { 
        month: 'long', 
        day: 'numeric', 
        year: 'numeric' 
      }),
      entryTime: originalEntryTime.toLocaleTimeString('en-US', { 
        hour: 'numeric', 
        minute: 'numeric', 
        hour12: true 
      }),
      // Keep original dates for filtering
      _originalEntryDate: originalEntryDate,
      _originalEntryTime: originalEntryTime,
      status: val.late ? 'Late' : 'On Time'
    };
  });
  
  allEntryLogs.value = formattedLogs;
  filterDataByDateRange();
});
</script>

<template>
  <main class="w-full p-2 sm:p-4"> 
    <div class="max-w-7xl mx-auto">
      <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6"> 
        <h1 class="text-2xl font-semibold">{{ staff }} Attendance Summary</h1>
        <Button 
          @click="exportToCSV"
          color="primary"
          size="md"
          class="flex items-center gap-2"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          Export to CSV
        </Button>
      </div>

      <!-- Date Range Filter -->
      <div class="bg-white rounded-lg shadow p-4 mb-6">
        <div class="flex flex-col sm:flex-row gap-4 items-end">
          <div class="flex-1">
            <FormField label="Start Date" name="startDate">
              <Input
                v-model="startDate"
                type="date"
                size="md"
              />
            </FormField>
          </div>
          <div class="flex-1">
            <FormField label="End Date" name="endDate">
              <Input
                v-model="endDate"
                type="date"
                size="md"
              />
            </FormField>
          </div>
          <div class="flex gap-2">
            <Button
              @click="clearFilters"
              color="gray"
              variant="outline"
              size="md"
            >
              Clear
            </Button>
          </div>
        </div>
        <p v-if="staffTableData.length > 0" class="text-sm text-gray-600 mt-3">
          Showing {{ staffTableData.length }} record{{ staffTableData.length !== 1 ? 's' : '' }} 
          <span v-if="startDate && endDate">
            from {{ new Date(startDate).toLocaleDateString() }} to {{ new Date(endDate).toLocaleDateString() }}
          </span>
        </p>
      </div>

      <div v-if="store.$state.userRole === 'Admin'" class="bg-white rounded-lg shadow p-3 sm:p-6 mb-8">
        <div class="h-[300px] md:h-[400px] lg:h-[500px]">
          <Line :data="chartData" :options="chartOptions" />
        </div>
      </div>
      
      <XTable 
        :columns="columns" 
        :pagination-data="paginationData" 
        :table-data="staffTableData"
      />
    </div>
  </main>
</template>
