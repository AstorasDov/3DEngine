class Vector3 {
    constructor(x=0,y=0,z=0){
        this.x = x;
        this.y = y;
        this.z = z;
    };rotateZ(angle){
        const {x,y} = this;
        this.x = x * Math.cos(angle) - y * Math.sin(angle);
        this.y = x * Math.sin(angle) + y * Math.cos(angle);
    };rotateY(angle){
        const {x, y, z} = this;
        this.x = x * Math.cos(angle) + z * Math.sin(angle);
        this.z = -x * Math.sin(angle) + z * Math.cos(angle);
    };translated(a,b,c){
        return new Vector3(
            this.x + a,
            this.y + b,
            this.z + c
        );
    };scaled(s){
        return new Vector3(
            this.x * s,
            this.y * s,
            this.z * s
        );
    };onScreen(camera){
        const translated = this.translated(
            -camera.position.x,-camera.position.y,-camera.position.z
        );const scalingFactor = camera.focalLength / translated.z;
        const scaled = translated.scaled(scalingFactor);
        return new Vector3(scaled.x,scaled.y,scaled.z);
    };draw(canvas,camera){
        const ctx = canvas.getContext('2d');
        const point = this.onScreen(camera);
        ctx.fillStyle = "black";
        ctx.fillRect(canvas.width/2+point.x,canvas.height/2+point.y,2,2);
    }
}

class Triangle {
    constructor(a,b,c){
        this.a = a;
        this.b = b;
        this.c = c;
    };outline(canvas,camera){
        const pointA = this.a.onScreen(camera);
        const pointB = this.b.onScreen(camera);
        const pointC = this.c.onScreen(camera);

        const ctx = canvas.getContext('2d');
        ctx.beginPath();
        ctx.moveTo(canvas.width/2+pointA.x,canvas.height/2+pointA.y);
        ctx.lineTo(canvas.width/2+pointB.x,canvas.height/2+pointB.y);
        ctx.lineTo(canvas.width/2+pointC.x,canvas.height/2+pointC.y);
        ctx.closePath();
        ctx.stroke();
    };fill(color,canvas,camera){
        const pointA = this.a.onScreen(camera);
        const pointB = this.b.onScreen(camera);
        const pointC = this.c.onScreen(camera);

        const ctx = canvas.getContext('2d');
        ctx.beginPath();
        ctx.moveTo(canvas.width/2+pointA.x,canvas.height/2+pointA.y);
        ctx.lineTo(canvas.width/2+pointB.x,canvas.height/2+pointB.y);
        ctx.lineTo(canvas.width/2+pointC.x,canvas.height/2+pointC.y);
        ctx.closePath();

        ctx.fillStyle = color;
        ctx.fill();
    };normal(){
        const u = new Vector3(this.b.x-this.a.x,this.b.y-this.a.y,this.b.z-this.a.z);
        const v = new Vector3(this.c.x-this.a.x,this.c.y-this.a.y,this.c.z-this.a.z);
        const crossProduct = new Vector3( u.y * v.z - u.z * v.y,u.z * v.x - u.x * v.z,u.x * v.y - u.y * v.x);


        const {x,y,z} = crossProduct;
        const length = Math.sqrt(x*x+y*y+z*z);
        const normal = new Vector3(crossProduct.x/length,crossProduct.y/length,crossProduct.z/length);

        return normal;
    }
}

class Camera {
    constructor(position=new Vector3,focalLength=1000){
        this.position = position;
        this.focalLength = focalLength;
    }
}

const container = document.querySelector("#container");
const canvas = document.querySelector('canvas');
canvas.width = 500;canvas.height = 500;

const userCamera = new Camera(new Vector3(0,0,-8));

const vertices = [];
const triangles = [];

const update = () => {
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0,0,canvas.width,canvas.height);
    triangles.forEach((t)=>{
        const normal = t.normal();
        const vectorToCamera = new Vector3(
            userCamera.position.x - normal.x,
            userCamera.position.y - normal.y,
            userCamera.position.z - normal.z
        );const dotProduct = normal.x * vectorToCamera.x + normal.y * vectorToCamera.y + normal.z * vectorToCamera.z;
        if(dotProduct > 0){
            t.outline(canvas,userCamera);
            t.fill("orange",canvas,userCamera);
        }
    });
}

setInterval(()=>{
    vertices.forEach(v=>v.rotateY(0.01));
    vertices.forEach(v=>v.rotateZ(0.01));
    update();
},10);

window.addEventListener("DOMContentLoaded",async ()=>{
    const response = await fetch("/api/modelData");
    const object = await response.json();
    for (const v of object.v){
        vertices.push(new Vector3(v[0],v[1],v[2]));
    };for(const t of object.t){
        triangles.push(new Triangle(
            vertices[t[0]-1],
            vertices[t[1]-1],
            vertices[t[2]-1]
        ));
    }

    container.textContent = object.whole;
});
