import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

import {
  APP_NAME,
  BOOLEAN_FALSE_VALUES,
  BOOLEAN_TRUE_VALUES,
  ENV_DEFAULTS,
  PASSWORD_POLICY_LIMITS,
  VALID_NODE_ENVS,
} from "../utils/constants.js";

let cachedEnvConfig;

class EnvValidationError extends Error {
  constructor(issues) {
    super(
      ["Environment validation failed:", ...issues.map((issue) => `- ${issue}`)].join(
        "\n"
      )
    );
    this.name = "EnvValidationError";
    this.issues = issues;
  }
}

const deepFreeze = (value) => {
  if (!value || typeof value !== "object" || Object.isFrozen(value)) {
    return value;
  }

  Object.freeze(value);

  Object.values(value).forEach((nestedValue) => {
    deepFreeze(nestedValue);
  });

  return value;
};

const isBlank = (value) =>
  value == null || (typeof value === "string" && value.trim().length === 0);

const resolveDefaultValue = (defaultValue) =>
  typeof defaultValue === "function" ? defaultValue() : defaultValue;

const getRawEnvValue = (key, aliases = []) => {
  for (const candidate of [key, ...aliases]) {
    if (Object.prototype.hasOwnProperty.call(process.env, candidate)) {
      return process.env[candidate];
    }
  }

  return undefined;
};

const parseString = (key, rawValue, options = {}) => {
  const {
    required = true,
    defaultValue,
    allowEmpty = false,
    trim = true,
    allowedValues,
    minLength = allowEmpty ? 0 : 1,
  } = options;

  if (isBlank(rawValue)) {
    if (defaultValue !== undefined) {
      return resolveDefaultValue(defaultValue);
    }

    if (!required) {
      return undefined;
    }

    throw new Error(`${key} is required`);
  }

  const value = trim ? String(rawValue).trim() : String(rawValue);

  if (!allowEmpty && value.length === 0) {
    throw new Error(`${key} must not be empty`);
  }

  if (value.length < minLength) {
    throw new Error(`${key} must be at least ${minLength} characters long`);
  }

  if (allowedValues && !allowedValues.includes(value)) {
    throw new Error(`${key} must be one of: ${allowedValues.join(", ")}`);
  }

  return value;
};

const parseInteger = (key, rawValue, options = {}) => {
  const { defaultValue, required = defaultValue === undefined, min, max } = options;
  const value = parseString(key, rawValue, { required, defaultValue });

  if (value === undefined) {
    return undefined;
  }

  if (!/^-?\d+$/.test(value)) {
    throw new Error(`${key} must be an integer`);
  }

  const parsedValue = Number.parseInt(value, 10);

  if (!Number.isSafeInteger(parsedValue)) {
    throw new Error(`${key} must be a safe integer`);
  }

  if (min !== undefined && parsedValue < min) {
    throw new Error(`${key} must be greater than or equal to ${min}`);
  }

  if (max !== undefined && parsedValue > max) {
    throw new Error(`${key} must be less than or equal to ${max}`);
  }

  return parsedValue;
};

const parseBoolean = (key, rawValue, options = {}) => {
  const {
    defaultValue,
    required = defaultValue === undefined,
    trim = true,
  } = options;
  const value = parseString(key, rawValue, {
    required,
    defaultValue:
      defaultValue === undefined
        ? undefined
        : String(resolveDefaultValue(defaultValue)),
    trim,
  });

  if (value === undefined) {
    return undefined;
  }

  const normalizedValue = value.toLowerCase();

  if (BOOLEAN_TRUE_VALUES.has(normalizedValue)) {
    return true;
  }

  if (BOOLEAN_FALSE_VALUES.has(normalizedValue)) {
    return false;
  }

  throw new Error(`${key} must be a boolean`);
};

