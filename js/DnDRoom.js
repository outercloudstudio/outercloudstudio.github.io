const headless = false

class Collider{
    constructor(colliderShape){
        this.shape = colliderShape
    }

    toObject(){
        return {
            shape: this.shape.toObject()
        }
    }

    init(gameObject){
        this.gameObject = gameObject
    }
}

class SphereCollider{
    constructor(radius){
        this.radius = radius
        this.type = 'Sphere'
    }

    toObject(){
        return {
            type: 'Sphere',
            radius: this.radius
        }
    }
}

class BoxCollider{
    constructor(scale){
        this.scale = scale
        this.type = 'Box'
    }

    toObject(){
        return {
            type: 'Box',
            scale: this.scale
        }
    }
}

class PolygonCollider{
    constructor(points, faces = null){
        this.points = points
        this.faces = faces
        this.type = 'Polygon'

        if(faces == null){
            let result = GeometryToData(points)

            this.points = result.vertices
            this.faces = result.faces
        }
    }

    toObject(){
        return {
            type: 'Polygon',
            points: this.points,
            faces: this.faces,
        }
    }
}

class D20Collider{
    constructor(){
        this.type = 'D20'
    }

    toObject(){
        return {
            type: 'D20',
        }
    }
}

class D12Collider{
    constructor(){
        this.type = 'D12'
    }

    toObject(){
        return {
            type: 'D12',
        }
    }
}

class D10Collider{
    constructor(){
        this.type = 'D10'
    }

    toObject(){
        return {
            type: 'D10',
        }
    }
}

class D8Collider{
    constructor(){
        this.type = 'D8'
    }

    toObject(){
        return {
            type: 'D8',
        }
    }
}

class D6Collider{
    constructor(){
        this.type = 'D6'
    }

    toObject(){
        return {
            type: 'D6',
        }
    }
}

class D4Collider{
    constructor(){
        this.type = 'D4'
    }

    toObject(){
        return {
            type: 'D4',
        }
    }
}

class Component{
    constructor(value, networked){
        this.value = value
        this.networked = networked
        this.type = 'Unkown'
    }

    toObject(){
        return {
            type: this.type,
            value: this.value.toObject(),
            networked: this.networked,
        }
    }

    init(gameObject){
        if(this.value instanceof Transform){
            this.type = 'Transform'
        }

        if(this.value instanceof Renderer){
            this.type = 'Renderer'
        }

        if(this.value instanceof Collider){
            this.type = 'Collider'
        }

        if(this.value instanceof RigidBody){
            this.type = 'RigidBody'
        }

        this.value.init(gameObject)
    }

    Update(deltaTime){
        if(this.value.Update != null){
            this.value.Update(deltaTime)
        }
    }

    PreUpdate(deltaTime){
        if(this.value.PreUpdate != null){
            this.value.PreUpdate(deltaTime)
        }
    }

    RemoteUpdate(){
        return this.value.RemoteUpdate()
    }

    ReceiveUpdate(update){
        this.value.ReceiveUpdate(update)
    }

    PrePhysicsUpdate(deltaTime){
        if(this.value.PrePhysicsUpdate != null){
            this.value.PrePhysicsUpdate(deltaTime)
        }
    }

    Destroy(){
        if(this.value.Destroy != null){
            this.value.Destroy()
        }
    }
}

class Transform{
    constructor(position, rotation, scale){
        this.position = position
        this.rotation = rotation
        this.scale = scale
    }

    toObject(){
        return {
            position: this.position,
            rotation: this.rotation,
            scale: this.scale,
        }
    }

    init(gameObject){
        this.gameObject = gameObject
    }

    RemoteUpdate(){
        return {
            position: this.position,
            rotation: this.rotation,
            scale: this.scale,
        }
    }

    ReceiveUpdate(update){
        this.position = new THREE.Vector3(update.position.x, update.position.y, update.position.z)
        this.rotation = new THREE.Quaternion(update.rotation._x, update.rotation._y, update.rotation._z, update.rotation._w)
        this.scale = new THREE.Vector3(update.scale.x, update.scale.y, update.scale.z)
    }
}

class Renderer{
    constructor(builder){
        this.builder = builder
    }

    toObject(){
        return {
            builder: this.builder,
        }
    }

    init(gameObject){
        this.gameObject = gameObject

        if(!headless){
            this.addToScene(scene)
        }
    }

    addToScene(scene){
        if(this.object3D == null){
            if(this.builder == 'cube'){
                let geometry = new THREE.BoxGeometry(this.sx, this.sy, this.sz)

                let material = new THREE.MeshPhongMaterial({
                    color: 0xFFFFFF,
                    flatShading: true,
                })

                this.object3D = new THREE.Mesh(geometry, material);

                let transform = this.gameObject.GetComponent('Transform')

                this.object3D.position.set(transform.position.x, transform.position.y, transform.position.z)
                this.object3D.quaternion.set(transform.rotation.x, transform.rotation.y, transform.rotation.z, transform.rotation.w)
                this.object3D.scale.set(transform.scale.x, transform.scale.y, transform.scale.z)

                updateMaterialHDRI(this.object3D)

                scene.add(this.object3D)
            }

            if(this.builder == 'miniture-base'){
				loader.load('./models/Human_Female_Barbarian.fbx', object =>{
                    this.object3D = object

                    this.object3D.position.set(0, 0, 0)
                    this.object3D.rotation.set(0, 0, 0)
                    this.object3D.scale.set(1, 1, 1)

                    let transform = this.gameObject.GetComponent('Transform')

                    this.object3D.position.set(transform.position.x, transform.position.y, transform.position.z)
                    this.object3D.quaternion.set(transform.rotation.x, transform.rotation.y, transform.rotation.z, transform.rotation.w)
                    this.object3D.scale.set(transform.scale.x, transform.scale.y, transform.scale.z)

                    updateMaterialHDRI(object)
                    
                    selectables.add(this.object3D)
                })
            }

            if(this.builder == "plane"){
                let geometry = new THREE.PlaneGeometry(this.sx, this.sy, this.sz)

                let material = new THREE.MeshPhongMaterial({
                    color: 0xFFFFFF,
                    flatShading: true,
                })

                this.object3D = new THREE.Mesh(geometry, material);

                let transform = this.gameObject.GetComponent('Transform')

                this.object3D.position.set(transform.position.x, transform.position.y, transform.position.z)
                this.object3D.quaternion.set(transform.rotation.x, transform.rotation.y, transform.rotation.z, transform.rotation.w)
                this.object3D.scale.set(transform.scale.x, transform.scale.y, transform.scale.z)

                updateMaterialHDRI(this.object3D)

                scene.add(this.object3D)
            }

            if(this.builder == 'D20'){
				loader.load('./models/D20.fbx', object =>{
                    this.object3D = object

                    this.object3D.position.set(0, 0, 0)
                    this.object3D.rotation.set(0, 0, 0)
                    this.object3D.scale.set(1, 1, 1)

                    let transform = this.gameObject.GetComponent('Transform')

                    this.object3D.position.set(transform.position.x, transform.position.y, transform.position.z)
                    this.object3D.quaternion.set(transform.rotation.x, transform.rotation.y, transform.rotation.z, transform.rotation.w)
                    this.object3D.scale.set(transform.scale.x, transform.scale.y, transform.scale.z)

                    this.object3D.children[0].rotation.set(0, 0, 0)

                    updateMaterialHDRI(object, D20Texture)
                    
                    selectables.add(this.object3D)
                })
            }

            if(this.builder == 'D12'){
				loader.load('./models/D12.fbx', object =>{
                    this.object3D = object

                    this.object3D.position.set(0, 0, 0)
                    this.object3D.rotation.set(0, 0, 0)
                    this.object3D.scale.set(1, 1, 1)

                    let transform = this.gameObject.GetComponent('Transform')

                    this.object3D.position.set(transform.position.x, transform.position.y, transform.position.z)
                    this.object3D.quaternion.set(transform.rotation.x, transform.rotation.y, transform.rotation.z, transform.rotation.w)
                    this.object3D.scale.set(transform.scale.x, transform.scale.y, transform.scale.z)

                    this.object3D.children[0].rotation.set(0, 0, 0)

                    updateMaterialHDRI(object, D12Texture)
                    
                    selectables.add(this.object3D)
                })
            }

            if(this.builder == 'D10'){
                loader.load('./models/D10.fbx', object =>{
                    this.object3D = object

                    this.object3D.position.set(0, 0, 0)
                    this.object3D.rotation.set(0, 0, 0)
                    this.object3D.scale.set(1, 1, 1)

                    let transform = this.gameObject.GetComponent('Transform')

                    this.object3D.position.set(transform.position.x, transform.position.y, transform.position.z)
                    this.object3D.quaternion.set(transform.rotation.x, transform.rotation.y, transform.rotation.z, transform.rotation.w)
                    this.object3D.scale.set(transform.scale.x, transform.scale.y, transform.scale.z)

                    this.object3D.children[0].rotation.set(0, 0, 0)

                    updateMaterialHDRI(object, D10Texture)
                    
                    selectables.add(this.object3D)
                })
            }

            if(this.builder == 'D8'){
                loader.load('./models/D8.fbx', object =>{
                    this.object3D = object

                    this.object3D.position.set(0, 0, 0)
                    this.object3D.rotation.set(0, 0, 0)
                    this.object3D.scale.set(1, 1, 1)

                    let transform = this.gameObject.GetComponent('Transform')

                    this.object3D.position.set(transform.position.x, transform.position.y, transform.position.z)
                    this.object3D.quaternion.set(transform.rotation.x, transform.rotation.y, transform.rotation.z, transform.rotation.w)
                    this.object3D.scale.set(transform.scale.x, transform.scale.y, transform.scale.z)

                    this.object3D.children[0].rotation.set(0, 0, 0)

                    updateMaterialHDRI(object, D8Texture)
                    
                    selectables.add(this.object3D)
                })
            }

            if(this.builder == 'D6'){
                loader.load('./models/D6.fbx', object =>{
                    this.object3D = object

                    this.object3D.position.set(0, 0, 0)
                    this.object3D.rotation.set(0, 0, 0)
                    this.object3D.scale.set(1, 1, 1)

                    let transform = this.gameObject.GetComponent('Transform')

                    this.object3D.position.set(transform.position.x, transform.position.y, transform.position.z)
                    this.object3D.quaternion.set(transform.rotation.x, transform.rotation.y, transform.rotation.z, transform.rotation.w)
                    this.object3D.scale.set(transform.scale.x, transform.scale.y, transform.scale.z)

                    this.object3D.children[0].rotation.set(0, 0, 0)

                    updateMaterialHDRI(object, D6Texture)
                    
                    selectables.add(this.object3D)
                })
            }

            if(this.builder == 'D4'){
                loader.load('./models/D4.fbx', object =>{
                    this.object3D = object

                    this.object3D.position.set(0, 0, 0)
                    this.object3D.rotation.set(0, 0, 0)
                    this.object3D.scale.set(1, 1, 1)

                    let transform = this.gameObject.GetComponent('Transform')

                    this.object3D.position.set(transform.position.x, transform.position.y, transform.position.z)
                    this.object3D.quaternion.set(transform.rotation.x, transform.rotation.y, transform.rotation.z, transform.rotation.w)
                    this.object3D.scale.set(transform.scale.x, transform.scale.y, transform.scale.z)

                    this.object3D.children[0].rotation.set(0, 0, 0)

                    updateMaterialHDRI(object, D4Texture)
                    
                    selectables.add(this.object3D)
                })
            }
        }
    }

