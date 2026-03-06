import mongoose from "mongoose";

import { softDeletePlugin } from "../plugins/softDeletePlugin.js";
import { toJSONPlugin } from "../plugins/toJSONPlugin.js";
import {
  MODEL_NAMES,
  ORGANIZATION_SIZE_VALUES,
} from "../utils/constants.js";
import { normalizeEmail, normalizePhoneNumber } from "../utils/sanitize.js";

const organizationSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 120,
    },
    description: {
      type: String,
      trim: true,
      maxlength: 500,
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
      index: true,
    },
    phone: {
      type: String,
      trim: true,
    },
    address: {
      type: String,
      trim: true,
      maxlength: 240,
    },
    website: {
      type: String,
      trim: true,
    },
    industry: {
      type: String,
      trim: true,
      maxlength: 120,
    },
    size: {
      type: String,
      enum: ORGANIZATION_SIZE_VALUES,
      default: ORGANIZATION_SIZE_VALUES[0],
    },
    isPlatformOrg: {
      type: Boolean,
      default: false,
      immutable: true,
      index: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

organizationSchema.pre("validate", function normalizeOrganizationFields(next) {
  if (this.email) {
    this.email = normalizeEmail(this.email);
  }

  if (this.phone) {
    this.phone = normalizePhoneNumber(this.phone);
  }

  next();
});

organizationSchema.plugin(toJSONPlugin);
organizationSchema.plugin(softDeletePlugin);

const Organization =
  mongoose.models[MODEL_NAMES.ORGANIZATION] ||
  mongoose.model(MODEL_NAMES.ORGANIZATION, organizationSchema);

export default Organization;
