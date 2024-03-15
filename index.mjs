import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import routes from "./routes/index.mjs";

dotenv.config();

const PORT = process.env.PORT || 5000;

const app = express();

// Routes
app.use("/api", routes);

// Enable CORS
app.use(cors());

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
