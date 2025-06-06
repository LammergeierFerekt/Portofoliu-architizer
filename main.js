
//#region 1.Importing Modules
import "/style.css";
import * as THREE from "three";
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
//#endregion

//#region 2.Initializations


document.addEventListener('DOMContentLoaded', function() {
    // Get references to the elements
    const pdfContainer = document.querySelector('.pdf-container');
    const axoContainer = document.getElementById('axo');
    const view3DButton = document.getElementById('view3D');
    const pdfButtons = document.querySelectorAll('.button-container button:not(#view3D)');
    const pdfViewer = document.getElementById('pdf-viewer');
    
    // Function to activate 3D view
    function activate3DView() {
        axoContainer.classList.add('active');
        pdfContainer.classList.remove('active');
        pdfViewer.src = '';
        document.getElementById('gradient-shadow_1').style.opacity = 0;
        document.getElementById('gradient-shadow_2').style.opacity = 0;
    }
    
    // Function to activate PDF view
    function activatePDFView() {
        axoContainer.classList.remove('active');
        pdfContainer.classList.add('active');
    }
    
    // Function to show PDF (from HTML script)
    function showPDF(pdfFile) {
        activatePDFView();
        pdfViewer.src = pdfFile;
        document.getElementById('gradient-shadow_1').style.opacity = 1;
        document.getElementById('gradient-shadow_2').style.opacity = 1;
    }
    
    // Set up event listeners
    view3DButton.addEventListener('click', activate3DView);
    
    pdfButtons.forEach(button => {
        button.addEventListener('click', function() {
            const pdfFile = this.getAttribute('data-pdf');
            if (pdfFile) {
                showPDF(pdfFile);
            } else {
                activatePDFView();
                document.getElementById('gradient-shadow_1').style.opacity = 1;
                document.getElementById('gradient-shadow_2').style.opacity = 1;
            }
        });
    });
    
    // Initialize with 3D view active
    activate3DView();
    
    // Expose showPDF to global scope for HTML onclick handlers
    window.showPDF = showPDF;
    window.toggle3D = activate3DView;
});

//#endregion

//#region 3.Handle cache files
const REPO_NAME = '/Portofoliu-architizer';

// Files to preload matching service worker's FILES_TO_CACHE exactly
const filesToPreload = [
  `${REPO_NAME}/`,
  `${REPO_NAME}/index.html`,
  `${REPO_NAME}/public/images/CV_Furdu_Mihael-Ionut.pdf`,
  `${REPO_NAME}/public/alte_lucrari.pdf`,
  `${REPO_NAME}/public/cv.pdf`,
  `${REPO_NAME}/public/proiect_tipic.pdf`,
  `${REPO_NAME}/public/tehnic_tipic.pdf`,
  `${REPO_NAME}/src/CASA_BACAU.gltf`,
];

// Function to preload files by fetching them (to warm cache)
function preloadFiles() {
  filesToPreload.forEach((url) => {
    fetch(url).then(response => {
      if (!response.ok) {
        console.warn('[Main] Failed to preload:', url);
      }
    }).catch(err => {
      console.warn('[Main] Error preloading:', url, err);
    });
  });
}

window.addEventListener('load', () => {
  preloadFiles();

  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register(`${REPO_NAME}/sw.js`).then(reg => {
      console.log('[Main] SW registered:', reg.scope);
    }).catch(err => {
      console.error('[Main] SW registration failed:', err);
    });

    navigator.serviceWorker.ready.then(() => {
      console.log('[Main] SW ready and controlling the page');
    });
  }
});
//#endregion 

//#region 4.3D view settings

// Set 3D viewport
const container = document.getElementById("axo");

// Settingup Scene
const scene = new THREE.Scene();

let width = container.clientWidth;
let height = container.clientHeight;

// Set up Orthographic Camera (adjust near/far planes and view size based on your needs)
// Creating parameteres for camera
const aspect = width / height;
const far = 10000;
const near = 0.001;
const top = 5;
const bottom = -5;
const right = 5;
const left = -5;

// Settingup the camera
const camera = new THREE.OrthographicCamera(left * aspect, right * aspect, top, bottom, near, far);

// Set initial camera position at the corner (isometric-like view)
camera.position.set(5, 5, 5); // Position at (10, 10, 10) to simulate isometric view
// Set direction of the camera;
camera.lookAt(new THREE.Vector3(0, 0, 0)); // Look at the center of the object

// Set the renderer
const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
renderer.setSize(width, height);
renderer.setPixelRatio(window.devicePixelRatio);
container.appendChild(renderer.domElement);

// Lights
const ambientLight = new THREE.AmbientLight(0xffffff, 3); // Soft light
const directionalLight01 = new THREE.DirectionalLight(0xffffff, 7); // Directional light 01
const directionalLight02 = new THREE.DirectionalLight(0xffffff, 10); // Directional light 02
scene.add(ambientLight, directionalLight01, directionalLight02);

// Light parameters
directionalLight01.position.set(5, 10, 5);
directionalLight02.position.set(-5, 10, -5);

// Creating GLTF Models paths
const model = `src/CASA_BACAU.gltf`;
// Load GLB model
const loader = new GLTFLoader();

