/**
 * @file Shared backend utility exports plus schema helper builders.
 * @throws {never} Module initialization does not throw.
 */
import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

import {
  SCHEMA_FIELD_LIMITS,
  SCHEMA_VALIDATION_PATTERNS,
  URL_PROTOCOL_VALUES,
} from "./constants.js";

const buildRequiredMessage = (label) => `${label} is required.`;
const buildInvalidObjectIdMessage = (label) =>
  `${label} must be a valid ObjectId.`;
const buildMinLengthMessage = (label, minLength) =>
  `${label} must be at least ${minLength} characters.`;
const buildMaxLengthMessage = (label, maxLength) =>
  `${label} must be at most ${maxLength} characters.`;
const buildMinValueMessage = (label, minValue) =>
  `${label} must be at least ${minValue}.`;
const buildMaxValueMessage = (label, maxValue) =>
  `${label} must be at most ${maxValue}.`;
const buildEnumMessage = (label, values) =>
  `${label} must be one of: ${values.join(", ")}.`;

/**
 * Builds a schema definition for an ObjectId reference.
 *
 * @param {{ label: string, ref: string, required?: boolean, defaultValue?: import("mongoose").SchemaTypeOptions<unknown>["default"], immutable?: boolean }} options - Field options.
 * @returns {import("mongoose").SchemaTypeOptions<import("mongoose").Types.ObjectId | null>} Schema definition.
 * @throws {never} This helper does not throw.
 */
export const buildReferenceField = ({
  label,
  ref,
  required = false,
  defaultValue = null,
  immutable = false,
}) => {
  const field = {
    type: mongoose.Schema.Types.ObjectId,
    ref,
    immutable,
    validate: {
      validator: (value) => value == null || mongoose.isValidObjectId(value),
      message: buildInvalidObjectIdMessage(label),
    },
  };

  if (required) {
    field.required = [true, buildRequiredMessage(label)];
  } else {
    field.default = defaultValue;
  }

  return field;
};

/**
 * Builds a schema definition for a string field.
 *
 * @param {{ label: string, required?: boolean, trim?: boolean, lowercase?: boolean, minLength?: number, maxLength?: number, enumValues?: readonly string[], defaultValue?: string | null, immutable?: boolean, validate?: import("mongoose").SchemaTypeOptions<string>["validate"] }} options - Field options.
 * @returns {import("mongoose").SchemaTypeOptions<string | null>} Schema definition.
 * @throws {never} This helper does not throw.
 */
export const buildStringField = ({
  label,
  required = false,
  trim = true,
  lowercase = false,
  minLength,
  maxLength,
  enumValues,
  defaultValue,
  immutable = false,
  validate,
}) => {
  const field = {
    type: String,
    trim,
    lowercase,
    immutable,
  };

  if (required) {
    field.required = [true, buildRequiredMessage(label)];
  } else if (defaultValue !== undefined) {
    field.default = defaultValue;
  }

  if (typeof minLength === "number") {
    field.minlength = [minLength, buildMinLengthMessage(label, minLength)];
  }

  if (typeof maxLength === "number") {
    field.maxlength = [maxLength, buildMaxLengthMessage(label, maxLength)];
  }

  if (Array.isArray(enumValues)) {
    field.enum = {
      values: [...enumValues],
      message: buildEnumMessage(label, enumValues),
    };
  }

  if (validate) {
    field.validate = validate;
  }

  return field;
};

/**
 * Builds a schema definition for an email field.
 *
 * @param {{ label: string, required?: boolean }} options - Field options.
 * @returns {import("mongoose").SchemaTypeOptions<string | null>} Schema definition.
 * @throws {never} This helper does not throw.
 */
export const buildEmailField = ({ label, required = false }) =>
  buildStringField({
    label,
    required,
    trim: true,
    lowercase: true,
    maxLength: SCHEMA_FIELD_LIMITS.EMAIL_MAX_LENGTH,
    validate: {
      validator: (value) =>
        !value ||
        SCHEMA_VALIDATION_PATTERNS.EMAIL.test(String(value || "").trim().toLowerCase()),
      message: `${label} must be a valid email address.`,
    },
  });

