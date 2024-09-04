<script setup lang="ts">
import { loginEmployer, loginStaff } from "@/composables/services/auth/auth";
import { useLoginValidate } from "@/composables/helpers/validate";
import { userLoginToast } from "@/composables/helpers/notifications";
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

const state = reactive({
  email: "",
  password: "",
});

const login = async () => {
  loading.value = true;
  try {
    const response = await loginEmployer(state);
    loading.value = false;
    userLoginToast(["Successfully Logged in!"], 200);
    if (response.employer) {
      navigateTo("/dashboardEmployer");
    } else {
      navigateTo("/staff");
    }
  } catch (error: any) {
    loading.value = false;
    const err = [error.response.data.message];
    userLoginToast(err, error.response.data.code);
  }
};

onMounted(async () => {
  if ($route.query.authToken) {
    const token = $route.query.authToken;
    const res = await loginStaff(token);
    store.$patch({
      role: res.staff.role,
      name: `${res.staff.firstName} ${res.staff.lastName}`,
    });
    $router.push("/dashboardStaff");
  }
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
