export const sql_keywords = [
    "SELECT",
    "FROM",
    "WHERE",
    "GROUP BY",
    "HAVING",
    "ORDER BY",
    "LIMIT",
    "JOIN",
    "LEFT JOIN",
    "RIGHT JOIN",
    "INNER JOIN",
    "OUTER JOIN",
    "UNION",
    "VALUES",
    "SET"
];

export default function formatSQL(query: string): string {
  // Define the keywords we want to move to a new line

  // Create a regex pattern: \b(KEYWORD1|KEYWORD2)\b
  // \b ensures we match whole words only
  const pattern = new RegExp(`\\b(${sql_keywords.join("|")})\\b`, "gi");

  return query
    .replace(/\s+/g, " ")       // Collapse multiple spaces/newlines into one
    .replace(pattern, "\n$1")   // Add newline before the keyword
    .trim();                    // Remove leading/trailing whitespace
}