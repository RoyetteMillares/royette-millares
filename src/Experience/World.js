import * as THREE from 'three'
import Experience from './Experience';
import Ball from './Sections/BallSection';
import Sphere from './Sections/SpherePhysicsSection'

export default class World 
{
    constructor()
    {
        this.experience = new Experience()
        this.scene = this.experience.scene
        this.resources = this.experience.resources
        this.sphere = new Sphere();
        this.ball = new Ball();
        this.objectDistance = this.ball.objectsDistance
        //KUNG GANO KARAME UNG SECTION GANUN DIN KAHABA UNG LENGTH NG PARTICLES
        this.section = 4
        //KUNG GANO KARAME UNG SECTION GANUN DIN KAHABA UNG LENGTH NG PARTICLES
        this.debug = this.experience.debug



        
        //MY PARAMETERS FOR GUI
        this.parameters = {}
        this.parameters.counts = 1500
        this.parameters.sizes = 0.2
        this.parameters.color = '#1ddadd'
        //MY PARAMETERS FOR GUI

        //Debug
        if(this.debug.active)
        {
           this.folder = this.debug.gui.addFolder('Particles')
            this.folder.add(this.parameters, 'counts').name('Particles Count').min(500).max(100000).step(100).onChange(() => {
                this.particleGeo.attributes.position.count = this.parameters.counts
              })
                
              this.folder.add(this.parameters, 'sizes').name('Particles Size').min(0.2).max(1).step(0.2).onChange(() => {
                  this.particleMaterial.size = this.parameters.sizes
              })
              this.folder.addColor(this.parameters, 'color').name('Particles Color').onChange(() => {
                 this.particleMaterial.color.set(this.parameters.color)
              })
        }
        //Debug



        this.setLight()
       

        this.resources.on('ready', () => {
            this.setParticles()
        })
    }

    setLight()
    {
        this.directionalLight = new THREE.DirectionalLight('#ffffff', 1)
        this.directionalLight.position.set(1, 1, 0)
        this.scene.add(this.directionalLight)
    }
      
    setParticles()
    {
            //Particles
        this.particleGeo = new THREE.BufferGeometry()
        //Kung ilang vertices ang gusto mo!
       

        //THIS IS THE POSITION OF PARTICLES 
        this.positions = new Float32Array(this.parameters.counts * 3)
        this.color = new Float32Array(this.parameters.counts * 3)

        for(let i = 0; i < this.parameters.counts * 3; i++)
        {
            this.positions[i * 3 + 0] = (Math.random() - 0.5) * 10
            this.positions[i * 3 + 1] = this.objectDistance * 0.5 - Math.random() * this.objectDistance * this.section
            
            this.positions[i * 3 + 2] = (Math.random() - 0.5) * 10

            this.color[i] = (Math.random() - 0.5) * 10
        }
        
        this.particleGeo.setAttribute('position', 
        new THREE.BufferAttribute(this.positions, 3))

        this.particleGeo.setAttribute('color', 
        new THREE.BufferAttribute(this.color, 3))

        this.particleMaterial = new THREE.PointsMaterial({
            // color: this.parameters.color,
            
            transparent: true,
            alphaMap: this.resources.items.Particles,
            size: this.parameters.sizes,
            sizeAttenuation: true,
            // alphaTest: 0.001
            depthWrite: false,
            // blending: THREE.AdditiveBlending,
            // vertexColors: true
        })
 
        this.particles = new THREE.Points(this.particleGeo, this.particleMaterial)
        this.scene.add(this.particles)
    }

    animateParticles()
    {
        // this.particles.rotation.x += 0.001
        // this.particles.rotation.y += 0.001
        this.particles.rotation.z += 0.001
        
    }
}