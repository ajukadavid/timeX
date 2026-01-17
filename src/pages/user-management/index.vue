<script lang="ts" setup>
import {
  getDepartments,
  createDepartment,
  updateTime
} from "@/composables/services/data/data";
import { userToast } from "@/composables/helpers/notifications";
import XDropdown from "@/components/XDropdown.vue";
import XModal from "@/components/XModal.vue";
import Button from "@/components/ui/Button.vue";
import Input from "@/components/ui/Input.vue";
import FormField from "@/components/ui/FormField.vue";

const isModalOpen = ref(false);
const state = reactive({
  deptName: "",
});
const loading = ref(false);
const deptData = ref<any[]>([]);
const signInTime = ref<string>("");
const showUpdateTime = ref<boolean>(false);

const columns = [
  {
    key: "name",
    label: "Department Name",
    id: "name",
  },
  {
    key: "_id",
    label: "Department ID",
    id: "_id",
  },
  {
    key: "actions",
    label: "Actions",
    id: "actions",
  },
];

const items = (row: any) => [
  [
    {
      label: "Update Time",
      icon: "i-heroicons-clock",
      click: () => {
        showUpdateTime.value = true;
      }
    }
  ]
];

const morningTimes = [
  { value: "06:00", name: "6:00 AM", id: "06:00" },
  { value: "07:00", name: "7:00 AM", id: "07:00" },
  { value: "08:00", name: "8:00 AM", id: "08:00" },
  { value: "09:00", name: "9:00 AM", id: "09:00" }
];

const handleCreateDepartment = async () => {
  if (!state.deptName.trim()) {
    userToast(["Department name is required"], 400);
    return;
  }
  
  loading.value = true;
  try {
    const response = await createDepartment(state.deptName);
    loading.value = false;
    userToast(["Department Successfully Created!"], 200);
    isModalOpen.value = false;
    state.deptName = "";
    getData();
  } catch (error: any) {
    loading.value = false;
    const err = [error.response?.data?.message || "Failed to create department"];
    isModalOpen.value = false;
    userToast(err, error.response?.data?.code || 400);
  }
};

interface PaginationData {
  page: number;
  count: number;
  total: number;
  next: string;
  prev: string;
}

const pageData = reactive<PaginationData>({
  page: 1,
  count: 5,
  total: 0,
  next: "",
  prev: "",
});

const getData = async (pageNum?: number) => {
  const data = await getDepartments(pageNum);
  pageData.page = data.currentPage || 1;
  pageData.count = data.totalPages || 1;
  pageData.prev = data.previous || "";
  pageData.next = data.next || "";
  pageData.total = data.count || 0;
  deptData.value = data.data || [];
};

const getPage = (page: any) => {
  if (!page) {
    getData();
  } else {
    const pageNumber = new URL(page).searchParams.get("page");
    getData(Number(pageNumber));
  }
};

const handleSaveTime = async () => {
  if (!signInTime.value) {
    userToast(["Please select a time"], 400);
    return;
  }
  
  try {
    const response = await updateTime(signInTime.value);
    showUpdateTime.value = false;
    userToast(["Login time Successfully Updated!"], 200);
    getData();
  } catch (error: any) {
    loading.value = false;
    const err = [error.response?.data?.message || "Failed to update time"];
    userToast(err, error.response?.data?.code || 400);
  }
}

onMounted(() => {
  getData();
});
</script>

<template>
  <main class="p-4 md:p-10">
    <div class="flex flex-col md:flex-row md:items-center md:justify-between">
      <div class="flex flex-col mb-4 md:mb-0">
        <span class="text-xl md:text-2xl font-bold">User Management</span>
        <span class="text-sm font-light text-gray-600">Manage your company's users & departments</span>
      </div>
      <div class="flex flex-col space-y-3 md:flex-row md:space-y-0 md:space-x-3">
        <Button @click="showUpdateTime = !showUpdateTime" color="primary" size="lg">
          Update Time
        </Button>
        <Button color="primary" size="lg" @click="isModalOpen = true">
          Create Department
        </Button>
      </div>
    </div>

    <div v-if="showUpdateTime" class="flex flex-col md:flex-row space-y-3 md:space-y-0 md:space-x-3 mt-4">
      <XDropdown placeholder="Select Time" :items="morningTimes" @select="((val: any) => signInTime = val.value)" class="w-full md:w-auto" />
      <Button color="primary" size="lg" @click="handleSaveTime">
        Save
      </Button>
    </div>

    <div class="mt-8 md:mt-20">
      <XTable 
        :columns="columns" 
        :items-generator="items" 
        :table-data="deptData" 
        :pagination-data="pageData"
        @prevPage="getPage" 
        @nextPage="getPage"
      />
    </div>
  </main>
  
  <XModal 
    v-model="isModalOpen" 
    modal-id="create-department"
    title="Create Department"
    @close="isModalOpen = false"
  >
    <form @submit.prevent="handleCreateDepartment" class="space-y-5 w-full">
      <FormField label="Department Name" name="deptName">
        <Input 
          v-model="state.deptName" 
          placeholder="Please Enter name of department" 
          size="lg" 
        />
      </FormField>
    </form>
    
    <template #footer>
      <div class="flex justify-end">
        <Button 
          type="submit" 
          size="lg" 
          color="primary" 
          :loading="loading"
          @click="handleCreateDepartment"
        >
          Submit
        </Button>
      </div>
    </template>
  </XModal>
</template>