    Update(deltaTime){
        if(this.object3D != null){
            let transform = this.gameObject.GetComponent('Transform')

            this.object3D.position.set(transform.position.x, transform.position.y, transform.position.z)
            this.object3D.quaternion.set(transform.rotation.x, transform.rotation.y, transform.rotation.z, transform.rotation.w)
            this.object3D.scale.set(transform.scale.x, transform.scale.y, transform.scale.z)
        }
    }

    PrePhysicsUpdate(deltaTime){
        if(this.object3D != null){
            if(transformer.object == this.object3D){
                let transform = this.gameObject.GetComponent('Transform')

                transform.position.set(this.object3D.position.x, this.object3D.position.y, this.object3D.position.z)
                transform.rotation.set(this.object3D.quaternion.x, this.object3D.quaternion.y, this.object3D.quaternion.z, this.object3D.quaternion.w)
                transform.scale.set(this.object3D.scale.x, this.object3D.scale.y, this.object3D.scale.z)
            }
        }
    }

    Destroy(){
        if(this.object3D != null){
            if(transformer.object == this.object3D){
                transformer.detach()
            }

            this.object3D.removeFromParent()
        }
    }
}

class RigidBody{
    constructor(mass){
        this.mass = mass
    }

    toObject(){
        return {
            mass: this.mass,
            velocity: this.rigidBody.velocity,
            //TODO: Add angular velocity
        }
    }

    init(gameObject){
        this.gameObject = gameObject

        let collider = this.gameObject.GetComponent('Collider')

        let colliderShape = new CANNON.Box(new CANNON.Vec3(.5, .5, .5))

        let transform = this.gameObject.GetComponent('Transform')

        let collisionGroup = 1
        let collisionMask = 1 | 2

        if(!headless){
            if(collider.shape.type == 'Box'){
                colliderShape = new CANNON.Box(new CANNON.Vec3(collider.shape.scale.x * transform.scale.x, collider.shape.scale.y  * transform.scale.y, collider.shape.scale.z  * transform.scale.z))
            }else if(collider.shape.type == 'Sphere'){
                colliderShape = new CANNON.Sphere(collider.shape.radius * transform.scale.x)
            }else if(collider.shape.type == 'D20'){
                let result = GeometryToData(D20Geometry)

                for (let i = 0; i < result.vertices.length; i++) {
                    result.vertices[i].x *= transform.scale.x
                    result.vertices[i].y *= transform.scale.y
                    result.vertices[i].z *= transform.scale.z
                }

                colliderShape = new CANNON.ConvexPolyhedron(result.vertices, result.faces)

                collisionGroup = 2
                collisionMask = 1
            }else if(collider.shape.type == 'D12'){
                let result = GeometryToData(D12Geometry)

                for (let i = 0; i < result.vertices.length; i++) {
                    result.vertices[i].x *= transform.scale.x
                    result.vertices[i].y *= transform.scale.y
                    result.vertices[i].z *= transform.scale.z
                }

                colliderShape = new CANNON.ConvexPolyhedron(result.vertices, result.faces)

                collisionGroup = 2
                collisionMask = 1
            }else if(collider.shape.type == 'D10'){
                let result = GeometryToData(D10Geometry)

                for (let i = 0; i < result.vertices.length; i++) {
                    result.vertices[i].x *= transform.scale.x
                    result.vertices[i].y *= transform.scale.y
                    result.vertices[i].z *= transform.scale.z
                }

                colliderShape = new CANNON.ConvexPolyhedron(result.vertices, result.faces)

                collisionGroup = 2
                collisionMask = 1
            }else if(collider.shape.type == 'D8'){
                let result = GeometryToData(D8Geometry)

                for (let i = 0; i < result.vertices.length; i++) {
                    result.vertices[i].x *= transform.scale.x
                    result.vertices[i].y *= transform.scale.y
                    result.vertices[i].z *= transform.scale.z
                }

                colliderShape = new CANNON.ConvexPolyhedron(result.vertices, result.faces)

                collisionGroup = 2
                collisionMask = 1
            }else if(collider.shape.type == 'D6'){
                colliderShape = new CANNON.Box(new CANNON.Vec3(.5 * transform.scale.x, .5 * transform.scale.y, .5 * transform.scale.z))

                /*let result = GeometryToData(D6Geometry)

                for (let i = 0; i < result.vertices.length; i++) {
                    result.vertices[i].x *= transform.scale.x
                    result.vertices[i].y *= transform.scale.y
                    result.vertices[i].z *= transform.scale.z
                }

                colliderShape = new CANNON.ConvexPolyhedron(result.vertices, result.faces)*/

                collisionGroup = 2
                collisionMask = 1
            }else if(collider.shape.type == 'D4'){
                let result = GeometryToData(D4Geometry)

                for (let i = 0; i < result.vertices.length; i++) {
                    result.vertices[i].x *= transform.scale.x
                    result.vertices[i].y *= transform.scale.y
                    result.vertices[i].z *= transform.scale.z
                }

                colliderShape = new CANNON.ConvexPolyhedron(result.vertices, result.faces)

                collisionGroup = 2
                collisionMask = 1
            }else{
                console.error('Collider type ' + collider.shape.type + ' not supported')
            }
        }

        let bodyMaterial = new CANNON.Material()    

        this.rigidBody = new CANNON.Body({ mass: this.mass, material: bodyMaterial, collisionFilterGroup: collisionGroup, collisionFilterMask: collisionMask })

        this.rigidBody.position.set(transform.position.x, transform.position.y, transform.position.z)
        this.rigidBody.quaternion.set(transform.rotation.x, transform.rotation.y, transform.rotation.z, transform.rotation.w)

        this.rigidBody.addShape(colliderShape)
        this.rigidBody.linearDamping = physicsDamping

        physicsWorld.add(this.rigidBody)
    }

    PreUpdate(deltaTime){
        let transform = this.gameObject.GetComponent('Transform')

        transform.position.set(this.rigidBody.position.x, this.rigidBody.position.y, this.rigidBody.position.z)
        transform.rotation.set(this.rigidBody.quaternion.x, this.rigidBody.quaternion.y, this.rigidBody.quaternion.z, this.rigidBody.quaternion.w)
        //TODO: update collider based on scale
    }

    RemoteUpdate(){
        return{
            velocity: this.rigidBody.velocity,
        }
    }

    ReceiveUpdate(data){
        this.rigidBody.velocity.set(data.velocity.x, data.velocity.y, data.velocity.z)
    }

    //PrePhysicsUpdate(deltaTime){
        //let transform = this.gameObject.GetComponent('Transform')

        //this.rigidBody.position.set(transform.position.x, transform.position.y, transform.position.z)
        //this.rigidBody.quaternion.set(transform.rotation.x, transform.rotation.y, transform.rotation.z, transform.rotation.w)
    //}

    Destroy(){
        physicsWorld.remove(this.rigidBody)
    }
}

class GameObject{
    constructor(components, owner = null){
        this.dirty = false
        this.components = components
        this.owner = owner

        if(this.owner == null){
            this.owner = false
        }

        this.ID = uuidv4()

        for (let i = 0; i < components.length; i++) {
            components[i].init(this)
        }
    }

    toObject(asOwner){
        let components = []

        for (let i = 0; i < this.components.length; i++) {
            components.push(this.components[i].toObject())    
        }

        return {
            ID: this.ID,
            components: components,
            owner: this.owner && !asOwner,
        }
    }

    GetComponent(componentType){
        for (let i = 0; i < this.components.length; i++) {
            if(this.components[i].type == componentType){
                return this.components[i].value
            }
        }
    }

    Update(deltaTime){
        for (let i = 0; i < this.components.length; i++) {
            this.components[i].PreUpdate(deltaTime)
        }

        for (let i = 0; i < this.components.length; i++) {
            this.components[i].Update(deltaTime)
        }
    }

    RemoteUpdate(){
        if(this.owner){
            let updateData = []

            for (let i = 0; i < this.components.length; i++) {
                if(this.components[i].networked){
                    if(this.components[i].RemoteUpdate != null){
                        updateData.push({
                            type: this.components[i].type,
                            data: this.components[i].RemoteUpdate(),
                        })
                    }
                }
            }

            if(updateData.length > 0){
                updateData = {
                    ID: this.ID,
                    data: updateData,
                }

                socket.emit('update-game-object', updateData)
            }
        }
    }

    ReceiveUpdate(updateData){
        for (let i = 0; i < updateData.length; i++) {
            //console.log(updateData[i].data)
            let component = this.GetComponent(updateData[i].type)
            component.ReceiveUpdate(updateData[i].data)
        }
    }

    PrePhysicsUpdate(deltaTime){
        for (let i = 0; i < this.components.length; i++) {
            this.components[i].PrePhysicsUpdate(deltaTime)
        }
    }

