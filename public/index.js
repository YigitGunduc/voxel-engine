import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'

// CONSTANTS
const FOV = 75;
const X_MAX = 128;
const Y_MAX = 128;
const TREES = true;
const SEA_LEVEL = -10;
const SNOW_LEVEL = 16;
const MAX_HEIGHT = 25;
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
//scene.add(light);
scene.add(directionalLight);

// Textures
const woodTexture = new THREE.TextureLoader().load('textures/wood/woodTexture.jpg');
const snowTexture = new THREE.TextureLoader().load('textures/snow/snowTexture.png');
const grassTexture = new THREE.TextureLoader().load('textures/grass/grassUpFace.jpg');
const darkGrassTexture = new THREE.TextureLoader().load('textures/grass/darkgrass.jpeg');
const waterTexture = new THREE.TextureLoader().load('textures/water/waterTexture.jpg');
const leaveTexture = new THREE.TextureLoader().load('textures/leaves/leaveTexture.png');
const sandTexture = new THREE.TextureLoader().load('textures/sand/sandTexture.png');


// CAMERA AND CONTROLS
const camera = new THREE.PerspectiveCamera(FOV, aspectRatio, 0.1, view_distance);
const controls = new OrbitControls(camera, renderer.domElement);
controls.update();

camera.position.z = Y_MAX / 2;
camera.position.x = X_MAX / 2;
camera.position.y = 30;
camera.lookAt((X_MAX / 2), (Y_MAX / 2), MAX_HEIGHT);

function addVoxel(posx, posy, posz, texture) {
  var geometry = new THREE.BoxGeometry(1, 1, 1);
  var material = new THREE.MeshLambertMaterial( {map: texture} );
  var cube = new THREE.Mesh(geometry,material);
  cube.position.set(posx, posy, posz)
  scene.add(cube);

  return;
}

function addNewTree(x, height, y) {

  height = height + 3;

  addVoxel(x, height - 1 , y, woodTexture);
  addVoxel(x, height - 2, y,  woodTexture);
  addVoxel(x, height - 3, y,  woodTexture);
    addVoxel(x, height , y,  woodTexture);

  addVoxel(x, height + 1 , y, woodTexture);
  addVoxel(x, height + 2, y,  woodTexture);
  addVoxel(x, height + 3, y,  woodTexture);

  addVoxel(x + 1, height + 3, y,  leaveTexture);
  addVoxel(x - 1, height + 3, y,  leaveTexture);
  addVoxel(x, height + 3, y + 1,  leaveTexture);
  addVoxel(x, height + 3, y - 1,  leaveTexture);

  addVoxel(x + 2, height + 3, y,  leaveTexture);
  addVoxel(x - 2, height + 3, y,  leaveTexture);
  addVoxel(x, height + 3, y + 2,  leaveTexture);
  addVoxel(x, height + 3, y - 2,  leaveTexture);

  addVoxel(x + 1, height + 3, y - 1,  leaveTexture);
  addVoxel(x - 1, height + 3, y + 1,  leaveTexture);
  addVoxel(x + 1, height + 3, y + 1,  leaveTexture);
  addVoxel(x - 1, height + 3, y - 1,  leaveTexture);

  addVoxel(x + 1, height + 4, y,  leaveTexture);
  addVoxel(x - 1, height + 4, y,  leaveTexture);
  addVoxel(x, height + 4, y + 1,  leaveTexture);
  addVoxel(x, height + 4, y - 1,  leaveTexture);

  addVoxel(x, height + 5, y,  leaveTexture);

  return;
}

function randomNum(min, max) {
    return Math.floor(Math.random() * (max - min)) + min; // You can remove the Math.floor if you don't want it to be an integer
  
}

function addTree(x, height, y) {

  height = height -1;

  addVoxel(x, height + 1 , y, woodTexture);
  addVoxel(x, height + 2, y,  woodTexture);
  addVoxel(x, height + 3, y,  woodTexture);
  addVoxel(x, height + 4, y,  woodTexture);
  addVoxel(x + 1, height + 5, y,  leaveTexture);
  addVoxel(x + 2, height + 5, y,  leaveTexture);
  addVoxel(x + 1, height + 5, y + 1,  leaveTexture);
  addVoxel(x - 1, height + 5, y - 1,  leaveTexture);
  addVoxel(x - 1, height + 5, y + 1,  leaveTexture);
  addVoxel(x + 1, height + 5, y - 1,  leaveTexture);
  addVoxel(x - 1, height + 5, y,  leaveTexture);
  addVoxel(x - 2, height + 5, y,  leaveTexture);
  addVoxel(x, height + 5, y + 1,  leaveTexture);
  addVoxel(x, height + 5, y + 2,  leaveTexture);
  addVoxel(x, height + 5, y - 1,  leaveTexture);
  addVoxel(x, height + 5, y - 2,  leaveTexture);
  addVoxel(x, height + 6, y,  leaveTexture);

  return;
}

function generatePerlinNoise2D(x, y, max_height) {
  var value = noise.simplex2(x / 125, y / 125);
  value = value * max_height;
  value = Math.floor(value);

  return value;
}

function generateTerrain() {
  for(let x = - (X_MAX / 2); x < (X_MAX / 2); x++) {
    for(let y = - (Y_MAX / 2); y < (Y_MAX / 2); y++) {

      let height = generatePerlinNoise2D(x, y, MAX_HEIGHT);

      if(height >= SNOW_LEVEL) {
        let texture = snowTexture;
        addVoxel(x, height, y, texture);
      } else if (height == SEA_LEVEL | (height - 1 == SEA_LEVEL)) {
        let texture = sandTexture;
        addVoxel(x, height, y, texture);
      } else if (height < SEA_LEVEL) {
        let texture = waterTexture;
        addVoxel(x, SEA_LEVEL, y, texture);
      } else { 
        let texture = grassTexture;
        if (TREES) {
          if (Math.random() > 0.97) {
            if (randomNum(0, 10) == 1) {
              addNewTree(x, height, y)
            } else {

              addTree(x, height, y);
            }
          }
        }
        if (randomNum(0, 5) == 1) {
          addVoxel(x, height, y, darkGrassTexture);
        } else {

          addVoxel(x, height, y, texture);
        }
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
