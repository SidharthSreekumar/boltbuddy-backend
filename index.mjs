import express from "express";
import cors from "cors";
import routes from "./routes/index.mjs";
import dotenv from "dotenv";
import rateLimit from "express-rate-limit";
import logger from "./utils/logger.mjs";

dotenv.config();

const PORT = process.env.PORT || 5000;

const app = express();

// Rate limiting
/**
 * Rate limiting middleware handler
 */
const limitHandler = (req, res, next, options) => {
  // get ip address
  const ip = req.headers["x-forwarded-for"] || req.socket.remoteAddress;
  logger.info(`Too many requests from this IP: ${ip}`);
  res.status(options.statusCode).send(options.message);
};

/**
 * Rate limiting middleware
 */
const limiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: "Too many requests from this IP, please try again later",
  handler: limitHandler
});

app.use(limiter);
app.set("trust proxy", 1); // trust first proxy

// Enable CORS
if (process.env.PRODUCTION === 'FALSE') {
  logger.info('Running in development mode');
  app.use(cors({
    origin: 'http://localhost:4200'
  }));
} else {
  logger.info("Running in production mode");
  app.use(
    cors({
      origin: "https://boltbuddy.netlify.app",
    })
  );
}

// Routes
app.use("/api", routes);


app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
