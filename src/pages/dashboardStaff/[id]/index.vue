<script lang="ts" setup>
import { getStaff } from '@/composables/services/data/data';
import { useUserStore } from '@/store/userStore';
import { Line } from 'vue-chartjs'
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js'
import { saveAs } from 'file-saver';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend)

const store = useUserStore();
const $route = useRoute();



definePageMeta({
  // layout: computed(() => userType.value === 'employer' ? 'default' : 'staff')
})

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
  },
  {
    key: "entryTime",
    label: "Sign in Time",
  },

];


const items = (row: any) => [
  [
    { "id": "18:00", "name": "" },
    
  ]

];

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
  // Create CSV headers
  const headers = ['Date', 'Sign in Time', 'Status'];
  
  // Convert data to CSV format
  const csvData = staffTableData.value.map(row => {
    return [
      row.entryDate,
      row.entryTime,
      row.late ? 'Late' : 'Early'
    ].join(',');
  });
  
  // Combine headers and data
  const csvContent = [headers.join(','), ...csvData].join('\n');
  
  // Create and download the file
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8' });
  saveAs(blob, `staff_attendance_${new Date().toISOString().split('T')[0]}.csv`);
};

const staff = ref('')
onMounted( async () => {
  const staffData = await getStaff($route.params.id);
  staff.value = staffData.staff.firstName + ' ' + staffData.staff.lastName
  staffData.entryLogs.map((val:any) => {
    val.entryDate = new Date(val.entryDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
    val.entryTime = new Date(val.entryTime).toLocaleTimeString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true });
  })
  staffTableData.value = staffData.entryLogs



  // Process data for chart
  const monthlyStats = staffData.entryLogs.reduce((acc: any, log: any) => {
    const date = new Date(log.entryDate);
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
});
</script>

<template>
  <main class="w-full p-2 sm:p-4"> 
    <div class="max-w-7xl mx-auto">
      <div class="flex justify-between items-center mb-6"> 
        <h1 class="text-2xl font-semibold">{{ staff }} Attendance Summary</h1>
        <button v-if="store.$state.userRole === 'Admin'"
          @click="exportToCSV"
          class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors flex items-center gap-2"
        >
          Export to CSV
        </button>
      </div>

      <div v-if="store.$state.userRole === 'Admin'" class="bg-white rounded-lg shadow p-3 sm:p-6 mb-8">
        <div class="h-[300px] md:h-[400px] lg:h-[500px]">
          <Line :data="chartData" :options="chartOptions" />
        </div>
      </div>
      <XTable :rows="columns" :paginationData="paginationData" :columns="columns" :table-data="staffTableData" />
    </div>
  </main>
</template>
