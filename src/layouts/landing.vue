<!-- eslint-disable prettier/prettier -->
<script setup lang="ts">

const staticText = "Manage Your Staff Processes More ";
const array = ["Productively", "Competently", "Expediently", "Resourcefully", "Systematically"];
const speed = 50;

const i = ref(0);
const j = ref(0);

const dynamicText = ref(array[0]);

const typeWriter = () => {
  const targetText = array[j.value];
  if (i.value < targetText.length) {
    dynamicText.value = targetText.substring(0, i.value + 1);
    i.value++;
    setTimeout(typeWriter, speed);
  } else {
    i.value = 0; // Reset index for next word
  }
};

const rotate = () => {
  j.value = (j.value + 1) % array.length;
  typeWriter();
};

const startTyping = () => {
  typeWriter();
  setInterval(rotate, 5000);
};

onMounted(() => {
  startTyping();
});
</script>

<template>
  <div
    class="landing flex flex-col justify-between h-screen bg-cover bg-center bg-no-repeat"
  >
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
        <span class="text-8xl font-extrabold splashText">
          <div class="text-[#102542] w-full leading-relaxed pl-8">
            <p>
              {{ staticText }}<span class="text-white">{{ dynamicText }}</span
              >.
            </p>
          </div>
        </span>
        <UButton
          type="submit"
          size="xl"
          color="white"
          variant="solid"
          class="self-center text-3xl font-extrabold"
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
