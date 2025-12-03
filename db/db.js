import mongoose from 'mongoose';
const connectDb = () => {
    mongoose.connect("mongodb://localhost:27017/test").then((c) => {
        if (c.Connection) {
            console.log("DB connected succesfully");
        }
    })
}


export default connectDb;