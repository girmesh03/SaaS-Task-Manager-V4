/**
 * @file Refresh token session model schema.
 */
import mongoose from "mongoose";

import { toJSONPlugin } from "../plugins/toJSONPlugin.js";
import {
  attachSessionAwarePagination,
  buildDateField,
  buildReferenceField,
  buildStringField,
  MODEL_NAMES,
  ROLE_VALUES,
  SCHEMA_FIELD_LABELS,
  SCHEMA_FIELD_LIMITS,
} from "../utils/index.js";

const refreshTokenSessionSchema = new mongoose.Schema(
  {
    user: buildReferenceField({
      label: SCHEMA_FIELD_LABELS.REFRESH_TOKEN_SESSION.USER,
      ref: MODEL_NAMES.USER,
      required: true,
    }),
    organization: buildReferenceField({
      label: SCHEMA_FIELD_LABELS.REFRESH_TOKEN_SESSION.ORGANIZATION,
      ref: MODEL_NAMES.ORGANIZATION,
      required: true,
    }),
    department: buildReferenceField({
      label: SCHEMA_FIELD_LABELS.REFRESH_TOKEN_SESSION.DEPARTMENT,
      ref: MODEL_NAMES.DEPARTMENT,
      defaultValue: null,
    }),
    role: buildStringField({
      label: SCHEMA_FIELD_LABELS.REFRESH_TOKEN_SESSION.ROLE,
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
    },
    tokenHash: buildStringField({
      label: SCHEMA_FIELD_LABELS.REFRESH_TOKEN_SESSION.TOKEN_HASH,
      required: true,
      maxLength: SCHEMA_FIELD_LIMITS.TOKEN_HASH_MAX_LENGTH,
    }),
    expiresAt: buildDateField({
      label: SCHEMA_FIELD_LABELS.REFRESH_TOKEN_SESSION.EXPIRES_AT,
      required: true,
    }),
    revokedAt: buildDateField({
      label: SCHEMA_FIELD_LABELS.REFRESH_TOKEN_SESSION.REVOKED_AT,
      defaultValue: null,
    }),
    replacedBySession: buildReferenceField({
      label: SCHEMA_FIELD_LABELS.REFRESH_TOKEN_SESSION.REPLACED_BY_SESSION,
      ref: MODEL_NAMES.REFRESH_TOKEN_SESSION,
      defaultValue: null,
    }),
    lastUsedAt: buildDateField({
      label: SCHEMA_FIELD_LABELS.REFRESH_TOKEN_SESSION.LAST_USED_AT,
      defaultValue: null,
    }),
    ip: buildStringField({
      label: SCHEMA_FIELD_LABELS.REFRESH_TOKEN_SESSION.IP,
      maxLength: SCHEMA_FIELD_LIMITS.IP_MAX_LENGTH,
      defaultValue: null,
    }),
    userAgent: buildStringField({
      label: SCHEMA_FIELD_LABELS.REFRESH_TOKEN_SESSION.USER_AGENT,
      maxLength: SCHEMA_FIELD_LIMITS.USER_AGENT_MAX_LENGTH,
      defaultValue: null,
    }),
  },
  {
    timestamps: true,
  }
);

refreshTokenSessionSchema.path("tokenHash").select(false);
refreshTokenSessionSchema.index({ user: 1 });
refreshTokenSessionSchema.index({ organization: 1 });
refreshTokenSessionSchema.index({ department: 1 });
refreshTokenSessionSchema.index({ expiresAt: 1 });
refreshTokenSessionSchema.index({ revokedAt: 1 });
refreshTokenSessionSchema.index({ replacedBySession: 1 });

refreshTokenSessionSchema.plugin(toJSONPlugin);
attachSessionAwarePagination(refreshTokenSessionSchema);

const RefreshTokenSession =
  mongoose.models[MODEL_NAMES.REFRESH_TOKEN_SESSION] ||
  mongoose.model(MODEL_NAMES.REFRESH_TOKEN_SESSION, refreshTokenSessionSchema);

export default RefreshTokenSession;
