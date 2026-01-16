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
import type { StaffData } from "@/types/data";
import XDropdown from "@/components/XDropdown.vue";
import XModal from '@/components/XModal.vue';
import XSummary from "@/components/XSummary.vue";

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
        <span class="text-xl md:text-2xl font-bold">Welcome Admin</span> 
        <span class="text-sm font-light">See Today's attendance overview..</span>
      </div>
      <div class="flex space-x-2">
        <div class="border-[#762CC0] cursor-pointer border py-3 px-5 space-x-2 rounded-md flex justify-center">
          <svg width="20" height="20" viewBox="0 0 20 21" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M9.922 3.29004C14.6963 1.66245 17.0834 0.848663 18.3674 2.13261C19.6513 3.41656 18.8375 5.80371 17.21 10.578L16.1016 13.8292C14.8517 17.4958 14.2267 19.3291 13.1964 19.4808C12.9195 19.5216 12.6328 19.4971 12.3587 19.4091C11.3395 19.0819 10.8007 17.1489 9.7231 13.283C9.4841 12.4255 9.3646 11.9967 9.0924 11.6692C9.0134 11.5742 8.9258 11.4866 8.8308 11.4076C8.5033 11.1354 8.0745 11.0159 7.21705 10.7769C3.35111 9.6993 1.41814 9.1605 1.0909 8.14127C1.00292 7.86724 0.97837 7.58053 1.01916 7.30355C1.17088 6.27332 3.00419 5.64834 6.6708 4.39838L9.922 3.29004Z" stroke="#1A1A1A" stroke-width="2"/>
</svg>
<span>Send Invite</span>
        </div>
        <div class="bg-[#762CC0] cursor-pointer text-white border py-3 px-5 space-x-2 rounded-md flex justify-center">
          <svg width="20" height="20" viewBox="0 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M13 22.5H6.59087C5.04549 22.5 3.81631 21.748 2.71266 20.6966C0.453366 18.5441 4.1628 16.824 5.57757 15.9816C7.97679 14.553 10.8425 14.1575 13.5 14.7952" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M16.5 7C16.5 9.48528 14.4853 11.5 12 11.5C9.51472 11.5 7.5 9.48528 7.5 7C7.5 4.51472 9.51472 2.5 12 2.5C14.4853 2.5 16.5 4.51472 16.5 7Z" stroke="white" stroke-width="2"/>
<path d="M19 23.7426V19.5M19 19.5V15.2574M19 19.5H14.7574M19 19.5H23.2427" stroke="white" stroke-width="2" stroke-linecap="round"/>
</svg>
<span>Add employee</span>
        </div>
      </div>

     
    </div>
    <div class="mt-8 md:mt-20">
      <XSummary />
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
        <UFormField label="First Name" name="firstName" class="space-y-2">
          <UInput v-model="state.firstName" placeholder="First Name" size="lg" />
        </UFormField>

        <UFormField label="Last Name" name="lastName" class="space-y-2">
          <UInput v-model="state.lastName" placeholder="Last Name" size="lg" />
        </UFormField>

        <UFormField label="Email" name="email" class="space-y-2">
          <UInput v-model="state.email" placeholder="Email Address" size="lg" />
        </UFormField>

        <UFormField label="Role" name="role" class="space-y-2">
          <UInput v-model="state.role" placeholder="Role" size="lg" />
        </UFormField>

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
        <UFormField
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
        </UFormField>

        <UFormField
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
        </UFormField>
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
