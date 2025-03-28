document.addEventListener('DOMContentLoaded', function() {
    // Get references to the elements
    const pdfContainer = document.querySelector('.pdf-container');
    const axoContainer = document.getElementById('axo');
    const view3DButton = document.getElementById('view3D');
    const pdfButtons = document.querySelectorAll('.button-container button:not(#view3D)');
    
    // Function to activate 3D view
    function activate3DView() {
        axoContainer.classList.add('active');
        pdfContainer.classList.remove('active');
        document.getElementById('pdf-viewer').src = '';
    }
    
    // Function to activate PDF view
    function activatePDFView() {
        axoContainer.classList.remove('active');
        pdfContainer.classList.add('active');
    }
    
    // Set up event listeners
    view3DButton.addEventListener('click', activate3DView);
    
    pdfButtons.forEach(button => {
        button.addEventListener('click', function() {
            activatePDFView();
            // Optional: You can add specific PDF handling here if needed
        });
    });
    
    // Initialize with 3D view active
    activate3DView();
});














// Importing Modules
import "./style.css";
import * as THREE from "three";
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

// // Importing from CSS
// const mainColor = '#4a5ba9';




// Set 3D viewport
const container = document.getElementById("axo");
// container.height = 1000;
// container.width = 1000;


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
    const camera = new THREE.OrthographicCamera(left * aspect,  right * aspect,top, bottom, near, far);

// Setting the background
// scene.background = new THREE.Color(mainColor);

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
    const directionalLight01 = new THREE.DirectionalLight(0xffffff, 5); // Directional light 01
    const directionalLight02 = new THREE.DirectionalLight(0xffffff, 5); // Directional light 02
    scene.add(ambientLight, directionalLight01, directionalLight02);

    // Light parameters
    directionalLight01.position.set(5, 10, 5);
    directionalLight02.position.set(-5, 10, -5);

// // Geometry test
//     const geometry = new THREE.BoxGeometry(5,5,5);
//     const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
//     const cube = new THREE.Mesh(geometry, material);

//     // console.log(cube);
//     // scene.add(cube);





// Creating GLTF Models paths
const model = "./src/02_00_CASA-BACAU_ACOPERIS.glb";
// Load GLB model
const loader = new GLTFLoader();


let gltfModel;  // Store the model reference
let isSpinning = true;  // Flag to control rotation


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

    // Apply material overrides (same for all stages)
    const backgroundColor = 0xe6e6e6;
    gltf.scene.traverse((child) => {
        if (child.isMesh) {
            if (Array.isArray(child.material)) {
                child.material.forEach((material, index) => {
                    if (['Pamant'].includes(material.name)) {
                        child.material[index] = new THREE.MeshBasicMaterial({
                            color: backgroundColor,
                            emissive: 0xf0f0f0,
                            map: null,
                            side: THREE.FrontSide
                        });
                    }
                });
            } else {
                if (['Pamant'].includes(child.material.name)) {
                    child.material = new THREE.MeshBasicMaterial({
                        color: backgroundColor,
                        emissive: 0xf0f0f0,
                        map: null,
                        side: THREE.FrontSide
                    });
                }
            }
        }
    });


    // Add a rotating animation to the model
    const rotationSpeed = 0.0025; // Control the speed of the rotation
    function animate() {
        requestAnimationFrame(animate);
        
        // Rotate the entire scene or the specific model object (gltf.scene)
        gltf.scene.rotation.y += rotationSpeed; // Rotating around the Y-axis

        controls.update();
        renderer.render(scene, camera);
    }
 animate();
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

 
    // Tests
console.log(container.height, container.width)
console.log(model)


// Function to update the aspect ratio and camera projection on window resize
function onWindowResize() {
    width = container.clientWidth;
    height = container.clientHeight;

    // Update camera aspect ratio and projection matrix
    camera.aspect = width / height;
    camera.updateProjectionMatrix();

    // Update renderer size
    renderer.setSize(width, height);
}


// Show PDF function
function showPDF(pdfFile) {
    // Hide 3D container and show PDF container
    document.getElementById('axo').classList.remove('active');
    document.getElementById('pdf-viewer').src = pdfFile;
    document.querySelector('.pdf-container').classList.add('active');
}

// Toggle 3D function
function toggle3D() {
    // Hide PDF container and show 3D container
    document.querySelector('.pdf-container').classList.remove('active');
    document.getElementById('pdf-viewer').src = '';
    document.getElementById('axo').classList.add('active');
}

// Initially, disable both, and load 3D view
window.onload = function() {
    toggle3D();
};

// Animation loop
function animate() {
    requestAnimationFrame(animate);
    controls.update();
    renderer.render(scene, camera);
}
animate();