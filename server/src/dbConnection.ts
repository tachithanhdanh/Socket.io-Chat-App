import mongoose, { ConnectOptions } from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const uri: string = process.env.CONNECTION_STRING ?? "";

const clientOptions: ConnectOptions = {
  serverApi: { version: "1", strict: true, deprecationErrors: true },
};


export default async function connectDb() {
  console.log("logging uri");
  console.log(uri);
  try {
    // Create a Mongoose client with a MongoClientOptions object to set the Stable API version
    const connect = await mongoose.connect(uri, clientOptions);
    console.log(
      `MongoDB connected: ${connect.connection.host} ${connect.connection.name}`
    );
    await mongoose.connection.db.admin().command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
}
