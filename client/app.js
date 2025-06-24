const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');

canvas.width = 300;
canvas.height = 300;

const unitSize = 2;

class Vector3 {
    constructor(x=0,y=0,z=0){
        this.x = x;
        this.y = y;
        this.z = z;
    };scaled(scalingFactor){
        const {x,y,z} = this;
        const s = scalingFactor;
        return new Vector3(x*s,y*s,z*s);
    };translated(x,y,z){
        return new Vector3(
            this.x + x,
            this.y + y,
            this.z + z,
        );
    };renderOnCamera(camera){
        const translatedVector = this.translated(-camera.position.x,-camera.position.y,-camera.position.z);
        const scalingFactor = camera.focalLength / translatedVector.z;
        const scaledVector = translatedVector.scaled(scalingFactor);
        ctx.fillStyle = "black";
        ctx.fillRect(
            canvas.width/2+scaledVector.x,
            canvas.height/2-scaledVector.y,
            unitSize,unitSize
        );
    }
}

class Camera {
    constructor(position=new Vector3(),focalLength=1000){
        this.position = position;
        this.focalLength = focalLength;
    }
}

const userCamera = new Camera(new Vector3(0,0,-20),1000);
const vertices = [];

const render = () => {
    ctx.clearRect(0,0,canvas.width,canvas.height);
    vertices.forEach(v=>v.renderOnCamera(userCamera));
}


window.addEventListener("DOMContentLoaded",async ()=>{
    const response = await fetch('/api/loadModel');
    const vertexData = await response.json();
    for(const vertice of vertexData){
        vertices.push(new Vector3(vertice[0],vertice[1],vertice[2]));
    };render();
});

const step = 1;
window.addEventListener("keydown",(e)=>{
    const movementKeys = ['a','w','s','d'];
    if(e.key==="w"){userCamera.position.z+=step}
    else if(e.key==="s"){userCamera.position.z-=step}
    else if(e.key==="a"){userCamera.position.x-=step}
    else if(e.key==="d"){userCamera.position.x+=step}

    if(movementKeys.includes(e.key)){render();}
});