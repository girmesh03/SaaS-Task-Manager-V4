import mongoose from "mongoose";

import { softDeletePlugin } from "../plugins/softDeletePlugin.js";
import { toJSONPlugin } from "../plugins/toJSONPlugin.js";
import { MODEL_NAMES } from "../utils/constants.js";

const notificationSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: MODEL_NAMES.USER,
      required: true,
      index: true,
    },
    organizationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: MODEL_NAMES.ORGANIZATION,
      required: true,
      index: true,
    },
    departmentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: MODEL_NAMES.DEPARTMENT,
      default: null,
      index: true,
    },
    type: {
      type: String,
      required: true,
      trim: true,
      maxlength: 80,
    },
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 160,
    },
    message: {
      type: String,
      required: true,
      trim: true,
      maxlength: 500,
    },
    route: {
      type: String,
      trim: true,
      default: null,
    },
    entityType: {
      type: String,
      trim: true,
      default: null,
    },
    entityId: {
      type: String,
      trim: true,
      default: null,
    },
    isRead: {
      type: Boolean,
      default: false,
    },
    expiresAt: {
      type: Date,
      required: true,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

notificationSchema.plugin(toJSONPlugin);
notificationSchema.plugin(softDeletePlugin);

const Notification =
  mongoose.models[MODEL_NAMES.NOTIFICATION] ||
  mongoose.model(MODEL_NAMES.NOTIFICATION, notificationSchema);

export default Notification;
