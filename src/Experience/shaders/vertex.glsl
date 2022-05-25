uniform float time;
varying vec2 vUv;

uniform vec2 pixels;


attribute vec3 barycentric;


varying vec3 vBarycentric;

void main(){

        vUv = uv;
        vBarycentric =  barycentric;

        gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

      
       

      
}