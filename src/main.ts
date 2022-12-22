import './main.css'
import * as THREE from 'three'
import { scene, camera, renderer, run, composer, update } from 'three-kit'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { PCDLoader } from 'three/examples/jsm/loaders/PCDLoader'
import Inspector from 'three-inspect'

new Inspector(
  THREE,
  scene,
  camera,
  renderer,
  composer
)

scene.remove(camera.parent!)

const controls = new OrbitControls(camera, renderer.domElement)
const loader = new PCDLoader()

const dropZone = document.querySelector('#drop-zone')!

camera.position.set(1,1,1)

addEventListener("dragstart", (event) => {
  console.log('start', event)
})

addEventListener('dragenter', (event) => {
  // prevent default to allow drop
  event.preventDefault()
})

addEventListener("dragover", (event) => {
  // prevent default to allow drop
  event.preventDefault()
})

addEventListener('drop', (event) => {
  event.preventDefault()

  const reader = new FileReader();

  reader.addEventListener('load', (event) => {
    const points = loader.parse(event.target!.result!)

    scene.add(points)

    dropZone.remove()
  });

  reader.readAsArrayBuffer((event as any).dataTransfer.files[0])
})

run()
 
update(() => {
  controls.update()
})
