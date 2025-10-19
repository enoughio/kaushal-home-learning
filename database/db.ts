import postgres from 'postgres';

// create the postgres.js client
export const sql = postgres(process.env.DATABASE_URL!, {
	ssl: 'require',
	// optionally tune connection pool
	max: 5,
});

// Replace exported helper with a wrapper that always returns a native Promise.
// // This avoids TypeScript/await issues with the callable `sql` client.
// export function run<T = any>(text: string, params?: any[]): Promise<T> {
// 	// ensure we always return a proper Promise (avoid thenable confusion)
// 	if (!params || params.length === 0) {
// 		return Promise.resolve((sql as any)(text)) as Promise<T>;
// 	}
// 	return Promise.resolve((sql as any)(text, ...params)) as Promise<T>;
// }

export default sql;

// Helper to test DB connectivity (used by health check API)
export async function testConnection() {
	try {
		// run a simple query to get the server version
		const res = await (sql as any)`select version()`;
		const version = Array.isArray(res) && res.length > 0 ? String(res[0].version ?? res[0]) : undefined;
		return {
			success: true,
			timestamp: new Date().toISOString(),
			version,
		};
	} catch (err: any) {
		return {
			success: false,
			timestamp: new Date().toISOString(),
			error: err?.message ?? String(err),
		};
	}
}

