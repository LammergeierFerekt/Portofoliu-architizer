import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

class ImportedObject {
    constructor(url, mixer, animationIndex, loopType) {
        this.url = url;
        this.mixer = mixer;
        this.animationIndex = animationIndex;
        this.loopType = loopType;
    }

    // Method to load the GLTF file
    load() {
        const loader = new GLTFLoader();
        loader.load(
            this.url,  // Path to your GLTF file
            (glb) => {
                // Handle the loaded GLTF model
                const mesh = glb.scene;  // The 3D model
                scene.add(mesh);  // Add the mesh to the scene
                
                // Handle animations
                const animationsClips = glb.animations;
                this.mixer = new THREE.AnimationMixer(mesh);  // Create the mixer for the mesh
                const meshAction = this.mixer.clipAction(animationsClips[this.animationIndex]);  // Get the animation based on index
                meshAction.setLoop(this.loopType);  // Set the loop type
                meshAction.play();  // Play the animation
            },
            (xhr) => {
                console.log((xhr.loaded / xhr.total * 100) + '% loaded');  // Show the progress
            },
            (error) => {
                console.log("Error loading model:", error);  // Handle error
            }
        );
    }
}

export { ImportedObject };
