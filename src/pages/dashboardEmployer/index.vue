<script lang="ts" setup>
import { getStaffs } from "@/composables/services/data/data";
const isModalOpen = useState("showModal");

onMounted(() => {
  getStaffs();
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
  </main>
  <XModal show-header show-footer>
    <template #header>
      <div>Create Employees</div>
    </template>
    <div>
      <UForm
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
            <UInput placeholder="First Name" size="xl" />
          </UFormGroup>

          <UFormGroup
            label="Last Name"
            name="last Name"
            size="xl"
            class="space-y-2"
          >
            <UInput placeholder="First Last" size="xl" />
          </UFormGroup>

          <UFormGroup label="Email" name="email" size="xl" class="space-y-2">
            <UInput placeholder="Email Address" size="xl" />
          </UFormGroup>

          <UFormGroup label="Role" name="role" size="xl" class="space-y-2">
            <UInput placeholder="Role" size="xl" />
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
        >
          Submit
        </UButton>
      </div>
    </template>
  </XModal>
</template>
