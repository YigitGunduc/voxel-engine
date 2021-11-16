import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import Stats from 'three/examples/jsm/libs/stats.module'
//import { GUI } from 'three/examples/jsm/libs/dat.gui.module'

// CONSTANTS
const FOV = 75;
const X_MAX = 128;
const Y_MAX = 128;
const TREES = true;
const MAX_HEIGHT = 12;
const view_distance = 1024;
const WIDTH = window.innerWidth;
const HEIGHT = window.innerHeight;
const aspectRatio = WIDTH / HEIGHT;
const noise = new Noise(Math.random());

// SCENE and RENDERER INIT
const scene = new THREE.Scene()
scene.background = new THREE.Color(0x87ceeb);
const renderer = new THREE.WebGLRenderer({antialias: true});
renderer.setSize(window.innerWidth,window.innerHeight);
document.body.appendChild(renderer.domElement)

// LIGHTING
const light = new THREE.AmbientLight(0x404040); 
const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
scene.add(light);
scene.add(directionalLight);

// Textures
const snowTexture = new THREE.TextureLoader().load('textures/snow/snowTexture.png');
const waterTexture = new THREE.TextureLoader().load('textures/water/waterTexture.jpg');
const grassTexture = new THREE.TextureLoader().load('textures/grass/grassUpFace.jpg');

// CAMERA AND CONTROLS
const camera = new THREE.PerspectiveCamera(FOV, aspectRatio, 0.1, view_distance);
const controls = new OrbitControls(camera, renderer.domElement);
controls.update();

camera.position.z = Y_MAX / 2;
camera.position.x = X_MAX / 2;
camera.position.y = MAX_HEIGHT;
camera.lookAt((X_MAX / 2), (Y_MAX / 2), MAX_HEIGHT);

function addVoxel(posx, posy, posz, color) {
  var geometry = new THREE.BoxGeometry(1, 1, 1);
  var material = new THREE.MeshLambertMaterial( {color: color} );
  var cube = new THREE.Mesh(geometry,material);
  cube.position.set(posx, posy, posz)
  scene.add(cube);

  return;
}

function addTree(x, height, y) {

  height = height -1;

  addVoxel(x, height + 1 , y, 0x964B00);
  addVoxel(x, height + 2, y,  0x964B00);
  addVoxel(x, height + 3, y,  0x964B00);
  addVoxel(x, height + 4, y,  0x964B00);
  addVoxel(x + 1, height + 5, y,  0x2D5A27);
  addVoxel(x + 2, height + 5, y,  0x2D5A27);
  addVoxel(x + 1, height + 5, y + 1,  0x2D5A27);
  addVoxel(x - 1, height + 5, y - 1,  0x2D5A27);
  addVoxel(x - 1, height + 5, y + 1,  0x2D5A27);
  addVoxel(x + 1, height + 5, y - 1,  0x2D5A27);
  addVoxel(x - 1, height + 5, y,  0x2D5A27);
  addVoxel(x - 2, height + 5, y,  0x2D5A27);
  addVoxel(x, height + 5, y + 1,  0x2D5A27);
  addVoxel(x, height + 5, y + 2,  0x2D5A27);
  addVoxel(x, height + 5, y - 1,  0x2D5A27);
  addVoxel(x, height + 5, y - 2,  0x2D5A27);
  addVoxel(x, height + 6, y,  0x2D5A27);

}

function generatePerlinNoise2D(x, y, max_height=8) {
  var value = noise.simplex2(x / 50, y / 50);
  value = value * max_height;
  value = Math.floor(value);

  return value

}

function generateTerrain() {
  for(let x = -(X_MAX / 2); x < (X_MAX / 2); x++) {
    for(let y = -(Y_MAX / 2); y < (Y_MAX / 2); y++) {

      let height = generatePerlinNoise2D(x, y, MAX_HEIGHT);

      if(height >= 6) {
        let color = 0xffffff;
        addVoxel(x, height, y, color);
      } else if (height < -4) {
        let color = 0x0000ff;
        addVoxel(x, -4, y, color);
      } else { 
        let color = 0x00ff00;
        if (TREES) {
          if (Math.random() > 0.996) {
          addTree(x, height, y)
          }
        }
        addVoxel(x, height, y, color);
      }
    }
  }
}

function render() {
  renderer.render(scene,camera);
  requestAnimationFrame(render);
  controls.update();
}


generateTerrain();

render();
