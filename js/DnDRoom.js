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
        this.dirty = false

        if(object != null){
            this.builder = object.builder
            this.x = object.x
            this.y = object.y
            this.z = object.z
            this.rx = object.rx
            this.ry = object.ry
            this.rz = object.rz
            this.sx = object.sx
            this.sy = object.sy
            this.sz = object.sz
            this.ID = object.ID
        }else{
            this.builder = builder
            this.x = x
            this.y = y
            this.z = z
            this.rx = rx
            this.ry = ry
            this.rz = rz
            this.sx = sx
            this.sy = sy
            this.sz = sz
            this.ID = uuidv4()
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
                geometry = new THREE.BoxGeometry(this.sx, this.sy, this.sz)

                material = new THREE.MeshPhongMaterial({
                    color: 0xFFFFFF,
                    flatShading: true,
                })

                //this.object3D = new THREE.Mesh(geometry, material);
                
				loader.load('./models/Human_Female_Barbarian.fbx', object =>{
                    this.object3D = object

                    this.object3D.position.set(0, 0, 0)
                    this.object3D.rotation.set(0, 0, 0)


                    this.object3D.position.set(this.x, this.y, this.z)
                    this.object3D.rotation.set(this.rx, this.ry, this.rz)

                    scene.add(this.object3D)
                })
            }
        }
    }

    update(object){
        if(object != null){
            this.x = object.x
            this.y = object.y
            this.z = object.z
            this.rx = object.rx
            this.ry = object.ry
            this.rz = object.rz
            this.sx = object.sx
            this.sy = object.sy
            this.sz = object.sz
        }

        if(this.object3D != null){
            this.object3D.position.set(this.x, this.y, this.z)
            this.object3D.rotation.set(this.rx, this.ry, this.rz)
            this.object3D.scale.set(this.sx, this.sy, this.sz)
        }
    }

    updateValues(){
        this.x = this.object3D.position.x
        this.y = this.object3D.position.y
        this.z = this.object3D.position.z
        this.rx = this.object3D.rotation.x
        this.ry = this.object3D.rotation.y
        this.rz = this.object3D.rotation.z
        this.sx = this.object3D.scale.x
        this.sy = this.object3D.scale.y
        this.sz = this.object3D.scale.z

        this.dirty = true
    }
}

//const socket = io('ws://76.86.240.158:25566')
//const socket = io('ws://192.168.1.101:25566')
const socket = io('ws://localhost:25566')
const loader = new THREE.FBXLoader();

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
const conValue = document.getElementById('con-value')
const intValue = document.getElementById('int-value')
const wisValue = document.getElementById('wis-value')
const chaValue = document.getElementById('cha-value')

const strModifier = document.getElementById('str-modifier')
const dexModifier = document.getElementById('dex-modifier')
const conModifier = document.getElementById('con-modifier')
const intModifier = document.getElementById('int-modifier')
const wisModifier = document.getElementById('wis-modifier')
const chaModifier = document.getElementById('cha-modifier')

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
            con: conValue.value,
            int: intValue.value,
            wis: wisValue.value,
            cha: chaValue.value,
        }
    }

    console.log(data)

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
            updateUI()
        })
    
        newElement.children[1].addEventListener('change', event => {
            currentData.player.inventory[i].note = event.target.parentNode.children[1].value
            
            updatePlayerData()
            updateUI()
        })

        newElement.children[2].addEventListener('click', event => {
            console.log(i)
            
            currentData.player.inventory.splice(i, 1)

            event.target.parentNode.parentNode.remove()

            updatePlayerData()
            updateInventory()
            updateUI()
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

        let conMod = Math.floor((conValue.value - 10) / 2)
        conModifier.innerHTML = conMod

        if(conMod >= 0){
            conModifier.innerHTML = '+' + conMod.toString()
        }

        let intMod = Math.floor((intValue.value - 10) / 2)
        intModifier.innerHTML = intMod

        if(intMod >= 0){
            intModifier.innerHTML = '+' + intMod.toString()
        }

        let wisMod = Math.floor((wisValue.value - 10) / 2)
        wisModifier.innerHTML = wisMod

        if(wisMod >= 0){
            wisModifier.innerHTML = '+' + wisMod.toString()
        }

        let chaMod = Math.floor((chaValue.value - 10) / 2)
        chaModifier.innerHTML = chaMod

        if(chaMod >= 0){
            chaModifier.innerHTML = '+' + chaMod.toString()
        }

        strValue.value = currentData.player.stats.str
        dexValue.value = currentData.player.stats.dex
        conValue.value = currentData.player.stats.con
        intValue.value = currentData.player.stats.int
        wisValue.value = currentData.player.stats.wis
        chaValue.value = currentData.player.stats.cha
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
    updateUI()
})

