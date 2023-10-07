<script setup lang="ts">
import type { FormError } from "@nuxt/ui/dist/runtime/types";
import { employerRegister } from "@/composables/services/auth/auth";
import { userRegistrationToast } from "@/composables/helpers/notifications";

definePageMeta({
  layout: "auth",
});

useHead({
  title: "Register | TimeX",
  meta: [
    {
      hid: "description",
      name: "description",
      content: "Register to TimeX",
    },
  ],
});

const loading = ref(false);

const state = reactive({
  firstName: "",
  lastName: "",
  companyName: "",
  phone: "",
  email: "",
  password: "",
});

const validate = (state: any): FormError[] => {
  const errors = [];
  if (!state.email) errors.push({ path: "email", message: "Required" });
  if (!state.firstName)
    errors.push({ path: "given_name", message: "Required" });
  if (!state.lastName)
    errors.push({ path: "family_name", message: "Required" });
  if (!state.companyName)
    errors.push({ path: "company_name", message: "Required" });
  if (state.password.length < 8)
    errors.push({
      path: "password",
      message: "Password must be at least 8 characters",
    });
  return errors;
};

const createEmployer = async () => {
  loading.value = true;
  try {
    const response = await employerRegister(state);
    // Handle the response here
    // eslint-disable-next-line no-console
    console.log(response);
    loading.value = false;
    userRegistrationToast("success");
    navigateTo("/login");
  } catch (error) {
    // Handle errors here
    loading.value = false;
    // eslint-disable-next-line no-console
    console.log(error);
  }
};

const showPassword = ref(false);
</script>

<template>
  <div class="flex h-screen">
    <div
      class="hidden bg-primary lg:grid flex-[0.6] overflow-hidden place-content-center text-center"
    >
      <img src="~/" alt="" />
    </div>
    <div
      class="px-6 pb-6 lg:flex-[0.4] flex-1 flex flex-col w-full bg-white overflow-scroll dark:bg-slate-800"
    >
      <div class="max-w-md mx-auto space-y-5 w-full">
        <div>
          <h2 class="my-6 text-2xl font-bold text-blueZodiac dark:text-white">
            <nuxt-link to="/"> TimeX </nuxt-link>
          </h2>
          <p
            class="text-3xl font-bold selection:bg-indigo-700 selection:text-white"
          >
            Don't have a timeX account? Let's fix that.
          </p>
          <p class="my-5 font-medium text-lg">
            Fill out the form below to have full access of the platform.
          </p>
        </div>

        <UForm
          :validate="validate"
          :state="state"
          class="space-y-4"
          :validate-on="['submit']"
          @submit.prevent="createEmployer"
        >
          <div class="space-y-5">
            <UFormGroup
              label="First Name"
              name="given_name"
              size="xl"
              class="space-y-2"
            >
              <UInput
                v-model="state.firstName"
                placeholder="Enter your first name"
                size="xl"
                class="autofill:bg-transparent"
              />
            </UFormGroup>
            <UFormGroup
              label="Last Name"
              name="family_name"
              size="xl"
              class="space-y-2"
            >
              <UInput
                v-model="state.lastName"
                placeholder="Enter your last name"
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
            <UFormGroup
              label="Company Name"
              name="company_name"
              size="xl"
              class="space-y-2"
            >
              <UInput
                v-model="state.companyName"
                placeholder="Enter your company name"
                size="xl"
              />
            </UFormGroup>

            <UFormGroup
              label="Password"
              name="password"
              size="xl"
              class="space-y-2"
            >
              <UInput
                v-model="state.password"
                :type="showPassword ? 'text' : 'password'"
                placeholder="Password"
                size="xl"
                :ui="{ icon: { trailing: { pointer: '' } } }"
              >
                <template #trailing>
                  <UButton
                    color="primary"
                    variant="link"
                    :icon="
                      showPassword ? 'i-heroicons-eye-slash' : 'i-heroicons-eye'
                    "
                    :padded="false"
                    :ui="{ color: 'primary' }"
                    @click="showPassword = !showPassword"
                  />
                </template>
              </UInput>
            </UFormGroup>
          </div>
          <UButton
            type="submit"
            size="lg"
            color="white"
            variant="solid"
            :loading="loading"
          >
            Submit
          </UButton>
        </UForm>

        <p class="text-sm text-center my-3">
          Do you have an account?
          <nuxt-link to="/login" class="text-primary font-bold">
            Login
          </nuxt-link>
        </p>
      </div>
    </div>
  </div>
</template>

<style scoped>
::-webkit-scrollbar {
  display: none;
}
input:-webkit-autofill,
input:-webkit-autofill:hover,
input:-webkit-autofill:focus,
input:-webkit-autofill:active {
  background-color: transparent !important;
}
</style>
