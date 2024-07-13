<!-- eslint-disable prettier/prettier -->
<template>
  <div class="landing flex flex-col justify-between h-screen bg-cover bg-center bg-no-repeat">
    <div class="flex justify-between items-center mx-4">
      <img src="/logo.png" class="w-16 md:w-28 cursor-pointer" />
      <div class="flex space-x-3 font-bold text-white text-lg">
        <UButton
          type="submit"
          size="xl"
          color="white"
          variant="solid"
          class="self-start"
        >
          Contact Us
        </UButton>
        <UButton
          type="submit"
          size="xl"
          color="white"
          variant="solid"
          class="self-start"
        >
          Sign up
        </UButton>
        <UButton
          type="submit"
          size="xl"
          color="white"
          variant="solid"
          class="self-start"
        >
          Log in
        </UButton>
      </div>
    </div>
    <div class="justify-center flex items-center h-fit">
      <div class="flex flex-col space-y-4">
        <span class="text-5xl splashText font-bold">Manage Your <br />Employee Processes <br /> More Efficiently.</span>
        <UButton
          type="submit"
          size="xl"
          color="white"
          variant="solid"
          class="self-center"
        >
          Get Started.
        </UButton>
      </div>
    </div>
    <span></span>
  </div>
</template>

<style scoped>
.landing {
  background-image: url("/landing_splash.jpg");
}
.splashText {
  font-family: "AllenSans";
}
</style>
