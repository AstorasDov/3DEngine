const http = require('http');
const {readFile} = require('fs');
const path = require('path');

const read = (path) => {
    return new Promise((resolve,reject)=>{
        readFile(path,'utf-8',(err,data)=>{
            if(data){resolve(data);}
            else reject(err);
        });
    });
}

const server = http.createServer(async (req,res)=>{
    const extname = path.extname(req.url);

    switch(req.url){
        case "/":
            const html = await read('./public/index.html');
            res.writeHead(200,{"Content-Type":"text/html"});
            res.write(html);
            res.end();
            break;
        case "/api/modelData":
            const data = await read('./model.obj');
            const lines = data.split("\n");

            const vertexData = lines.filter(l=>l.startsWith('v '))
            .map(v=>v.replace("v ","").trim()).map(e=>e.split(" ")
            .map(n=>parseFloat(n)));

            const faceData = lines.filter(l=>l.startsWith("f "))
            .map(f=>f.replace("f ","").trim()).map(e=>e.split(" ")
            .map(e=>parseInt(e)));

            res.end(JSON.stringify({v:vertexData,t:faceData,whole:data}));
            break;
    }

    switch(extname){
        case ".css":
            const css = await read(path.join(__dirname,'public',req.url));
            res.writeHead(200,{"Content-Type":"text/css"});;
            res.write(css);
            res.end();
            break;
        case ".js":
            const js = await read(path.join(__dirname,'public',req.url));
            res.writeHead(200,{"Content-Type":"application/javascript"});;
            res.write(js);
            res.end();
            break;
    }
});

server.listen(3000);
