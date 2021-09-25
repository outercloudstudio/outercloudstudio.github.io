/*
addToScene(scene){
        let geometry = null
        let material = null
        let object = null

        if(this.builder == "cube"){
            geometry = new THREE.BoxGeometry(this.sx, this.sy, this.sz);

            material = new THREE.MeshPhongMaterial({
                color: 0xFFFFFF,
                flatShading: true,
            })

            object = new THREE.Mesh(geometry, material);
        }

        scene.add(object)
    }
*/

class Remote3DObject{
    constructor(object, builder, x = 0, y = 0, z = 0, rx = 0, ry = 0, rz = 0, sx = 1, sy = 1, sz = 1){
        if(object != null){
            this.builder = object.builder;
            this.x = object.x;
            this.y = object.y;
            this.z = object.z;
            this.rx = object.rx;
            this.ry = object.ry;
            this.rz = object.rz;
            this.sx = object.sx;
            this.sy = object.sy;
            this.sz = object.sz;
            this.ID = object.ID;
        }else{
            this.builder = builder;
            this.x = x;
            this.y = y;
            this.z = z;
            this.rx = rx;
            this.ry = ry;
            this.rz = rz;
            this.sx = sx;
            this.sy = sy;
            this.sz = sz;
            this.ID = uuidv4();
        }
    }

    toObject(){
        return {
            builder: this.builder,
            x: this.x,
            y: this.y,
            z: this.z,
            rx: this.rx,
            ry: this.ry,
            rz: this.rz,
            sx: this.sx,
            sy: this.sy,
            sz: this.sz,
            ID: this.ID
        }
    }

    addToScene(scene){
        if(this.object3D == null){
            let geometry = null
            let material = null
            this.object3D = null

            if(this.builder == "cube"){
                geometry = new THREE.BoxGeometry(this.sx, this.sy, this.sz);

                material = new THREE.MeshPhongMaterial({
                    color: 0xFFFFFF,
                    flatShading: true,
                })

                this.object3D = new THREE.Mesh(geometry, material);
            }

            this.object3D.position.set(this.x, this.y, this.z);
            this.object3D.rotation.set(this.rx, this.ry, this.rz);

            scene.add(this.object3D)
        }
    }

    update(object){
        if(object != null){
            this.x = object.x;
            this.y = object.y;
            this.z = object.z;
            this.rx = object.rx;
            this.ry = object.ry;
            this.rz = object.rz;
            this.sx = object.sx;
            this.sy = object.sy;
            this.sz = object.sz;
        }

        if(this.object3D != null){
            this.object3D.position.set(this.x, this.y, this.z);
            this.object3D.rotation.set(this.rx, this.ry, this.rz);
            this.object3D.scale.set(this.sx, this.sy, this.sz);
        }
    }
}

const socket = io('ws://localhost:8080')

const joiningRoomElement = document.getElementById('joining-room')

const inventoryButton = document.getElementById('inventory-button')
const inventory = document.getElementById('inventory')

const inventoryAddButton = document.getElementById('inventory-add-button')
const inventoryList = document.getElementById('inventory-list')
const inventoryListItemTemplate = document.getElementById('inventory-item-template')

const statsButton = document.getElementById('stats-button')
const stats = document.getElementById('stats')

const strValue = document.getElementById('str-value')
const dexValue = document.getElementById('dex-value')

const strModifier = document.getElementById('str-modifier')
const dexModifier = document.getElementById('dex-modifier')

let currentData = null

let isDM = false

let remote3DObjects = []

function randomIntFromInterval(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min)
  }

function updatePlayerData(){
    let inventory = []

    for (let i = 0; i < inventoryList.children.length; i++) {
        inventory.push({
            name: inventoryList.children[i].children[0].value,
            note: inventoryList.children[i].children[1].value,
        })
    }
    
    let data = {
        inventory: inventory,
        stats: {
            str: strValue.value,
            dex: dexValue.value,
        }
    }

    socket.emit('update-player-data', data)
}

function updateInventory(){
    for(let i = 0; i <inventoryList.children.length; i = 0){
        inventoryList.removeChild(inventoryList.children[0])
    }

    for(let i = 0; i < currentData.player.inventory.length; i++){
        let newElement = inventoryListItemTemplate.cloneNode(true)
        newElement.removeAttribute('id')

        newElement.children[0].addEventListener('change', event => {
            currentData.player.inventory[i].name = event.target.parentNode.children[0].value
            
            updatePlayerData()
        })
    
        newElement.children[1].addEventListener('change', event => {
            currentData.player.inventory[i].note = event.target.parentNode.children[1].value
            
            updatePlayerData()
        })

        newElement.children[2].addEventListener('click', event => {
            console.log(i)
            
            currentData.player.inventory.splice(i, 1)

            event.target.parentNode.parentNode.remove()

            updatePlayerData()
            updateInventory()
        })

        newElement.children[0].value = currentData.player.inventory[i].name
        newElement.children[1].value = currentData.player.inventory[i].note

        inventoryList.appendChild(newElement)
    }
}

