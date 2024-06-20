import './style.css'
import * as THREE from 'three';

import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 20, window.innerWidth / window.innerHeight, 0.1, 1000 );

const renderer = new THREE.WebGLRenderer({
  canvas: document.querySelector('#bg'),
});

renderer.setPixelRatio( window.devicePixelRatio );
renderer.setSize( window.innerWidth, window.innerHeight );
camera.position.setZ(30);
renderer.render( scene, camera );

const controls = new OrbitControls( camera, renderer.domElement );
const loader = new GLTFLoader();

const geometry = new THREE.BoxGeometry( 1, 1, 1 );
const material = new THREE.MeshStandardMaterial( { color: 0x420420 } ); //MeshBasicMaterial = no Light interaction, MeshStandardMaterial = light interaction
const cube = new THREE.Mesh( geometry, material );

scene.add( cube );

const pointLight = new THREE.PointLight(0xffffff);
pointLight.position.set(3,3,3);
pointLight.power = 10000;

const ambientLight = new THREE.AmbientLight(0xffffff);

scene.add(pointLight, ambientLight);

const lightHelper = new THREE.PointLightHelper(pointLight);
scene.add(lightHelper);

function addStar(){
  const geometry = new THREE.SphereGeometry(0.25, 24, 24);
  const material = new THREE.MeshStandardMaterial({color: 0xffffff});
  const star = new THREE.Mesh(geometry, material);

  const [x,y,z] = Array(3).fill().map(()=> THREE.MathUtils.randFloatSpread(100));

  star.position.set(x,y,z);
  scene.add(star);
}

Array(200).fill().forEach(addStar);

const worldMap = new THREE.TextureLoader().load('images/AtmosEarth.png');

function addBG(){
  const geometry = new THREE.SphereGeometry(30,24,24);
  var material = new THREE.MeshBasicMaterial({map: worldMap, side: THREE.BackSide})
  const worldBg = new THREE.Mesh(geometry, material);
  scene.add(worldBg);
}

addBG();

function animate(){
  requestAnimationFrame(animate);

  cube.rotation.x += 0.01;
  cube.rotation.y += 0.01;
  

  renderer.render(scene, camera);
}

animate();