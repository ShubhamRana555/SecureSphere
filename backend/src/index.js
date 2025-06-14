import app from "./app.js";
import dotenv from "dotenv";
import connectDB from "./db/db.js";

dotenv.config();
const PORT = process.env.PORT || 3000;

connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server is running on port ${process.env.BASE_URL}`);
    });
  })
  .catch((err) => {
    console.error("Failed to connect to the database:", err.message);
    process.exit(1);
  });
