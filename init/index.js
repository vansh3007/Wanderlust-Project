const mongoose = require('mongoose');
const Listing=require("../models/listing");
const initData=require("./data");

main().then(()=>{
    console.log("connected to DB");
}).catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/wanderlust');
};

const initDB= async()=>{
  await Listing.deleteMany({});
initData.data = initData.data.map((obj) => ({
  ...obj,
  owner: "66700b5e4c00763e16d75aca",
}));
  await Listing.insertMany(initData.data);
    console.log("Initial Data save");
};

initDB();
