import express from 'express';
import dotenv from "dotenv";
import indexRouter from "./routes/index.js";
import config from "./config/config.js";
import { dbConnection } from './config/db.config.js';
import morgan from "morgan";
import mongoSanitize from 'express-mongo-sanitize';

dotenv.config();

const app = express();

dbConnection();

app.use(morgan('combined'));
app.use(express.json());
app.use(mongoSanitize());

app.use("/api/v1", indexRouter);

//Error handling for unmatched routes
app.use((req, res, next) =>{
    const error = new Error("Page not found");
    error.status = 400;
    next(error);
})

//Error handler middleware
app.use((error, req, res, next) =>{
    res.status(error.status || 500).json({
        status: false,
        error: error.message
    })
})

app.listen(config.PORT, () =>{
    console.log(`Server running in ${config.NODE_ENV} environment on port ${config.PORT}`);
});