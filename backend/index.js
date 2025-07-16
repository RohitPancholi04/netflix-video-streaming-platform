import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import databaseConnection from "./utils/database.js";
import userRoute from "./routes/userRoute.js";

dotenv.config({ path: ".env" });

const app = express();
databaseConnection();


app.use(cors({
  origin: "http://localhost:3000",
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use("/api/v1/user", userRoute);


app.listen(process.env.PORT, () => {
  console.log(`✅ Server listening on port ${process.env.PORT}`);
});
