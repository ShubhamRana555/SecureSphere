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

app.get("/", (req, res) => {
  res.send("Hello, World!");
});

app.get("/home", (req, res) => {
  res.send("Welcome to the Home Page!");
});

// Import routes
import authRouter from './routes/auth.route.js';
import userRouter from './routes/user.route.js';
app.use("/auth", authRouter);
app.use("/user", userRouter);

export default app;
