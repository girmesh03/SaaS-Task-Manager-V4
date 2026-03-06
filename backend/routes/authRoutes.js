/**
 * @file Authentication route definitions.
 */
import express from "express";

import {
  getCsrfToken,
  logout,
  refreshSession,
} from "../controllers/authController.js";
import { requireCsrf } from "../middlewares/requireCsrf.js";
import { rateLimitAuth } from "../middlewares/rateLimiters.js";

const router = express.Router();

router.get("/csrf", rateLimitAuth, getCsrfToken);
router.post("/refresh", rateLimitAuth, requireCsrf, refreshSession);
router.post("/logout", rateLimitAuth, requireCsrf, logout);

export default router;
