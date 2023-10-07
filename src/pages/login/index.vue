<script setup lang="ts">
import type { FormError } from "@nuxt/ui/dist/runtime/types";
import { loginEmployer } from "@/composables/services/auth/auth";
import { userLoginToast } from "@/composables/helpers/notifications";

definePageMeta({
  layout: "auth",
});

useHead({
  title: "Login | TimeX",
  meta: [
    {
      hid: "description",
      name: "description",
      content: "Login to TimeX",
    },
  ],
});

const loading = ref(false);

const state = reactive({
  email: "",
  password: "",
});

const validate = (state: any): FormError[] => {
  const errors = [];
  if (!state.email) errors.push({ path: "email", message: "Required" });
  if (state.password.length < 8)
    errors.push({
      path: "password",
      message: "Password must be at least 8 characters",
    });
  return errors;
};

const login = async () => {
  loading.value = true;
  try {
    const response = await loginEmployer(state);
    // Handle the response here
    // eslint-disable-next-line no-console
    console.log(response);
    loading.value = false;
    userLoginToast("success");
    navigateTo("/");
  } catch (error) {
    // Handle errors here
    loading.value = false;
    userLoginToast("error");
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
      class="px-6 pb-6 lg:flex-[0.4] flex-1 flex flex-col w-full justify-center bg-white overflow-auto dark:bg-slate-800"
    >
      <div class="max-w-md mx-auto space-y-5 w-full">
        <div>
          <h2 class="my-6 text-2xl font-bold text-blueZodiac dark:text-white">
            <nuxt-link to="/"> TimeX </nuxt-link>
          </h2>
          <p
            class="text-3xl font-bold selection:bg-indigo-700 selection:text-white"
          >
            Welcome Back
          </p>
          <p class="text-gray-500 dark:text-gray-400">
            Login to your account to continue
          </p>
        </div>

        <UForm
          :validate="validate"
          :state="state"
          class="space-y-4 justify-center flex items-center flex-col"
          :validate-on="['submit']"
          @submit.prevent="login"
        >
          <div class="space-y-5 w-full">
            <UFormGroup label="Email" name="email" size="xl" class="space-y-2">
              <UInput
                v-model="state.email"
                placeholder="Email Address"
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
            class="self-start"
            :loading="loading"
          >
            Submit
          </UButton>
        </UForm>

        <p class="text-sm text-center my-3">
          Don't have an account?
          <nuxt-link to="/register" class="text-primary font-bold">
            Register
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
