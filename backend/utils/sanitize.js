import {
  SCHEMA_VALIDATION_PATTERNS,
  URL_PROTOCOL_VALUES,
} from "./constants.js";

/**
 * Normalizes an email address for storage and comparisons.
 *
 * @param {string} value - Email candidate.
 * @returns {string} Normalized email.
 * @throws {never} This helper does not throw.
 */
export const normalizeEmail = (value) => String(value || "").trim().toLowerCase();

/**
 * Normalizes an Ethiopian phone number into its trimmed representation.
 *
 * @param {string} value - Phone candidate.
 * @returns {string} Normalized phone number.
 * @throws {never} This helper does not throw.
 */
export const normalizePhoneNumber = (value) =>
  String(value || "").replace(/\s+/g, "").trim();

/**
 * Checks whether an email address matches the canonical backend pattern.
 *
 * @param {string} value - Email candidate.
 * @returns {boolean} Whether the email is valid.
 * @throws {never} This helper does not throw.
 */
export const isValidEmailAddress = (value) =>
  SCHEMA_VALIDATION_PATTERNS.EMAIL.test(normalizeEmail(value));

/**
 * Checks whether a phone number matches the canonical backend pattern.
 *
 * @param {string} value - Phone candidate.
 * @returns {boolean} Whether the phone number is valid.
 * @throws {never} This helper does not throw.
 */
export const isValidPhoneNumber = (value) =>
  SCHEMA_VALIDATION_PATTERNS.PHONE.test(normalizePhoneNumber(value));

/**
 * Checks whether a URL uses an allowed protocol and parses correctly.
 *
 * @param {string} value - URL candidate.
 * @returns {boolean} Whether the URL is valid.
 * @throws {never} This helper does not throw.
 */
export const isValidHttpUrl = (value) => {
  try {
    const url = new URL(String(value || "").trim());
    return URL_PROTOCOL_VALUES.includes(url.protocol);
  } catch {
    return false;
  }
};

/**
 * Normalizes an SKU-like value for consistent indexing.
 *
 * @param {string} value - SKU candidate.
 * @returns {string} Normalized SKU.
 * @throws {never} This helper does not throw.
 */
export const normalizeSku = (value) =>
  String(value || "")
    .trim()
    .toUpperCase()
    .replace(/[^A-Z0-9-]/g, "-")
    .replace(/-{2,}/g, "-");

/**
 * Normalizes comma or array tag inputs to lowercase unique values.
 *
 * @param {string[] | string | null | undefined} value - Tag input.
 * @returns {string[]} Normalized tags.
 * @throws {never} This helper does not throw.
 */
export const normalizeTags = (value) => {
  const source = Array.isArray(value)
    ? value
    : String(value || "")
        .split(",")
        .map((item) => item.trim());

  return [...new Set(source.filter(Boolean).map((item) => item.toLowerCase()))];
};
