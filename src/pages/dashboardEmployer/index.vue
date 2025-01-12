<script lang="ts" setup>
import {
  getStaffs,
  getStaff,
  registerStaff,
  getDepartments,
  updateStaffPassword,
  deleteStaff,
} from "@/composables/services/data/data";
import { userToast } from "@/composables/helpers/notifications";
import { StaffData } from "@/types/data";
import XDropdown from "@/components/XDropdown.vue";
import XModal from '@/components/XModal.vue';

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
    key: "lastEntryTime",
    label: "Last login time"
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
      label: "Delete Employee",
      icon: "i-heroicons-trash-20-solid",
      click: () => handleDeleteStaff(row),
    },
  ],
  [
    {
      label: "Add Password",
      icon: "i-heroicons-wrench-screwdriver-solid",
      click: () => handleAddPassword(row),
    },
  ],
];

const departmentItems = ref([]);

const loading = ref(false);
const staffData = ref<StaffData[]>([]);
const createStaff = async () => {
  loading.value = true;
  try {
    const response = await registerStaff(state);

    loading.value = false;
    userToast(["Employee Successfully Created!"], 200);
    isModalOpen.value = false;
    state.email = "";
    state.firstName = "";
    state.lastName = "";
    state.role = "";
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
  const data = await getStaffs(pageNum);
  data.staff.map((x:any) => {
    x.lastEntryTime = new Date(x.lastEntryTime).toLocaleString('en-US', { 
          year: 'numeric', 
          month: 'long', 
          day: 'numeric', 
          hour: 'numeric', 
          minute: 'numeric', 
          hour12: true 
      });
      })

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

const showAddEmployeeModal = ref(false);
const showAddPasswordModal = ref(false);

const handleAddEmployees = () => {
  showAddEmployeeModal.value = true;
};

// Simplified password state
interface PasswordState {
  password: string;
  confirmPassword: string;
}

const passwordState = reactive<PasswordState>({
  password: '',
  confirmPassword: ''
});

const selectedUser = ref({
  email: '',
  _id: ''
});

const handleAddPassword = (user: any) => {
  selectedUser.value = user;
  showAddPasswordModal.value = true;
};

const handlePasswordSubmit = async () => {
  if (passwordState.password !== passwordState.confirmPassword) {
    userToast(['Passwords do not match'], 400);
    return;
  }

  loading.value = true;
  try {
    await updateStaffPassword(selectedUser.value._id, passwordState.password);
    
    showAddPasswordModal.value = false;
    userToast(['Password successfully updated'], 200);
    handleModalClose('add-password');
  } catch (error: any) {
    userToast(
      [error.response?.data?.message || 'Error updating password'], 
      error.response?.status || 400
    );
  } finally {
    loading.value = false;
  }
};

const handleModalClose = (modalId: string) => {
  if (modalId === 'add-employee') {
    state.email = "";
    state.firstName = "";
    state.lastName = "";
    state.role = "";
    state.department = "";
  } else if (modalId === 'add-password') {
    selectedUser.value = { email: '', _id: '' };
    passwordState.password = '';
    passwordState.confirmPassword = '';
  }
};

const showDeleteModal = ref(false);
const selectedUserForDelete = ref({
  _id: '',
  firstName: '',
  lastName: ''
});

const handleDeleteStaff = (user: any) => {
  selectedUserForDelete.value = user;
  showDeleteModal.value = true;
};

const confirmDelete = async () => {
  loading.value = true;
  try {
    await deleteStaff(selectedUserForDelete.value._id);
    userToast(['Employee successfully deleted'], 200);
    getData(); // Refresh the table
  } catch (error: any) {
    userToast(
      [error.response?.data?.message || 'Error deleting employee'],
      error.response?.status || 400
    );
  } finally {
    loading.value = false;
    showDeleteModal.value = false;
    selectedUserForDelete.value = { _id: '', firstName: '', lastName: '' };
  }
};

onMounted( async () => {
  const depts = await getDepartments()
  departmentItems.value = depts.data.map((item: { name: any; _id: any; }) => ({
    name: item.name, // Adjust according to your data structure
    id: item._id    // Adjust according to your data structure
  }));
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

  <!-- Add Employee Modal -->
  <XModal
    modal-id="add-employee"
    v-model="showAddEmployeeModal"
    title="Create Employee"
    size="2xl"
    @close="handleModalClose"
  >
    <UForm
      :state="state"
      class="space-y-4 justify-center flex items-center flex-col"
      :validate-on="['submit']"
    >
      <div class="space-y-5 w-full">
        <UFormGroup label="First Name" name="firstName" size="xl" class="space-y-2">
          <UInput v-model="state.firstName" placeholder="First Name" size="xl" />
        </UFormGroup>

        <UFormGroup label="Last Name" name="lastName" size="xl" class="space-y-2">
          <UInput v-model="state.lastName" placeholder="Last Name" size="xl" />
        </UFormGroup>

        <UFormGroup label="Email" name="email" size="xl" class="space-y-2">
          <UInput v-model="state.email" placeholder="Email Address" size="xl" />
        </UFormGroup>

        <UFormGroup label="Role" name="role" size="xl" class="space-y-2">
          <UInput v-model="state.role" placeholder="Role" size="xl" />
        </UFormGroup>

        <div class="flex flex-col space-y-2">
          <label for="department">Department</label>
          <XDropdown 
            :items="departmentItems" 
            @select="((val: any) => state.department = val.id)" 
          />
        </div>
      </div>
    </UForm>

    <template #footer>
      <div class="flex justify-end gap-3">
        <UButton
          color="gray"
          variant="soft"
          @click="showAddEmployeeModal = false"
        >
          Cancel
        </UButton>
        <UButton
          type="submit"
          :loading="loading"
          @click="createStaff"
        >
          Create Employee
        </UButton>
      </div>
    </template>
  </XModal>

  <!-- Add Password Modal -->
  <XModal
    modal-id="add-password"
    v-model="showAddPasswordModal"
    title="Set Password"
    size="md"
    @close="handleModalClose"
  >
    <UForm
      :state="passwordState"
      class="space-y-6"
    >
      <div class="space-y-4">
        <!-- User Info Section -->
        <div class="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
          <div class="text-sm text-gray-600 dark:text-gray-300">Setting password for:</div>
          <div class="font-medium text-gray-900 dark:text-white">{{ selectedUser.email }}</div>
        </div>

        <!-- Password Fields -->
        <UFormGroup
          label="New Password"
          name="password"
          class="space-y-2"
        >
          <UInput
            v-model="passwordState.password"
            type="password"
            placeholder="Enter new password"
            size="lg"
            autocomplete="new-password"
          />
        </UFormGroup>

        <UFormGroup
          label="Confirm Password"
          name="confirmPassword"
          class="space-y-2"
        >
          <UInput
            v-model="passwordState.confirmPassword"
            type="password"
            placeholder="Confirm new password"
            size="lg"
            autocomplete="new-password"
          />
        </UFormGroup>
      </div>
    </UForm>

    <template #footer>
      <div class="flex justify-end gap-3">
        <UButton
          color="gray"
          variant="soft"
          @click="showAddPasswordModal = false"
        >
          Cancel
        </UButton>
        <UButton
          :loading="loading"
          color="primary"
          @click="handlePasswordSubmit"
        >
          Set Password
        </UButton>
      </div>
    </template>
  </XModal>

  <!-- Delete Confirmation Modal -->
  <XModal
    modal-id="delete-staff"
    v-model="showDeleteModal"
    title="Delete Employee"
    size="md"
    @close="showDeleteModal = false"
  >
    <div class="p-4">
      <p class="text-gray-600 dark:text-gray-300">
        Are you sure you want to delete {{ selectedUserForDelete.firstName }} {{ selectedUserForDelete.lastName }}? 
        This action cannot be undone.
      </p>
    </div>

    <template #footer>
      <div class="flex justify-end gap-3">
        <UButton
          color="gray"
          variant="soft"
          @click="showDeleteModal = false"
        >
          Cancel
        </UButton>
        <UButton
          color="red"
          :loading="loading"
          @click="confirmDelete"
        >
          Delete Employee
        </UButton>
      </div>
    </template>
  </XModal>
</template>
