<script setup lang="ts">
interface Props {
  totalEmployees?: number
  presentToday?: number
  lateToday?: number
  absentToday?: number
}

const props = withDefaults(defineProps<Props>(), {
  totalEmployees: 0,
  presentToday: 0,
  lateToday: 0,
  absentToday: 0,
})
</script>

<template>
  <div class="flex space-x-4">
    <div class="border flex space-y-8 rounded-md flex-col border-gray-300 px-5 py-3 bg-white">
      <span class="text-gray-500 font-medium">Overall Summary</span>

      <div class="flex justify-center space-x-3">
        <div class="flex flex-col">
          <span class="text-sm text-gray-600">Total employees</span>
          <span class="font-semibold text-xl text-gray-900">{{ totalEmployees }}</span>
          <div class="flex text-xs space-x-1 justify-center">
            <span class="text-blue-500">+2</span><span class="text-gray-500">vs yesterday</span>
          </div>
        </div>
        <div class="h-20 w-[1px] bg-gray-300"></div>
        <div class="flex flex-col">
          <span class="text-sm text-gray-600">Active today</span>
          <span class="font-semibold text-xl text-gray-900">{{ presentToday }}</span>
          <div class="flex text-xs space-x-1 justify-center">
            <span class="text-red-500">-5</span><span class="text-gray-500">vs yesterday</span>
          </div>
        </div>
      </div>
    </div>
    
    <div class="border flex space-y-8 rounded-md border-gray-300 px-5 py-3 bg-white">
      <span class="text-gray-500 font-medium">Attendance Summary</span>

      <div class="flex justify-center space-x-3">
        <div class="flex flex-col">
          <span class="text-sm text-gray-600">On time</span>
          <span class="font-semibold text-xl text-gray-900">{{ presentToday }}</span>
          <div class="flex text-xs space-x-1 justify-center">
            <span class="text-blue-500">+2</span><span class="text-gray-500">vs yesterday</span>
          </div>
        </div>
        <div class="h-20 w-[1px] bg-gray-300"></div>
        <div class="flex flex-col">
          <span class="text-sm text-gray-600">Late</span>
          <span class="font-semibold text-xl text-gray-900">{{ lateToday }}</span>
          <div class="flex text-xs space-x-1 justify-center">
            <span class="text-yellow-500">+1</span><span class="text-gray-500">vs yesterday</span>
          </div>
        </div>
        <div class="h-20 w-[1px] bg-gray-300"></div>
        <div class="flex flex-col">
          <span class="text-sm text-gray-600">Absent</span>
          <span class="font-semibold text-xl text-gray-900">{{ absentToday }}</span>
          <div class="flex text-xs space-x-1 justify-center">
            <span class="text-red-500">-3</span><span class="text-gray-500">vs yesterday</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>