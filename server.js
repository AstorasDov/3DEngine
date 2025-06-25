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

const server = http.createServer(async(req,res)=>{
    const extname = path.extname(req.url);
    switch(req.url){
        case "/":
            const html = await read('./client/index.html');
            res.writeHead(200,{"Content-Type":"text/html"});
            res.end(html);
            break;
        case "/api/model":
            const data = await read('./Model/model.obj');
            const lines = data.split('\n');

            const vertexData = lines.filter(l=>l.startsWith('v '))
            .map(l=>l.replace('v ',"").trim().split(' ').map(n=>parseFloat(n)));

            const faceData = lines.filter(f=>f.startsWith('f '))
            .map(f=>f.replace('f ',"").trim().split(' ').map(n=>parseFloat(n)));

            res.writeHead(200,{"Content-Type":"application/json"});
            res.end(JSON.stringify({v:vertexData,f:faceData}));
            break;
    }

    switch(extname){
        case ".css":
            const css = await read(path.join(__dirname,'client',req.url));
            res.writeHead(200,{"Content-type":"text/css"})
            res.end(css);
            break;
        case ".js":
            const js = await read(path.join(__dirname,'client',req.url));
            res.writeHead(200, {"Content-Type": "application/javascript"});
            res.end(js);
            break;
    }
});

server.listen(3000);
