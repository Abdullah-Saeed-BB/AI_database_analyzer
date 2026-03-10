const API_URL = process.env.NEXT_PUBLIC_API_URL

export function getCookie(name: string) {
    if (typeof document === 'undefined') return undefined
    const value = `; ${document.cookie}`
    const parts = value.split(`; ${name}=`)
    if (parts.length === 2) return parts.pop()?.split(';').shift()
    return undefined
}

export async function authFetchClient(url: string, options: RequestInit = {}) {
    const token = getCookie('jwt_token')
    const res = await fetch(`${API_URL}${url}`, {
        ...options,
        headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
            ...options.headers,
        },
    })

    if (res.status === 401) {
        if (typeof window !== "undefined") {
            window.location.href = "/login";
        }
        throw new Error("Unauthorized");
    }

    return res
}
