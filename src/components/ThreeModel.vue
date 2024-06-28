<template>
  <div ref="threeContainer" class="three-container"></div>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from 'vue';
import * as THREE from 'three';

export default defineComponent({
  name: 'ThreeModel',
  setup() {
    const threeContainer = ref<HTMLDivElement | null>(null);

    onMounted(() => {
      if (threeContainer.value) {
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        const renderer = new THREE.WebGLRenderer();
        renderer.setSize(window.innerWidth, window.innerHeight);
        threeContainer.value.appendChild(renderer.domElement);

        const geometry = new THREE.BoxGeometry();
        const material = new THREE.MeshBasicMaterial({ color: 0xffffff });
        const cube = new THREE.Mesh(geometry, material);
        scene.add(cube);

        camera.position.z = 5;

        const animate = () => {
          requestAnimationFrame(animate);
          cube.rotation.x += 0.01;
          cube.rotation.y += 0.01;
          renderer.render(scene, camera);
        };

        animate();
      }
    });

    return {
      threeContainer,
    };
  },
});
</script>

<style>
.three-container {
  width: 100%;
  height: 100vh;
}
</style>
