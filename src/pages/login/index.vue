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
      localStorage.setItem('userType', 'staff');
      $router.push(`/dashboardStaff/${res.staff._id}`);
    } else {
      // Employer login - uses email and password
      const response = await loginEmployer(state);
      await store.$patch({
        userRole: "Admin",
      });
      localStorage.setItem('userType', 'employer');
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
      class="px-6 pb-6 lg:flex-[0.4] flex-1 flex flex-col w-full justify-center bg-white overflow-auto dark:bg-primary-800"
    >
      <div class="max-w-md mx-auto space-y-5 w-full">
        <div>
          <p
            class="text-3xl font-bold selection:bg-indigo-700 selection:text-white"
          >
            Welcome Back
          </p>
          <p class="text-gray-500 dark:text-gray-400">
            Login to your account to continue
          </p>
        </div>

        <div class="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <span class="text-sm font-medium text-gray-900 dark:text-gray-200">
            {{ isStaffLogin ? 'Staff Login' : 'Employer Login' }}
          </span>
          <UToggle
            v-model="isStaffLogin"
            size="lg"
            color="primary"
            :ui="{
              container: 'w-[52px]',
              active: 'bg-primary-500',
              inactive: 'bg-gray-200 dark:bg-gray-700'
            }"
          />
        </div>

        <UForm
          :validate="useLoginValidate"
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

.hero-bg {
  background: url("/login.svg") no-repeat;
  background-size: cover;
}
</style>
