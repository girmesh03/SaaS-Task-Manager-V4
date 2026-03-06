/**
 * Calculates a lightweight password-strength score for auth forms.
 *
 * @param {string} password - Raw password input.
 * @returns {{ score: number, label: "Weak"|"Fair"|"Good"|"Strong", percent: number, color: "error"|"warning"|"success" }} Strength result.
 * @throws {never} This helper does not throw.
 */
export const getPasswordStrength = (password) => {
  let score = 0;
  const value = String(password || "");

  if (value.length >= 8) {
    score += 1;
  }

  if (value.length >= 12) {
    score += 1;
  }

  if (/[a-z]/.test(value) && /[A-Z]/.test(value)) {
    score += 1;
  }

  if (/\d/.test(value) && /[^A-Za-z0-9]/.test(value)) {
    score += 1;
  }

  const normalizedScore = Math.max(0, Math.min(score, 4));
  const percent = Math.round((normalizedScore / 4) * 100);

  if (normalizedScore <= 1) {
    return {
      score: normalizedScore,
      label: "Weak",
      percent,
      color: "error",
    };
  }

  if (normalizedScore === 2) {
    return {
      score: normalizedScore,
      label: "Fair",
      percent,
      color: "warning",
    };
  }

  if (normalizedScore === 3) {
    return {
      score: normalizedScore,
      label: "Good",
      percent,
      color: "success",
    };
  }

  return {
    score: normalizedScore,
    label: "Strong",
    percent,
    color: "success",
  };
};
