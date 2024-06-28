<template>
  <div id="app">
    <RoomModel />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import RoomModel from './components/RoomModel.vue';

export default defineComponent({
  name: 'App',
  components: {
    RoomModel,
  },
});
</script>

<style>
</style>
