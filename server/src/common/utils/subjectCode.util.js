// src/modules/subjects/subject-code.util.js

function normalizeCodePart(value) {
  return String(value)
    .trim()
    .toUpperCase()
    .replace(/[^A-Z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function createSubjectCodePrefix({
  streamCode,
  subjectName,
  level,
}) {
  const normalizedStreamCode =
    normalizeCodePart(streamCode);

  const normalizedSubjectName =
    normalizeCodePart(subjectName);

  const normalizedLevel = String(level).padStart(
    2,
    "0"
  );

  return [
    normalizedStreamCode,
    normalizedSubjectName,
    normalizedLevel,
  ].join("-");
}