strValue.addEventListener('change', event => {
    currentData.player.stats.str = event.target.value

    updatePlayerData()
    updateUI()
})

dexValue.addEventListener('change', event => {
    currentData.player.stats.dex = event.target.value

    updatePlayerData()
    updateUI()
})

conValue.addEventListener('change', event => {
    currentData.player.stats.con = event.target.value

    updatePlayerData()
    updateUI()
})

intValue.addEventListener('change', event => {
    currentData.player.stats.int = event.target.value

    updatePlayerData()
    updateUI()
})

wisValue.addEventListener('change', event => {
    currentData.player.stats.wis = event.target.value

    updatePlayerData()
    updateUI()
})

chaValue.addEventListener('change', event => {
    currentData.player.stats.cha = event.target.value

    updatePlayerData()
    updateUI()
})

//Init Scene
const viewport = document.getElementById('viewport')
const scene = new THREE.Scene()
const camera = new THREE.PerspectiveCamera( 70, viewport.offsetWidth / viewport.offsetHeight, 0.1, 1000 )
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

const updatePS = 15
let timeTillUpdate = 1/updatePS

let mouseX = 0
let mouseY = 0
let mouseAbsX = 0
let mouseAbsY = 0
let mouseDown = false
let mouseScroll = 0
let selectedObject = null

//Setup input
viewport.addEventListener('mousemove', event => {
    mouseX += event.movementX
    mouseY += event.movementY

    mouseAbsX = event.clientX
    mouseAbsY = event.clientY
})

viewport.addEventListener('mousedown', event => {
    mouseDown = true
})

viewport.addEventListener('mouseup', event => {
    mouseDown = false
})

viewport.addEventListener('wheel', event => {
    mouseScroll = event.deltaY
});

viewport.addEventListener('contextmenu', event => {
    event.preventDefault()

    selectedObject = null
})

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

    timeTillUpdate -= delta

    if(timeTillUpdate <= 0){
        timeTillUpdate = 1/updatePS

        for(let i = 0; i < remote3DObjects.length; i++){
            if(remote3DObjects[i].dirty){
                socket.emit('update-remote', remote3DObjects[i].toObject())

                remote3DObjects[i].dirty = false
            }
        }
    }

    if(mouseScroll != 0){
        camera.position.y += mouseScroll / 102

        if(camera.position.y < 5){
            camera.position.y = 5
        }

        if(camera.position.y > 40){
            camera.position.y = 40
        }
    }

    if(mouseDown){

        if(selectedObject == null){
            const raycaster = new THREE.Raycaster()
            const mouse = new THREE.Vector2()

            mouse.x = (mouseAbsX / viewport.offsetWidth ) * 2 - 1
            mouse.y = -(mouseAbsY / viewport.offsetHeight ) * 2 + 1

            raycaster.setFromCamera( mouse, camera )

            const intersects = raycaster.intersectObjects(scene.children, true)
            
            if(intersects.length > 0){
                selectedObject = intersects[0].object
            }else{
                camera.position.x += -mouseX * delta * camera.position.y / 7
                camera.position.z += -mouseY * delta * camera.position.y / 7
            }
        }else{
            camera.position.x += -mouseX * delta * camera.position.y / 7
            camera.position.z += -mouseY * delta * camera.position.y / 7
        }
    }

    if(selectedObject != null){

        let remote = null

        while(remote == null && selectedObject.parent != null){
            remote = remote3DObjects.find(remote => remote.object3D == selectedObject)

            if(remote == null){
                selectedObject = selectedObject.parent
            }
        }

        selectedObject.position.set(camera.position.x, 0, camera.position.z)

        if(remote != null){
            remote.updateValues()
        }
    }

    input = resetInput()
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
            int: 10,
            wis: 10,
            cha: 10,
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
    updateUI()
});

socket.on('create-remote-3D-object', object => {
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

let checkboxes = document.getElementsByClassName('checkbox')

for(let i = 0; i < checkboxes.length; i++){
    checkboxes[i].addEventListener('click', () => {
        if(checkboxes[i].classList.contains('checked')){
            checkboxes[i].classList.remove('checked')
        }else{
            checkboxes[i].classList.add('checked')
        }
    })
}

render()