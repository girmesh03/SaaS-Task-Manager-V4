/**
 * @file Notification model schema.
 */
import mongoose from "mongoose";

import { softDeletePlugin } from "../plugins/softDeletePlugin.js";
import { toJSONPlugin } from "../plugins/toJSONPlugin.js";
import {
  attachSessionAwarePagination,
  buildDateField,
  buildReferenceField,
  buildStringField,
  MODEL_NAMES,
  SCHEMA_FIELD_LABELS,
  SCHEMA_FIELD_LIMITS,
} from "../utils/index.js";

const notificationSchema = new mongoose.Schema(
  {
    user: buildReferenceField({
      label: SCHEMA_FIELD_LABELS.NOTIFICATION.USER,
      ref: MODEL_NAMES.USER,
      required: true,
    }),
    organization: buildReferenceField({
      label: SCHEMA_FIELD_LABELS.NOTIFICATION.ORGANIZATION,
      ref: MODEL_NAMES.ORGANIZATION,
      required: true,
    }),
    department: buildReferenceField({
      label: SCHEMA_FIELD_LABELS.NOTIFICATION.DEPARTMENT,
      ref: MODEL_NAMES.DEPARTMENT,
      defaultValue: null,
    }),
    type: buildStringField({
      label: SCHEMA_FIELD_LABELS.NOTIFICATION.TYPE,
      required: true,
      maxLength: SCHEMA_FIELD_LIMITS.NOTIFICATION_TYPE_MAX_LENGTH,
    }),
    title: buildStringField({
      label: SCHEMA_FIELD_LABELS.NOTIFICATION.TITLE,
      required: true,
      maxLength: SCHEMA_FIELD_LIMITS.NOTIFICATION_TITLE_MAX_LENGTH,
    }),
    message: buildStringField({
      label: SCHEMA_FIELD_LABELS.NOTIFICATION.MESSAGE,
      required: true,
      maxLength: SCHEMA_FIELD_LIMITS.NOTIFICATION_MESSAGE_MAX_LENGTH,
    }),
    route: buildStringField({
      label: SCHEMA_FIELD_LABELS.NOTIFICATION.ROUTE,
      maxLength: SCHEMA_FIELD_LIMITS.URL_MAX_LENGTH,
      defaultValue: null,
    }),
    entityType: buildStringField({
      label: SCHEMA_FIELD_LABELS.NOTIFICATION.ENTITY_TYPE,
      maxLength: SCHEMA_FIELD_LIMITS.ENTITY_TYPE_MAX_LENGTH,
      defaultValue: null,
    }),
    entityId: buildStringField({
      label: SCHEMA_FIELD_LABELS.NOTIFICATION.ENTITY_ID,
      maxLength: SCHEMA_FIELD_LIMITS.ENTITY_ID_MAX_LENGTH,
      defaultValue: null,
    }),
    isRead: {
      type: Boolean,
      default: false,
    },
    expiresAt: buildDateField({
      label: SCHEMA_FIELD_LABELS.NOTIFICATION.EXPIRES_AT,
      required: true,
    }),
  },
  {
    timestamps: true,
  }
);

notificationSchema.index({ user: 1, isRead: 1 });
notificationSchema.index({ organization: 1 });
notificationSchema.index({ department: 1 });
notificationSchema.index({ expiresAt: 1 });

notificationSchema.plugin(toJSONPlugin);
attachSessionAwarePagination(notificationSchema);
notificationSchema.plugin(softDeletePlugin);

const Notification =
  mongoose.models[MODEL_NAMES.NOTIFICATION] ||
  mongoose.model(MODEL_NAMES.NOTIFICATION, notificationSchema);

export default Notification;
