<script setup>
const colorMode = useColorMode()
import axios from 'axios'
import { setupInterceptors } from '../composables/helpers/axios-interceptor'

const axiosInstance = setupInterceptors(axios.create());

async function fetchData() {

    const data = {
        firstName: 'david',
        lastName: 'ajuka',
        email: 'ajuka@ajuka.com',
        companyName: 'ajukscompany',
        phone: 344421144,
        password: 'lepass'
    }

    try {
        const response = await axiosInstance.post('/employers', data);
        // Handle the response here
        console.log(response)
    } catch (error) {
        // Handle errors here
    }
}

onMounted(() => {
    fetchData()
})

const isDark = computed({
    get() {
        return colorMode.value === 'dark'
    },
    set() {
        colorMode.preference = colorMode.value === 'dark' ? 'light' : 'dark'
    }
})
</script>

<template>
    <ClientOnly>
        <UButton :icon="isDark ? 'i-heroicons-moon-20-solid' : 'i-heroicons-sun-20-solid'" color="gray" variant="ghost"
            aria-label="Theme" @click="isDark = !isDark" />

        <template #fallback>
            <div class="w-8 h-8" />
        </template>
    </ClientOnly>
</template>
