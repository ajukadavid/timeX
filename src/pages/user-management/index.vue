<!-- eslint-disable vue/no-multiple-template-root -->
<script lang="ts" setup>
import {
  getDepartments,
  createDepartment,
  updateTime
} from "@/composables/services/data/data";
import { userToast } from "@/composables/helpers/notifications";
import XDropdown from "@/components/XDropdown.vue";

const isModalOpen = useState("showModal");
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
  },
  {
    key: "_id",
    label: "Department ID",
  },
 
  {
    key: "actions",
  },
];

const items = (row: any) => [
  [
    { "id": "18:00", "name": "" },
    
  ]

];

const morningTimes = [
  { value: "06:00", label: "6:00 AM" },
  { value: "07:00", label: "7:00 AM" },
  { value: "08:00", label: "8:00 AM" },
  { value: "09:00", label: "9:00 AM" }
];


const handleCreateDepartment = async () => {
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
    const err = [error.response.data.message];
    isModalOpen.value = false;
    userToast(err, error.response.data.code);
  }
};

const pageData = reactive({
  page: 1,
  count: "5",
  total: 0,
  next: "",
  prev: "",
});

const getData = async (pageNum?: number) => {
  const data = await getDepartments(pageNum);
  pageData.page = 1;
  pageData.prev = data.previous;
  pageData.next = data.next;
  pageData.total = data.count;
  deptData.value = data.data;
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
 


    try {
      const response = await updateTime(signInTime.value);
    showUpdateTime.value = false;
    userToast(["Login time Successfully Updated!"], 200);

    getData();
  } catch (error: any) {
    loading.value = false;
    const err = [error.response.data.message];
    isModalOpen.value = false;
    userToast(err, error.response.data.code);
  }

}

onMounted(() => {
  getData();
});
</script>

<template>
  <main class="p-10">
    <div class="flex items-center justify-between">
      <div class="flex flex-col">
        <span class="text-2xl font-bold">User Management</span>
        <span class="text-sm font-light">Manage your company's users & departments</span>
      </div>
      <div class="flex flex-col space-y-3">
        <div class="flex space-x-3">
          <UButton @click="showUpdateTime = true" type="submit" size="xl" color="white" variant="solid" class="self-start dark:bg-white dark:text-primary-800 hover:dark:bg-white hover:dark:text-primary-800 dark:border-primary-800">
            Update Time
          </UButton>

          <UButton class="dark:bg-white dark:text-primary-800 self-start hover:dark:bg-white hover:dark:text-primary-800 dark:border-primary-800" type="submit" size="xl" color="white" variant="solid" @click="isModalOpen = true">
            Create Department
          </UButton>
        </div>

        <div v-if="showUpdateTime" class="flex  space-x-3">
          <XDropdown placeholder="Select Time" :items="morningTimes" @select="((val: any) => signInTime = val.value)" />

          <UButton type="submit" size="xl" color="white" variant="solid" class="self-start dark:bg-white dark:text-primary hover:dark:bg-white hover:dark:text-primary" @click="handleSaveTime">
           Save
          </UButton>
        </div>
      </div>



    </div>
    <div class="mt-20">
      <XTable :columns="columns" :items-generator="items" :table-data="deptData" :pagination-data="pageData"
        @prevPage="getPage" @nextPage="getPage">
      </XTable>
    </div>
  </main>
  <XModal show-header show-footer>
    <template #header>
      <div>Create Department</div>
    </template>
    <div>
      <UForm :state="state" class="space-y-4 justify-center flex items-center flex-col" :validate-on="['submit']"
        @submit.prevent="handleCreateDepartment">
        <div class="space-y-5 w-full">
          <UFormGroup label="Department Name" name="deptName" size="xl" class="space-y-2">
            <UInput v-model="state.deptName" placeholder="Please Enter name of department" size="xl" />
          </UFormGroup>
        </div>
      </UForm>
    </div>
    <template #footer>
      <div class="flex justify-end">
        <UButton type="submit" size="lg" color="white" variant="solid" class="self-start" :loading="loading"
          @click="handleCreateDepartment">
          Submit
        </UButton>
      </div>
    </template>
  </XModal>
</template>
