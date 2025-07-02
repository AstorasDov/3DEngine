class Vector3 {
    constructor(x=0,y=0,z=0){
        this.x = x;
        this.y = y;
        this.z = z;
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

class Camera {
    constructor(position=new Vector3,focalLength=1000){
        this.position = position;
        this.focalLength = focalLength;
    }
}

const canvas = document.querySelector('canvas');
canvas.width = "500";canvas.height = "500";

const userCamera = new Camera(new Vector3);
