/**
 * @file Organization model schema.
 */
import mongoose from "mongoose";

import { softDeletePlugin } from "../plugins/softDeletePlugin.js";
import { toJSONPlugin } from "../plugins/toJSONPlugin.js";
import {
  attachSessionAwarePagination,
  buildEmailField,
  buildPhoneField,
  buildStringField,
  buildUrlField,
  MODEL_NAMES,
  ORGANIZATION_SIZE_VALUES,
  SCHEMA_FIELD_LABELS,
  SCHEMA_FIELD_LIMITS,
  SCHEMA_INDEX_FILTERS,
} from "../utils/index.js";
import { normalizeEmail, normalizePhoneNumber } from "../utils/sanitize.js";

const organizationSchema = new mongoose.Schema(
  {
    name: buildStringField({
      label: SCHEMA_FIELD_LABELS.ORGANIZATION.NAME,
      required: true,
      maxLength: SCHEMA_FIELD_LIMITS.ORGANIZATION_NAME_MAX_LENGTH,
    }),
    description: buildStringField({
      label: SCHEMA_FIELD_LABELS.ORGANIZATION.DESCRIPTION,
      maxLength: SCHEMA_FIELD_LIMITS.ORGANIZATION_DESCRIPTION_MAX_LENGTH,
    }),
    email: buildEmailField({
      label: SCHEMA_FIELD_LABELS.ORGANIZATION.EMAIL,
    }),
    phone: buildPhoneField({
      label: SCHEMA_FIELD_LABELS.ORGANIZATION.PHONE,
    }),
    address: buildStringField({
      label: SCHEMA_FIELD_LABELS.ORGANIZATION.ADDRESS,
      maxLength: SCHEMA_FIELD_LIMITS.ORGANIZATION_ADDRESS_MAX_LENGTH,
    }),
    website: buildUrlField({
      label: SCHEMA_FIELD_LABELS.ORGANIZATION.WEBSITE,
    }),
    industry: buildStringField({
      label: SCHEMA_FIELD_LABELS.ORGANIZATION.INDUSTRY,
      maxLength: SCHEMA_FIELD_LIMITS.ORGANIZATION_INDUSTRY_MAX_LENGTH,
    }),
    size: buildStringField({
      label: SCHEMA_FIELD_LABELS.ORGANIZATION.SIZE,
      enumValues: ORGANIZATION_SIZE_VALUES,
      defaultValue: ORGANIZATION_SIZE_VALUES[0],
    }),
    isPlatformOrg: {
      type: Boolean,
      default: false,
      immutable: true,
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

organizationSchema.index(
  { email: 1 },
  {
    partialFilterExpression: SCHEMA_INDEX_FILTERS.NOT_DELETED_WITH_EMAIL,
  }
);
organizationSchema.index({ isPlatformOrg: 1 });

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
attachSessionAwarePagination(organizationSchema);
organizationSchema.plugin(softDeletePlugin);

const Organization =
  mongoose.models[MODEL_NAMES.ORGANIZATION] ||
  mongoose.model(MODEL_NAMES.ORGANIZATION, organizationSchema);

export default Organization;
