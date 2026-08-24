import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

const JWT_SECRET = process.env.JWT_SECRET || "super_secret_key_123";

export async function createSession(userId: string, role: string) {
  const token = jwt.sign({ userId, role }, JWT_SECRET, { expiresIn: "7d" });
  const cookieStore = await cookies();
  const cookieName = role === "ADMIN" ? "admin_session_token" : "session_token";
  
  cookieStore.set(cookieName, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 24 * 7, // 7 days
    path: "/",
  });
}

export async function getSession() {
  const cookieStore = await cookies();
  const token = cookieStore.get("session_token")?.value;
  if (!token) return null;
  try {
    return jwt.verify(token, JWT_SECRET) as { userId: string; role: string };
  } catch (error) {
    return null;
  }
}

export async function getAdminSession() {
  const cookieStore = await cookies();
  const token = cookieStore.get("admin_session_token")?.value || cookieStore.get("session_token")?.value;
  if (!token) return null;
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string; role: string };
    if (decoded && (decoded.role === "ADMIN" || decoded.role === "admin")) {
      return decoded;
    }
    return null;
  } catch (error) {
    return null;
  }
}

export async function clearSession() {
  const cookieStore = await cookies();
  cookieStore.delete("session_token");
}

export async function clearAdminSession() {
  const cookieStore = await cookies();
  cookieStore.delete("admin_session_token");
}
