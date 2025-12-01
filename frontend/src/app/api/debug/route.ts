// app/api/debug/route.ts
import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    NEXT_PUBLIC_CPP_BACKEND: process.env.NEXT_PUBLIC_CPP_BACKEND ?? null,
    NEXT_PUBLIC_PY_BACKEND: process.env.NEXT_PUBLIC_PY_BACKEND ?? null,
  });
}
