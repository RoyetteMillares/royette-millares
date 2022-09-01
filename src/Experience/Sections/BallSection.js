import * as THREE from 'three'
import Experience from '../Experience'
import gsap from 'gsap'
import landscapes from '../../../static/assets/images.jpg'
import vertexIco from '../shaders/vertexIco.glsl'
import fragmentIco from '../shaders/fragmentIco.glsl'
import fragment1 from '../shaders/fragment1.glsl'


export default class Ball {
    constructor() {
        this.experience = new Experience()
        this.scene = this.experience.scene
        this.camera = this.experience.camera.instance
        this.cameraG = this.experience.camera.cameraGroup
        this.sizes = this.experience.sizes
        this.sizesHeight = this.experience.sizes.height
        this.debug = this.experience.debug
        this.resources = this.experience.resources
        this.resources.loaders.textureLoader.magFilter = THREE.NearestFilter
        this.renderer = this.experience.renderer


        //TIME
        this.clock = new THREE.Clock()
        this.previousTime = 0
        //TIME
        //MY PARAMETER FOR DEBUG GUI
        this.parameter = {}
        this.parameter.color = '#ededed'




        this.objectsDistance = 11;
        //Parallax
        this.cursor = {}
        this.cursor.x = 0
        this.cursor.y = 0

        window.addEventListener('mousemove', (e) => {
            this.cursor.x = e.clientX / this.sizes.width - 0.5
            this.cursor.y = e.clientY / this.sizes.height - 0.5
        })

        //SCROLLING MADE SIMPLE FOR NOW
        this.scrollY = window.scrollY
        this.currentSection = 0
        //SCROLLING MADE SIMPLE FOR NOW




        this.setBall()
        this.animateScroll()


    }

