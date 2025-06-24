import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

export const dbConnect = () => {

    mongoose.connect(process.env.DATABASE_URL)
        .then(() => {
            console.log("Connection with the database is done");
        })
        .catch((err) => {
            console.log("Something went wrong");
            console.error(err.message);
            process.exit(1);
        });
};
