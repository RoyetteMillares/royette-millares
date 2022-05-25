import * as THREE from 'three'
import {GLTFLoader} from 'three/examples/jsm/loaders/GLTFLoader'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader';

import EventEmitter from "./EventEmitter";

export default class Resources extends EventEmitter
{
    constructor(sources)
    {
        super()

        //options
        this.sources = sources 

        //Setup
        this.items = {}
        this.toLoad = this.sources.length
        this.loaded = 0

        this.setLoaders()
        this.startLoading()
    }

    setLoaders()
    {
        this.loaders = {}
        this.loaders.gltfLoader = new GLTFLoader()
        this.loaders.textureLoader = new THREE.TextureLoader()
      
        
        this.loaders.cubeTextureLoader = new THREE.CubeTextureLoader()
        this.loaders.dracoLoader = new DRACOLoader()
    }

    startLoading()
    {   
        //Load each source loop thru sources
        for(const source of this.sources)
        {
            if(source.type === 'texture')
            {
                this.loaders.textureLoader.load(
                    source.path,
                    (file) => 
                    {
                        this.sourceLoaded(source, file);
                        
                    }
                )
                
            }
            else if(source.type === 'gltfModel')
            {
                this.loaders.gltfLoader.load(
                    source.path,
                    (file) => 
                    {
                        this.sourceLoaded(source, file);
                    }
                )
            }
            else if(source.type === 'cubeTexture')
            {
                this.loaders.cubeTextureLoader.load(
                    source.path,
                    (file) => 
                    {
                        this.sourceLoaded(source, file);
                    }
                )
            }
            else if(source.type === 'dracoModel')
            {
                this.loaders.dracoLoader.load(
                    source.path,
                    (file) => 
                    {
                        this.sourceLoaded(source, file);
                    }
                )
            }
        }
    }

    sourceLoaded(source, file)
    {
        //this.items.name mo sa assets.js
        this.items[source.name] = file
        this.loaded++

        if(this.loaded === this.toLoad)
        {
            this.trigger('ready')
        }
    }

}