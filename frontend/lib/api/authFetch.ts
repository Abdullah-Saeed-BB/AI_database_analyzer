import { cookies } from "next/headers";

const API_URL = process.env.NEXT_PUBLIC_API_URL
export async function authFetch(url: string, options: RequestInit = {}) {

  const cookiesStore = await cookies();
  const token = cookiesStore.get("jwt_token")?.value;

  const res = await fetch(`${API_URL}${url}`, {
    ...options,
    headers: {
      Authorization: `Bearer ${token}`,
      ...options.headers
    }
  });

  if (res.status === 401) {
    if (typeof window !== "undefined") {
      window.location.href = "/login";
    }
    throw new Error("Unauthorized");
  }

  return res;
}