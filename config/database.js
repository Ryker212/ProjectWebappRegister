const mongoose = require('mongoose');

const { MONGO_URI } = process.env;

exports.conect = () =>{

        mongoose.connect(MONGO_URI,{
            useNewUrlParser: true,
            useUnifiedTopology: true,
            //useCreateIndex: true,
            //useFindAndModidy: false
        })
        .then(() => {
            console.log("Connected to databse complete");
        })
        .catch((error) => {
            console.log("Error conecting to database");
            console.error(error);
            process.exit(1);
        });

}