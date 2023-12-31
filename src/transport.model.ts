import mongoose from "mongoose";

import mongoosePaginate from "mongoose-paginate"
let transportSchema = new mongoose.Schema({

   
    title: { type: String, required: true },
    idTransport: { type: String, required: true },
    description: { type: String, required: true }
   
    });
    
    transportSchema.plugin(mongoosePaginate)
    const transport = mongoose.model("transport",transportSchema)
    export default transport;