function updateUI(){
    if(currentData != null){
        let strMod = Math.floor((strValue.value - 10) / 2)
        strModifier.innerHTML = strMod

        if(strMod >= 0){
            strModifier.innerHTML = '+' + strMod.toString()
        }

        let dexMod = Math.floor((dexValue.value - 10) / 2)
        dexModifier.innerHTML = dexMod

        if(dexMod >= 0){
            dexModifier.innerHTML = '+' + dexMod.toString()
        }

        strValue.value = currentData.player.stats.str
        dexValue.value = currentData.player.stats.dex
    }
}

function closeAllWindows(){
    if(inventory.classList.contains('open')) {
        inventory.classList.remove('open')
    }

    if(stats.classList.contains('open')) {
        stats.classList.remove('open')
    }
}

inventoryButton.addEventListener('click', () => {
    if(inventory.classList.contains('open')) {
        closeAllWindows()
    }else{
        closeAllWindows()

        inventory.classList.add('open')
    }
})

statsButton.addEventListener('click', () => {
    if(stats.classList.contains('open')) {
        closeAllWindows()
    }else{
        closeAllWindows()

        stats.classList.add('open')
    }
})

inventoryAddButton.addEventListener('click', () => {
    currentData.player.inventory.push({
        name: '',
        note: '',
    })

    updateInventory()
})

strValue.addEventListener('change', event => {
    updatePlayerData()
    updateModifiers()
})

dexValue.addEventListener('change', event => {
    updatePlayerData()
    updateModifiers()
})

//Init Scene
const viewport = document.getElementById('viewport')
const scene = new THREE.Scene()
const camera = new THREE.PerspectiveCamera( 90, viewport.offsetWidth / viewport.offsetHeight, 0.1, 1000 )
const renderer = new THREE.WebGLRenderer()
const clock = new THREE.Clock()
renderer.setSize(viewport.offsetWidth, viewport.offsetHeight)
viewport.appendChild(renderer.domElement)

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
viewport.addEventListener('mousemove', event => {
    mouseX += event.movementX
    mouseY += event.movementY
})

viewport.addEventListener('mousedown', event => {
    mouseDown = true
})

viewport.addEventListener('mouseup', event => {
    mouseDown = false
})

viewport.addEventListener("wheel", event => {
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

    if(mouseScroll != 0){
        camera.position.y += mouseScroll / 102

        if(camera.position.y < 5){
            camera.position.y = 5
        }

        if(camera.position.y > 20){
            camera.position.y = 20
        }
    }

    if(mouseDown){
        camera.position.x += -mouseX * delta * camera.position.y / viewport.offsetWidth * 192
        camera.position.z += -mouseY * delta * camera.position.y / viewport.offsetHeight * 108
    }

    //if(remote3DObjects.length > 0){
        //remote3DObjects[0].x += randomIntFromInterval(-1, 1) * delta
        //remote3DObjects[0].update(null)
        //socket.emit('update-remote', remote3DObjects[0].toObject())
    //}

    input = resetInput()

    updateUI()
}

socket.on('request-auth', authID => {
    console.log('Requested auth')

    if(localStorage.getItem('ID') == null){
        console.log('No auth found')
        socket.emit('send-auth', {auth: authID, proposed: 'Guest'})
    }else{
        console.log('Found auth: ' + localStorage.getItem('ID'))
        socket.emit('send-auth', {auth: authID, proposed: localStorage.getItem('ID')})
    }
});

socket.on('accepted-auth', authID => {
    console.log('Accepted auth!')

    socket.emit('join-room')
});

socket.on('new-user-accepted-auth', authID => {
    console.log('Accepted auth as new user!')

    localStorage.setItem('ID', authID)

    //Go to character creation
    let playerData = {
        inventory: [
            {
                name: 'Sword',
                note: 'A sword that can cut through the air.',
            },
            {
                name: 'Shield',
                note: 'A shield that can block incoming attacks.',
            },
            {
                name: 'Health Potion',
                note: 'A potion that can restore health.',
            },
            {   
                name: 'Mana Potion',
                note: 'A potion that can restore mana.',
            },
            {
                name: 'Gold',
                note: 'A bag of gold.',
            },
            {
                name: 'Wood',
                note: 'A bag of wood.',
            }
        ],
        stats:{
            str: 10,
            dex: 10,
            con: 10,
        }
    }

    socket.emit('created-character', playerData)
});

socket.on('joined-room', roomData => {
    console.log('Joined room!')

    joiningRoomElement.classList.add('joined')

    //load player data
    currentData = roomData

    isDM = roomData.gameData.DMID == localStorage.getItem('ID')

    if(isDM){
        console.log('This is the DM!')

        inventoryButton.remove()
        statsButton.remove()
    }

    updateInventory()
});

socket.on('create-remote-3D-object', object => {
    console.log(object)
    console.log('Creating 3D object with builder: ' + object.builder)

    remote3DObjects.push(new Remote3DObject(object))

    remote3DObjects[remote3DObjects.length - 1].addToScene(scene)
})

socket.on('update-remotes', remotes => {
    console.log('Updating remotes')

    for(let i = 0; i < remote3DObjects.length; i++){
        let remote = remotes.find(remote => remote.ID == remote3DObjects[i].ID)

        if(remote != null){
            remote3DObjects[i].update(remote)
        }
    }
})

render()