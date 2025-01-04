const mongoose = require("mongoose");

/*exports.connectDatabase = async () => {
  await mongoose
    .connect(process.env.MONGO_URI)
    .then((con) => console.log(`Database Connected: ${con.connection.host}`))
    .catch((err) => console.log(err));
};*/

const connectDatabase = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`Database Connected: ${conn.connection.host}`);
  }catch(err){
    console.log(err);
    process.exit(1);
  }
}

module.exports = connectDatabase;