const parseUrl = (key, rawValue, options = {}) => {
  const {
    defaultValue,
    required = defaultValue === undefined,
    protocols = ["http", "https"],
    allowPath = true,
    allowQuery = true,
    allowHash = true,
  } = options;
  const value = parseString(key, rawValue, { required, defaultValue });

  if (value === undefined) {
    return undefined;
  }

  let parsedUrl;

  try {
    parsedUrl = new URL(value);
  } catch {
    throw new Error(`${key} must be a valid URL`);
  }

  const normalizedProtocol = parsedUrl.protocol.replace(/:$/, "");

  if (!protocols.includes(normalizedProtocol)) {
    throw new Error(
      `${key} must use one of these protocols: ${protocols.join(", ")}`
    );
  }

  if (!allowPath && parsedUrl.pathname !== "/") {
    throw new Error(`${key} must not include a path`);
  }

  if (!allowQuery && parsedUrl.search) {
    throw new Error(`${key} must not include a query string`);
  }

  if (!allowHash && parsedUrl.hash) {
    throw new Error(`${key} must not include a hash fragment`);
  }

  return allowPath ? parsedUrl.toString() : parsedUrl.origin;
};

const parseArray = (key, rawValue, options = {}) => {
  const {
    defaultValue,
    required = defaultValue === undefined,
    separator = ",",
    minItems = 0,
    unique = false,
    itemParser = (item) => item,
  } = options;
  const value = parseString(key, rawValue, { required, defaultValue });

  if (value === undefined) {
    return undefined;
  }

  const items = value.split(separator).map((item) => item.trim());

  if (items.some((item) => item.length === 0)) {
    throw new Error(`${key} must not contain empty items`);
  }

  const parsedItems = items.map((item, index) => itemParser(item, index));

  if (unique && new Set(parsedItems).size !== parsedItems.length) {
    throw new Error(`${key} must not contain duplicate values`);
  }

  if (parsedItems.length < minItems) {
    throw new Error(`${key} must include at least ${minItems} value(s)`);
  }

  return parsedItems;
};

const parseMongoUri = (key, rawValue, options = {}) => {
  const value = parseString(key, rawValue, options);

  if (value === undefined) {
    return undefined;
  }

  if (!/^mongodb(\+srv)?:\/\//u.test(value)) {
    throw new Error(`${key} must be a valid MongoDB connection string`);
  }

  return value;
};

const parseEnvValue = (key, options = {}) => {
  const rawValue = getRawEnvValue(key, options.aliases);

  switch (options.type) {
    case "int":
      return parseInteger(key, rawValue, options);
    case "bool":
      return parseBoolean(key, rawValue, options);
    case "array":
      return parseArray(key, rawValue, options);
    case "url":
      return parseUrl(key, rawValue, options);
    case "mongo":
      return parseMongoUri(key, rawValue, options);
    case undefined:
    case "string":
      return parseString(key, rawValue, options);
    default:
      throw new Error(`Unsupported env parser type "${options.type}" for ${key}`);
  }
};

