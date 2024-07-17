<!-- eslint-disable vue/no-multiple-template-root -->
<script lang="ts" setup>
import {
  getDepartments,
  createDepartment,
} from "@/composables/services/data/data";
import { userLoginToast } from "@/composables/helpers/notifications";

const $route = useRoute();
const $router = useRouter();
const isModalOpen = useState("showModal");
const state = reactive({
  deptName: "",
});
const loading = ref(false);
const deptData = ref<any[]>([]);

const columns = [
  {
    key: "_id",
    label: "Department ID",
  },
  {
    key: "name",
    label: "Department Name",
  },
  {
    key: "actions",
  },
];

const items = (row: any) => [
  [
    {
      label: "View Details",
      icon: "i-heroicons-eye-20-solid",
      click: () => console.log("Edit", row.id),
    },
  ],
];

const handleCreateDepartment = async () => {
  loading.value = true;
  try {
    const response = await createDepartment(state.deptName);

    loading.value = false;
    userLoginToast(["Department Successfully Created!"], 200);
    isModalOpen.value = false;
    state.deptName = "";

    getData();
  } catch (error: any) {
    loading.value = false;
    const err = [error.response.data.message];
    isModalOpen.value = false;
    userLoginToast(err, error.response.data.code);
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
onMounted(() => {
  getData();
});
</script>

<template>
  <main class="p-10">
    <div class="flex items-center justify-between">
      <div class="flex flex-col">
        <span class="text-2xl font-bold">User Management</span>
        <span class="text-sm font-light"
          >Manage your company's users & departments</span
        >
      </div>
      <UButton
        type="submit"
        size="xl"
        color="white"
        variant="solid"
        class="self-start"
        @click="isModalOpen = true"
      >
        Create Department
      </UButton>
    </div>
    <div class="mt-20">
      <XTable
        :columns="columns"
        :items-generator="items"
        :table-data="deptData"
        :pagination-data="pageData"
        @prevPage="getPage"
        @nextPage="getPage"
      >
      </XTable>
    </div>
  </main>
  <XModal show-header show-footer>
    <template #header>
      <div>Create Department</div>
    </template>
    <div>
      <UForm
        :state="state"
        class="space-y-4 justify-center flex items-center flex-col"
        :validate-on="['submit']"
        @submit.prevent="handleCreateDepartment"
      >
        <div class="space-y-5 w-full">
          <UFormGroup
            label="Department Name"
            name="deptName"
            size="xl"
            class="space-y-2"
          >
            <UInput
              v-model="state.deptName"
              placeholder="Please Enter name of department"
              size="xl"
            />
          </UFormGroup>
        </div>
      </UForm>
    </div>
    <template #footer>
      <div class="flex justify-end">
        <UButton
          type="submit"
          size="lg"
          color="white"
          variant="solid"
          class="self-start"
          :loading="loading"
          @click="handleCreateDepartment"
        >
          Submit
        </UButton>
      </div>
    </template>
  </XModal>
</template>
