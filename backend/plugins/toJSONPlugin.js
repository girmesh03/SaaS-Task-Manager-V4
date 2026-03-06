/**
 * Normalizes Mongoose JSON serialization for API responses.
 *
 * @param {import("mongoose").Schema} schema - Target schema.
 * @returns {void}
 * @throws {never} This plugin does not throw during registration.
 */
export const toJSONPlugin = (schema) => {
  const privatePaths = Object.entries(schema.paths)
    .filter(([, schemaType]) => schemaType?.options?.select === false)
    .map(([pathName]) => pathName);
  const existingTransform = schema.get("toJSON")?.transform;

  schema.set("toJSON", {
    virtuals: true,
    versionKey: false,
    transform(doc, ret, options) {
      delete ret.id;

      privatePaths.forEach((pathName) => {
        delete ret[pathName];
      });

      if (typeof existingTransform === "function") {
        return existingTransform(doc, ret, options);
      }

      return ret;
    },
  });

  schema.set("toObject", schema.get("toJSON"));
};
