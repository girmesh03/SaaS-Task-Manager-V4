import mongoose from "mongoose";

import { softDeletePlugin } from "../plugins/softDeletePlugin.js";
import { toJSONPlugin } from "../plugins/toJSONPlugin.js";
import {
  MODEL_NAMES,
  ROLE_VALUES,
} from "../utils/constants.js";
import { normalizeEmail, normalizePhoneNumber } from "../utils/sanitize.js";

const userSchema = new mongoose.Schema(
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
      required: true,
      index: true,
    },
    firstName: {
      type: String,
      required: true,
      trim: true,
      maxlength: 60,
    },
    lastName: {
      type: String,
      required: true,
      trim: true,
      maxlength: 60,
    },
    fullName: {
      type: String,
      trim: true,
      maxlength: 121,
    },
    position: {
      type: String,
      trim: true,
      maxlength: 120,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      unique: true,
      index: true,
    },
    phone: {
      type: String,
      trim: true,
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
      immutable: true,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    avatarUrl: {
      type: String,
      trim: true,
    },
    passwordHash: {
      type: String,
      select: false,
    },
    passwordHistoryHashes: {
      type: [String],
      select: false,
      default: [],
    },
    joinedAt: {
      type: Date,
      default: Date.now,
      immutable: true,
    },
  },
  {
    timestamps: true,
  }
);

userSchema.pre("validate", function normalizeUserFields(next) {
  if (this.email) {
    this.email = normalizeEmail(this.email);
  }

  if (this.phone) {
    this.phone = normalizePhoneNumber(this.phone);
  }

  this.fullName = [this.firstName, this.lastName].filter(Boolean).join(" ").trim();
  next();
});

userSchema.plugin(toJSONPlugin);
userSchema.plugin(softDeletePlugin);

const User =
  mongoose.models[MODEL_NAMES.USER] ||
  mongoose.model(MODEL_NAMES.USER, userSchema);

export default User;
