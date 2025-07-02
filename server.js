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
