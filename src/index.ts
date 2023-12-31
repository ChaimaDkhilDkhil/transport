import express ,{Request,Response}  from "express";
import mongoose from "mongoose";
import Transport from "./transport.model";
import bodyParser from "body-parser";


const app =express();

const PORT = process.env.PORT || 3000;
const eurekaHelper = require('./eureka-helper');

app.listen(PORT, () => {
  console.log("transport-server on 3000");
})

eurekaHelper.registerWithEureka('transport-server', PORT);
app.use(bodyParser.json())

const uri="mongodb://localhost:27017/transports";
mongoose.connect(uri,(err)=>{
    if (err)console.log(err)
    else console.log("Mongo Database connected successfuly")





});




app.get("/transports",(req:Request,resp:Response)=>{
  Transport.find((err,transports)=>{
     if(err) resp.status(500).send(err);
     else resp.send(transports);
  
});
});



app.get("/transports/:id",(req:Request,resp:Response)=>{
    Transport.findById(req.params.id,(err:any,transport:any)=>{
       if(err) resp.status(500).send(err);
       else resp.send(transport);
    
  });
  });



  app.put("/transports/:id",(req:Request,resp:Response)=>{
    let transport=Transport.findByIdAndUpdate(req.params.id,req.body,(err:any)=>{
        if(err) resp.status(500).send(err)
        else resp.send("transport update")
    });
});



app.delete("/transports/:id",(req:Request,resp:Response)=>{
    let transport=Transport.findByIdAndDelete(req.params.id,req.body,(err:any)=>{
        if(err) resp.status(500).send(err)
        else resp.send("transport deleted")
    });
});


app.get('/transportsSearch',(req:Request,res:Response)=>{
    const search = req.query.search || '';
    const page:number = parseInt(req.query.page?.toString()||'1');
    const size:number = parseInt(req.query.size?.toString()||'5');

    Transport.paginate({title:{$regex:".*(?i)"+search+".*"}},{page:page,limit:size},(err:any,transports:any)=>{
        if(err) res.status(500).send(err);
        else res.send(transports);
    });
    
});






app.post("/transports",(req:Request,resp:Response)=>{
let transport =new Transport(req.body)
transport.save(err=>{
    if(err) resp.status(500).send(err);
    else resp.send(transport);
});
});

app.get("/",(req,resp)=>{
    resp.send("MCHA YACINE MCHA")
});

app.listen(8085,()=>{
    console.log("server srtared")
})