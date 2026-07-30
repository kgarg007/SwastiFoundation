const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';

function getHeaders() {
  const headers = {};
  const token = localStorage.getItem('admin_token');
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
}

export const api = {
  // GET helper
  async get(endpoint) {
    const res = await fetch(`${API_BASE_URL}${endpoint}`, {
      cache: "no-store",
      headers: getHeaders()
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Request failed');
    return data;
  },

  // POST helper
  async post(endpoint, body, isMultipart = false) {
    const res = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'POST',
      headers: isMultipart ? getHeaders() : { 'Content-Type': 'application/json', ...getHeaders() },
      body: isMultipart ? body : JSON.stringify(body)
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Request failed');
    return data;
  },

  // PUT helper
  async put(endpoint, body, isMultipart = false) {
    const res = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'PUT',
      headers: isMultipart ? getHeaders() : { 'Content-Type': 'application/json', ...getHeaders() },
      body: isMultipart ? body : JSON.stringify(body)
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Request failed');
    return data;
  },

  // DELETE helper
  async delete(endpoint) {
    const res = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'DELETE',
      headers: getHeaders()
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Request failed');
    return data;
  }
};
