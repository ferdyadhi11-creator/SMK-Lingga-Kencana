import { NextRequest, NextResponse } from "next/server";
import { getSession, SESSION_COOKIE, setAdminPassword, verifyCredentials, createSession } from "@/lib/auth";

export async function POST(req: NextRequest) {
  const session = await getSession(req.cookies.get(SESSION_COOKIE)?.value);
  if (!session) return NextResponse.json({ error: "Sesi login tidak valid." }, { status: 401 });

  const body = await req.json();
  const currentPassword = String(body.currentPassword || "");
  const newPassword = String(body.newPassword || "");

  if (newPassword.length < 6) {
    return NextResponse.json({ error: "Password baru minimal 6 karakter." }, { status: 400 });
  }
  if (!(await verifyCredentials(session.username, currentPassword))) {
    return NextResponse.json({ error: "Password saat ini salah." }, { status: 400 });
  }

  await setAdminPassword(newPassword);
  // Sesi lama otomatis tidak berlaku; buat sesi baru agar admin tetap login.
  const fresh = await createSession(session.user_id);
  const response = NextResponse.json({ ok: true, message: "Password berhasil diperbarui." });
  response.cookies.set(SESSION_COOKIE, fresh.token, { httpOnly: true, sameSite: 'lax', secure: process.env.NODE_ENV === 'production', path: '/', maxAge: 7 * 86400 });
  return response;
}
