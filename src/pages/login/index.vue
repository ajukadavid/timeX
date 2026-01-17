<script setup lang="ts">
import { loginEmployer, loginStaff } from "@/composables/services/auth/auth";
import { useLoginValidate } from "@/composables/helpers/validate";
import { userToast } from "@/composables/helpers/notifications";
import { useUserStore } from "@/store/userStore";
import Button from "@/components/ui/Button.vue";
import Input from "@/components/ui/Input.vue";
import FormField from "@/components/ui/FormField.vue";

const store = useUserStore();
const $route = useRoute();
const $router = useRouter();

definePageMeta({
  layout: "auth",
});

useHead({
  title: "Login | TimeX",
  meta: [
    {
      name: "description",
      content: "Login to TimeX",
    },
  ],
});

const loading = ref(false);
const showPassword = ref(false);
const isStaffLogin = ref(false);

const state = reactive({
  email: "",
  password: "",
});

const errors = reactive({
  email: "",
  password: "",
});

const validateForm = () => {
  errors.email = "";
  errors.password = "";
  
  if (!state.email) {
    errors.email = "Email is required";
    return false;
  }
  if (!/\S+@\S+\.\S+/.test(state.email)) {
    errors.email = "Email is invalid";
    return false;
  }
  if (!state.password) {
    errors.password = "Password is required";
    return false;
  }
  return true;
};

const login = async () => {
  if (!validateForm()) {
    return;
  }
  
  loading.value = true;
  try {
    if (isStaffLogin.value) {
      const res = await loginStaff({
        email: state.email,
        password: state.password
      });
      await store.$patch({
        userRole: res.staff.role,
        name: `${res.staff.firstName} ${res.staff.lastName}`,
      });
      $router.push(`/dashboardStaff/${res.staff._id}`);
    } else {
      const response = await loginEmployer(state);
      await store.$patch({
        userRole: "Admin",
      });
      $router.push('/dashboardEmployer');
    }
    
    userToast(["Successfully Logged in!"], 200);
  } catch (error: any) {
    const err = [error.response?.data?.message || "Login failed"];
    userToast(err, error.response?.data?.code || 400);
  } finally {
    loading.value = false;
  }
};
</script>

<template>
  <div class="flex w-full h-screen">
    <div class="hero-bg w-1/2 hidden bg-primary-800 lg:grid flex-[0.6] overflow-hidden">
      <div class="flex px-8 gap-32 flex-col text-white">
        <h2 class="my-6 text-5xl font-bold">
          <nuxt-link to="/"> TimeX </nuxt-link>
        </h2>
        <em>
          <h4 class="text-3xl italic justify-self-center font-lighter">
            Your No. 1 Employee Time Management <br />
            System.
          </h4>
        </em>
      </div>
    </div>
    <div
      class="px-6 pb-6 lg:flex-[0.4] flex-1 flex flex-col w-full justify-center bg-gray-50 overflow-auto"
    >
      <div class="max-w-md mx-auto space-y-8 w-full">
        <div class="text-center lg:text-left">
          <h1 class="text-4xl font-bold text-gray-900 mb-2">
            Welcome Back
          </h1>
          <p class="text-gray-600">
            Sign in to your account to continue
          </p>
        </div>

        <div class="flex gap-3 p-1.5 bg-white rounded-xl shadow-sm border border-gray-200">
          <button
            @click="isStaffLogin = false"
            :class="[
              'flex-1 flex items-center justify-center gap-2 py-3.5 px-4 rounded-lg font-semibold text-sm transition-all duration-200',
              !isStaffLogin
                ? 'bg-primary-600 text-white shadow-md'
                : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
            ]"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.25 21h19.5m-18-18v18m10.5-18v18m6-13.5V21M6.75 6.75h.75m-.75 3h.75m-.75 3h.75m3-6h.75m-.75 3h.75m-.75 3h.75M6.75 21v-3.375c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21M3 3h12m-1.125-4.125H18.75M3 3v18m0 0h18M3 21h18" />
            </svg>
            <span>Employer</span>
          </button>
          <button
            @click="isStaffLogin = true"
            :class="[
              'flex-1 flex items-center justify-center gap-2 py-3.5 px-4 rounded-lg font-semibold text-sm transition-all duration-200',
              isStaffLogin
                ? 'bg-primary-600 text-white shadow-md'
                : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
            ]"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            <span>Staff</span>
          </button>
        </div>

        <div class="bg-white rounded-2xl shadow-lg border border-gray-200 p-8">
          <form @submit.prevent="login" class="space-y-5 w-full">
            <FormField label="Email" name="email" :error="errors.email">
              <Input
                v-model="state.email"
                type="email"
                placeholder="Enter your email"
                size="lg"
                color="primary"
                variant="outline"
              />
            </FormField>

            <FormField label="Password" name="password" :error="errors.password">
              <div class="relative">
                <Input
                  v-model="state.password"
                  :type="showPassword ? 'text' : 'password'"
                  placeholder="Enter your password"
                  size="lg"
                  color="primary"
                  variant="outline"
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
              :loading="loading"
              class="w-full mt-6"
            >
              Sign In
            </Button>
          </form>
        </div>

        <p class="text-sm text-center text-gray-600">
          Don't have an account?
          <nuxt-link to="/register" class="text-primary-600 font-semibold hover:underline">
            Sign up
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

.hero-bg {
  background: url("/login.svg") no-repeat;
  background-size: cover;
}
</style>
