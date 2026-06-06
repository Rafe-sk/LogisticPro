/**
 * auth.js  —  Lightweight JWT-based auth helper (replaces Firebase)
 *
 * Token payload stored in localStorage under "lp_token".
 * The backend signs it as:  { userid, email, name }
 */

const API = 'http://localhost:8000/user';
const TOKEN_KEY = 'lp_token';

// ─── Token helpers ────────────────────────────────────────────────────────────

export function getToken() {
    return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token) {
    localStorage.setItem(TOKEN_KEY, token);
}

export function removeToken() {
    localStorage.removeItem(TOKEN_KEY);
}

/** Decode the JWT payload (no signature verification — client-side only). */
export function getUser() {
    const token = getToken();
    if (!token) return null;
    try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        // Check expiry
        if (payload.exp && Date.now() / 1000 > payload.exp) {
            removeToken();
            return null;
        }
        return payload;          // { userid, email, name, iat, exp }
    } catch {
        return null;
    }
}

export function isLoggedIn() {
    return getUser() !== null;
}

// ─── Auth API calls ───────────────────────────────────────────────────────────

/**
 * Register a new user (email + password).
 * Returns { token } on success, or throws with an error message.
 */
export async function registerWithEmailAndPassword(email, password) {
    const res = await fetch(`${API}/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Registration failed');
    setToken(data.token);
    return data;
}

/**
 * Login with email + password.
 * Returns { token } on success, or throws with an error message.
 */
export async function loginWithEmailAndPassword(email, password) {
    const res = await fetch(`${API}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Login failed');
    setToken(data.token);
    return data;
}

/** Log out — clear the stored token. */
export function logOut() {
    removeToken();
}
