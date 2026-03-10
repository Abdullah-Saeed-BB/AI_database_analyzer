import { cookies } from "next/headers";

const API_URL = process.env.NEXT_PUBLIC_API_URL
export async function authFetch(url: string, options: RequestInit = {}) {

  const cookiesStore = await cookies();
  const token = cookiesStore.get("jwt_token")?.value;

  return fetch(`${API_URL}${url}`, {
    ...options,
    headers: {
      Authorization: `Bearer ${token}`,
      ...options.headers
    }
  });
}
