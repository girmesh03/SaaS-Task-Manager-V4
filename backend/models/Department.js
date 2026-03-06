import mongoose from "mongoose";

import { softDeletePlugin } from "../plugins/softDeletePlugin.js";
import { toJSONPlugin } from "../plugins/toJSONPlugin.js";
import { MODEL_NAMES } from "../utils/constants.js";

const departmentSchema = new mongoose.Schema(
  {
    organizationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: MODEL_NAMES.ORGANIZATION,
      required: true,
      index: true,
    },
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
    managerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: MODEL_NAMES.USER,
      default: null,
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

departmentSchema.index(
  { organizationId: 1, name: 1 },
  {
    unique: true,
    partialFilterExpression: {
      isDeleted: {
        $ne: true,
      },
    },
  }
);

departmentSchema.plugin(toJSONPlugin);
departmentSchema.plugin(softDeletePlugin);

const Department =
  mongoose.models[MODEL_NAMES.DEPARTMENT] ||
  mongoose.model(MODEL_NAMES.DEPARTMENT, departmentSchema);

export default Department;
