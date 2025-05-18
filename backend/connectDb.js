import mongoose from "mongoose";

const connectDb = async () => {
    try {
        const conn = await mongoose.connect(`${process.env.MONGO_URL}/todo`);
        console.log(`database connected successfully`);

        // console.log(conn);
    } catch (error) {
        console.log("error occured in connecting db", error);
    }
};

export default connectDb;
