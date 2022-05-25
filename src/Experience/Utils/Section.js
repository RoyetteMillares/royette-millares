import * as THREE from 'three'


export default class Section
{
    constructor(name)
    {
        this.name = name;

        this.element = new THREE.Object3D()
    }

    add(object)
    {
        this.element.add(object)
    }
}