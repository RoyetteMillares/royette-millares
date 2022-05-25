import * as dat from 'lil-gui'

export default class Debug
{
    constructor()
    {

        this.active = window.location.hash === '#debugRoyette'
        

        if(this.active)
        {
            this.gui = new dat.GUI({width: 295})
        }
        
    }
}