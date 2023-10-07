<script setup lang="ts">
import { loginEmployer } from "@/composables/services/auth/auth";
import { useLoginValidate } from "@/composables/helpers/validate";
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

const login = async () => {
  loading.value = true;
  try {
    const response = await loginEmployer(state);
    // Handle the response here

    loading.value = false;
    userLoginToast(response.data.message, response.data.code);
    navigateTo("/");
  } catch (error: any) {
    loading.value = false;
    const err = [error.response.data.message];
    userLoginToast(err, error.response.data.code);
  }
};

const showPassword = ref(false);
</script>

<template>
  <div class="flex h-screen">
    <div
      class="hidden bg-primary lg:grid flex-1 overflow-hidden place-content-center text-center"
    >
      <img src="~/" alt="" />
    </div>
    <div
      class="flex flex-col container mx-auto px-6 pb-6 max-w-lg w-full bg-white overflow-auto dark:bg-slate-800"
    >
      <div>
        <h2 class="my-6 text-2xl font-bold text-carnation">
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
        :validate="useLoginValidate"
        :state="state"
        class="space-y-4 flex-1 justify-center flex items-center flex-col"
        :validate-on="['submit']"
        @submit.prevent="login"
      >
        <div class="space-y-5 w-full">
          <UFormGroup
            label="Email"
            name="email"
            size="xl"
            class="space-y-2 text-black dark:text-white"
          >
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
            class="space-y-2 text-black dark:text-white"
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
