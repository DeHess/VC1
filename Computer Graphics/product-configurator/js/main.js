import * as THREE from "https://cdn.skypack.dev/three@0.129.0/build/three.module.js";
import { OrbitControls } from "https://cdn.skypack.dev/three@0.129.0/examples/jsm/controls/OrbitControls.js";
import { GLTFLoader } from "https://cdn.skypack.dev/three@0.129.0/examples/jsm/loaders/GLTFLoader.js";

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 2;
camera.position.y = 2;

let carModel;

const loader = new GLTFLoader();
loader.load(
  `/models/car.glb`,
  function (gltf) {
    carModel = gltf.scene;
    scene.add(carModel);

    let rimz = scene.getObjectByName("rimz")
    let tires = scene.getObjectByName("tires")
    let lights = scene.getObjectByName("lights")
    let wipers = scene.getObjectByName("wipers")
    let windows = scene.getObjectByName("windows")
    let seats1 = scene.getObjectByName("seats1")
    let seats2 = scene.getObjectByName("seats2")

    let body = scene.getObjectByName("body")
    let upperbody = scene.getObjectByName("upperbody")

    console.log(body.material.color)

    let controls = {
        toggleWheelVisibility: function() {
          rimz.visible = !rimz.visible
          tires.visible = !tires.visible
        },
        toggleSeatsVisibility: function() {
          seats1.visible = !seats1.visible
          seats2.visible = !seats2.visible
        },
        toggleWiperVisibility: function() {
          wipers.visible = !wipers.visible
        },
        toggleWindowVisibility: function() {
          windows.visible = !windows.visible
        },
        toggleLightsVisibility: function() {
          lights.visible = !lights.visible
        }
    }

    const colorController = {
      upperColor: `#${upperbody.material.color.getHexString()}`,
      lowerColor: `#${body.material.color.getHexString()}`
    }


    const gui = new dat.GUI()
    gui.add(controls, 'toggleWheelVisibility').name('Toggle Wheels')
    gui.add(controls, 'toggleSeatsVisibility').name('Toggle Seats')
    gui.add(controls, 'toggleWiperVisibility').name('Toggle Wipers')
    gui.add(controls, 'toggleWindowVisibility').name('Toggle Windows')
    gui.add(controls, 'toggleLightsVisibility').name('Toggle Lights')
    gui.addColor(colorController, 'upperColor').name('Upper Chassis').onChange((value) => {upperbody.material.color.set(value)})
    gui.addColor(colorController, 'lowerColor').name('Lower Chassis').onChange((value) => {body.material.color.set(value)})
  
  },
  function (error) {
    console.error(error);
  }
);

const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true }); 
renderer.setSize(window.innerWidth, window.innerHeight);
document.getElementById("container3D").appendChild(renderer.domElement);

const topLight = new THREE.DirectionalLight(0xffffff, 1);
topLight.position.set(500, 500, 500)
scene.add(topLight);

const ambientLight = new THREE.AmbientLight(0x333333, 5);
scene.add(ambientLight);

let controls;
controls = new OrbitControls(camera, renderer.domElement);

window.addEventListener("resize", function () {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
}

animate();