const buildValidatedEnv = () => {
  const issues = [];

  const read = (key, options = {}) => {
    try {
      return parseEnvValue(key, options);
    } catch (error) {
      issues.push(error.message);
      return undefined;
    }
  };

  const NODE_ENV = read("NODE_ENV", {
    allowedValues: VALID_NODE_ENVS,
  });
  const IS_PRODUCTION = NODE_ENV === "production";
  const IS_STAGING = NODE_ENV === "staging";
  const IS_DEVELOPMENT = NODE_ENV === "development";

  const PORT = read("PORT", { type: "int", min: 1, max: 65535 });
  const MONGODB_URI = read("MONGODB_URI", { type: "mongo" });
  const CORS_ALLOWED_ORIGINS = read("CORS_ALLOWED_ORIGINS", {
    type: "array",
    aliases: ["ALLOWED_ORIGINS"],
    minItems: 1,
    unique: true,
    itemParser: (value) => {
      if (value === "*") {
        throw new Error("CORS_ALLOWED_ORIGINS must not contain '*'");
      }

      return parseUrl("CORS_ALLOWED_ORIGINS", value, {
        protocols: ["http", "https"],
        allowPath: false,
        allowQuery: false,
        allowHash: false,
      });
    },
  });
  const JWT_ACCESS_SECRET = read("JWT_ACCESS_SECRET", { minLength: 8 });
  const JWT_REFRESH_SECRET = read("JWT_REFRESH_SECRET", { minLength: 8 });
  const JWT_ACCESS_TTL_MINUTES = read("JWT_ACCESS_TTL_MINUTES", {
    type: "int",
    defaultValue: ENV_DEFAULTS.JWT_ACCESS_TTL_MINUTES,
    min: 1,
  });
  const JWT_REFRESH_TTL_DAYS = read("JWT_REFRESH_TTL_DAYS", {
    type: "int",
    defaultValue: ENV_DEFAULTS.JWT_REFRESH_TTL_DAYS,
    min: 1,
  });
  const EMAIL_VERIFICATION_TOKEN_TTL_MINUTES = read(
    "EMAIL_VERIFICATION_TOKEN_TTL_MINUTES",
    {
      type: "int",
      defaultValue: ENV_DEFAULTS.EMAIL_VERIFICATION_TOKEN_TTL_MINUTES,
      min: 1,
    }
  );
  const PASSWORD_RESET_TOKEN_TTL_MINUTES = read(
    "PASSWORD_RESET_TOKEN_TTL_MINUTES",
    {
      type: "int",
      defaultValue: ENV_DEFAULTS.PASSWORD_RESET_TOKEN_TTL_MINUTES,
      min: 1,
    }
  );
  const SET_PASSWORD_TOKEN_TTL_MINUTES = read("SET_PASSWORD_TOKEN_TTL_MINUTES", {
    type: "int",
    defaultValue: ENV_DEFAULTS.SET_PASSWORD_TOKEN_TTL_MINUTES,
    min: 1,
  });
  const SMTP_HOST = read("SMTP_HOST");
  const SMTP_PORT = read("SMTP_PORT", { type: "int", min: 1, max: 65535 });
  const SMTP_USER = read("SMTP_USER");
  const SMTP_PASS = read("SMTP_PASS");
  const SMTP_FROM = read("SMTP_FROM");
  const CLOUDINARY_CLOUD_NAME = read("CLOUDINARY_CLOUD_NAME");
  const CLOUDINARY_API_KEY = read("CLOUDINARY_API_KEY");
  const CLOUDINARY_API_SECRET = read("CLOUDINARY_API_SECRET");
  const ATTACHMENTS_TTL_DAYS = read("ATTACHMENTS_TTL_DAYS", {
    type: "int",
    min: 1,
  });
  const NOTIFICATIONS_TTL_DAYS = read("NOTIFICATIONS_TTL_DAYS", {
    type: "int",
    min: 1,
  });

  if (issues.length > 0) {
    throw new EnvValidationError(issues);
  }

  const PASSWORD_POLICY = {
    minLength: IS_PRODUCTION
      ? PASSWORD_POLICY_LIMITS.PRODUCTION_MIN_LENGTH
      : PASSWORD_POLICY_LIMITS.DEVELOPMENT_MIN_LENGTH,
    requireUppercase: IS_PRODUCTION,
    requireLowercase: IS_PRODUCTION,
    requireDigit: IS_PRODUCTION,
    requireSymbol: IS_PRODUCTION,
    allowCommonPasswords: !IS_PRODUCTION,
    allowSimplePasswords: !IS_PRODUCTION,
    passwordHistoryLimit: PASSWORD_POLICY_LIMITS.HISTORY_LIMIT,
  };

  const AUTH_COOKIE_OPTIONS = {
    httpOnly: true,
    secure: IS_PRODUCTION,
    sameSite: IS_PRODUCTION ? "strict" : "lax",
    path: "/",
  };

  const CSRF_COOKIE_OPTIONS = {
    httpOnly: false,
    secure: IS_PRODUCTION,
    sameSite: IS_PRODUCTION ? "strict" : "lax",
    path: "/",
  };

  return deepFreeze({
    NODE_ENV,
    IS_DEVELOPMENT,
    IS_STAGING,
    IS_PRODUCTION,
    PORT,
    MONGODB_URI,
    CORS_ALLOWED_ORIGINS,
    JWT_ACCESS_SECRET,
    JWT_REFRESH_SECRET,
    JWT_ACCESS_TTL_MINUTES,
    JWT_REFRESH_TTL_DAYS,
    JWT_ACCESS_EXPIRES_IN: `${JWT_ACCESS_TTL_MINUTES}m`,
    JWT_REFRESH_EXPIRES_IN: `${JWT_REFRESH_TTL_DAYS}d`,
    EMAIL_VERIFICATION_TOKEN_TTL_MINUTES,
    PASSWORD_RESET_TOKEN_TTL_MINUTES,
    SET_PASSWORD_TOKEN_TTL_MINUTES,
    SMTP_HOST,
    SMTP_PORT,
    SMTP_USER,
    SMTP_PASS,
    SMTP_FROM,
    CLOUDINARY_CLOUD_NAME,
    CLOUDINARY_API_KEY,
    CLOUDINARY_API_SECRET,
    ATTACHMENTS_TTL_DAYS,
    NOTIFICATIONS_TTL_DAYS,
    APP_NAME,
    AUTH_COOKIE_OPTIONS,
    CSRF_COOKIE_OPTIONS,
    PASSWORD_POLICY,
    PLATFORM_SEED: {
      organizationName: read("PLATFORM_ORGANIZATION_NAME", { required: false }),
      organizationDescription: read("PLATFORM_ORGANIZATION_DESCRIPTION", {
        required: false,
      }),
      organizationEmail: read("PLATFORM_ORGANIZATION_EMAIL", { required: false }),
      organizationPhone: read("PLATFORM_ORGANIZATION_PHONE", { required: false }),
      organizationAddress: read("PLATFORM_ORGANIZATION_ADDRESS", {
        required: false,
      }),
      organizationSize: read("PLATFORM_ORGANIZATION_SIZE", { required: false }),
      organizationIndustry: read("PLATFORM_ORGANIZATION_INDUSTRY", {
        required: false,
      }),
      departmentName: read("PLATFORM_DEPARTMENT_NAME", { required: false }),
      departmentDescription: read("PLATFORM_DEPARTMENT_DESCRIPTION", {
        required: false,
      }),
      adminFirstName: read("PLATFORM_ADMIN_FIRST_NAME", { required: false }),
      adminLastName: read("PLATFORM_ADMIN_LAST_NAME", { required: false }),
      adminPosition: read("PLATFORM_ADMIN_POSITION", { required: false }),
      adminRole: read("PLATFORM_ADMIN_ROLE", { required: false }),
      adminEmail: read("PLATFORM_ADMIN_EMAIL", { required: false }),
      adminPassword: read("PLATFORM_ADMIN_PASSWORD", { required: false }),
    },
  });
};

