<script lang="ts" setup>
import { getStaffs, registerStaff } from "@/composables/services/data/data";
import { userLoginToast } from "@/composables/helpers/notifications";
import { StaffData } from "@/types/data";

const isModalOpen = useState("showModal");

const state = reactive({
  firstName: "",
  lastName: "",
  email: "",
  role: "",
});
const loading = ref(false);
const staffData = ref<StaffData[]>([]);
const createStaff = async () => {
  loading.value = true;
  try {
    const response = await registerStaff(state);
    loading.value = false;
    userLoginToast(["Employee Successfully Created!"], 200);
    isModalOpen.value = false;
    getStaffs();
  } catch (error: any) {
    loading.value = false;
    const err = [error.response.data.message];
    isModalOpen.value = false;
    userLoginToast(err, error.response.data.code);
  }
};
onMounted(async () => {
  const data = await getStaffs();
  staffData.value = data.staff;
});
</script>

<template>
  <main class="p-10">
    <div class="flex items-center justify-between">
      <div class="flex flex-col">
        <span class="text-2xl font-bold">Employees</span>
        <span class="text-sm font-light">Here is a list of all employees</span>
      </div>
      <UButton
        type="submit"
        size="lg"
        color="white"
        variant="solid"
        class="self-start"
        @click="isModalOpen = true"
      >
        Add Employees
      </UButton>
    </div>
    <div class="mt-20">
      <XTable :staff-data="staffData">
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
        @submit.prevent="createStaff"
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
