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
        spinner.style.display = 'flex';

        activatePDFView();
        pdfViewer.src = pdfFile;
        
        // When PDF is loaded, hide spinner
        pdfViewer.onload = function() {
            const timeout = setTimeout(() => {
                spinner.style.display = 'none';
            }, 2000);
            document.getElementById('gradient-shadow_1').style.opacity = 1;
            document.getElementById('gradient-shadow_2').style.opacity = 1;
        };
        
        // Also hide spinner if there's an error
        pdfViewer.onerror = function() {
            spinner.style.display = 'none';
            alert('Failed to load PDF');
        };
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

// Add this at the top of your script section
const spinner = document.getElementById('spinner');

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

//#region 4.3D view settings with auto-spin functionality

// Set 3D viewport
const container = document.getElementById("axo");

// Setting up Scene
const scene = new THREE.Scene();

let width = container.clientWidth;
let height = container.clientHeight;

// Set up Orthographic Camera
const aspect = width / height;
const far = 10000;
const near = 0.001;
const top = 5;
const bottom = -5;
const right = 5;
const left = -5;

const camera = new THREE.OrthographicCamera(left * aspect, right * aspect, top, bottom, near, far);
camera.position.set(5, 5, 5);
camera.lookAt(new THREE.Vector3(0, 0, 0));

// Set the renderer
const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
renderer.setSize(width, height);
renderer.setPixelRatio(window.devicePixelRatio);
container.appendChild(renderer.domElement);

// Lights
const ambientLight = new THREE.AmbientLight(0xffffff, 3);
const directionalLight01 = new THREE.DirectionalLight(0xffffff, 7);
const directionalLight02 = new THREE.DirectionalLight(0xffffff, 10);
scene.add(ambientLight, directionalLight01, directionalLight02);

directionalLight01.position.set(5, 10, 5);
directionalLight02.position.set(-5, 10, -5);

// Creating GLTF Models paths
const model = `src/CASA_BACAU.gltf`;
const loader = new GLTFLoader();

let gltfModel;
let autoRotateEnabled = true;
let idleTimer;
const idleTimeout = 3000; // 3 seconds of inactivity before auto-rotate starts

// Function to handle auto-rotation
function startAutoRotate() {
    autoRotateEnabled = true;
    controls.autoRotate = true;
    controls.autoRotateSpeed = 0.5; // Slow rotation speed
}

function stopAutoRotate() {
    autoRotateEnabled = false;
    controls.autoRotate = false;
}

// Reset idle timer on user interaction
function resetIdleTimer() {
    stopAutoRotate();
    clearTimeout(idleTimer);
    idleTimer = setTimeout(startAutoRotate, idleTimeout);
}

// Set up event listeners for user interaction
container.addEventListener('mousedown', resetIdleTimer);
container.addEventListener('touchstart', resetIdleTimer);
container.addEventListener('wheel', resetIdleTimer);

// Load model
loader.load(model, (gltf) => {
    gltfModel = gltf.scene;
    gltfModel.scale.set(0.3, 0.3, 0.3);
    scene.add(gltfModel);

    // Material overrides (same as before)
    const backgroundColor = 0xe6e6e6;
    const movColor = 0x93a0c6;
    const sticlaColor = 0xffe2dd;
    const tiglaColor = 0xa3acc8;

    gltf.scene.traverse((child) => {
        if (child.isMesh) {
            if (Array.isArray(child.material)) {
                child.material.forEach((material, index) => {
                    if (['Pamant'].includes(material.name)) {
                        child.material[index] = new THREE.MeshBasicMaterial({
                            color: backgroundColor,
                            map: null,
                            side: THREE.FrontSide
                        });
                    }
                    else if (material.name.includes('Metal - plasa de sarma')) {
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
                        child.material[index] = new THREE.MeshPhysicalMaterial({
                            color: sticlaColor,
                            transmission: 0.9,
                            roughness: 0.1,
                            metalness: 0.0,
                            clearcoat: 1.5,
                            clearcoatRoughness: 0.1,
                            ior: 1.5,
                            transparent: true,
                            opacity: 0.7,
                            side: THREE.DoubleSide
                        });
                    }
                    else if (material.name.includes('Tigla rosie')) {
                        child.material[index] = new THREE.MeshStandardMaterial({
                            map: material.map,
                            color: tiglaColor,
                            side: THREE.FrontSide
                        });
                    }
                });
            } else {
                if (['Pamant'].includes(child.material.name)) {
                    child.material = new THREE.MeshBasicMaterial({
                        color: backgroundColor,
                        map: null,
                        side: THREE.FrontSide
                    });
                }
                else if (child.material.name.includes('Metal - plasa de sarma')) {
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
                    child.material = new THREE.MeshStandardMaterial({
                        map: child.material.map,
                        color: tiglaColor,
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
controls.enableDamping = true;
controls.dampingFactor = 0.05;
controls.screenSpacePanning = false;
controls.zoomSpeed = 1.2;
controls.minDistance = 10;
controls.maxDistance = 10;
controls.enableZoom = false;
controls.maxPolarAngle = Math.PI / 3;
controls.minPolarAngle = Math.PI / 3;

// Start with auto-rotate enabled
controls.autoRotate = true;
controls.autoRotateSpeed = 0.5;

// Start idle timer when page loads
idleTimer = setTimeout(startAutoRotate, idleTimeout);

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