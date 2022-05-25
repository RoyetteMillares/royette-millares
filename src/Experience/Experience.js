import * as THREE from 'three'
import Camera from './Camera'
import Renderer from './Renderer'
import Resources from './Utils/Resources'
import Sizes from './Utils/Sizes'
import Time from './Utils/Time'
import assets from './assets'
import World from './World'
import Debug from './Utils/Debug'




let instance = null
export default class Experience
{
    constructor(_options)
    {
        if(instance){
            return instance
        }
        instance = this

        this.debug = new Debug()
        this.canvas = _options
        this.sizes = new Sizes()
        this.time = new Time()
        this.resources = new Resources(assets)
        this.scene = new THREE.Scene()
        this.camera = new Camera()
        this.renderer = new Renderer()
        this.World = new World();

        this.sizes.on('resize', () => {
            this.resize()
        })
        
        this.time.on('tick', () => {
            this.update()
        })

    }

    resize()
    {
        this.camera.resize()
        this.renderer.resize()
        
    }

    update()
    {
        // this.camera.update()
        this.renderer.update()
       this.World.sphere.update()
       this.World.ball.animateCamera()   
       this.World.ball.animateObjects()
       this.World.ball.animaterBanner()
    //    this.World.animateParticles()
    } 

    
}