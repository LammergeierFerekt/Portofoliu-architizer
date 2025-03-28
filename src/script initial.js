
// // Import Three.js components
// import * as THREE from 'https://cdn.skypack.dev/three';
// import { OrbitControls } from 'https://cdn.skypack.dev/three/examples/js/controls/OrbitControls.js';

// // Scene Setup
// const scene = new THREE.Scene();
// const aspect = window.innerWidth / window.innerHeight;
// const camera = new THREE.OrthographicCamera(
//     -10 * aspect, 10 * aspect, 10, -10, 0.001, 10000
// );
// camera.position.set(10, 10, 10);
// camera.lookAt(new THREE.Vector3(0, 0, 0));

// // 3D viewport
// const container = document.getElementById("axo-container");
// const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
// renderer.setSize(container.clientWidth, container.clientHeight);
// container.appendChild(renderer.domElement);

// // Update renderer on resize
// window.addEventListener('resize', () => {
//     const aspect = window.innerWidth / window.innerHeight;
//     camera.left = -10 * aspect;
//     camera.right = 10 * aspect;
//     camera.updateProjectionMatrix();
//     renderer.setSize(window.innerWidth, window.innerHeight);
// });

// // Controls
// const controls = new OrbitControls(camera, renderer.domElement);
// controls.enableDamping = true;
// controls.dampingFactor = 0.05;
// controls.screenSpacePanning = false;
// controls.enableZoom = false;
// controls.maxPolarAngle = Math.PI / 3;
// controls.minPolarAngle = Math.PI / 3;

// // Lights
// const ambientLight = new THREE.AmbientLight(0xffffff, 3);
// const directionalLight = new THREE.DirectionalLight(0xffffff, 5);
// directionalLight.position.set(5, 10, 5);
// scene.add(ambientLight, directionalLight);

// // Load CASA_BACAU FBX Model
// const loader = new loader();
// loader.load('/models/CASA_BACAU.fbx', (fbx) => {
//     fbx.scale.set(0.5, 0.5, 0.5);
//     const box = new THREE.Box3().setFromObject(fbx);
//     fbx.position.sub(box.getCenter(new THREE.Vector3()));
//     scene.add(fbx);
// }, undefined, (error) => {
//     console.error('Error loading model:', error);
// });

// // Animation loop
// function animate() {
//     requestAnimationFrame(animate);
//     controls.update();
//     renderer.render(scene, camera);
// }
// animate();
