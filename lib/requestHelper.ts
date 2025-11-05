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
export const myFetch = async (route: string): Promise<Response> => {
  const fetchOptions = await createRequestHeader();
  const base = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
  // Build the URL safely (handles leading slashes)
  const url = new URL(route, base).toString();
  console.log("Fetch Options:", url);
  const response = await fetch(url, fetchOptions);
  return response;
};

export default myFetch;