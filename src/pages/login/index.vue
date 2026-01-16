<script setup lang="ts">
import { loginEmployer, loginStaff } from "@/composables/services/auth/auth";
import { useLoginValidate } from "@/composables/helpers/validate";
import { userToast } from "@/composables/helpers/notifications";
import { useUserStore } from "@/store/userStore";

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
      hid: "description",
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

const login = async () => {
  console.log(isStaffLogin.value)
  loading.value = true;
  try {
    if (isStaffLogin.value) {
      // Staff login - uses email and password
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
      // Employer login - uses email and password
      const response = await loginEmployer(state);
      console.log(response)
      await store.$patch({
        userRole: "Admin",
      });
      $router.push('/dashboardEmployer');
    }
    
    userToast(["Successfully Logged in!"], 200);
  } catch (error: any) {
    const err = [error.response.data.message];
    userToast(err, error.response.data.code);
  } finally {
    loading.value = false;
  }
};

onMounted(async () => {
console.log(store.userRole)
});
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
      class="px-6 pb-6 lg:flex-[0.4] flex-1 flex flex-col w-full justify-center bg-gray-50 overflow-auto dark:bg-gray-900"
    >
      <div class="max-w-md mx-auto space-y-8 w-full">
        <div class="text-center lg:text-left">
          <h1 class="text-4xl font-bold text-gray-900 dark:text-white mb-2">
            Welcome Back
          </h1>
          <p class="text-gray-600 dark:text-gray-400">
            Sign in to your account to continue
          </p>
        </div>

        <div class="flex gap-3 p-1.5 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
          <button
            @click="isStaffLogin = false"
            :class="[
              'flex-1 flex items-center justify-center gap-2 py-3.5 px-4 rounded-lg font-semibold text-sm transition-all duration-200',
              !isStaffLogin
                ? 'bg-primary-500 text-white shadow-md'
                : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
            ]"
          >
            <UIcon name="i-heroicons-building-office-2" class="w-5 h-5" />
            <span>Employer</span>
          </button>
          <button
            @click="isStaffLogin = true"
            :class="[
              'flex-1 flex items-center justify-center gap-2 py-3.5 px-4 rounded-lg font-semibold text-sm transition-all duration-200',
              isStaffLogin
                ? 'bg-primary-500 text-white shadow-md'
                : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
            ]"
          >
            <UIcon name="i-heroicons-user-group" class="w-5 h-5" />
            <span>Staff</span>
          </button>
        </div>

        <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-8">
          <UForm
            :validate="useLoginValidate"
            :state="state"
            class="space-y-5 w-full"
            :validate-on="['submit']"
            @submit.prevent="login"
          >
            <UFormField label="Email" name="email" class="space-y-2">
              <UInput
                v-model="state.email"
                placeholder="Enter your email"
                size="lg"
                color="primary"
                variant="outline"
                :ui="{
                  base: 'relative block w-full disabled:cursor-not-allowed disabled:opacity-75 focus:outline-none border-0',
                  rounded: 'rounded-lg',
                  placeholder: 'placeholder-gray-400 dark:placeholder-gray-500',
                  size: {
                    lg: 'text-base'
                  },
                  gap: {
                    lg: 'gap-3'
                  },
                  variant: {
                    outline: 'bg-white dark:bg-gray-900 text-gray-900 dark:text-white ring-1 ring-inset ring-gray-300 dark:ring-gray-700 focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400'
                  }
                }"
              />
            </UFormField>

            <UFormField label="Password" name="password" class="space-y-2">
              <UInput
                v-model="state.password"
                :type="showPassword ? 'text' : 'password'"
                placeholder="Enter your password"
                size="lg"
                color="primary"
                variant="outline"
                :ui="{
                  base: 'relative block w-full disabled:cursor-not-allowed disabled:opacity-75 focus:outline-none border-0',
                  rounded: 'rounded-lg',
                  placeholder: 'placeholder-gray-400 dark:placeholder-gray-500',
                  size: {
                    lg: 'text-base'
                  },
                  gap: {
                    lg: 'gap-3'
                  },
                  variant: {
                    outline: 'bg-white dark:bg-gray-900 text-gray-900 dark:text-white ring-1 ring-inset ring-gray-300 dark:ring-gray-700 focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400'
                  }
                }"
              >
                <template #trailing>
                  <UButton
                    color="gray"
                    variant="ghost"
                    size="sm"
                    :icon="
                      showPassword ? 'i-heroicons-eye-slash' : 'i-heroicons-eye'
                    "
                    @click="showPassword = !showPassword"
                  />
                </template>
              </UInput>
            </UFormField>

            <UButton
              type="submit"
              size="lg"
              color="primary"
              class="w-full mt-6"
              :loading="loading"
            >
              Sign In
            </UButton>
          </UForm>
        </div>

        <p class="text-sm text-center text-gray-600 dark:text-gray-400">
          Don't have an account?
          <nuxt-link to="/register" class="text-primary-600 dark:text-primary-400 font-semibold hover:underline">
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
