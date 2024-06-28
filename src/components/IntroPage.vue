<template>
  <div class="h-screen flex flex-col items-center justify-center bg-black text-white font-mono">
    <h1 class="text-4xl mb-4">Welcome to My Room Tour</h1>
    <p class="text-lg mb-6">This is an introduction to the virtual tour of my room.</p>
    <button @click="goToRoomTour" class="px-4 py-2 bg-white text-black font-mono rounded">Start Room Tour</button>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { useRouter } from 'vue-router';

export default defineComponent({
  name: 'IntroPage',
  setup() {
    const router = useRouter();

    const goToRoomTour = () => {
      router.push('/room-tour');
    };

    return { goToRoomTour };
  },
});
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;700&display=swap');
</style>
