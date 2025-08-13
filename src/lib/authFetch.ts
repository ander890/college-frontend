// src/lib/authFetch.ts
// Helper fetch dengan auto refresh token jika access token expired

export async function authFetch(input: RequestInfo, init: RequestInit = {}) {
  let token = typeof window !== "undefined" ? localStorage.getItem("admin_token") : null;
  let headers = { ...(init.headers || {}), ...(token ? { Authorization: `Bearer ${token}` } : {}) };
  let response = await fetch(input, { ...init, headers });

  // Jika token expired (401), coba refresh token
  if (response.status === 401) {
    // Coba refresh token
    const refreshRes = await fetch(
      (process.env.NEXT_PUBLIC_API_BASE_URL || "") + "/api/refresh",
      { method: "POST", credentials: "include" }
    );
    if (refreshRes.ok) {
      const refreshData = await refreshRes.json();
      if (refreshData.token) {
        // Simpan token baru ke localStorage
        localStorage.setItem("admin_token", refreshData.token);
        // Ulangi request awal dengan token baru
        token = refreshData.token;
        headers = { ...(init.headers || {}), Authorization: `Bearer ${token}` };
        response = await fetch(input, { ...init, headers });
      }
    }
  }
  return response;
}
