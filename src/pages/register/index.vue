<script setup lang="ts">
import { employerRegister } from "@/composables/services/auth/auth";
import { userRegistrationToast } from "@/composables/helpers/notifications";
import Button from "@/components/ui/Button.vue";
import Input from "@/components/ui/Input.vue";
import FormField from "@/components/ui/FormField.vue";

definePageMeta({
  layout: "auth",
});

useHead({
  title: "Register | TimeX",
  meta: [
    {
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

const errors = reactive({
  firstName: "",
  lastName: "",
  companyName: "",
  phone: "",
  email: "",
  password: "",
});

const validateForm = () => {
  let isValid = true;
  errors.firstName = "";
  errors.lastName = "";
  errors.companyName = "";
  errors.email = "";
  errors.password = "";
  
  if (!state.firstName) {
    errors.firstName = "First name is required";
    isValid = false;
  }
  if (!state.lastName) {
    errors.lastName = "Last name is required";
    isValid = false;
  }
  if (!state.companyName) {
    errors.companyName = "Company name is required";
    isValid = false;
  }
  if (!state.email) {
    errors.email = "Email is required";
    isValid = false;
  } else if (!/\S+@\S+\.\S+/.test(state.email)) {
    errors.email = "Email is invalid";
    isValid = false;
  }
  if (!state.password) {
    errors.password = "Password is required";
    isValid = false;
  } else if (state.password.length < 6) {
    errors.password = "Password must be at least 6 characters";
    isValid = false;
  }
  
  return isValid;
};

const createEmployer = async () => {
  if (!validateForm()) {
    return;
  }
  
  loading.value = true;
  try {
    const response = await employerRegister(state);
    loading.value = false;
    userRegistrationToast([response.data.message], response.data.code);
    navigateTo("/login");
  } catch (error: any) {
    loading.value = false;
    const err = [error.response?.data?.message || "Registration failed"];
    userRegistrationToast(err, error.response?.data?.code || 400);
  }
};

const showPassword = ref(false);
</script>

<template>
  <div class="flex h-screen">
    <div
      class="hidden bg-primary-800 lg:grid flex-[0.6] overflow-hidden place-content-center text-center"
    >
      <div class="text-white px-8">
        <h2 class="text-4xl font-bold mb-4">Welcome to TimeX</h2>
        <p class="text-xl">Your No. 1 Employee Time Management System</p>
      </div>
    </div>
    <div
      class="px-6 pb-6 lg:flex-[0.4] flex-1 flex flex-col w-full bg-white overflow-scroll"
    >
      <div>
        <h2 class="my-6 text-2xl font-bold text-primary-600">
          <nuxt-link to="/"> TimeX </nuxt-link>
        </h2>
        <p class="text-3xl font-bold text-gray-900">
          Don't have a timeX account? Let's fix that.
        </p>
        <p class="my-5 font-medium text-lg text-gray-600">
          Fill out the form below to have full access of the platform.
        </p>
      </div>

      <form @submit.prevent="createEmployer" class="space-y-5">
        <FormField label="First Name" name="firstName" :error="errors.firstName">
          <Input
            v-model="state.firstName"
            placeholder="Enter your first name"
            size="lg"
          />
        </FormField>
        
        <FormField label="Last Name" name="lastName" :error="errors.lastName">
          <Input
            v-model="state.lastName"
            placeholder="Enter your last name"
            size="lg"
          />
        </FormField>
        
        <FormField label="Email" name="email" :error="errors.email">
          <Input
            v-model="state.email"
            type="email"
            placeholder="Email Address"
            size="lg"
          />
        </FormField>
        
        <FormField label="Company Name" name="companyName" :error="errors.companyName">
          <Input
            v-model="state.companyName"
            placeholder="Enter your company name"
            size="lg"
          />
        </FormField>

        <FormField label="Password" name="password" :error="errors.password">
          <div class="relative">
            <Input
              v-model="state.password"
              :type="showPassword ? 'text' : 'password'"
              placeholder="Password"
              size="lg"
            />
            <button
              type="button"
              @click="showPassword = !showPassword"
              class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <svg v-if="showPassword" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
              </svg>
              <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
            </button>
          </div>
        </FormField>
        
        <Button
          type="submit"
          size="lg"
          color="primary"
          class="mt-10 mb-3 w-full"
          :loading="loading"
        >
          Submit
        </Button>
      </form>

      <p class="text-sm text-center my-3 text-gray-600">
        Do you have an account?
        <nuxt-link to="/login" class="text-primary-600 font-bold hover:underline">
          Login
        </nuxt-link>
      </p>
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