    Reconstruct(object){
        this.ID = object.ID
        this.dirty = false
        this.owner = object.owner

        this.components = []

        for (let i = 0; i < object.components.length; i++) {
            let component = object.components[i]
            let componentType = component.type
            let componentValue = component.value
            let componentNetworked = component.networked

            if(componentType == 'Transform'){
                this.components.push(
                    new Component(
                        new Transform(new THREE.Vector3(componentValue.position.x, componentValue.position.y, componentValue.position.z), new THREE.Quaternion(componentValue.rotation._x, componentValue.rotation._y, componentValue.rotation._z, componentValue.rotation._w), new THREE.Vector3(componentValue.scale.x, componentValue.scale.y, componentValue.scale.z)),
                        componentNetworked
                    )
                )
            }else if(componentType == 'Renderer'){
                this.components.push(
                    new Component(
                        new Renderer(componentValue.builder),
                        componentNetworked
                    )
                )
            }else if(componentType == 'RigidBody'){
                this.components.push(
                    new Component(
                        new RigidBody(componentValue.mass),
                        componentNetworked
                    )
                )
            }else if(componentType == 'Collider'){
                if(componentValue.shape.type == 'Box'){
                    this.components.push(
                        new Component(
                            new Collider(
                                new BoxCollider(new THREE.Vector3(componentValue.shape.scale.x, componentValue.shape.scale.y, componentValue.shape.scale.z)),
                            ),
                            componentNetworked
                        )
                    )
                }else if(componentValue.shape.type == 'Sphere'){
                    this.components.push(
                        new Component(
                            new Collider(
                                new SphereCollider(componentValue.shape.radius),
                            ),
                            componentNetworked
                        )
                    )
                }else if(componentValue.shape.type == 'D20'){
                    this.components.push(
                        new Component(
                            new Collider(
                                new D20Collider(),
                            ),
                            componentNetworked
                        )
                    )
                }else if(componentValue.shape.type == 'D12'){
                    this.components.push(
                        new Component(
                            new Collider(
                                new D12Collider(),
                            ),
                            componentNetworked
                        )
                    )
                }else if(componentValue.shape.type == 'D10'){
                    this.components.push(
                        new Component(
                            new Collider(
                                new D10Collider(),
                            ),
                            componentNetworked
                        )
                    )
                }else if(componentValue.shape.type == 'D8'){
                    this.components.push(
                        new Component(
                            new Collider(
                                new D8Collider(),
                            ),
                            componentNetworked
                        )
                    )
                }else if(componentValue.shape.type == 'D6'){
                    this.components.push(
                        new Component(
                            new Collider(
                                new D6Collider(),
                            ),
                            componentNetworked
                        )
                    )
                }else if(componentValue.shape.type == 'D4'){
                    this.components.push(
                        new Component(
                            new Collider(
                                new D4Collider(),
                            ),
                            componentNetworked
                        )
                    )
                }else{
                    console.error('Collider type ' + componentValue.shape.type + ' not supported')
                }
            }else{
                console.error('Component type ' + componentType + ' not supported')
            }
        }

        this.init()

        for (let i = 0; i < object.components.length; i++) {
            let component = object.components[i]
            let componentType = component.type
            let componentValue = component.value
            let componentNetworked = component.networked

            if(componentType == 'RigidBody'){
                let rigidBody = this.GetComponent('RigidBody').rigidBody
                rigidBody.velocity.set(componentValue.velocity.x, componentValue.velocity.y, componentValue.velocity.z)
            }
        }
    }

    init(){
        for (let i = 0; i < this.components.length; i++) {
            this.components[i].init(this)
        }
    }

    Destroy(){
        for (let i = 0; i < this.components.length; i++) {
            this.components[i].Destroy()
        }

        for (let i = 0; i < gameObjects.length; i++) {
            if(gameObjects[i] == this){
                gameObjects.splice(i, 1)
                break
            }
        }

        if(this.owner){
            socket.emit('destroy-game-object', this.ID )
        }
    }
}

//let socket = io('ws://76.86.240.158:25566')
//let socket = io('ws://192.168.1.101:25566')
let socket = io('ws://localhost:25566')

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

const strProf = document.getElementById('saving-str-value')
const dexProf = document.getElementById('saving-dex-value')
const conProf = document.getElementById('saving-con-value')
const intProf = document.getElementById('saving-int-value')
const wisProf = document.getElementById('saving-wis-value')
const chaProf = document.getElementById('saving-cha-value')

const acrobaticsProf = document.getElementById('skill-acrobatics-value')
const animalHandlingProf = document.getElementById('skill-animal-handling-value')
const arcanaProf = document.getElementById('skill-arcana-value')
const athleticsProf = document.getElementById('skill-athletics-value')
const deceptionProf = document.getElementById('skill-decepetion-value')
const historyProf = document.getElementById('skill-history-value')
const insightProf = document.getElementById('skill-insight-value')
const intimidationProf = document.getElementById('skill-intimidation-value')
const investigationProf = document.getElementById('skill-investigation-value')
const medicineProf = document.getElementById('skill-medicine-value')
const natureProf = document.getElementById('skill-nature-value')
const perceptionProf = document.getElementById('skill-perception-value')
const performanceProf = document.getElementById('skill-performance-value')
const persuasionProf = document.getElementById('skill-persuasion-value')
const religionProf = document.getElementById('skill-religion-value')
const sleightOfHandProf = document.getElementById('skill-sleight-of-hand-value')
const stealthProf = document.getElementById('skill-stealth-value')
const survivalProf = document.getElementById('skill-survival-value')

const hpValue = document.getElementById('hp-value')
const mhpValue = document.getElementById('mhp-value')
const thpValue = document.getElementById('thp-value')
const acValue = document.getElementById('ac-value')
const speedValue = document.getElementById('speed-value')
const initiativeValue = document.getElementById('initiative-value')
const hdValue = document.getElementById('hd-value')
const thdValue = document.getElementById('thd-value')
const dssValue = document.getElementById('dss-value')
const dsfValue = document.getElementById('dsf-value')
const profBonusValue = document.getElementById('prof-bonus-value')

const spellsButton = document.getElementById('spells-button')
const spells = document.getElementById('spells')

const level1SpellSlotsValue = document.getElementById('level-1-spell-slots')
const level2SpellSlotsValue = document.getElementById('level-2-spell-slots')
const level3SpellSlotsValue = document.getElementById('level-3-spell-slots')
const level4SpellSlotsValue = document.getElementById('level-4-spell-slots')
const level5SpellSlotsValue = document.getElementById('level-5-spell-slots')
const level6SpellSlotsValue = document.getElementById('level-6-spell-slots')
const level7SpellSlotsValue = document.getElementById('level-7-spell-slots')
const level8SpellSlotsValue = document.getElementById('level-8-spell-slots')
const level9SpellSlotsValue = document.getElementById('level-9-spell-slots')

const level1SpellSlotsUsedValue = document.getElementById('level-1-spell-slots-used')
const level2SpellSlotsUsedValue = document.getElementById('level-2-spell-slots-used')
const level3SpellSlotsUsedValue = document.getElementById('level-3-spell-slots-used')
const level4SpellSlotsUsedValue = document.getElementById('level-4-spell-slots-used')
const level5SpellSlotsUsedValue = document.getElementById('level-5-spell-slots-used')
const level6SpellSlotsUsedValue = document.getElementById('level-6-spell-slots-used')
const level7SpellSlotsUsedValue = document.getElementById('level-7-spell-slots-used')
const level8SpellSlotsUsedValue = document.getElementById('level-8-spell-slots-used')
const level9SpellSlotsUsedValue = document.getElementById('level-9-spell-slots-used')

const cantripsAddButton = document.getElementById('cantrips-add-button')
const cantripsList = document.getElementById('cantrips-list')
const level1AddButton = document.getElementById('level-1-add-button')
const level1List = document.getElementById('level-1-list')
const level2AddButton = document.getElementById('level-2-add-button')
const level2List = document.getElementById('level-2-list')
const level3AddButton = document.getElementById('level-3-add-button')
const level3List = document.getElementById('level-3-list')
const level4AddButton = document.getElementById('level-4-add-button')
const level4List = document.getElementById('level-4-list')
const level5AddButton = document.getElementById('level-5-add-button')
const level5List = document.getElementById('level-5-list')
const level6AddButton = document.getElementById('level-6-add-button')
const level6List = document.getElementById('level-6-list')
const level7AddButton = document.getElementById('level-7-add-button')
const level7List = document.getElementById('level-7-list')
const level8AddButton = document.getElementById('level-8-add-button')
const level8List = document.getElementById('level-8-list')
const level9AddButton = document.getElementById('level-9-add-button')
const level9List = document.getElementById('level-9-list')

const attacksList = document.getElementById('attacks-list') 
const attacksAddButton = document.getElementById('attacks-add-button')

const generalInfo = document.getElementById('general-info')
const generalInfoButton = document.getElementById('general-info-button')

const notes = document.getElementById('notes')

const characterNameValue = document.getElementById('character-name-value')
const classValue = document.getElementById('class-value')
const backgroundValue = document.getElementById('background-value')
const playerNameValue = document.getElementById('name-value')
const raceValue = document.getElementById('race-value')
const alignmentValue = document.getElementById('alignment-value')
const experienceValue = document.getElementById('experience-value')

const otherProfValue = document.getElementById('other-prof-value')

const characterCreator = document.getElementById('character-creator')
const characterFile = document.getElementById('character-file')

const minitures = document.getElementById('miniture-controls')
const minituresButton = document.getElementById('minitures-button')
const createMinitureBaseButton = document.getElementById('create-miniture-base')
const deleteMinituresButton = document.getElementById('delete-minitures')

const players = document.getElementById('players')
const playersButton = document.getElementById('people-button')

const playerDataButtonTemplate = document.getElementById('player-data-button-template')
const playerRow = document.getElementById('player-row')
const otherPlayerDataShow = document.getElementById('other-player-data-show')

let currentData = null
let isDM = false

function randomIntFromInterval(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min)
}

