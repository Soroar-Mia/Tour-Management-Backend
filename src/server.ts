/* eslint-disable no-console */
import {Server} from "http"
import mongoose from "mongoose";
import app from "./app";
import { envVars } from "./app/config/env";
let server : Server;

const startServer = async () => {
    try {
        await mongoose.connect(envVars.DB_URL)
        console.log("Connected to Db");

        server = app.listen(envVars.PORT, () => {
            console.log(`Server is listening to port ${envVars.PORT}`);
        })
    } catch (error) {
        console.log(error);
    }
}

startServer();

process.on("SIGTERM", (err) => {
    console.log("SIGTERM signal .... Server shutting down ", err);
    if (server) {
        server.close(() => {
            process.exit(1);
        });
    }
    process.exit(1);
})

process.on("unhandledRejection", (err) => {
    console.log("Unhandled Rejection detected.... Server shutting down ",err);
    if(server) {
        server.close(()=>{
            process.exit(1);
        });
    }
    process.exit(1);
})

process.on("uncaughtException", (err) => {
    console.log("uncaught Exception detected.... Server shutting down ", err);
    if (server) {
        server.close(() => {
            process.exit(1);
        });
    }
    process.exit(1);
})

// Promise.reject(new Error("I catch this error"))
// throw new Error("I forgot to Handel this local error")