<script setup lang="ts">
const isVisible = ref(false);

const closeModal = () => {
  isVisible.value = false;
};

const openModal = () => {
  isVisible.value = true;
};
</script>

<template>
  <div v-if="isVisible" class="modal">
    <div class="modal-content">
      <slot></slot>
      <button @click="closeModal">Close</button>
    </div>
  </div>
</template>

<style scoped>
.modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
}

.modal-content {
  background: white;
  padding: 20px;
  border-radius: 5px;
}
</style>
