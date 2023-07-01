import './main.css'
import * as THREE from 'three'
import { three } from 'trzy'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { PCDLoader } from 'three/examples/jsm/loaders/PCDLoader'
import Inspector from 'three-inspect'

const { scene, camera, renderer } = three({ parameters: { antialias: true }})

new Inspector({
  scene,
  camera: camera.current as THREE.PerspectiveCamera,
  renderer
})

const controls = new OrbitControls(camera.current, renderer.domElement)
const loader = new PCDLoader()

const dropZone = document.querySelector('#drop-zone')!

camera.current.position.set(1, 1, 1)

// addEventListener("dragstart", (event) => console.log('start', event))

// prevent default to allow drop
addEventListener('dragenter', (event) => event.preventDefault())

// prevent default to allow drop
addEventListener("dragover", (event) => event.preventDefault())

addEventListener('drop', (event) => {
  event.preventDefault()

  const reader = new FileReader()

  reader.addEventListener('load', (event) => {
    const points = loader.parse(event.target!.result!)

    scene.add(points)

    dropZone.remove()
  })

  reader.readAsArrayBuffer((event as any).dataTransfer.files[0])
})

controls.update()
