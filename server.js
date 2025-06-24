const http = require('http');
const path = require('path');
const {readFile} = require('fs');

const read = (path) => {
    return new Promise((resolve,reject)=>{
        readFile(path,'utf-8',(err,data)=>{
            if(data){resolve(data);}
            else {reject(err);}
        });
    });
}

const server = http.createServer(async(req,res)=>{
    const extname = path.extname(req.url);

    switch(req.url){
        case "/":
            const html = await read(path.join(__dirname,'client','index.html'));
            res.write(html);
            res.end();
            break;
        case "/api/loadModel":
            const model = await read('./Model/model.obj');
            const lines = model.split('\n');
            const vertexData = lines.filter(line=>line.startsWith('v '));
            const vertices = vertexData.map(v => v.replace(/^v\s+/, '').trim().split(/\s+/).map(Number));

            res.end(JSON.stringify(vertices));
            break;
    }

    switch(extname){
        case '.css':
            const css = await read(path.join(__dirname,'client',req.url));
            res.write(css);
            res.end();
            break;
        case '.js':
            const js = await read(path.join(__dirname,'client',req.url));
            res.write(js);
            res.end();
            break;
    }
});

server.listen(3000);