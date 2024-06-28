<template>
  <div ref="threeContainer" class="three-container" @click="onContainerClick"></div>
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
        loader.load('/models/charite_room.glb', (gltf) => {
          scene.add(gltf.scene);
        }, undefined, (error) => {
          console.error(error);
        });

        camera.value.position.set(0, 1.2, 0);
        controls.value = new PointerLockControls(camera.value, renderer.domElement);
        //controls.value.speedFactor = 0.01; //TODO: fix
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
          camera.value!.aspect = window.innerWidth / window.innerHeight;
          camera.value!.updateProjectionMatrix();
          renderer.setSize(window.innerWidth, window.innerHeight);
        });
        threeContainer.value.addEventListener('wheel', onWheel);
      }
    });

    return {
      threeContainer,
      onContainerClick,
    };
  },
});
</script>

<style>
.three-container {
  width: 100%;
  height: 100vh;
  cursor: pointer;
}
</style>
