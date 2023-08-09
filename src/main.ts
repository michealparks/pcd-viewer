import './main.css'
import * as THREE from 'three'
import { useTrzy, MouseRaycaster, ViewHelper } from 'trzy'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { PCDLoader } from 'three/examples/jsm/loaders/PCDLoader'
import Inspector from 'three-inspect'
import { useBvhRaycast } from './hooks/use-bvh-raycast'

const { scene, camera, renderer } = useTrzy()

useBvhRaycast({
  firstHitOnly: true,
  maxDepth: 100,
})

localStorage.setItem('three-inspect.grid', 'true')
localStorage.setItem('three-inspect.axes', 'true')

new Inspector({
  scene,
  camera: camera.current as THREE.PerspectiveCamera,
  renderer
})

new ViewHelper(camera.current, renderer)

const raycaster = new MouseRaycaster({
  camera: camera.current,
  target: renderer.domElement,
})

const controls = new OrbitControls(camera.current, renderer.domElement)
const loader = new PCDLoader()

const dropZone = document.querySelector('#drop-zone')!

camera.current.position.set(1, 1, 1)

const div = document.createElement('div')
div.style.cssText = `
  position: absolute;
  bottom: 1rem;
  left: 1rem;
  z-index: 100;
  color: white;
`
document.body.append(div)

const handleMove = (event) => {
  const [intersection] = event.intersections as THREE.Intersection[]

  console.log(intersection)
  if (!intersection) {
    return
  }

  const { point } = intersection

  div.innerHTML = `${point.x.toFixed(4)}, ${point.y.toFixed(4)}, ${point.z.toFixed(4)}`
}

raycaster.addEventListener('move', handleMove)

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
    raycaster.objects = [points]

    dropZone.remove()
  })

  reader.readAsArrayBuffer((event as any).dataTransfer.files[0])
})

controls.update()
