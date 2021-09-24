const socket = io('ws://localhost:8080')

//Receive a message
//socket.on('message', text => {
//    console.log(text)
//});

//Send a message
//socket.emit('message', text)

//Init Scene
const viewport = document.getElementById('viewport')
const scene = new THREE.Scene()
const camera = new THREE.PerspectiveCamera( 90, viewport.offsetWidth / viewport.offsetHeight, 0.1, 1000 )
const renderer = new THREE.WebGLRenderer()
const clock = new THREE.Clock()
renderer.setSize(viewport.offsetWidth, viewport.offsetHeight)
viewport.appendChild(renderer.domElement)

//Create a cube
const geometry = new THREE.BoxGeometry()
const material = new THREE.MeshPhongMaterial({
    color: 0xFF0000,
    flatShading: true,
})

const cube = new THREE.Mesh( geometry, material )
scene.add( cube )

//Lighting
const ambientLight = new THREE.AmbientLight( 0x404040 )
scene.add( ambientLight )

const pointLight = new THREE.PointLight( 0xffffff, 10, 100 )
pointLight.position.set( 50, 50, 50 )
scene.add( pointLight )

//Set Camera Position
camera.position.y = 5
camera.rotation.x = -Math.PI / 2

let mouseX = 0
let mouseY = 0
let mouseDown = false
let mouseScroll = 0

//Setup input
document.addEventListener('mousemove', event => {
    mouseX += event.movementX
    mouseY += event.movementY
})

document.addEventListener('mousedown', event => {
    mouseDown = true
})

document.addEventListener('mouseup', event => {
    mouseDown = false
})

document.addEventListener("wheel", event => {
    mouseScroll = event.deltaY
});

function resetInput(){
    mouseX = 0
    mouseY = 0
    mouseScroll = 0
}  

//Render Loop
function render() {
	requestAnimationFrame( render )
	renderer.render( scene, camera )

    let delta = clock.getDelta()

    //cube.rotation.x += 1 * delta;
    //cube.rotation.y += 1 * delta;

    if(mouseScroll != 0){
        camera.position.y += mouseScroll / 102
    }

    if(mouseDown){
        camera.position.x += -mouseX * delta
        camera.position.z += -mouseY * delta
    }

    input = resetInput()
}

render()