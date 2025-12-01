import { NextRequest, NextResponse } from "next/server";

const CPP_BACKEND = process.env.NEXT_PUBLIC_CPP_BACKEND;
if (!CPP_BACKEND) throw new Error("NEXT_PUBLIC_CPP_BACKEND not set!");

export async function POST(req: NextRequest) {
  const { pathname } = new URL(req.url);
  const path = pathname.replace("/api/proxy/cpp", "");

  const targetUrl = `${CPP_BACKEND}${path}`;

  const body = await req.text();

  const res = await fetch(targetUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body,
  });

  const data = await res.text();
  return new NextResponse(data, { status: res.status });
}

export async function GET(req: NextRequest) {
  const { pathname, search } = new URL(req.url);
  const path = pathname.replace("/api/proxy/cpp", "");

  const targetUrl = `${CPP_BACKEND}${path}${search}`;

  const res = await fetch(targetUrl, { method: "GET" });
  const data = await res.text();
  return new NextResponse(data, { status: res.status });
}
