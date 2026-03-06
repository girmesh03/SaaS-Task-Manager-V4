/**
 * @file Department model schema.
 */
import mongoose from "mongoose";

import { softDeletePlugin } from "../plugins/softDeletePlugin.js";
import { toJSONPlugin } from "../plugins/toJSONPlugin.js";
import {
  attachSessionAwarePagination,
  buildReferenceField,
  buildStringField,
  MODEL_NAMES,
  SCHEMA_FIELD_LABELS,
  SCHEMA_FIELD_LIMITS,
  SCHEMA_INDEX_FILTERS,
} from "../utils/index.js";

const departmentSchema = new mongoose.Schema(
  {
    organization: buildReferenceField({
      label: SCHEMA_FIELD_LABELS.DEPARTMENT.ORGANIZATION,
      ref: MODEL_NAMES.ORGANIZATION,
      required: true,
    }),
    name: buildStringField({
      label: SCHEMA_FIELD_LABELS.DEPARTMENT.NAME,
      required: true,
      maxLength: SCHEMA_FIELD_LIMITS.DEPARTMENT_NAME_MAX_LENGTH,
    }),
    description: buildStringField({
      label: SCHEMA_FIELD_LABELS.DEPARTMENT.DESCRIPTION,
      maxLength: SCHEMA_FIELD_LIMITS.DEPARTMENT_DESCRIPTION_MAX_LENGTH,
    }),
    manager: buildReferenceField({
      label: SCHEMA_FIELD_LABELS.DEPARTMENT.MANAGER,
      ref: MODEL_NAMES.USER,
      defaultValue: null,
    }),
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

departmentSchema.index(
  { organization: 1, name: 1 },
  {
    unique: true,
    partialFilterExpression: SCHEMA_INDEX_FILTERS.NOT_DELETED,
  }
);
departmentSchema.index({ organization: 1 });
departmentSchema.index({ manager: 1 });

departmentSchema.plugin(toJSONPlugin);
attachSessionAwarePagination(departmentSchema);
departmentSchema.plugin(softDeletePlugin);

const Department =
  mongoose.models[MODEL_NAMES.DEPARTMENT] ||
  mongoose.model(MODEL_NAMES.DEPARTMENT, departmentSchema);

export default Department;
