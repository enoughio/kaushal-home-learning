export function parsePagination(query: URLSearchParams, defaults?: { page?: number; limit?: number }) {
  const page = Math.max(1, Number(query.get("page")) || defaults?.page || 1);
  const limit = Math.min(100, Math.max(1, Number(query.get("limit")) || defaults?.limit || 20));
  const skip = (page - 1) * limit;

  return { page, limit, skip };
}