function uuidv4() {
    var d = new Date().getTime();
    var d2 = ((typeof performance !== 'undefined') && performance.now && (performance.now()*1000)) || 0;//Time in microseconds since page-load or 0 if unsupported
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = Math.random() * 16;
        if(d > 0){
            r = (d + r)%16 | 0;
            d = Math.floor(d/16);
        } else {
            r = (d2 + r)%16 | 0;
            d2 = Math.floor(d2/16);
        }
        return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
    });
}

function updatePlayerData(){
    console.log(currentData.player)

    socket.emit('update-player-data', currentData.player)
}

function updateUI(){
    if(currentData != null){
        if(currentData.player != null){
            strValue.value = currentData.player.stats.str
            dexValue.value = currentData.player.stats.dex
            conValue.value = currentData.player.stats.con
            intValue.value = currentData.player.stats.int
            wisValue.value = currentData.player.stats.wis
            chaValue.value = currentData.player.stats.cha

            hpValue.value = currentData.player.stats.hp
            mhpValue.value = currentData.player.stats.mhp
            thpValue.value = currentData.player.stats.thp
            acValue.value = currentData.player.stats.ac
            speedValue.value = currentData.player.stats.speed
            initiativeValue.value = currentData.player.stats.initiative
            hdValue.value = currentData.player.stats.hd
            thdValue.value = currentData.player.stats.thd
            thpValue.value = currentData.player.stats.thp
            dssValue.value = currentData.player.stats.dss
            dsfValue.value = currentData.player.stats.dsf
            profBonusValue.value = currentData.player.stats.profBonus

            notes.value = currentData.player.notes

            characterNameValue.value = currentData.player.characterName
            classValue.value = currentData.player.class
            backgroundValue.value = currentData.player.background
            playerNameValue.value = currentData.player.playerName
            raceValue.value = currentData.player.race
            alignmentValue.value = currentData.player.alignment
            experienceValue.value = currentData.player.experience

            otherProfValue.value = currentData.player.otherProf

            level1SpellSlotsValue.value = currentData.player.level1SpellSlots
            level1SpellSlotsUsedValue.value = currentData.player.level1SpellSlotsUsed
            level2SpellSlotsValue.value = currentData.player.level2SpellSlots
            level2SpellSlotsUsedValue.value = currentData.player.level2SpellSlotsUsed
            level3SpellSlotsValue.value = currentData.player.level3SpellSlots
            level3SpellSlotsUsedValue.value = currentData.player.level3SpellSlotsUsed
            level4SpellSlotsValue.value = currentData.player.level4SpellSlots
            level4SpellSlotsUsedValue.value = currentData.player.level4SpellSlotsUsed
            level5SpellSlotsValue.value = currentData.player.level5SpellSlots
            level5SpellSlotsUsedValue.value = currentData.player.level5SpellSlotsUsed
            level6SpellSlotsValue.value = currentData.player.level6SpellSlots
            level6SpellSlotsUsedValue.value = currentData.player.level6SpellSlotsUsed
            level7SpellSlotsValue.value = currentData.player.level7SpellSlots
            level7SpellSlotsUsedValue.value = currentData.player.level7SpellSlotsUsed
            level8SpellSlotsValue.value = currentData.player.level8SpellSlots
            level8SpellSlotsUsedValue.value = currentData.player.level8SpellSlotsUsed
            level9SpellSlotsValue.value = currentData.player.level9SpellSlots
            level9SpellSlotsUsedValue.value = currentData.player.level9SpellSlotsUsed

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

                    updatePlayerData()
                    updateUI()
                })
        
                newElement.children[0].value = currentData.player.inventory[i].name
                newElement.children[1].value = currentData.player.inventory[i].note
        
                inventoryList.appendChild(newElement)
            }

            let spellListElements = [cantripsList, level1List, level2List, level3List, level4List, level5List, level6List, level7List, level8List, level9List]
            let spellObjectProps = ['cantrips', 'level1', 'level2', 'level3', 'level4', 'level5', 'level6', 'level7', 'level8', 'level9']
            
            for(let i = 0; i < spellListElements.length; i++){
                for(let j = 0; j <spellListElements[i].children.length; j = 0){
                    spellListElements[i].removeChild(spellListElements[i].children[0])
                }

                for(let j = 0; j < currentData.player.spells[spellObjectProps[i]].length; j++){
                    let newElement = inventoryListItemTemplate.cloneNode(true)
                    newElement.removeAttribute('id')
            
                    newElement.children[0].addEventListener('change', event => {
                        currentData.player.spells[spellObjectProps[i]][j].name = event.target.parentNode.children[0].value
                        
                        updatePlayerData()
                        updateUI()
                    })
                
                    newElement.children[1].addEventListener('change', event => {
                        currentData.player.spells[spellObjectProps[i]][j].note = event.target.parentNode.children[1].value
                        
                        updatePlayerData()
                        updateUI()
                    })
            
                    newElement.children[2].addEventListener('click', event => {
                        currentData.player.spells[spellObjectProps[i]].splice(j, 1)
            
                        updatePlayerData()
                        updateUI()
                    })
            
                    newElement.children[0].value = currentData.player.spells[spellObjectProps[i]][j].name
                    newElement.children[1].value = currentData.player.spells[spellObjectProps[i]][j].note
            
                    spellListElements[i].appendChild(newElement)
                }
            }

            for(let i = 0; i <attacksList.children.length; i = 0){
                attacksList.removeChild(attacksList.children[0])
            }
        
            for(let i = 0; i < currentData.player.attacks.length; i++){
                let newElement = inventoryListItemTemplate.cloneNode(true)
                newElement.removeAttribute('id')
        
                newElement.children[0].addEventListener('change', event => {
                    currentData.player.attacks[i].name = event.target.parentNode.children[0].value
                    
                    updatePlayerData()
                    updateUI()
                })
            
                newElement.children[1].addEventListener('change', event => {
                    currentData.player.attacks[i].note = event.target.parentNode.children[1].value
                    
                    updatePlayerData()
                    updateUI()
                })
        
                newElement.children[2].addEventListener('click', event => {
                    currentData.player.attacks.splice(i, 1)
        
                    updatePlayerData()
                    updateUI()
                })
        
                newElement.children[0].value = currentData.player.attacks[i].name
                newElement.children[1].value = currentData.player.attacks[i].note
        
                attacksList.appendChild(newElement)
            }
            
            let modifierTypes = ["str", "dex", "con", "int", "wis", "cha"]
            let modifierValues = [strValue, dexValue, conValue, intValue, wisValue, chaValue]

            for (let i = 0; i < modifierValues.length; i++) {
                let fields = document.getElementsByClassName(modifierTypes[i] + '-modifier')

                let mod = Math.floor((parseInt(modifierValues[i].value) - 10) / 2)

                for (let j = 0; j < fields.length; j++) {
                    fields[j].innerHTML = mod

                    if(mod >= 0){
                        fields[j].innerHTML = '+' + mod.toString()
                    }
                }
            }

            strProf.classList.remove('checked')
            
            if(currentData.player.stats.savingThrows.str){
                strProf.classList.add('checked')
            }

            dexProf.classList.remove('checked')
            
            if(currentData.player.stats.savingThrows.dex){
                dexProf.classList.add('checked')
            }

            conProf.classList.remove('checked')

            if(currentData.player.stats.savingThrows.con){
                conProf.classList.add('checked')
            }

            intProf.classList.remove('checked')

            if(currentData.player.stats.savingThrows.int){
                intProf.classList.add('checked')
            }

            wisProf.classList.remove('checked')

            if(currentData.player.stats.savingThrows.wis){
                wisProf.classList.add('checked')
            }

            chaProf.classList.remove('checked')

            if(currentData.player.stats.savingThrows.cha){
                chaProf.classList.add('checked')
            }

            acrobaticsProf.classList.remove('checked')

            if(currentData.player.stats.skills.acrobatics){
                acrobaticsProf.classList.add('checked')
            }

            animalHandlingProf.classList.remove('checked')

            if(currentData.player.stats.skills.animalHandling){
                animalHandlingProf.classList.add('checked')
            }

            arcanaProf.classList.remove('checked')

            if(currentData.player.stats.skills.arcana){
                arcanaProf.classList.add('checked')
            }

            athleticsProf.classList.remove('checked')

            if(currentData.player.stats.skills.athletics){
                athleticsProf.classList.add('checked')
            }

            deceptionProf.classList.remove('checked')

            if(currentData.player.stats.skills.deception){
                deceptionProf.classList.add('checked')
            }

            historyProf.classList.remove('checked')

            if(currentData.player.stats.skills.history){
                historyProf.classList.add('checked')
            }

            insightProf.classList.remove('checked')

            if(currentData.player.stats.skills.insight){
                insightProf.classList.add('checked')
            }

            intimidationProf.classList.remove('checked')

            if(currentData.player.stats.skills.intimidation){
                intimidationProf.classList.add('checked')
            }

            investigationProf.classList.remove('checked')

            if(currentData.player.stats.skills.investigation){
                investigationProf.classList.add('checked')
            }

            medicineProf.classList.remove('checked')

            if(currentData.player.stats.skills.medicine){
                medicineProf.classList.add('checked')
            }

            natureProf.classList.remove('checked')

            if(currentData.player.stats.skills.nature){
                natureProf.classList.add('checked')
            }

            perceptionProf.classList.remove('checked')

            if(currentData.player.stats.skills.perception){
                perceptionProf.classList.add('checked')
            }

            performanceProf.classList.remove('checked')

            if(currentData.player.stats.skills.performance){
                performanceProf.classList.add('checked')
            }

            persuasionProf.classList.remove('checked')

            if(currentData.player.stats.skills.persuasion){
                persuasionProf.classList.add('checked')
            }

            religionProf.classList.remove('checked')

            if(currentData.player.stats.skills.religion){
                religionProf.classList.add('checked')
            }

            sleightOfHandProf.classList.remove('checked')

            if(currentData.player.stats.skills.sleightOfHand){
                sleightOfHandProf.classList.add('checked')
            }

            stealthProf.classList.remove('checked')

            if(currentData.player.stats.skills.stealth){
                stealthProf.classList.add('checked')
            }

            survivalProf.classList.remove('checked')

            if(currentData.player.stats.skills.survival){
                survivalProf.classList.add('checked')
            }
        }
    }
}

