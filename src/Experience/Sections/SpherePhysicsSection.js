import * as THREE from 'three'
import Experience from "../Experience"
import fragmentShaders from '../shaders/fragment.glsl'
import vertexShaders from '../shaders/vertex.glsl'
import * as OIMO from 'oimo'

export default class SpherePhysics
{
    constructor()
    {
        //SetUp
        this.experience = new Experience()
        this.time = this.experience.time
        this.sizes = this.experience.sizes
        this.camera = this.experience.camera.instance
        this.scene = this.experience.scene
        this.debug = this.experience.debug
        
        this.raycaster = new THREE.Raycaster()
     
        this.mouse = new THREE.Vector2(0,0)
        this.point = new THREE.Vector3(0,0,0)
        //MY PARAMETERS FOR GUI
        this.debugObject = {}
        this.debugObject.createBody = () => {
            this.createBox()   
        } 
             
        //MY PARAMETERS FOR GUI
        // DEBUG 
        if(this.debug.active)
        {
               
            this.debug.gui.add(this.debugObject, 'createBody').name('Create Box')
        }

        

        // DEBUG 

        
        
        // this.objectsToUpdate = []
        this.mouseMove()
        this.setPhysics()
        this.addMesh()
        //MY OBJECTS
        this.createBox()
        this.createBox()
     

    }

    mouseMove()
    {
        let that = this
        this.testPlane = new THREE.Mesh(new THREE.PlaneBufferGeometry(50,50),
            new THREE.MeshBasicMaterial({color: 0xff0000})
        )
     

        window.addEventListener('mousemove', (e) => {
            that.mouse.x = (e.clientX / this.sizes.width) * 2 - 1
            that.mouse.y = - (e.clientY / this.sizes.height) * 2 + 1

            that.raycaster.setFromCamera(that.mouse, that.camera);

            let intersects = that.raycaster.intersectObjects([that.testPlane]);

            if(intersects.length > 0)
            {
                that.point = intersects[0].point
                // console.log(intersects[0].point);
            }

        }, false);
    }
   
    addMesh() 
    {
        this.material = new THREE.ShaderMaterial({
            extensions: {
                derivatives: "#extension GL_OES_standard_derivatives : enable "
            },
            
            side: THREE.DoubleSide,
            uniforms: {
                time: { type: "f", value: 0 },
                resolution: {type: "v4", value: new THREE.Vector4()},
                uvRate1: {
                    value: new THREE.Vector2(1, 1)
                }
            },

            fragmentShader: fragmentShaders,
            vertexShader: vertexShaders,
            
        })
        // this.geometry = new THREE.OctahedronBufferGeometry(1);
        this.geometry = new THREE.TetrahedronBufferGeometry(1, 1, 1);

        let pos = this.geometry.attributes.position
        let count = pos.count / 3 
        let bary = []

        for(let i = 0; i < count; i++)
        {
            bary.push(0,0,1, 0,1,0, 1,0,0)
        }

        bary = new Float32Array(bary)

        this.geometry.setAttribute('barycentric', new THREE.BufferAttribute(bary, 3))


        this.mesh = new THREE.Mesh( this.geometry, this.material );
        //My mesh THREE JS MESH THE OBJECTS THAT CAN COLLIDE WITH THE PHYSICS NOW ITS ONLY MOUSE!
        // this.scene.add( this.mesh );

      
        
      
    }
    
    setPhysics()
    {
        //PHYSICS PARTS 
        this.bodies = [];

        this.world = new OIMO.World({ 
            timestep: 1/60, 
            iterations: 8, 
            broadphase: 2, // 1 brute force, 2 sweep and prune, 3 volume tree
            worldscale: 1, // scale full world 
            random: true,  // randomize sample
            info: false,   // calculate statistic or not
            gravity: [0,0,0] 
        });

          this.body = this.world.add({ 
            type:'box', // type of shape : sphere, box, cylinder 
            size:[1,1,1], // size of shape
            pos:[0,0,0], // start position in degree
            rot:[0,0,90], // start rotation in degree
            move:true, // dynamic or statique
            density: 1,
            noSleep: true,
            friction: 0.2,
            restitution: 0.2,
            belongsTo: 1, // The bits of the collision groups to which the shape belongs.
            collidesWith: 0xffffffff // The bits of the collision groups with which the shape collides.
        });
        //POSITION OF MY GROUND in PHYSICS
        //y
        this.ground = this.world.add({size:[40, 1, 40], pos:[0,-8,0] })
        this.ground1 = this.world.add({size:[40, 1, 40], pos:[0,8,0] })
        
        //x
        this.left = this.world.add({size:[1, 40, 40], pos:[-14.5,0,0] })
        this.right = this.world.add({size:[1, 40, 40], pos:[14.5,0,0] })

        
        //Z
        this.z = this.world.add({size:[40, 40, 1], pos:[0,0,-1] })
        this.z1 = this.world.add({size:[40, 40, 1], pos:[0,0,1] })
    }
    //Box one
    createBox()
    {
        let o = {}

        let body = this.world.add({ 
            type:'box', // type of shape : sphere, box, cylinder 
            size:[1,1,1], // size of shape
            pos:[Math.random(3) * 7 - 6,Math.random(4) * 2,0], // start position in degree
            rot:[0,0,90], // start rotation in degree
            move:true, // dynamic or statique
            density: 1,
            friction: 0.2,
            restitution: 0.2,
            belongsTo: 1, // The bits of the collision groups to which the shape belongs.
            collidesWith: 0xffffffff // The bits of the collision groups with which the shape collides.
        });
      
        let mesh = new THREE.Mesh(
            new THREE.BoxBufferGeometry(1,1,1),
            new THREE.MeshBasicMaterial({color: 0xfff000})
        );
        //THE PHYSICS PART OF THE OBJECT
        mesh = new THREE.Mesh( this.geometry, this.material );
        o.body = body;
        //THE THREE JS MESH
        o.mesh = mesh;

        this.scene.add(mesh)
        this.bodies.push(o)
    }
    
    resize(){
        window.addEventListener('resize', () => {
            console.log('you resize');
            console.log(Math.round(this.sizes.height));
            console.log(Math.round(this.sizes.width));
        })
    }
   

    update()
    {
        //Update Physics World
        this.world.step()
        this.body.awake();
        this.body.setPosition(this.point)
        
        this.mesh.position.copy( this.body.getPosition() );
        this.mesh.quaternion.copy( this.body.getQuaternion() );
        this.bodies.forEach( b => {
            b.mesh.position.copy( b.body.getPosition() );
        b.mesh.quaternion.copy( b.body.getQuaternion() );
        })
        
    }

    
}

