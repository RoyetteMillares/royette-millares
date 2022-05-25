import * as THREE from 'three'
import Experience from './Experience'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'

export default class Camera
{
    constructor()
    {
        this.experience = new Experience()
        this.canvas = this.experience.canvas
        this.sizes = this.experience.sizes
        this.time = this.experience.time
        this.scene = this.experience.scene
        //CAMERA GROUP
        
        
        this.setInstance()
        // this.setOrbit()
    }
    
    
    setInstance()
    {
        this.cameraGroup = new THREE.Group()
        this.instance = new THREE.PerspectiveCamera(45, this.sizes.width / this.sizes.height, 1, 1000);
        this.instance.position.z = 10
        this.cameraGroup.add(this.instance)
        this.scene.add(this.cameraGroup)

       
    }
    setOrbit()
    {
        this.controls = new OrbitControls(this.instance, this.canvas)
        this.controls.enableDamping = true
    }

    resize()
    {
        this.instance.aspect = this.sizes.width / this.sizes.height
        this.instance.updateProjectionMatrix()
    }

    update(){
        this.controls.update()
    }
}