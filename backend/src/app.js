import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(
  cors({
    origin: process.env.BASE_URL || "http://localhost:3000",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);


// Import routes
import authRouter from './routes/auth.route.js';
import userRouter from './routes/user.route.js';
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/user", userRouter);

export default app;