let gltfModel;  // Store the model reference

loader.load(model, (gltf) => {
    gltfModel = gltf.scene;
    gltfModel.scale.set(0.3, 0.3, 0.3); // Scale model
    scene.add(gltfModel);

    // Traverse the scene to find meshes and log their materials
    gltf.scene.traverse((child) => {
        if (child.isMesh) {
            // If the mesh has materials, log them
            if (Array.isArray(child.material)) {
                child.material.forEach((material, index) => {
                    console.log(`Material ${index}:`, material);
                });
            } else {
                console.log(`Material:`, child.material);
            }
        }
    });


// Apply material overrides
const backgroundColor = 0xe6e6e6;       // Light gray for ground
const movColor = 0x93a0c6;             // Purple-blue color
const sticlaColor = 0xffe2dd;          // Yellow for glass
const tiglaColor = 0xa3acc8;           // Purple-blue for tiles (originally red)

gltf.scene.traverse((child) => {
    if (child.isMesh) {
        // Handle materials that are in an array
        if (Array.isArray(child.material)) {
            child.material.forEach((material, index) => {
                if (['Pamant'].includes(material.name)) {
                    // Ground material
                    child.material[index] = new THREE.MeshBasicMaterial({
                        color: backgroundColor,
                        map: null,
                        side: THREE.FrontSide
                    });
                }
                else if (material.name.includes('Metal - plasa de sarma')) {
                    // Wire mesh material - transparent purple-blue
                    child.material[index] = new THREE.MeshStandardMaterial({
                        color: movColor,
                        metalness: 0.8,
                        roughness: 0.4,
                        transparent: true,
                        opacity: 0.7,
                        side: THREE.FrontSide
                    });
                }
                else if (material.name.includes('Sticla - clara')) {
                    // Clear glass material - yellow tint
                    child.material[index] = new THREE.MeshPhysicalMaterial({
                        color: sticlaColor,
                        transmission: 0.9,    // Glass transparency
                        roughness: 0.1,
                        metalness: 0.0,
                        clearcoat: 1.5,
                        clearcoatRoughness: 0.1,
                        ior: 1.5,  
                        transparent: true,
                        opacity: 0.7,          // Index of refraction (glass is ~1.5)
                        side: THREE.DoubleSide // Glass should render both sides
                    });
                }
                else if (material.name.includes('Tigla rosie')) {
                    // Red tiles - override with purple-blue but keep original texture
                    child.material[index] = new THREE.MeshStandardMaterial({
                        map: material.map,     // Keep original texture map
                        color: tiglaColor,     // Apply purple-blue tint
                        side: THREE.FrontSide
                    });
                }
            });
        } 
        // Handle single materials
        else {
            if (['Pamant'].includes(child.material.name)) {
                // Ground material
                child.material = new THREE.MeshBasicMaterial({
                    color: backgroundColor,
                    map: null,
                    side: THREE.FrontSide
                });
            }
            else if (child.material.name.includes('Metal - plasa de sarma')) {
                // Wire mesh material - transparent purple-blue
                child.material = new THREE.MeshStandardMaterial({
                    color: movColor,
                    metalness: 0.8,
                    roughness: 0.4,
                    transparent: true,
                    opacity: 0.7,
                    side: THREE.FrontSide
                });
            }
            else if (child.material.name.includes('Sticla - clara')) {
                // Clear glass material - yellow tint
                child.material = new THREE.MeshPhysicalMaterial({
                    color: sticlaColor,
                    transmission: 0.9,
                    roughness: 0.1,
                    metalness: 0.0,
                    clearcoat: 1.0,
                    clearcoatRoughness: 0.1,
                    ior: 1.5,
                    side: THREE.DoubleSide
                });
            }
            else if (child.material.name.includes('Tigla rosie')) {
                // Red tiles - override with purple-blue but keep original texture
                child.material = new THREE.MeshStandardMaterial({
                    map: child.material.map,  // Keep original texture map
                    color: tiglaColor,       // Apply purple-blue tint
                    metalness: child.material.metalness || 0.0,
                    roughness: child.material.roughness || 0.5,
                    side: THREE.FrontSide
                });
            }
        }
    }
});
}, undefined, (error) => {
    console.error('Loading error', error);
});



// Set Camera Controls
const controls = new OrbitControls(camera, renderer.domElement);
// Set parameters of controls
controls.enableDamping = true;
controls.dampingFactor = 0.05;
controls.screenSpacePanning = false;
controls.zoomSpeed = 1.2;
controls.minDistance = 10;  // Limit zoom to a certain minimum distance
controls.maxDistance = 10; // Limit zoom to a certain maximum distance
controls.enableZoom = false; // Disabling zoom
controls.maxPolarAngle = Math.PI / 3; // Prevent vertical rotation (limit pitch to 90 degrees)
controls.minPolarAngle = Math.PI / 3; // Lock vertical axis at 90 degrees (horizontal only)

// Animation loop
function animate() {
    requestAnimationFrame(animate);
    controls.update();
    renderer.render(scene, camera);
}
animate();

// Handle window resize
window.addEventListener('resize', () => {
    width = container.clientWidth;
    height = container.clientHeight;
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    renderer.setSize(width, height);
});
//#endregion