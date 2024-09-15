<script lang="ts" setup>
import {
  getStaffs,
  getStaff,
  registerStaff,
  getDepartments,
} from "@/composables/services/data/data";
import { userToast } from "@/composables/helpers/notifications";
import { StaffData } from "@/types/data";
import XDropdown from "@/components/XDropdown.vue";

const isModalOpen = useState("showModal");
const $route = useRoute();
const $router = useRouter();

const state = reactive({
  firstName: "",
  lastName: "",
  email: "",
  role: "",
  department: "",
});

const columns = [
  {
    key: "_id",
    label: "ID",
  },
  {
    key: "firstName",
    label: "First Name",
  },
  {
    key: "lastName",
    label: "Last Name",
  },
  {
    key: "role",
    label: "Staff Role",
  },
  {
    key: "email",
    label: "Email",
  },
  {
    key: "actions",
  },
];

const items = (row: any) => [
  [
    {
      label: "View Employee",
      icon: "i-heroicons-eye-20-solid",
      click: () => $router.push(`/dashboardStaff/${row._id}`),
    },
  ],
  [
    {
      label: "Send Query",
      icon: "i-heroicons-archive-box-20-solid",
    },
  ],
];

const departmentItems = ref([]);

const loading = ref(false);
const staffData = ref<StaffData[]>([]);
const createStaff = async () => {
  loading.value = true;
  console.log(state)
  // try {
  //   const response = await registerStaff(state);

  //   loading.value = false;
  //   userToast(["Employee Successfully Created!"], 200);
  //   isModalOpen.value = false;
  //   state.email = "";
  //   state.firstName = "";
  //   state.lastName = "";
  //   state.role = "";
  //   getData();
  // } catch (error: any) {
  //   loading.value = false;
  //   const err = [error.response.data.message];
  //   isModalOpen.value = false;
  //   userToast(err, error.response.data.code);
  // }
};

const pageData = reactive({
  page: 1,
  count: "5",
  total: 0,
  next: "",
  prev: "",
});

const getData = async (pageNum?: number) => {
  const data = await getStaffs(pageNum);

  pageData.page = 1;
  pageData.prev = data.previous;
  pageData.next = data.next;
  pageData.total = data.count;
  staffData.value = data.staff;
};

const getPage = (page: any) => {
  if (!page) {
    getData();
  } else {
    const pageNumber = new URL(page).searchParams.get("page");
    getData(Number(pageNumber));
  }
};

const handleAddEmployees = async () => {
  isModalOpen.value = true;
};

onMounted( async () => {
  const depts = await getDepartments()
  departmentItems.value = depts.data
  getData();
});
</script>

<template>
  <main class="min-h-full bg-white dark:bg-primary-800 p-4 md:p-10">
    <div class="flex flex-col md:flex-row md:items-center md:justify-between">
      <div class="flex flex-col mb-4 md:mb-0">
        <span class="text-xl md:text-2xl font-bold">Employees</span>
        <span class="text-sm font-light">Here is a list of all employees</span>
      </div>
      <UButton
        type="submit"
        size="lg"
        color="white"
        variant="solid"
        class="self-start dark:bg-white dark:text-primary-800 hover:dark:bg-white hover:dark:text-primary-800 dark:border-primary-800"
        @click="handleAddEmployees"
      >
        Add Employees
      </UButton>
    </div>
    <div class="mt-8 md:mt-20">
      <XTable
        :columns="columns"
        :items-generator="items"
        :table-data="staffData"
        :pagination-data="pageData"
        @prevPage="getPage"
        @nextPage="getPage"
      >
      </XTable>
    </div>
  </main>
  <XModal show-header show-footer>
    <template #header>
      <div>Create Employees</div>
    </template>
    <div>
      <UForm
        :state="state"
        class="space-y-4 justify-center flex items-center flex-col"
        :validate-on="['submit']"
      >
        <div class="space-y-5 w-full">
          <UFormGroup
            label="First Name"
            name="firstName"
            size="xl"
            class="space-y-2"
          >
            <UInput
              v-model="state.firstName"
              placeholder="First Name"
              size="xl"
            />
          </UFormGroup>

          <UFormGroup
            label="Last Name"
            name="last Name"
            size="xl"
            class="space-y-2"
          >
            <UInput
              v-model="state.lastName"
              placeholder="First Last"
              size="xl"
            />
          </UFormGroup>

          <UFormGroup label="Email" name="email" size="xl" class="space-y-2">
            <UInput
              v-model="state.email"
              placeholder="Email Address"
              size="xl"
            />
          </UFormGroup>

          <UFormGroup label="Role" name="role" size="xl" class="space-y-2">
            <UInput v-model="state.role" placeholder="Role" size="xl" />
          </UFormGroup>
          <div class="flex flex-col space-y-2">
            <label for="department">Department</label>
        
          <XDropdown :items="departmentItems" @select="((val: any) => state.department = val._id)" />
          </div>
      
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
          @click="createStaff"
        >
          Submit
        </UButton>
      </div>
    </template>
  </XModal>
</template>
