import express from "express";

import { API_MESSAGES } from "../utils/constants.js";

const router = express.Router();

router.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: API_MESSAGES.ROOT,
  });
});

export default router;
