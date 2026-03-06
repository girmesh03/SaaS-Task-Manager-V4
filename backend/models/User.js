/**
 * @file User model schema.
 */
import mongoose from "mongoose";

import { softDeletePlugin } from "../plugins/softDeletePlugin.js";
import { toJSONPlugin } from "../plugins/toJSONPlugin.js";
import {
  attachSessionAwarePagination,
  buildDateField,
  buildEmailField,
  buildPhoneField,
  buildReferenceField,
  buildStringField,
  buildUrlField,
  MODEL_NAMES,
  ROLE_VALUES,
  SCHEMA_FIELD_LABELS,
  SCHEMA_FIELD_LIMITS,
  SCHEMA_INDEX_FILTERS,
} from "../utils/index.js";
import { normalizeEmail, normalizePhoneNumber } from "../utils/sanitize.js";

const userSchema = new mongoose.Schema(
  {
    organization: buildReferenceField({
      label: SCHEMA_FIELD_LABELS.USER.ORGANIZATION,
      ref: MODEL_NAMES.ORGANIZATION,
      required: true,
    }),
    department: buildReferenceField({
      label: SCHEMA_FIELD_LABELS.USER.DEPARTMENT,
      ref: MODEL_NAMES.DEPARTMENT,
      required: true,
    }),
    firstName: buildStringField({
      label: SCHEMA_FIELD_LABELS.USER.FIRST_NAME,
      required: true,
      maxLength: SCHEMA_FIELD_LIMITS.USER_FIRST_NAME_MAX_LENGTH,
    }),
    lastName: buildStringField({
      label: SCHEMA_FIELD_LABELS.USER.LAST_NAME,
      required: true,
      maxLength: SCHEMA_FIELD_LIMITS.USER_LAST_NAME_MAX_LENGTH,
    }),
    fullName: buildStringField({
      label: SCHEMA_FIELD_LABELS.USER.FULL_NAME,
      maxLength: SCHEMA_FIELD_LIMITS.USER_FULL_NAME_MAX_LENGTH,
    }),
    position: buildStringField({
      label: SCHEMA_FIELD_LABELS.USER.POSITION,
      maxLength: SCHEMA_FIELD_LIMITS.USER_POSITION_MAX_LENGTH,
    }),
    email: buildEmailField({
      label: SCHEMA_FIELD_LABELS.USER.EMAIL,
      required: true,
    }),
    phone: buildPhoneField({
      label: SCHEMA_FIELD_LABELS.USER.PHONE,
    }),
    role: buildStringField({
      label: SCHEMA_FIELD_LABELS.USER.ROLE,
      required: true,
      enumValues: ROLE_VALUES,
    }),
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
    avatarUrl: buildUrlField({
      label: SCHEMA_FIELD_LABELS.USER.AVATAR_URL,
    }),
    passwordHash: {
      type: String,
      select: false,
    },
    passwordHistoryHashes: {
      type: [String],
      select: false,
      default: [],
    },
    joinedAt: buildDateField({
      label: SCHEMA_FIELD_LABELS.USER.JOINED_AT,
      defaultValue: Date.now,
      immutable: true,
    }),
  },
  {
    timestamps: true,
  }
);

userSchema.index(
  { email: 1 },
  {
    unique: true,
    partialFilterExpression: SCHEMA_INDEX_FILTERS.NOT_DELETED_WITH_EMAIL,
  }
);
userSchema.index({ organization: 1 });
userSchema.index({ department: 1 });

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
attachSessionAwarePagination(userSchema);
userSchema.plugin(softDeletePlugin);

const User =
  mongoose.models[MODEL_NAMES.USER] ||
  mongoose.model(MODEL_NAMES.USER, userSchema);

export default User;
