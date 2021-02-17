import "./style.css";
import * as THREE from "three";
import gsap from "gsap";
const canvas = document.querySelector(".webgl");
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import * as dat from "dat.gui";

const gui = new dat.GUI();
const parameters = {
  color: "#00FFFF",
  spin: () => {
    gsap.to(mesh.rotation, { y: mesh.rotation.y + 10, duration: 1 });
  },
};

gui
  .addColor(parameters, "color")
  .onChange(() => material.color.set(parameters.color));

gui.add(parameters, "spin");

// Mouse Coords
const cursor = {
  x: 0,
  y: 0,
};
window.addEventListener("mousemove", (e) => {
  cursor.x = e.clientX / sizes.width - 0.5;
  cursor.y = -(e.clientY / sizes.height - 0.5);
});

// Scene
const scene = new THREE.Scene();

// Objects
const geometry = new THREE.BoxGeometry(0.7, 0.7, 0.7);
const material = new THREE.MeshBasicMaterial({ color: parameters.color });
const mesh = new THREE.Mesh(geometry, material);
mesh.visible = true;
scene.add(mesh);

gui.add(mesh.position, "y", -3, 3, 0.01).name("Elevation");
gui.add(mesh, "visible");
gui.add(material, "wireframe");

// Axes helper
const axeshelper = new THREE.AxesHelper();
scene.add(axeshelper);

// Sizes
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

window.addEventListener("resize", () => {
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

window.addEventListener("dblclick", (e) => {
  const fullscreenElement =
    document.fullscreenElement || document.webkitFullscreenElement;

  if (!fullscreenElement) {
    if (canvas.requestFullscreen) {
      canvas.requestFullscreen();
    } else if (canvas.webkitRequestFullscreen) {
      canvas.webkitRequestFullscreen();
    }
  } else {
    if (document.exitFullscreen) {
      document.exitFullscreen();
    } else if (document.webkitExitFullscreen) {
      document.webkitExitFullscreen();
    }
  }
});

// Camera
const camera = new THREE.PerspectiveCamera(
  75,
  sizes.width / sizes.height,
  0.1,
  100
);
camera.position.z = 3;
scene.add(camera);

const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

camera.lookAt(mesh.position);

// Renderer
const renderer = new THREE.WebGLRenderer({
  canvas,
});

renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

// Animations
function tick() {
  controls.update();

  renderer.render(scene, camera);
  window.requestAnimationFrame(tick);
}

tick();
