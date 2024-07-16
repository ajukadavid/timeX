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
    <div class="flex justify-between sticky top-0 items-center mx-4">
      <img src="/logo.png" class="w-16 md:w-28 cursor-pointer" />
      <div class="flex space-x-3 font-bold text-white text-lg">
        <nuxt-link to="/register">
          <UButton
            type="submit"
            size="xl"
            color="white"
            variant="solid"
            class="self-start"
          >
            Sign up
          </UButton>
        </nuxt-link>

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
    <div class="justify-center flex mb-10 items-center h-fit">
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
    <div class="bg-white p-10 w-full items-center flex space-x-5">
      <img src="/about_us.jpg" class="w-1/2 border rounded-md" />
      <div
        class="bg-[#102542] text-white w-1/2 h-fit p-8 border rounded-md border-[#1022542]"
      >
        <p class="text-lg">
          Our HR Time Management System is a comprehensive software application
          designed to streamline employee attendance management, sign-in
          records, and punctuality monitoring for organizations. At its core,
          our system revolutionizes how businesses track and manage employee
          attendance with precision and ease. By automating the recording of
          sign-in times and providing insightful analytics, organizations gain
          valuable insights into workforce punctuality and attendance patterns.
          With seamless integration into your existing workflows, our solution
          simplifies the complex task of monitoring employee attendance.
          Employers can effortlessly create and manage user accounts, send
          personalized sign-in invites, and receive timely notifications for
          late arrivals. This proactive approach empowers management to address
          attendance issues promptly, fostering a culture of accountability and
          efficiency within the workplace. Moreover, our system supports
          compliance with regulatory requirements and data security standards,
          ensuring that sensitive employee information remains protected at all
          times. Backed by robust technical infrastructure and user-friendly
          interfaces, our HR Time Management System is the ideal choice for
          modern organizations striving to optimize HR operations and enhance
          overall productivity. Discover the power of efficient attendance
          management with our intuitive and reliable solution. Join countless
          businesses who have transformed their workforce management practices
          with our innovative HR Time Management System.
        </p>
      </div>
    </div>

    <div
      class="w-full bg-[#102542] flex flex-col items-center px-8 py-12 space-y-9"
    >
      <span class="text-4xl text-white">Our Core Features</span>
      <div class="flex w-full justify-between text-white text-2xl">
        <div class="flex flex-col space-y-5 items-center">
          <UIcon name="i-heroicons-user" class="text-7xl" />
          <span>User Management</span>
        </div>
        <div class="flex flex-col space-y-5 items-center">
          <UIcon name="i-heroicons-inbox-arrow-down" class="text-7xl" />
          <span>Sign-In Invites</span>
        </div>
        <div class="flex flex-col space-y-5 items-center">
          <UIcon name="i-heroicons-clock" class="text-7xl" />
          <span>Automatic Time Logging</span>
        </div>
        <div class="flex flex-col space-y-5 items-center">
          <UIcon name="i-heroicons-bell-alert" class="text-7xl" />
          <span>Late Arrival Notifications</span>
        </div>
      </div>
    </div>
    <div
      class="w-full space-x-6 flex text-white h-fit justify-between items-center p-20 mt-8 bg-[#102542]"
    >
      <img src="/ill1.png" class="h-64" />
      <span class="text-5xl"
        >Join Now! Manage your staff proceses efficiently!</span
      >
      <img src="/ill2.png" class="h-64" />
    </div>
    <div class="bg-[#102542] w-full flex justify-between text-white p-10">
      <span class="cursor-pointer">FAQ</span>
      <span class="cursor-pointer">Contact</span>
      <span class="cursor-pointer">About Us</span>
    </div>
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