/**
 * Loads environment variables, validates the supported keys, and caches the frozen result.
 *
 * @param {object} [options] - Load options.
 * @param {boolean} [options.forceReload=false] - Rebuilds the cached config from the current process env.
 * @param {string} [options.envFilePath] - Optional `.env` file path to load before validation.
 * @param {Record<string, string | number | boolean | null | undefined>} [options.overrides] - Temporary env overrides applied before validation.
 * @returns {Readonly<Record<string, unknown>>} Frozen validated environment config.
 * @throws {EnvValidationError} Thrown when required environment values are missing or invalid.
 */
export const loadEnv = (options = {}) => {
  const {
    forceReload = false,
    envFilePath = path.resolve(
      path.dirname(fileURLToPath(import.meta.url)),
      "../.env"
    ),
    overrides,
  } = options;

  if (cachedEnvConfig && !forceReload) {
    return cachedEnvConfig;
  }

  dotenv.config({ path: envFilePath, quiet: true });

  if (overrides && typeof overrides === "object") {
    Object.entries(overrides).forEach(([key, value]) => {
      if (value == null) {
        delete process.env[key];
        return;
      }

      process.env[key] = String(value);
    });
  }

  cachedEnvConfig = undefined;
  cachedEnvConfig = buildValidatedEnv();

  return cachedEnvConfig;
};

/**
 * Returns the full validated env object or a single typed env value.
 *
 * @param {string} [key] - Optional env key to retrieve.
 * @param {object} [options] - Optional parser configuration for ad hoc env access.
 * @param {"string"|"int"|"bool"|"array"|"url"|"mongo"} [options.type] - Parser type used when the requested key is outside the validated config.
 * @param {string[]} [options.aliases] - Additional env key aliases checked in order.
 * @param {string|number|boolean|(() => unknown)} [options.defaultValue] - Fallback value used when the key is absent.
 * @param {boolean} [options.required] - Whether the key is required if no default is provided.
 * @returns {unknown} The full env object or a parsed env value.
 * @throws {EnvValidationError|Error} Thrown when the env is invalid or the requested key cannot be parsed.
 */
export const getEnv = (key, options = {}) => {
  const envConfig = loadEnv();

  if (typeof key === "undefined") {
    return envConfig;
  }

  if (Object.prototype.hasOwnProperty.call(envConfig, key)) {
    return envConfig[key];
  }

  return parseEnvValue(key, options);
};
