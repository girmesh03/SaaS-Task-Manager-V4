import {
  buildReferenceField,
  MODEL_NAMES,
  SCHEMA_FIELD_LABELS,
} from "../utils/index.js";

const QUERY_MIDDLEWARE = [
  "find",
  "findOne",
  "findOneAndUpdate",
  "countDocuments",
  "updateMany",
  "updateOne",
];

/**
 * Adds soft-delete fields, query filtering, and restore helpers to a schema.
 *
 * @param {import("mongoose").Schema} schema - Target schema.
 * @returns {void}
 * @throws {never} This plugin does not throw during registration.
 */
export const softDeletePlugin = (schema) => {
  schema.add({
    isDeleted: {
      type: Boolean,
      default: false,
    },
    deletedAt: {
      type: Date,
      default: null,
    },
    deletedBy: buildReferenceField({
      label: SCHEMA_FIELD_LABELS.SOFT_DELETE.DELETED_BY,
      ref: MODEL_NAMES.USER,
      defaultValue: null,
    }),
  });

  schema.index({ isDeleted: 1 });
  schema.index({ deletedAt: 1 });
  schema.index({ deletedBy: 1 });

  schema.query.withDeleted = function withDeleted() {
    return this.setOptions({ withDeleted: true, onlyDeleted: false });
  };

  schema.query.onlyDeleted = function onlyDeleted() {
    return this.setOptions({ withDeleted: true, onlyDeleted: true });
  };

  QUERY_MIDDLEWARE.forEach((hookName) => {
    schema.pre(hookName, function applySoftDeleteFilter() {
      const options = this.getOptions();

      if (options?.withDeleted) {
        if (options.onlyDeleted) {
          this.where({ isDeleted: true });
        }
        return;
      }

      this.where({ isDeleted: { $ne: true } });
    });
  });

  schema.pre("aggregate", function applyAggregateSoftDelete() {
    const options = this.options || {};

    if (options.withDeleted) {
      if (options.onlyDeleted) {
        this.pipeline().unshift({ $match: { isDeleted: true } });
      }
      return;
    }

    this.pipeline().unshift({ $match: { isDeleted: { $ne: true } } });
  });

  schema.methods.softDelete = async function softDelete({
    deletedBy = null,
    session,
  } = {}) {
    this.isDeleted = true;
    this.deletedAt = new Date();
    this.deletedBy = deletedBy;
    return this.save({ session });
  };

  schema.methods.restore = async function restore({ session } = {}) {
    this.isDeleted = false;
    this.deletedAt = null;
    this.deletedBy = null;
    return this.save({ session });
  };

  schema.statics.softDeleteById = async function softDeleteById(
    id,
    { deletedBy = null, session } = {}
  ) {
    return this.findOneAndUpdate(
      { _id: id },
      {
        $set: {
          isDeleted: true,
          deletedAt: new Date(),
          deletedBy,
        },
      },
      {
        new: true,
        session,
        withDeleted: true,
      }
    );
  };

  schema.statics.restoreById = async function restoreById(id, { session } = {}) {
    return this.findOneAndUpdate(
      { _id: id },
      {
        $set: {
          isDeleted: false,
          deletedAt: null,
          deletedBy: null,
        },
      },
      {
        new: true,
        session,
        withDeleted: true,
      }
    );
  };
};
