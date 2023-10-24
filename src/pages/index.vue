<script setup>
definePageMeta({
  layout: "landing",
});
</script>

<template>
  <div>
    <div class="grid place-content-center h-screen">
      <div class="flex items-center gap-5">
        <UButton
          to="/login"
          size="lg"
          label="Login"
          color="white"
          variant="solid"
        />
        <UButton
          to="/register"
          size="lg"
          label="Register"
          color="white"
          variant="solid"
        />
      </div>
    </div>
  </div>
</template>
