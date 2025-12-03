
import mongoose from "mongoose";


export const connectDb = () => {
    mongoose.connect(process.env.MONGO_URI).then((c) => {
        if (c.Connection) {
            console.log("DB connected succesfully");

        }
    })
}