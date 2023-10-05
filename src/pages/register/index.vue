<script setup lang="ts">
import { ref } from "vue";
import type { FormError, FormSubmitEvent } from "@nuxt/ui/dist/runtime/types";

const state = ref({
    firstName: undefined,
    lastName: undefined,
    companyName: undefined,
    phone: undefined,
    email: undefined,
    password: undefined,
});

// const validate = (state: any): FormError[] => {
//     const errors: FormError[] = [];
//     if (!state.email)
//         errors.push({
//             path: "email",
//             message: "Enter a valid email address",
//         } as FormError);
//     if (!state.password)
//         errors.push({
//             path: "password",
//             message: "Password not strong enough",
//         } as FormError);
//     return errors;
// };

async function submit(event: FormSubmitEvent<any>) {
    // Do something with data
    console.log(event.data);
}

const showPassword = ref(false);
</script>

<template>
    <div class="flex h-screen">
        <div
            class="container mx-auto px-6 pb-6 max-w-lg w-full bg-white overflow-auto dark:bg-slate-800"
        >
            <div class="dark:text-white">
                <h2 class="my-6 text-2xl font-bold text-indigo-700">
                    <nuxt-link to="/">TimeX</nuxt-link>
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
                :state="state"
                @submit="submit"
                validateOn="input"
                class="space-y-4"
            >
                <div class="space-y-5">
                    <UFormGroup
                        label="First Name"
                        name="given_name"
                        size="xl"
                        class="space-y-2 text-black dark:text-white"
                    >
                        <UInput
                            v-model="state.firstName"
                            placeholder="Enter your first name"
                            size="xl"
                        />
                    </UFormGroup>
                    <UFormGroup
                        label="Last Name"
                        name="family_name"
                        size="xl"
                        class="space-y-2 text-black dark:text-white"
                    >
                        <UInput
                            v-model="state.lastName"
                            placeholder="Enter your last name"
                            size="xl"
                        />
                    </UFormGroup>
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
                        label="Company Name"
                        name="company_name"
                        size="xl"
                        class="space-y-2 text-black dark:text-white"
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
                                        showPassword
                                            ? 'i-heroicons-eye-slash'
                                            : 'i-heroicons-eye'
                                    "
                                    :padded="false"
                                    @click="showPassword = !showPassword"
                                />
                            </template>
                        </UInput>
                    </UFormGroup>
                </div>
                <UButton
                    type="submit"
                    size="xl"
                    class="lg:max-w-[150px] w-full justify-center"
                >
                    Submit
                </UButton>
            </UForm>

            <p class="text-sm text-center my-3">
                Do you have an account?
                <nuxt-link to="/login" class="text-primary font-bold"
                    >Login</nuxt-link
                >
            </p>
        </div>
        <div
            class="bg-indigo-700 hidden lg:grid flex-1 overflow-hidden place-content-center text-center"
        >
            <div
                class="animate-ping rounded-full h-4 w-4 dark:bg-neutral-400 bg-white mx-auto"
            ></div>
            <div
                class="bg-white dark:bg-neutral-400 relative flex items-center justify-center w-48 h-48 rounded-2xl [&>*]:absolute [&>*]:rounded-2xl [&>*]:h-12 [&>*]:w-12 [&>*]:bg-neutral-900"
            >
                <div class="top-6"></div>
                <div class="left-6"></div>
                <div class="right-6"></div>
                <div class="bottom-6"></div>
            </div>
        </div>
    </div>
</template>

<style scoped>
::-webkit-scrollbar {
    display: none;
}
</style>
