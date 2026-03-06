import mongoose from "mongoose";

import { softDeletePlugin } from "../plugins/softDeletePlugin.js";
import { toJSONPlugin } from "../plugins/toJSONPlugin.js";
import {
  MODEL_NAMES,
  FILE_UPLOAD_CONSTRAINTS,
} from "../utils/constants.js";

const attachmentSchema = new mongoose.Schema(
  {
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
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: MODEL_NAMES.USER,
      default: null,
    },
    parentType: {
      type: String,
      required: true,
      enum: ["Task", "TaskActivity", "Comment"],
    },
    parentId: {
      type: String,
      required: true,
    },
    fileName: {
      type: String,
      required: true,
      trim: true,
    },
    extension: {
      type: String,
      required: true,
      lowercase: true,
      enum: FILE_UPLOAD_CONSTRAINTS.ALLOWED_EXTENSIONS,
    },
    resourceType: {
      type: String,
      required: true,
      enum: ["image", "video", "raw"],
    },
    publicId: {
      type: String,
      required: true,
      trim: true,
    },
    secureUrl: {
      type: String,
      required: true,
      trim: true,
    },
    bytes: {
      type: Number,
      required: true,
      min: 0,
      max: FILE_UPLOAD_CONSTRAINTS.MAX_SIZE_BYTES,
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

attachmentSchema.plugin(toJSONPlugin);
attachmentSchema.plugin(softDeletePlugin);

const Attachment =
  mongoose.models[MODEL_NAMES.ATTACHMENT] ||
  mongoose.model(MODEL_NAMES.ATTACHMENT, attachmentSchema);

export default Attachment;
