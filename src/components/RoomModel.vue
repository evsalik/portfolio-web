<template>
  <div class="three-container" ref="threeContainer" @click="onContainerClick">
    <div v-if="loading" class="loading-container">
      <div class="loading-bar" :style="{ width: `${loadingProgress}%` }"></div>
      <div class="loading-text">Loading... {{ Math.round(loadingProgress) }}%</div>
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
            loading.value = false; // Model loaded, hide the loading spinner
          },
          (xhr) => {
            // Update progress
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

          // Smoothly interpolate FOV towards target FOV
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

<style>
body, html {
  overflow: hidden;
  margin: 0;
  padding: 0;
  background-color: black; /* Set background color to black */
}

.three-container {
  width: 100%;
  height: 100vh;
  cursor: pointer;
  position: relative;
}

.loading-container {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 80%;
  background-color: black; /* Set background color to black */
  padding: 10px;
  border-radius: 5px;
  text-align: center;
}

.loading-bar {
  height: 20px;
  background-color: white; /* Set loading bar color to white */
  width: 0;
  transition: width 0.3s ease;
}

.loading-text {
  margin-top: 10px;
  font-size: 1.2em;
  color: white; /* Set loading text color to white */
}
</style>
