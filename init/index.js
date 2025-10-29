const mongoose =require("mongoose")
const initdata=require("./data.js")
const Listing =require("../models/listing.model.js")

MONGO_URI="mongodb://127.0.0.1:27017/rentro"
main().then(()=>{
    console.log("connected to db");
    
}).catch(err=>{
    console.log(err);
    
})
async function main(){
 mongoose.connect(MONGO_URI)
}

const initDB= async()=>{
    await Listing.deleteMany({});
    initdata.data=initdata.data.map((obj)=>({...obj,owner:"68fc6dbd839498081741987a"}))
    await Listing.insertMany(
      initdata.data
    )
    console.log("data has been initiallised");
}
initDB();