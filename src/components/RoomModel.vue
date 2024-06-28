<template>
  <div class="h-full w-full relative cursor-pointer" ref="threeContainer" @click="onContainerClick">
    <div v-if="loading" class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-4/5 bg-black p-2 rounded text-center">
      <div class="h-5 bg-white transition-all" :style="{ width: `${Math.round(loadingProgress)}%` }"></div>
      <div class="mt-2 text-xl text-white font-mono">Loading... {{ Math.round(loadingProgress) }}%</div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from 'vue';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { PointerLockControls } from 'three/examples/jsm/controls/PointerLockControls';

export default defineComponent({
  name: 'RoomModel',
  setup() {
    const threeContainer = ref<HTMLDivElement | null>(null);
    const camera = ref<THREE.PerspectiveCamera>();
    const controls = ref<PointerLockControls>();
    const loading = ref(true);
    const loadingProgress = ref(0);
    const zoomSpeed = 0.05;
    const targetFov = ref(75);
    const zoomEase = 0.1;

    const onContainerClick = () => {
      if (controls.value) {
        controls.value.lock();
      }
    };

    const onWheel = (event: WheelEvent) => {
      if (camera.value) {
        targetFov.value -= event.deltaY * zoomSpeed;
        targetFov.value = Math.max(30, Math.min(75, targetFov.value));
      }
    };

    onMounted(() => {
      if (threeContainer.value) {
        const scene = new THREE.Scene();
        camera.value = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        const renderer = new THREE.WebGLRenderer({ antialias: true });
        renderer.setSize(window.innerWidth, window.innerHeight);
        threeContainer.value.appendChild(renderer.domElement);

        const loader = new GLTFLoader();
        loader.load(
          '/models/charite_room.glb',
          (gltf) => {
            scene.add(gltf.scene);
            loading.value = false;
          },
          (xhr) => {
            if (xhr.total) {
              loadingProgress.value = (xhr.loaded / xhr.total) * 100;
            }
          },
          (error) => {
            console.error(error);
          }
        );

        camera.value.position.set(0, 1.2, 0);

        controls.value = new PointerLockControls(camera.value, renderer.domElement);
        controls.value.pointerSpeed = 0.5;

        scene.add(controls.value.getObject());

        const animate = () => {
          requestAnimationFrame(animate);

          if (camera.value) {
            camera.value.fov += (targetFov.value - camera.value.fov) * zoomEase;
            camera.value.updateProjectionMatrix();
          }

          renderer.render(scene, camera.value!);
        };

        animate();

        window.addEventListener('resize', () => {
          if (camera.value) {
            camera.value.aspect = window.innerWidth / window.innerHeight;
            camera.value.updateProjectionMatrix();
          }
          renderer.setSize(window.innerWidth, window.innerHeight);
        });

        threeContainer.value.addEventListener('wheel', onWheel);
      }
    });

    return {
      threeContainer,
      onContainerClick,
      loading,
      loadingProgress,
    };
  },
});
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;700&display=swap');
</style>

<style>
body, html {
  @apply overflow-hidden m-0 p-0 h-full bg-black;
}
</style>
