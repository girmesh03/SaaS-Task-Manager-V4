/**
 * @file Attachment model schema.
 */
import mongoose from "mongoose";

import { softDeletePlugin } from "../plugins/softDeletePlugin.js";
import { toJSONPlugin } from "../plugins/toJSONPlugin.js";
import {
  attachSessionAwarePagination,
  buildDateField,
  buildNumberField,
  buildReferenceField,
  buildStringField,
  buildUrlField,
  ATTACHMENT_PARENT_TYPE_VALUES,
  ATTACHMENT_RESOURCE_TYPE_VALUES,
  MODEL_NAMES,
  FILE_UPLOAD_CONSTRAINTS,
  SCHEMA_FIELD_LABELS,
  SCHEMA_FIELD_LIMITS,
} from "../utils/index.js";

const attachmentSchema = new mongoose.Schema(
  {
    organization: buildReferenceField({
      label: SCHEMA_FIELD_LABELS.ATTACHMENT.ORGANIZATION,
      ref: MODEL_NAMES.ORGANIZATION,
      required: true,
    }),
    department: buildReferenceField({
      label: SCHEMA_FIELD_LABELS.ATTACHMENT.DEPARTMENT,
      ref: MODEL_NAMES.DEPARTMENT,
      defaultValue: null,
    }),
    createdBy: buildReferenceField({
      label: SCHEMA_FIELD_LABELS.ATTACHMENT.CREATED_BY,
      ref: MODEL_NAMES.USER,
      defaultValue: null,
    }),
    parentType: buildStringField({
      label: SCHEMA_FIELD_LABELS.ATTACHMENT.PARENT_TYPE,
      required: true,
      enumValues: ATTACHMENT_PARENT_TYPE_VALUES,
    }),
    parentId: buildStringField({
      label: SCHEMA_FIELD_LABELS.ATTACHMENT.PARENT_ID,
      required: true,
      maxLength: SCHEMA_FIELD_LIMITS.ENTITY_ID_MAX_LENGTH,
    }),
    fileName: buildStringField({
      label: SCHEMA_FIELD_LABELS.ATTACHMENT.FILE_NAME,
      required: true,
      maxLength: SCHEMA_FIELD_LIMITS.FILE_NAME_MAX_LENGTH,
    }),
    extension: buildStringField({
      label: SCHEMA_FIELD_LABELS.ATTACHMENT.EXTENSION,
      required: true,
      lowercase: true,
      enumValues: FILE_UPLOAD_CONSTRAINTS.ALLOWED_EXTENSIONS,
    }),
    resourceType: buildStringField({
      label: SCHEMA_FIELD_LABELS.ATTACHMENT.RESOURCE_TYPE,
      required: true,
      enumValues: ATTACHMENT_RESOURCE_TYPE_VALUES,
    }),
    publicId: buildStringField({
      label: SCHEMA_FIELD_LABELS.ATTACHMENT.PUBLIC_ID,
      required: true,
      maxLength: SCHEMA_FIELD_LIMITS.PUBLIC_ID_MAX_LENGTH,
    }),
    secureUrl: buildUrlField({
      label: SCHEMA_FIELD_LABELS.ATTACHMENT.SECURE_URL,
      required: true,
    }),
    bytes: buildNumberField({
      label: SCHEMA_FIELD_LABELS.ATTACHMENT.BYTES,
      required: true,
      minValue: 0,
      maxValue: FILE_UPLOAD_CONSTRAINTS.MAX_SIZE_BYTES,
    }),
    expiresAt: buildDateField({
      label: SCHEMA_FIELD_LABELS.ATTACHMENT.EXPIRES_AT,
      required: true,
    }),
  },
  {
    timestamps: true,
  }
);

attachmentSchema.index({ organization: 1 });
attachmentSchema.index({ department: 1 });
attachmentSchema.index({ createdBy: 1 });
attachmentSchema.index({ parentType: 1, parentId: 1 });
attachmentSchema.index({ expiresAt: 1 });

attachmentSchema.plugin(toJSONPlugin);
attachSessionAwarePagination(attachmentSchema);
attachmentSchema.plugin(softDeletePlugin);

const Attachment =
  mongoose.models[MODEL_NAMES.ATTACHMENT] ||
  mongoose.model(MODEL_NAMES.ATTACHMENT, attachmentSchema);

export default Attachment;