function closeAllWindows(){
    inventory.classList.remove('open')
    stats.classList.remove('open')
    spells.classList.remove('open')
    generalInfo.classList.remove('open')
    minitures.classList.remove('open')
    players.classList.remove('open')
}

function setupEventListeners(){
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

        updateUI()
        updatePlayerData()
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

    hpValue.addEventListener('change', event => {
        currentData.player.stats.hp = event.target.value

        updatePlayerData()
        updateUI()
    })

    mhpValue.addEventListener('change', event => {
        currentData.player.stats.mhp = event.target.value

        updatePlayerData()
        updateUI()
    })

    thpValue.addEventListener('change', event => {
        currentData.player.stats.thp = event.target.value

        updatePlayerData()
        updateUI()
    })

    acValue.addEventListener('change', event => {
        currentData.player.stats.ac = event.target.value

        updatePlayerData()
        updateUI()
    })

    speedValue.addEventListener('change', event => {
        currentData.player.stats.speed = event.target.value

        updatePlayerData()
        updateUI()
    })

    initiativeValue.addEventListener('change', event => {
        currentData.player.stats.initiative = event.target.value

        updatePlayerData()
        updateUI()
    })

    hdValue.addEventListener('change', event => {
        currentData.player.stats.hd = event.target.value
        
        updatePlayerData()
        updateUI()
    })

    thdValue.addEventListener('change', event => {
        currentData.player.stats.thd = event.target.value

        updatePlayerData()
        updateUI()
    })

    thpValue.addEventListener('change', event => {
        currentData.player.stats.thp = event.target.value

        updatePlayerData()
        updateUI()
    })

    dssValue.addEventListener('change', event => {
        currentData.player.stats.dss = event.target.value

        updatePlayerData()
        updateUI()
    })

    dsfValue.addEventListener('change', event => {
        currentData.player.stats.dsf = event.target.value
        
        updatePlayerData()
        updateUI()
    })

    profBonusValue.addEventListener('change', event => {
        currentData.player.stats.profBonus = event.target.value

        updatePlayerData()
        updateUI()
    })

    spellsButton.addEventListener('click', () => {
        if(spells.classList.contains('open')) {
            closeAllWindows()
        }else{
            closeAllWindows()

            spells.classList.add('open')
        }
    })

    level1SpellSlotsValue.addEventListener('change', event => {
        currentData.player.level1SpellSlots = event.target.value

        updatePlayerData()
        updateUI()
    })

    level2SpellSlotsValue.addEventListener('change', event => {
        currentData.player.level2SpellSlots = event.target.value

        updatePlayerData()
        updateUI()
    })

    level3SpellSlotsValue.addEventListener('change', event => {
        currentData.player.level3SpellSlots = event.target.value

        updatePlayerData()
        updateUI()
    })

    level4SpellSlotsValue.addEventListener('change', event => {
        currentData.player.level4SpellSlots = event.target.value

        updatePlayerData()
        updateUI()
    })

    level5SpellSlotsValue.addEventListener('change', event => {
        currentData.player.level5SpellSlots = event.target.value

        updatePlayerData()
        updateUI()
    })

    level6SpellSlotsValue.addEventListener('change', event => {
        currentData.player.level6SpellSlots = event.target.value

        updatePlayerData()
        updateUI()
    })

    level7SpellSlotsValue.addEventListener('change', event => {
        currentData.player.level7SpellSlots = event.target.value

        updatePlayerData()
        updateUI()
    })

    level8SpellSlotsValue.addEventListener('change', event => {
        currentData.player.level8SpellSlots = event.target.value

        updatePlayerData()
        updateUI()
    })

    level9SpellSlotsValue.addEventListener('change', event => {
        currentData.player.level9SpellSlots = event.target.value

        updatePlayerData()
        updateUI()
    })

    level1SpellSlotsUsedValue.addEventListener('change', event => {
        currentData.player.level1SpellSlotsUsed = event.target.value

        updatePlayerData()
        updateUI()
    })

    level2SpellSlotsUsedValue.addEventListener('change', event => {
        currentData.player.level2SpellSlotsUsed = event.target.value

        updatePlayerData()
        updateUI()
    })

    level3SpellSlotsUsedValue.addEventListener('change', event => {
        currentData.player.level3SpellSlotsUsed = event.target.value

        updatePlayerData()
        updateUI()
    })

    level4SpellSlotsUsedValue.addEventListener('change', event => {
        currentData.player.level4SpellSlotsUsed = event.target.value

        updatePlayerData()
        updateUI()
    })

    level5SpellSlotsUsedValue.addEventListener('change', event => {
        currentData.player.level5SpellSlotsUsed = event.target.value

        updatePlayerData()
        updateUI()
    })

    level6SpellSlotsUsedValue.addEventListener('change', event => {
        currentData.player.level6SpellSlotsUsed = event.target.value

        updatePlayerData()
        updateUI()
    })

    level7SpellSlotsUsedValue.addEventListener('change', event => {
        currentData.player.level7SpellSlotsUsed = event.target.value

        updatePlayerData()
        updateUI()
    })

    level8SpellSlotsUsedValue.addEventListener('change', event => {
        currentData.player.level8SpellSlotsUsed = event.target.value

        updatePlayerData()
        updateUI()
    })

    level9SpellSlotsUsedValue.addEventListener('change', event => {
        currentData.player.level9SpellSlotsUsed = event.target.value

        updatePlayerData()
        updateUI()
    })

    cantripsAddButton.addEventListener('click', () => {
        currentData.player.spells.cantrips.push({
            name: '',
            note: '',
        })

        updateUI()
        updatePlayerData()
    })

    level1AddButton.addEventListener('click', () => {
        currentData.player.spells.level1.push({
            name: '',
            note: '',
        })

        updateUI()
        updatePlayerData()
    })

    level2AddButton.addEventListener('click', () => {
        currentData.player.spells.level2.push({
            name: '',
            note: '',
        })

        updateUI()
        updatePlayerData()
    })

    level3AddButton.addEventListener('click', () => {
        currentData.player.spells.level3.push({
            name: '',
            note: '',
        })

        updateUI()
        updatePlayerData()
    })

    level4AddButton.addEventListener('click', () => {
        currentData.player.spells.level4.push({
            name: '',
            note: '',
        })

        updateUI()
        updatePlayerData()
    })

    level5AddButton.addEventListener('click', () => {
        currentData.player.spells.level5.push({
            name: '',
            note: '',
        })

        updateUI()
        updatePlayerData()
    })

    level6AddButton.addEventListener('click', () => {
        currentData.player.spells.level6.push({
            name: '',
            note: '',
        })

        updateUI()
        updatePlayerData()
    })

    level7AddButton.addEventListener('click', () => {
        currentData.player.spells.level7.push({
            name: '',
            note: '',
        })

        updateUI()
        updatePlayerData()
    })

    level8AddButton.addEventListener('click', () => {
        currentData.player.spells.level8.push({
            name: '',
            note: '',
        })

        updateUI()
        updatePlayerData()
    })

    level9AddButton.addEventListener('click', () => {
        currentData.player.spells.level9.push({
            name: '',
            note: '',
        })

        updateUI()
        updatePlayerData()
    })

    attacksAddButton.addEventListener('click', () => {
        currentData.player.attacks.push({
            name: '',
            note: '',
        })

        updateUI()
        updatePlayerData()
    })

    generalInfoButton.addEventListener('click', () => {
        if(generalInfo.classList.contains('open')) {
            closeAllWindows()
        }else{
            closeAllWindows()

            generalInfo.classList.add('open')
        }
    })

    notes.addEventListener('change', () => {
        currentData.player.notes = notes.value

        updatePlayerData()
        updateUI()
    })

    characterNameValue.addEventListener('change', event => {
        currentData.player.characterName = event.target.value

        updatePlayerData()
        updateUI()
    })

    classValue.addEventListener('change', event => {
        currentData.player.class = event.target.value

        updatePlayerData()
        updateUI()
    })

    backgroundValue.addEventListener('change', event => {
        currentData.player.background = event.target.value

        updatePlayerData()
        updateUI()
    })

    playerNameValue.addEventListener('change', event => {
        currentData.player.playerName = event.target.value

        updatePlayerData()
        updateUI()
    })

    raceValue.addEventListener('change', event => {
        currentData.player.race = event.target.value

        updatePlayerData()
        updateUI()
    })

    alignmentValue.addEventListener('change', event => {
        currentData.player.alignment = event.target.value

        updatePlayerData()
        updateUI()
    })

    experienceValue.addEventListener('change', event => {
        currentData.player.experience = event.target.value

        updatePlayerData()
        updateUI()
    })

    otherProfValue.addEventListener('change', event => {
        currentData.player.otherProf = event.target.value

        updatePlayerData()
        updateUI()
    })

    characterFile.addEventListener('change', event => {
        const file = event.target.files[0]

        const reader = new FileReader()
        reader.readAsText(file)

        reader.addEventListener('load', () => {
            console.log(reader.result)
            currentData = JSON.parse(reader.result)

            characterCreator.classList.remove('open')
            
            socket.emit('created-character', currentData)
        })
    })

    minituresButton.addEventListener('click', () => {
        if(minitures.classList.contains('open')) {
            closeAllWindows()
        }else{
            closeAllWindows()

            minitures.classList.add('open')
        }
    })

    createMinitureBaseButton.addEventListener('click', () => {
        let cameraDir = new THREE.Vector3()
        camera.getWorldDirection(cameraDir)
        cameraDir.multiplyScalar(.5)


        let miniture = new GameObject([
            new Component(
                new Transform(camera.position.clone().add(cameraDir), new THREE.Quaternion().setFromEuler(new THREE.Euler(0, 0, 0, 'XYZ')), new THREE.Vector3(1, 1, 1)),
                true,
            ),
            new Component(
                new Renderer('miniture-base'),
                false,
            )
        ], true)

        gameObjects.push(miniture)

        socket.emit('create-game-object', miniture.toObject(true))
    })

    deleteMinituresButton.addEventListener('click', () => {
        socket.emit('delete-minitures')
    })

    playersButton.addEventListener('click', () => {
        if(players.classList.contains('open')) {
            closeAllWindows()
        }else{
            closeAllWindows()

            socket.emit('get-players')

            players.classList.add('open')
        }
    })
}

