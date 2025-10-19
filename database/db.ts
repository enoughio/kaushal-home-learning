import postgres from "postgres";

// create the postgres.js client
export const sql = postgres(process.env.DATABASE_URL!, {
  ssl: "require",
  // optionally tune connection pool
  max: 5,
});

// Replace exported helper with a wrapper that always returns a native Promise.
// This avoids TypeScript/await issues with the callable `sql` client.
export function run<T = any>(text: string, params?: any[]): Promise<T> {
  // ensure we always return a proper Promise (avoid thenable confusion)
  if (!params || params.length === 0) {
    return Promise.resolve((sql as any)(text)) as Promise<T>;
  }
  return Promise.resolve((sql as any)(text, ...params)) as Promise<T>;
}

export default sql;
