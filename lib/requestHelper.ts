import { cookies } from "next/headers";

// Create RequestInit for server-side fetches. cookies() is async in recent
// Next versions so this helper is async and must be awaited.
export const createRequestHeader = async (): Promise<RequestInit> => {
  // Await cookies() per Next.js guidance for dynamic APIs in server routes
  const cookieStore = await cookies();
  // cookies().toString() will format as 'name=value; name2=value2'
  const cookieHeader = cookieStore.toString();

  const fetchOptions: RequestInit = {
    // avoid caching server-side auth-protected data
    cache: "no-store",
    // Forward cookies to internal API so middleware can read the auth token
    headers: cookieHeader ? { cookie: cookieHeader } : undefined,
  };

  return fetchOptions;
};

// A small server-side fetch wrapper that forwards cookies and returns the Response.
/**
 * Server-side fetch wrapper that forwards cookies and accepts any RequestInit.
 * - route: path or full URL relative to NEXT_PUBLIC_BASE_URL
 * - init: optional RequestInit, same shape as window.fetch
 *
 * Behavior:
 * - merges server defaults from createRequestHeader() with provided init
 * - headers are merged (cookie header from createRequestHeader is preserved
 *   unless init.headers overrides it)
 */
export const myFetch = async (route: string, init?: RequestInit): Promise<Response> => {
  // Get base defaults (includes forwarded cookie header)
  const baseOptions = await createRequestHeader();

  const base = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
  // Build the URL safely (handles leading slashes)
  const url = new URL(route, base).toString();

  // Helper to normalize HeadersInit into a plain object
  const normalizeHeaders = (h?: HeadersInit): Record<string, string> => {
    const out: Record<string, string> = {};
    if (!h) return out;
    if (h instanceof Headers) {
      h.forEach((v, k) => (out[k] = v));
    } else if (Array.isArray(h)) {
      h.forEach(([k, v]) => (out[k] = v));
    } else {
      // h is Record<string, string>
      Object.assign(out, h);
    }
    return out;
  };

  const mergedHeaders = {
    ...normalizeHeaders(baseOptions.headers as HeadersInit | undefined),
    ...normalizeHeaders(init?.headers as HeadersInit | undefined),
  };

  // Merge options: baseOptions provide defaults (e.g. cache no-store), init overrides
  const mergedInit: RequestInit = {
    ...baseOptions,
    ...init,
    // ensure headers becomes the merged plain-object headers
    headers: mergedHeaders,
  };

  const response = await fetch(url, mergedInit);
  return response;
};

export default myFetch;