function updateMaterialHDRI(object, textureMap = null, sides = THREE.FrontSide,){
    object.traverse(child => {
        if (child instanceof THREE.Mesh) {
            if(child.material.length != null){
                for(let i = 0; i < child.material.length; i++){
                    child.material[i] = new THREE.MeshPhysicalMaterial({
                        metalness: child.material[i].metalness,
                        roughness: child.material[i].roughness,
                        color: child.material[i].color,
                        envMap: envmap.texture,
                        side: sides,
                        map: textureMap,
                    })
                }
            }else{
                child.material = new THREE.MeshPhysicalMaterial({
                    metalness: child.material.metalness,
                    roughness: child.material.roughness,
                    color: child.material.color,
                    envMap: envmap.texture,
                    side: sides,
                    map: textureMap,
                })
            }

            child.castShadow = true
            child.receiveShadow = true
        }

        if (child instanceof THREE.DirectionalLight) {
            child.castShadow = true
            child.shadow.mapSize.width = 512
            child.shadow.mapSize.height = 512
            child.shadow.camera.near = 0.5
            child.shadow.camera.far = 500
        }
    })
}

function PolyhedronColliderFromGeometry(geometry){
    let geo = geometry.toNonIndexed().attributes.position.array

    let vertices = []
    let faces = []

    let vertCount = Math.floor(geo.length / 3)

    for (let i = 0; i < vertCount; i++) {
        vertices.push(new CANNON.Vec3(geo[i * 3], geo[i * 3 + 1], geo[i * 3 + 2]))
    }

    let faceCount = Math.floor(geo.length / 9)

    for (let i = 0; i < faceCount; i++) {
        faces.push([i * 3, i * 3 + 1, i * 3 + 2])
    }

    let shape = new CANNON.ConvexPolyhedron(vertices, faces)

    return shape
}

function GeometryToData(geometry){
    let geo = geometry.toNonIndexed().attributes.position.array

    let vertices = []
    let faces = []

    let vertCount = Math.floor(geo.length / 3)

    for (let i = 0; i < vertCount; i++) {
        vertices.push(new CANNON.Vec3(geo[i * 3], geo[i * 3 + 1], geo[i * 3 + 2]))
    }

    let faceCount = Math.floor(geo.length / 9)

    for (let i = 0; i < faceCount; i++) {
        faces.push([i * 3, i * 3 + 1, i * 3 + 2])
    }

    return {
        vertices: vertices,
        faces: faces,
    }
}

setupEventListeners()

let checkboxes = document.getElementsByClassName('checkbox')

for(let i = 0; i < checkboxes.length; i++){
    checkboxes[i].addEventListener('click', () => {
        if(checkboxes[i].classList.contains('checked')){
            checkboxes[i].classList.remove('checked')
        }else{
            checkboxes[i].classList.add('checked')
        }

        if(['saving-str-value', 'saving-dex-value', 'saving-con-value', 'saving-int-value', 'saving-wis-value', 'saving-cha-value', 'skill-acrobatics-value', 'skill-animal-handling-value', 'skill-arcana-value', 'skill-athletics-value', 'skill-deception-value', 'skill-history-value', 'skill-insight-value', 'skill-intimidation-value', 'skill-investigation-value', 'skill-medicine-value', 'skill-nature-value', 'skill-perception-value', 'skill-performance-value', 'skill-persuasion-value', 'skill-religion-value', 'skill-sleight-of-hand-value', 'skill-stealth-value', 'skill-survival-value'].includes(checkboxes[i].id)){
            if(checkboxes[i].id == 'saving-str-value'){
                currentData.player.stats.savingThrows.str = checkboxes[i].classList.contains('checked')

                updatePlayerData()
                updateUI()
            }

            if(checkboxes[i].id == 'saving-dex-value'){
                currentData.player.stats.savingThrows.dex = checkboxes[i].classList.contains('checked')

                updatePlayerData()
                updateUI()
            }

            if(checkboxes[i].id == 'saving-con-value'){
                currentData.player.stats.savingThrows.con = checkboxes[i].classList.contains('checked')

                updatePlayerData()
                updateUI()
            }

            if(checkboxes[i].id == 'saving-int-value'){
                currentData.player.stats.savingThrows.int = checkboxes[i].classList.contains('checked')

                updatePlayerData()
                updateUI()
            }

            if(checkboxes[i].id == 'saving-wis-value'){
                currentData.player.stats.savingThrows.wis = checkboxes[i].classList.contains('checked')

                updatePlayerData()
                updateUI()
            }

            if(checkboxes[i].id == 'saving-cha-value'){
                currentData.player.stats.savingThrows.cha = checkboxes[i].classList.contains('checked')

                updatePlayerData()
                updateUI()
            }

            if(checkboxes[i].id == 'skill-acrobatics-value'){
                currentData.player.stats.skills.acrobatics = checkboxes[i].classList.contains('checked')

                updatePlayerData()
                updateUI()
            }

            if(checkboxes[i].id == 'skill-animal-handling-value'){
                currentData.player.stats.skills.animalHandling = checkboxes[i].classList.contains('checked')

                updatePlayerData()
                updateUI()
            }

            if(checkboxes[i].id == 'skill-arcana-value'){
                currentData.player.stats.skills.arcana = checkboxes[i].classList.contains('checked')

                updatePlayerData()
                updateUI()
            }

            if(checkboxes[i].id == 'skill-athletics-value'){
                currentData.player.stats.skills.athletics = checkboxes[i].classList.contains('checked')

                updatePlayerData()
                updateUI()
            }

            if(checkboxes[i].id == 'skill-deception-value'){
                currentData.player.stats.skills.deception = checkboxes[i].classList.contains('checked')

                updatePlayerData()
                updateUI()
            }

            if(checkboxes[i].id == 'skill-history-value'){
                currentData.player.stats.skills.history = checkboxes[i].classList.contains('checked')

                updatePlayerData()
                updateUI()
            }

            if(checkboxes[i].id == 'skill-insight-value'){
                currentData.player.stats.skills.insight = checkboxes[i].classList.contains('checked')

                updatePlayerData()
                updateUI()
            }

            if(checkboxes[i].id == 'skill-intimidation-value'){
                currentData.player.stats.skills.intimidation = checkboxes[i].classList.contains('checked')

                updatePlayerData()
                updateUI()
            }

            if(checkboxes[i].id == 'skill-investigation-value'){
                currentData.player.stats.skills.investigation = checkboxes[i].classList.contains('checked')

                updatePlayerData()
                updateUI()
            }

            if(checkboxes[i].id == 'skill-medicine-value'){
                currentData.player.stats.skills.medicine = checkboxes[i].classList.contains('checked')

                updatePlayerData()
                updateUI()
            }

            if(checkboxes[i].id == 'skill-nature-value'){
                currentData.player.stats.skills.nature = checkboxes[i].classList.contains('checked')

                updatePlayerData()
                updateUI()
            }

            if(checkboxes[i].id == 'skill-perception-value'){
                currentData.player.stats.skills.perception = checkboxes[i].classList.contains('checked')

                updatePlayerData()
                updateUI()
            }

            if(checkboxes[i].id == 'skill-performance-value'){
                currentData.player.stats.skills.performance = checkboxes[i].classList.contains('checked')

                updatePlayerData()
                updateUI()
            }

            if(checkboxes[i].id == 'skill-persuasion-value'){
                currentData.player.stats.skills.persuasion = checkboxes[i].classList.contains('checked')

                updatePlayerData()
                updateUI()
            }

            if(checkboxes[i].id == 'skill-religion-value'){
                currentData.player.stats.skills.religion = checkboxes[i].classList.contains('checked')

                updatePlayerData()
                updateUI()
            }

            if(checkboxes[i].id == 'skill-sleight-of-hand-value'){
                currentData.player.stats.skills.sleightOfHand = checkboxes[i].classList.contains('checked')

                updatePlayerData()
                updateUI()
            }

            if(checkboxes[i].id == 'skill-stealth-value'){
                currentData.player.stats.skills.stealth = checkboxes[i].classList.contains('checked')

                updatePlayerData()
                updateUI()
            }

            if(checkboxes[i].id == 'skill-survival-value'){
                currentData.player.stats.skills.survival = checkboxes[i].classList.contains('checked')

                updatePlayerData()
                updateUI()
            }
        }
    })
    
}

//Init Infernal
let gameObjects = []

//Init THREE
let viewport = document.getElementById('viewport')
const scene = new THREE.Scene()
const camera = new THREE.PerspectiveCamera( 70, viewport.offsetWidth / viewport.offsetHeight, 0.1, 1000 )
const renderer = new THREE.WebGLRenderer()
renderer.physicallyCorrectLights = true
renderer.toneMapping = THREE.ACESFilmicToneMapping
renderer.outputEncoding = THREE.sRGBEncoding
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

renderer.setSize(viewport.offsetWidth, viewport.offsetHeight)
viewport.appendChild(renderer.domElement)

const clock = new THREE.Clock()
const selectables = new THREE.Group()
scene.add(selectables)

const loader = new THREE.FBXLoader()
const envmaploader = new THREE.PMREMGenerator(renderer);
const RGBELoader = new THREE.RGBELoader()
const textureLoader = new THREE.TextureLoader()

//Init physics
const physicsWorld = new CANNON.World()

//const cannonDebugRenderer = new THREE.CannonDebugRenderer(scene, physicsWorld );

const physicsDamping = 0.01
let timeScale = 0

physicsWorld.broadphase = new CANNON.NaiveBroadphase()
physicsWorld.gravity.set(0, -10, 0)  

//Load HDRI
let envmap = new THREE.CubeTexture()

RGBELoader.setPath('models/textures/')
.load('hdri.hdr', texture => {

    texture.mapping = THREE.EquirectangularReflectionMapping

    scene.background = texture
    scene.environment = texture
    envmap = envmaploader.fromCubemap(texture)
})

