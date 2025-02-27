import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { DragControls } from 'three/examples/jsm/controls/DragControls.js';

const scene = new THREE.Scene();
scene.background = new THREE.Color(0xa0a0a0);

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 5000);
camera.position.set(0, 5, 10);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.05;

const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
scene.add(ambientLight);

const sunlight = new THREE.DirectionalLight(0xffffff, 0.5);
sunlight.position.set(5, 10, 5);
scene.add(sunlight);

const loader = new GLTFLoader();
let currentModel = null;

const models = {
    basketball: '/models/scene.gltf',
    tennis: '/models/tenniscourt.gltf',
    bench: '/models/bench.gltf',
};

function loadModel(path) {
    console.log(`Loading model from: ${path}`);
    if (currentModel) {
        scene.remove(currentModel);
        currentModel = null;
    }

    loader.load(
        path,
        (gltf) => {
            currentModel = gltf.scene;
            scene.add(currentModel);
            console.log(`Model loaded: ${path}`);
        },
        undefined,
        (error) => {
            console.error(`Failed to load model at ${path}:`, error);
        }
    );
}

function addDraggableBench() {
    console.log("Adding bench model...");
    loader.load(
        models.bench,
        (gltf) => {
            const bench = gltf.scene.clone();
            bench.position.set(0, 0, 0);
            scene.add(bench);

            const dragControls = new DragControls([bench], camera, renderer.domElement);

            dragControls.addEventListener('dragstart', () => {
                controls.enabled = false; // Disable orbit controls during drag
            });

            dragControls.addEventListener('dragend', () => {
                controls.enabled = true; // Re-enable orbit controls after drag
            });

            console.log("Bench added and made draggable.");
        },
        undefined,
        (error) => {
            console.error("Failed to load bench model:", error);
        }
    );
}

document.getElementById('basketball').addEventListener('click', () => loadModel(models.basketball));
document.getElementById('tennis').addEventListener('click', () => loadModel(models.tennis));
document.getElementById('add-bench').addEventListener('click', () => addDraggableBench());

document.getElementById('change-color').addEventListener('click', () => {
    if (currentModel) {
        currentModel.traverse((child) => {
            if (child.isMesh) {
                child.material.color.set(Math.random() * 0xffffff);
            }
        });
        console.log("Court color changed.");
    } else {
        console.warn("No model loaded to change color.");
    }
});

window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

function animate() {
    requestAnimationFrame(animate);
    controls.update();
    renderer.render(scene, camera);
}
animate();