/**
 * Builds a schema definition for a phone field.
 *
 * @param {{ label: string, required?: boolean }} options - Field options.
 * @returns {import("mongoose").SchemaTypeOptions<string | null>} Schema definition.
 * @throws {never} This helper does not throw.
 */
export const buildPhoneField = ({ label, required = false }) =>
  buildStringField({
    label,
    required,
    trim: true,
    maxLength: SCHEMA_FIELD_LIMITS.PHONE_MAX_LENGTH,
    validate: {
      validator: (value) =>
        !value ||
        SCHEMA_VALIDATION_PATTERNS.PHONE.test(
          String(value || "").replace(/\s+/g, "").trim()
        ),
      message: `${label} must be a valid phone number.`,
    },
  });

/**
 * Builds a schema definition for a URL field.
 *
 * @param {{ label: string, required?: boolean }} options - Field options.
 * @returns {import("mongoose").SchemaTypeOptions<string | null>} Schema definition.
 * @throws {never} This helper does not throw.
 */
export const buildUrlField = ({ label, required = false }) =>
  buildStringField({
    label,
    required,
    trim: true,
    maxLength: SCHEMA_FIELD_LIMITS.URL_MAX_LENGTH,
    validate: {
      validator: (value) => {
        if (!value) {
          return true;
        }

        try {
          const url = new URL(String(value || "").trim());
          return URL_PROTOCOL_VALUES.includes(url.protocol);
        } catch {
          return false;
        }
      },
      message: `${label} must be a valid URL.`,
    },
  });

/**
 * Builds a schema definition for a numeric field.
 *
 * @param {{ label: string, required?: boolean, minValue?: number, maxValue?: number, defaultValue?: number | null, immutable?: boolean }} options - Field options.
 * @returns {import("mongoose").SchemaTypeOptions<number | null>} Schema definition.
 * @throws {never} This helper does not throw.
 */
export const buildNumberField = ({
  label,
  required = false,
  minValue,
  maxValue,
  defaultValue,
  immutable = false,
}) => {
  const field = {
    type: Number,
    immutable,
  };

  if (required) {
    field.required = [true, buildRequiredMessage(label)];
  } else if (defaultValue !== undefined) {
    field.default = defaultValue;
  }

  if (typeof minValue === "number") {
    field.min = [minValue, buildMinValueMessage(label, minValue)];
  }

  if (typeof maxValue === "number") {
    field.max = [maxValue, buildMaxValueMessage(label, maxValue)];
  }

  return field;
};

/**
 * Builds a schema definition for a date field.
 *
 * @param {{ label: string, required?: boolean, defaultValue?: Date | (() => number | Date) | null, immutable?: boolean }} options - Field options.
 * @returns {import("mongoose").SchemaTypeOptions<Date | null>} Schema definition.
 * @throws {never} This helper does not throw.
 */
export const buildDateField = ({
  label,
  required = false,
  defaultValue,
  immutable = false,
}) => {
  const field = {
    type: Date,
    immutable,
  };

  if (required) {
    field.required = [true, buildRequiredMessage(label)];
  } else if (defaultValue !== undefined) {
    field.default = defaultValue;
  }

  return field;
};

/**
 * Adds mongoose-paginate-v2 plus a session-aware pagination helper to a schema.
 *
 * @param {import("mongoose").Schema} schema - Target schema.
 * @returns {void}
 * @throws {never} This helper does not throw.
 */
export const attachSessionAwarePagination = (schema) => {
  schema.plugin(mongoosePaginate);

  schema.statics.paginateWithSession = function paginateWithSession(
    query = {},
    options = {},
    { session } = {}
  ) {
    const paginateOptions = {
      ...options,
      options: {
        ...(options.options || {}),
        ...(session ? { session } : {}),
      },
    };

    return this.paginate(query, paginateOptions);
  };
};

export * from "./constants.js";
export * from "./apiResponse.js";
export * from "./errorFactory.js";
export * from "./mongo.js";
export * from "./sanitize.js";
