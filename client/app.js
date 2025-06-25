const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');

class Vector3 {
    constructor(x=0,y=0,z=0){
        this.x = x;
        this.y = y;
        this.z = z;
    };scaled(s){
        const {x,y,z} = this;
        return new Vector3(x*s,y*s,z*s);
    };translated(i,j,k){
        const {x,y,z} = this;
        return new Vector3(x+i,y+j,z+k);
    };renderOnCanvas(camera,context){
        const translatedVector = this.translated(-camera.pos.x,-camera.pos.y,-camera.pos.z);
        const s = camera.focal / translatedVector.z;
        const scaled = translatedVector.scaled(s);
        context.fillStyle = "black";
        context.fillRect(canvas.width/2+scaled.x,canvas.height/2-scaled.y,5,5);
    }
}

class Triangle {
    constructor(a=new Vector3,b=new Vector3,c=new Vector3){
        this.a=a;this.b=b;this.c=c;
    }
}

class Camera {
    constructor(pos=new Vector3,focal=500){
        this.pos = pos;
        this.focal = focal;
    }
}

const userCamera = new Camera(new Vector3(0,0,-2),500);
const vertices = [];
const triangles = [];

window.addEventListener("DOMContentLoaded",async()=>{
    const response = await fetch('/api/model');
    const object = await response.json();

    const {v,f} = object;

    for(const vertex of v){
        vertices.push(new Vector3(vertex[0],vertex[1],vertex[2]));
    };for(const triangle of f){
        triangles.push(
            new Triangle(
                vertices[triangle[0]-1],
                vertices[triangle[1]-1],
                vertices[triangle[2]-1]
            )
        );
    };console.log(triangles);
});
