/**
 * @file Root API router and module mount points.
 */
import express from "express";

import { sendSuccess } from "../utils/apiResponse.js";
import { API_MESSAGES } from "../utils/constants.js";
import authRoutes from "./authRoutes.js";
import orgRoutes from "./orgRoutes.js";
import departmentRoutes from "./departmentRoutes.js";
import userRoutes from "./userRoutes.js";
import taskRoutes from "./taskRoutes.js";
import taskActivityRoutes from "./taskActivityRoutes.js";
import commentRoutes from "./commentRoutes.js";
import attachmentRoutes from "./attachmentRoutes.js";
import materialRoutes from "./materialRoutes.js";
import vendorRoutes from "./vendorRoutes.js";
import notificationRoutes from "./notificationRoutes.js";
import dashboardRoutes from "./dashboardRoutes.js";
import settingsRoutes from "./settingsRoutes.js";
import searchRoutes from "./searchRoutes.js";
import platformRoutes from "./platformRoutes.js";

const router = express.Router();

router.get("/", (req, res) => {
  sendSuccess(res, {
    message: API_MESSAGES.ROOT,
  });
});

router.use("/auth", authRoutes);
router.use("/org", orgRoutes);
router.use("/departments", departmentRoutes);
router.use("/users", userRoutes);
router.use("/tasks", taskRoutes);
router.use("/task-activities", taskActivityRoutes);
router.use("/comments", commentRoutes);
router.use("/attachments", attachmentRoutes);
router.use("/materials", materialRoutes);
router.use("/vendors", vendorRoutes);
router.use("/notifications", notificationRoutes);
router.use("/dashboard", dashboardRoutes);
router.use("/settings", settingsRoutes);
router.use("/search", searchRoutes);
router.use("/platform", platformRoutes);

export default router;