//Load Textures
textureLoader.setPath('models/textures/')

let D20Texture = textureLoader.load('D20.png')
let D12Texture = textureLoader.load('D12.png')
let D10Texture = textureLoader.load('D10.png')
let D8Texture = textureLoader.load('D8.png')
let D6Texture = textureLoader.load('D6.png')
let D4Texture = textureLoader.load('D4.png')

//Load Collision Shapes
let D20Geometry = null
let D12Geometry = null
let D10Geometry = null
let D8Geometry = null
let D6Geometry = null
let D4Geometry = null

loader.load('./models/D20.fbx', object =>{
    D20Geometry = THREE.BufferGeometryUtils.mergeVertices(object.children[0].geometry)
})

loader.load('./models/D12.fbx', object =>{
    D12Geometry = THREE.BufferGeometryUtils.mergeVertices(object.children[0].geometry)
})

loader.load('./models/D10.fbx', object =>{
    D10Geometry = THREE.BufferGeometryUtils.mergeVertices(object.children[0].geometry)
})

loader.load('./models/D8.fbx', object =>{
    D8Geometry = THREE.BufferGeometryUtils.mergeVertices(object.children[0].geometry)
})

loader.load('./models/D6.fbx', object =>{
    D6Geometry = THREE.BufferGeometryUtils.mergeVertices(object.children[0].geometry)
})

loader.load('./models/D4.fbx', object =>{
    D4Geometry = THREE.BufferGeometryUtils.mergeVertices(object.children[0].geometry)
})

//Load Scenery
loader.load('./models/Room.fbx', object =>{
    updateMaterialHDRI(object)
    scene.add(object)
})

loader.load('./models/DungeonTest.fbx', object =>{
    updateMaterialHDRI(object)

    scene.add(object)

    object.position.set(-2,.7,0)
})

//Setup Camera
camera.rotation.order = "YXZ";
camera.position.y = 1
camera.position.x = -0.7
camera.rotation.y = -Math.PI / 2

const transformer = new THREE.TransformControls(camera, renderer.domElement)
scene.add(transformer)

const updatePS = 10
let timeTillUpdate = 1/updatePS

//Setup input
const mouseMoveThreshold = 10

let mouseX = 0
let mouseY = 0
let mouseAbsX = 0
let mouseAbsY = 0
let mouseDown = false
let mouseScroll = 0
let WDown = false
let ADown = false
let SDown = false
let DDown = false
let QDown = false
let EDown = false
let RDown = false
let TDown = false
let YDown = false
let BackspaceDown = false

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
})

document.addEventListener('keydown', event => {
    console.log(event.key)

    if(event.key == 'w'){
        WDown = true
    }

    if(event.key == 'a'){
        ADown = true
    }

    if(event.key == 's'){
        SDown = true
    }

    if(event.key == 'd'){
        DDown = true
    }

    if(event.key == 'q')
    {
        QDown = true
    }

    if(event.key == 'e')
    {
        EDown = true
    }

    if(event.key == 'r')
    {
        RDown = true
    }

    if(event.key == 't')
    {
        TDown = true
    }

    if(event.key == 'y')
    {
        YDown = true
    }

    if(event.key == 'Backspace')
    {
        BackspaceDown = true
    }

    if(event.key == '1'){
        let dice = new GameObject([
            new Component(
                new Transform(camera.position.clone(), new THREE.Quaternion().setFromEuler(new THREE.Euler(Math.random() * Math.PI * 2 - Math.PI, Math.random() * Math.PI * 2 - Math.PI, Math.random() * Math.PI * 2 - Math.PI, 'XYZ')), new THREE.Vector3(.1, .1, .1)),
                true,
            ),
            new Component(
                new Renderer('D20'),
                false,
            ),
            new Component(
                new Collider(new D20Collider()),
                false,
            ),
            new Component(
                new RigidBody(3),
                true,
            ),
        ], true)

        let cameraDir = new THREE.Vector3()
        camera.getWorldDirection(cameraDir)
        cameraDir.multiplyScalar(5)

        dice.GetComponent('RigidBody').rigidBody.velocity.set(cameraDir.x, cameraDir.y, cameraDir.z)

        gameObjects.push(dice)

        socket.emit('create-game-object', dice.toObject(true))
    }

    if(event.key == '2'){
        let dice = new GameObject([
            new Component(
                new Transform(camera.position.clone(), new THREE.Quaternion().setFromEuler(new THREE.Euler(Math.random() * Math.PI * 2 - Math.PI, Math.random() * Math.PI * 2 - Math.PI, Math.random() * Math.PI * 2 - Math.PI, 'XYZ')), new THREE.Vector3(.1, .1, .1)),
                true,
            ),
            new Component(
                new Renderer('D12'),
                false,
            ),
            new Component(
                new Collider(new D12Collider()),
                false,
            ),
            new Component(
                new RigidBody(3),
                true,
            ),
        ], true)

        let cameraDir = new THREE.Vector3()
        camera.getWorldDirection(cameraDir)
        cameraDir.multiplyScalar(5)

        dice.GetComponent('RigidBody').rigidBody.velocity.set(cameraDir.x, cameraDir.y, cameraDir.z)

        gameObjects.push(dice)

        socket.emit('create-game-object', dice.toObject(true))
    }

    if(event.key == '3'){
        let dice = new GameObject([
            new Component(
                new Transform(camera.position.clone(), new THREE.Quaternion().setFromEuler(new THREE.Euler(Math.random() * Math.PI * 2 - Math.PI, Math.random() * Math.PI * 2 - Math.PI, Math.random() * Math.PI * 2 - Math.PI, 'XYZ')), new THREE.Vector3(.1, .1, .1)),
                true,
            ),
            new Component(
                new Renderer('D10'),
                false,
            ),
            new Component(
                new Collider(new D10Collider()),
                false,
            ),
            new Component(
                new RigidBody(3),
                true,
            ),
        ], true)

        let cameraDir = new THREE.Vector3()
        camera.getWorldDirection(cameraDir)
        cameraDir.multiplyScalar(5)

        dice.GetComponent('RigidBody').rigidBody.velocity.set(cameraDir.x, cameraDir.y, cameraDir.z)

        gameObjects.push(dice)

        socket.emit('create-game-object', dice.toObject(true))
    }

    if(event.key == '4'){
        let dice = new GameObject([
            new Component(
                new Transform(camera.position.clone(), new THREE.Quaternion().setFromEuler(new THREE.Euler(Math.random() * Math.PI * 2 - Math.PI, Math.random() * Math.PI * 2 - Math.PI, Math.random() * Math.PI * 2 - Math.PI, 'XYZ')), new THREE.Vector3(.1, .1, .1)),
                true,
            ),
            new Component(
                new Renderer('D8'),
                false,
            ),
            new Component(
                new Collider(new D8Collider()),
                false,
            ),
            new Component(
                new RigidBody(3),
                true,
            ),
        ], true)

        let cameraDir = new THREE.Vector3()
        camera.getWorldDirection(cameraDir)
        cameraDir.multiplyScalar(5)

        dice.GetComponent('RigidBody').rigidBody.velocity.set(cameraDir.x, cameraDir.y, cameraDir.z)

        gameObjects.push(dice)

        socket.emit('create-game-object', dice.toObject(true))
    }

    if(event.key == '5'){
        let dice = new GameObject([
            new Component(
                new Transform(camera.position.clone(), new THREE.Quaternion().setFromEuler(new THREE.Euler(Math.random() * Math.PI * 2 - Math.PI, Math.random() * Math.PI * 2 - Math.PI, Math.random() * Math.PI * 2 - Math.PI, 'XYZ')), new THREE.Vector3(.1, .1, .1)),
                true,
            ),
            new Component(
                new Renderer('D6'),
                false,
            ),
            new Component(
                new Collider(new D6Collider()),
                false,
            ),
            new Component(
                new RigidBody(3),
                true,
            ),
        ], true)

        let cameraDir = new THREE.Vector3()
        camera.getWorldDirection(cameraDir)
        cameraDir.multiplyScalar(5)

        dice.GetComponent('RigidBody').rigidBody.velocity.set(cameraDir.x, cameraDir.y, cameraDir.z)

        gameObjects.push(dice)

        socket.emit('create-game-object', dice.toObject(true))
    }

    if(event.key == '6'){
        let dice = new GameObject([
            new Component(
                new Transform(camera.position.clone(), new THREE.Quaternion().setFromEuler(new THREE.Euler(Math.random() * Math.PI * 2 - Math.PI, Math.random() * Math.PI * 2 - Math.PI, Math.random() * Math.PI * 2 - Math.PI, 'XYZ')), new THREE.Vector3(.1, .1, .1)),
                true,
            ),
            new Component(
                new Renderer('D4'),
                false,
            ),
            new Component(
                new Collider(new D4Collider()),
                false,
            ),
            new Component(
                new RigidBody(3),
                true,
            ),
        ], true)

        let cameraDir = new THREE.Vector3()
        camera.getWorldDirection(cameraDir)
        cameraDir.multiplyScalar(5)

        dice.GetComponent('RigidBody').rigidBody.velocity.set(cameraDir.x, cameraDir.y, cameraDir.z)

        gameObjects.push(dice)

        socket.emit('create-game-object', dice.toObject(true))
    }
})

document.addEventListener('keyup', event => {
    if(event.key == 'w'){
        WDown = false
    }

    if(event.key == 'a'){
        ADown = false
    }

    if(event.key == 's'){
        SDown = false
    }

    if(event.key == 'd'){
        DDown = false
    }

    if(event.key == 'q')
    {
        QDown = false
    }

    if(event.key == 'e')
    {
        EDown = false
    }

    if(event.key == 'r')
    {
        RDown = false
    }

    if(event.key == 't')
    {
        TDown = false
    }

    if(event.key == 'y')
    {
        YDown = false
    }

    if(event.key == 'Backspace')
    {
        BackspaceDown = false
    }

    /*if(event.key == 'l'){
        console.log('disconnecting')
        socket.disconnect()

        console.log('connecting to local')
        socket = io('ws://localhost:25566')
    }

    if(event.key == 'p'){
        console.log('disconnecting')
        socket.disconnect()

        console.log('connecting to local raspi')
        socket = io('ws://192.168.1.101:25566')
    }*/
})

