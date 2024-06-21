//import './style.css'
//import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.165.0/build/three.module.js'
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { TextGeometry } from 'three/addons/geometries/TextGeometry.js';
import { FontLoader } from 'three/addons/loaders/FontLoader.js';
import { DRACOLoader } from 'three/addons/loaders/DRACOLoader.js';
import { OBJLoader } from 'three/addons/loaders/OBJLoader.js';

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
const gltfloader = new GLTFLoader();
const dracoLoader = new DRACOLoader();
const textureloader = new THREE.TextureLoader();
const objloader = new OBJLoader();

const geometry = new THREE.BoxGeometry( 1, 1, 1 );
const material = new THREE.MeshStandardMaterial( { color: 0x420420 } ); //MeshBasicMaterial = no Light interaction, MeshStandardMaterial = light interaction
const cube = new THREE.Mesh( geometry, material );
cube.position.y = 2;
scene.add( cube );

const pointLight = new THREE.PointLight(0xffffff);
pointLight.position.set(3,2,3);
pointLight.power = 10000;

const ambientLight = new THREE.AmbientLight(0xffffff);
ambientLight.power = 1000;

//const directionalLight = new THREE.DirectionalLight(0xffffff);
//directionalLight.power = 1000;

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

const worldMap = new THREE.TextureLoader().load('assets/AtmosEarth.png');

function addBG(){
  const geometry = new THREE.SphereGeometry(30,24,24);
  var material = new THREE.MeshBasicMaterial({map: worldMap, side: THREE.BackSide})
  const worldBg = new THREE.Mesh(geometry, material);
  scene.add(worldBg);
}

addBG();

const loader = new FontLoader();

loader.load( 'assets/helvetiker_regular.typeface.json', function ( font ) {

	const textGeometry = new TextGeometry( 'B j o r n  M a r t e n s', {
		font: font,
		size: 1,
		depth: 0.2,
		curveSegments: 12,
		bevelEnabled: true,
		bevelThickness: 0.2,
		bevelSize: 0.2,
		bevelOffset: 0,
		bevelSegments: 10
	} );

  var textMaterial = new THREE.MeshStandardMaterial({ color: 0xff0000 });
  var mesh = new THREE.Mesh(textGeometry, textMaterial);

  //scene.add(mesh);
} );


dracoLoader.setDecoderPath( '/examples/jsm/libs/draco/' );
gltfloader.setDRACOLoader( dracoLoader );

/*// Load a glTF resource
gltfloader.load(
	// resource URL
	'assets/text.glb',
	// called when the resource is loaded
	function ( gltf ) {

		scene.add( gltf.scene );

		gltf.animations; // Array<THREE.AnimationClip>
		gltf.scene; // THREE.Group
		gltf.scenes; // Array<THREE.Group>
		gltf.cameras; // Array<THREE.Camera>
		gltf.asset; // Object

	},
	// called while loading is progressing
	function ( xhr ) {

		console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );

	},
	// called when loading has errors
	function ( error ) {

		console.log( 'An error happened' );

	}
);*/

/*objloader.load('assets/magmaball.obj', (object) => {
	//create material from textures
	const material = new THREE.MeshPhongMaterial({
		map: textureloader.load("assets/Material/Diffuse.png"),
		emissiveMap: textureloader.load("assets/Material/Emmit.png"),
		normalMap: textureloader.load("assets/Material/Normal.png"),
		emissiveIntensity: 1.0
		
	});

	// For any meshes in the model, add our material.
	object.traverse( function ( node ) {

		if ( node.isMesh ) node.material = material;
	
	  } );

	scene.add(object);
  });*/

gltfloader.load('assets/magmaball.glb', (gltf) => {

	const model = gltf.scene;
  	//const mesh = model.children[0].geometry;

	//create material from textures
	const material = new THREE.MeshPhongMaterial({
		emissiveMap: textureloader.load("assets/Material/Emmit.png"),
		map: textureloader.load("assets/Material/Diffuse.png"),
		normalMap: textureloader.load("assets/Material/Normal.png"),
		emissiveIntensity: 10.0,
		reflectivity: 1,
		normalScale: new THREE.Vector2(1,1),
	});

	model.traverse(function (child) {

		if (child.isMesh) {

			child.material = material;

		}

	});

	/*// For any meshes in the model, add our material.
	object.traverse( function ( node ) {
		if ( node.isMesh ) node.material = material;
	});*/
	//mesh.material = material;
	
	scene.add(model);
});

/*/ Load the GLTF model
const loader = new THREE.GLTFLoader();
loader.load('model.gltf', (gltf) => {
  const model = gltf.scene;
  const mesh = model.children[0].geometry;
  const texture = new THREE.TextureLoader().load('texture.png');
  const material = new THREE.MeshBasicMaterial({ map: texture });
  mesh.material = material;
});*/

function animate(){
  requestAnimationFrame(animate);

  cube.rotation.x += 0.01;
  cube.rotation.y += 0.01;
  

  renderer.render(scene, camera);
}

animate();