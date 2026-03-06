import mongoose from "mongoose";

import { toJSONPlugin } from "../plugins/toJSONPlugin.js";
import {
  MODEL_NAMES,
  ROLE_VALUES,
} from "../utils/constants.js";

const refreshTokenSessionSchema = new mongoose.Schema(
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
    role: {
      type: String,
      required: true,
      enum: ROLE_VALUES,
    },
    isHod: {
      type: Boolean,
      default: false,
    },
    isPlatformOrgUser: {
      type: Boolean,
      default: false,
    },
    tokenHash: {
      type: String,
      required: true,
      select: false,
    },
    expiresAt: {
      type: Date,
      required: true,
      index: true,
    },
    revokedAt: {
      type: Date,
      default: null,
      index: true,
    },
    replacedBySessionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: MODEL_NAMES.REFRESH_TOKEN_SESSION,
      default: null,
    },
    lastUsedAt: {
      type: Date,
      default: null,
    },
    ip: {
      type: String,
      trim: true,
      default: null,
    },
    userAgent: {
      type: String,
      trim: true,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

refreshTokenSessionSchema.plugin(toJSONPlugin);

const RefreshTokenSession =
  mongoose.models[MODEL_NAMES.REFRESH_TOKEN_SESSION] ||
  mongoose.model(MODEL_NAMES.REFRESH_TOKEN_SESSION, refreshTokenSessionSchema);

export default RefreshTokenSession;