function resetInput(){
    mouseX = 0
    mouseY = 0
    mouseScroll = 0
}

//Render Loop
function render() {
    let delta = clock.getDelta()

    timeTillUpdate -= delta

    for (let i = 0; i < gameObjects.length; i++) {
        gameObjects[i].PrePhysicsUpdate(delta)
    }

    if(timeScale != 0){
        physicsWorld.step(delta * timeScale)
    }

    for (let i = 0; i < gameObjects.length; i++) {
        gameObjects[i].Update(delta)

        if(timeTillUpdate <= 0){
            gameObjects[i].RemoteUpdate()
        }
    }

    if(timeTillUpdate <= 0){
        timeTillUpdate = 1/updatePS
    }

    //cannonDebugRenderer.update()

    requestAnimationFrame( render )
    renderer.render( scene, camera )

    let mouseMoved = Math.sqrt(Math.pow(mouseX, 2) + Math.pow(mouseY, 2)) > mouseMoveThreshold * delta

    if(mouseDown){
        if(!transformer.dragging){
            if(mouseMoved){
                camera.rotation.y += mouseX / 500
                camera.rotation.x += mouseY / 500
            }else{
                const raycaster = new THREE.Raycaster()
                const mouse = new THREE.Vector2()

                mouse.x = (mouseAbsX / viewport.offsetWidth ) * 2 - 1
                mouse.y = -(mouseAbsY / viewport.offsetHeight ) * 2 + 1

                raycaster.setFromCamera(mouse, camera)

                const intersects = raycaster.intersectObject(selectables, true)

                if(intersects.length > 0){
                    let object = intersects[0].object

                    while(object.parent.parent != null && object.parent != selectables){
                        object = object.parent
                    }

                    transformer.attach(object)
                }else{
                    transformer.detach()
                }
            }
        }
    }

    if(WDown){
        camera.translateZ(-1 * delta);
    }

    if(SDown){
        camera.translateZ(1 * delta);
    }

    if(ADown){
        camera.translateX(-1 * delta);
    }

    if(DDown){
        camera.translateX(1 * delta);
    }

    if(QDown){
        camera.translateY(-1 * delta);
    }

    if(EDown){
        camera.translateY(1 * delta);
    }

    if(TDown){
        transformer.setMode('translate')
    }

    if(YDown){
        transformer.setMode('rotate')
    }

    if(RDown){
        transformer.setMode('scale')
    }

    if(BackspaceDown){
        if(transformer.object != null){
            let object = transformer.object

            transformer.detach()

            for (let i = 0; i < gameObjects.length; i++) {
                let renderer = gameObjects[i].GetComponent('Renderer')

                if(renderer != null){
                    if(renderer.object3D == object){
                        gameObjects[i].Destroy()
                        break
                    }
                }
            }
        }
    }

    if(mouseScroll != 0){
        camera.fov += mouseScroll * delta

        if(camera.fov < 10){
            camera.fov = 10
        }

        if(camera.fov > 70){
            camera.fov = 70
        }

        camera.updateProjectionMatrix()
    }

    input = resetInput()
}

render()

//Ground
gameObjects.push(
    new GameObject([
        new Component(
            new Transform(new THREE.Vector3(0, -0.149, 0), new THREE.Quaternion().setFromEuler(new THREE.Euler(0, 0, 0, 'XYZ')), new THREE.Vector3(100, .3, 100)),
            false,
        ),
        new Component(
            new Renderer('cube'),
            false,
        ),
        new Component(
            new Collider(new BoxCollider(new THREE.Vector3(.5, .5, .5))),
            false,
        ),
        new Component(
            new RigidBody(0),
            false,
        ),
    ])
)

//Table
gameObjects.push(
    new GameObject([
        new Component(
            new Transform(new THREE.Vector3(0, 0.69, 0), new THREE.Quaternion().setFromEuler(new THREE.Euler(0, 0, 0, 'XYZ')), new THREE.Vector3(1, .04, 1.6)),
            false,
        ),
        new Component(
            new Collider(new BoxCollider(new THREE.Vector3(.5, .5, .5))),
            false,
        ),
        new Component(
            new RigidBody(0),
            false,
        ),
    ])
)

//Test
let testObject = null

socket.on('request-auth', authID => {
    console.log('Requested auth')

    if(localStorage.getItem('ID') == null){
        console.log('No auth found')
        socket.emit('send-auth', {auth: authID, proposed: 'Guest'})
    }else{
        console.log('Found auth: ' + localStorage.getItem('ID'))
        socket.emit('send-auth', {auth: authID, proposed: localStorage.getItem('ID')})
    }
})

socket.on('accepted-auth', authID => {
    console.log('Accepted auth!')

    socket.emit('join-room')
})

socket.on('new-user-accepted-auth', authID => {
    console.log('Accepted auth as new user!')

    localStorage.setItem('ID', authID)

    currentData = {
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
                name: 'Helmet',
                note: 'A helmet that can protect the head.',
            },
            {
                name: 'Chestplate',
                note: 'A chestplate that can protect the torso.',
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
            },
        ],
        stats:{
            str: 10,
            dex: 10,
            con: 10,
            int: 10,
            wis: 10,
            cha: 10,
            savingThrows: {
                str: true,
                dex: false,
                con: false,
                int: false,
                wis: false,
                cha: false,
            },
            skills: {
                acrobatics: false,
                animalHandling: false,
                arcana: false,
                athletics: false,
                deception: false,
                history: false,
                insight: false,
                intimidation: false,
                investigation: false,
                medicine: false,
                nature: false,
                perception: false,
                performance: false,
                persuasion: false,
                religion: false,
                sleightOfHand: false,
                stealth: false,
                survival: false,
            },
            hp: 10,
            mhp: 10,
            thp: 10,
            ac: 10,
            speed: 10,
            initiative: 10,
            hd: 10,
            thd: 10,
            thp: 10,
            dss: 10,
            dsf: 10,
            profBonus: 10,
        },
        attacks: [
            {
                name: 'Attack',
                note: 'A basic attack.',
            },
        ],
        spells:{
            cantrips: [
                {
                    name: 'Light',
                    note: 'A cantrip that can be cast without any material components.',
                },
            ],
            level1: [
                {
                    name: 'Light',
                    note: 'A spell that can be cast without any material components.',
                },
            ],
            level2: [
                {
                    name: 'Light',
                    note: 'A spell that can be cast without any material components.',
                },
            ],
            level3: [
                {
                    name: 'Light',
                    note: 'A spell that can be cast without any material components.',
                },
            ],
            level4: [
                {
                    name: 'Light',
                    note: 'A spell that can be cast without any material components.',
                },
            ],
            level5: [
                {
                    name: 'Light',
                    note: 'A spell that can be cast without any material components.',
                },
            ],
            level6: [
                {
                    name: 'Light',
                    note: 'A spell that can be cast without any material components.',
                },
            ],
            level7: [
                {
                    name: 'Light',
                    note: 'A spell that can be cast without any material components.',
                },
            ],
            level8: [
                {
                    name: 'Light',
                    note: 'A spell that can be cast without any material components.',
                },
            ],
            level9: [
                {
                    name: 'Light',
                    note: 'A spell that can be cast without any material components.',
                },
            ]
        },

        level1SpellSlots: 2,
        level1SpellSlotsUsed: 0,
        level2SpellSlots: 2,
        level2SpellSlotsUsed: 0,
        level3SpellSlots: 2,
        level3SpellSlotsUsed: 0,
        level4SpellSlots: 2,
        level4SpellSlotsUsed: 0,
        level5SpellSlots: 2,
        level5SpellSlotsUsed: 0,
        level6SpellSlots: 2,
        level6SpellSlotsUsed: 0,
        level7SpellSlots: 2,
        level7SpellSlotsUsed: 0,
        level8SpellSlots: 2,
        level8SpellSlotsUsed: 0,
        level9SpellSlots: 2,
        level9SpellSlotsUsed: 0,

        notes: '',

        characterName: '',
        class: '',
        background: '',
        playerName: '',
        race: '',
        alignment: '',
        experience: '',

        otherProf: '',
    }

    characterCreator.classList.add('open')
})

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
        spellsButton.remove()
    }else{
        minituresButton.remove()
    }

    updateUI()

    timeScale = 1
})

socket.on('create-game-object', object => {
    let reconstruction = new GameObject([])
    reconstruction.Reconstruct(object)

    gameObjects.push(reconstruction)
})

socket.on('update-game-object', object => {
    for (let i = 0; i < gameObjects.length; i++) {
        if(gameObjects[i].ID == object.ID){
            gameObjects[i].ReceiveUpdate(object.data)
        }
    }
})

socket.on('destroy-game-object', ID => {
    console.log('Destroying object with ID: ' + ID)

    for (let i = 0; i < gameObjects.length; i++) {
        if(gameObjects[i].ID == ID){
            gameObjects[i].Destroy()
        }
    }
})

socket.on('update-remotes', remotes => {
    /*onsole.log('Updating remotes')

    for(let i = 0; i < remote3DObjects.length; i++){
        let remote = remotes.find(remote => remote.ID == remote3DObjects[i].ID)

        if(remote != null){
            remote3DObjects[i].update(remote, true)
        }
    }*/
})

socket.on('delete-remote-3D-object' , ID => {
    /*for(let i = 0; i < remote3DObjects.length; i++){
        if(remote3DObjects[i].ID == ID){
            remote3DObjects[i].object3D.removeFromParent()
            remote3DObjects.splice(i, 1)

            i--
        }
    }*/
})

socket.on('set-players', data => {
    for(i = 0; i < playerRow.children.length; i++){
        playerRow.children[0].remove()
    }

    for(i = 0; i < data.length; i++){
        let playerButton = playerDataButtonTemplate.cloneNode(true)

        playerButton.removeAttribute('id')

        playerButton.children[0].innerHTML = data[i].playerName

        playerRow.appendChild(playerButton)

        let index = i

        playerButton.addEventListener('click', () => {
            otherPlayerDataShow.innerHTML = JSON.stringify(data[index], null, 4)
        })
    }
})