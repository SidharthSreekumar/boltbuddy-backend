import express from "express";
import fetch from "node-fetch";
import url from "url";
import apicache from "apicache";
import logger from "../utils/logger.mjs";

const router = express.Router();

const cache = apicache.middleware;

/**
 * Get weather data from OpenWeatherMap
 *
 * URL query params: lat: number, lon: number, units: string
 */
router.get("/", cache("2 minutes"), async (req, res) => {
  // Environment variables
  const OWM_API_KEY = process.env.OWM_API_KEY;
  const OWM_API_KEY_NAME = process.env.OWM_API_KEY_NAME;
  const OWM_API_BASE_URL = process.env.OWM_API_BASE_URL;

  // Request params
  const { lat, lon, units } = url.parse(req.url, true).query;

  try {
    if (!lat || !lon) {
      res.status(400).json({ error: "Invalid query params" });
      return;
    }
    const params = new URLSearchParams({
      [OWM_API_KEY_NAME]: OWM_API_KEY,
      lat,
      lon,
      units: units ? units: "metric", // default unit is metric
    });

    // API call to OpenWeatherMap
    const apiRes = await fetch(`${OWM_API_BASE_URL}?${params}`);
    const data = await apiRes.json();
    res.status(200).json(data);
  } catch (error) {
    logger.error(error);
    res.status(500).json({ error });
  }
});

/**
 * Health check
 */
router.get("/healthcheck", (req, res) => {
  res.status(200).send("Server is alive!");
})

export default router;