    setBall() {
        let t = new THREE.TextureLoader().load(landscapes)
        t.wrapS = t.wrapT = THREE.MirroredRepeatWrapping;
        //MESHES
        //ICOSAHEDRON WOW
        this.material = new THREE.ShaderMaterial({
            extensions: {
                derivatives: "#extension GL_OES_standard_derivatives : enable"
            },
            side: THREE.DoubleSide,
            uniforms: {
                time: { type: "f", value: 0 },
                landscape: { value: t },

                resolution: { type: "v4", value: new THREE.Vector4() },
                uvRate1: {
                    value: new THREE.Vector2(1, 1)
                }
            },

            // wireframe: true,

            vertexShader: vertexIco,
            fragmentShader: fragmentIco
        });
        //MATERIAL 1
        this.material1 = new THREE.ShaderMaterial({
            extensions: {
                derivatives: "#extension GL_OES_standard_derivatives : enable"
            },
            side: THREE.DoubleSide,
            uniforms: {
                time: { type: "f", value: 0 },
                landscape: { value: t },

                resolution: { type: "v4", value: new THREE.Vector4() },
                uvRate1: {
                    value: new THREE.Vector2(1, 1)
                }
            },

            // wireframe: true,

            vertexShader: vertexIco,
            fragmentShader: fragment1
        });
        //MATERIAL 1


        // this.geoOne = new THREE.IcosahedronGeometry(3,2);
        this.geoOne1 = new THREE.IcosahedronBufferGeometry(2, 2);
        let length = this.geoOne1.attributes.position.array.length;

        let barys = [];

        for (let i = 0; i < length / 3; i++) {
            barys.push(0, 0, 1, 0, 1, 0, 1, 0, 0)

        }

        let aBary = new Float32Array(barys);
        this.geoOne1.setAttribute('aBary', new THREE.BufferAttribute(aBary, 3),)

        this.mesh = new THREE.Mesh(this.geoOne1, this.material);
        this.icoLines = new THREE.Mesh(this.geoOne1, this.material1);
        this.scene.add(this.mesh)
        this.scene.add(this.icoLines)

        //ICOSAHEDRON WOW

        this.geoN = new THREE.TorusBufferGeometry(1, 0.4, 16, 60)
        this.materialOne = new THREE.MeshToonMaterial({
            color: this.parameter.color,
            gradientMap: this.resources.items.objectsMap
        })
        this.meshN = new THREE.Mesh(this.geoN, this.materialOne)
        this.scene.add(this.meshN)

        this.geoTwo = new THREE.ConeBufferGeometry(1, 2, 32)
        this.materialTwo = new THREE.MeshToonMaterial({
            gradientMap: this.resources.items.objectsMap,
            color: this.parameter.color
        })
        this.meshTwo = new THREE.Mesh(this.geoTwo, this.materialTwo)
        this.scene.add(this.meshTwo)

        this.geoThree = new THREE.TorusKnotBufferGeometry(0.8, 0.35, 100, 16)
        this.materialThree = new THREE.MeshToonMaterial({
            gradientMap: this.resources.items.objectsMap,
            color: this.parameter.color
        })
        this.meshThree = new THREE.Mesh(this.geoThree, this.materialThree)
        this.scene.add(this.meshThree)

        this.mesh.position.y = - this.objectsDistance * 0
        this.meshN.position.y = - this.objectsDistance * 1
        this.meshTwo.position.y = - this.objectsDistance * 2
        this.meshThree.position.y = - this.objectsDistance * 3

        //BANNER

        this.banner = new THREE.Group(this.mesh, this.icoLines);
        this.banner.position.x = 0.005;

        //BANNER

        this.meshN.position.x = 4
        this.meshTwo.position.x = -4
        this.meshThree.position.x = 4


        this.sectionMeshes = [this.meshN, this.meshTwo, this.meshThree]


        //DEBUG
        if (this.debug.active) {
            this.folderColor = this.debug.gui.addFolder('Objects Color')
            this.folderColor.addColor(this.parameter, 'color').name('Circle Color').onChange(() => {
                this.materialOne.color.set(this.parameter.color)
            })
            this.folderColor.addColor(this.parameter, 'color').name('Cone Color').onChange(() => {
                this.materialTwo.color.set(this.parameter.color)
            })
            this.folderColor.addColor(this.parameter, 'color').name('TorusKnot Color').onChange(() => {
                this.materialThree.color.set(this.parameter.color)
            })

            this.folderPos = this.debug.gui.addFolder('Position of Sphere')

            this.folderPos.add(this.banner.position, 'x').name('Pos X').onChange(() => {

            })



        }
        //DEBUG

    }
    animateCamera() {
        this.elapsedTime = this.clock.getElapsedTime()
        this.deltaTime = this.elapsedTime - this.previousTime
        this.previousTime = this.elapsedTime



        this.parallaxX = this.cursor.x * 0.5
        this.parallaxY = - this.cursor.y * 0.5

        this.cameraG.position.x += (this.parallaxX - this.cameraG.position.x) * 3 * this.deltaTime
        this.cameraG.position.y += (this.parallaxY - this.cameraG.position.y) * 3 * this.deltaTime

        this.camera.position.y = - this.scrollY / this.sizesHeight * this.objectsDistance
    }
    animateObjects() {
        for (const mesh of this.sectionMeshes) {
            // mesh.rotation.x = this.elapsed * 10
            // mesh.rotation.y = this.elapsed * 12
            //YETTE ung portfolio dapat taposin mona to ehh
            mesh.rotation.x += 0.1 * this.deltaTime
            mesh.rotation.y += 0.2 * this.deltaTime

        }
    }



    animateScroll() {

        window.addEventListener('scroll', () => {
            this.scrollY = window.scrollY
            this.newSection = Math.round(this.scrollY / this.sizes.height)
            if (this.newSection != this.currentSection) {
                this.currentSection = this.newSection

                gsap.to(
                    this.sectionMeshes[this.currentSection].rotation,
                    {
                        duration: 1.5,
                        ease: 'power2.inOut',
                        x: '+=6',
                        y: '+=6'
                    }
                )


            }
        })
    }

    animaterBanner() {
        //BANNER ANIMATION ROTATION
        this.mesh.rotation.x += 0.01 * this.deltaTime
        this.mesh.rotation.y += 0.02 * this.deltaTime
        this.icoLines.rotation.x += 0.01 * this.deltaTime
        this.icoLines.rotation.y += 0.02 * this.deltaTime


    }



}