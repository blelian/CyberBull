import { NextRequest, NextResponse } from 'next/server';

const PY_BACKEND = process.env.NEXT_PUBLIC_PY_BACKEND;

if (!PY_BACKEND) console.error("NEXT_PUBLIC_PY_BACKEND not set!");

async function forwardRequest(req: NextRequest, path: string[]) {
  // Build target URL
  const targetUrl = `${PY_BACKEND}/${path.join('/')}${req.nextUrl.search || ''}`;

  // Clone headers (omit host to avoid CORS issues)
  const headers = new Headers(req.headers);
  headers.delete('host');

  // Prepare request options
  const options: RequestInit = {
    method: req.method,
    headers,
    body: req.method !== 'GET' && req.method !== 'HEAD' ? await req.text() : undefined,
  };

  // Forward request to FastAPI backend
  const response = await fetch(targetUrl, options);

  // Create NextResponse with backend response
  const data = await response.arrayBuffer();
  const res = new NextResponse(data, {
    status: response.status,
    statusText: response.statusText,
  });

  // Copy response headers
  response.headers.forEach((value, key) => res.headers.set(key, value));

  return res;
}

// Handle all HTTP methods
export async function GET(req: NextRequest, { params }: { params: string[] }) {
  return forwardRequest(req, params);
}

export async function POST(req: NextRequest, { params }: { params: string[] }) {
  return forwardRequest(req, params);
}

export async function PUT(req: NextRequest, { params }: { params: string[] }) {
  return forwardRequest(req, params);
}

export async function DELETE(req: NextRequest, { params }: { params: string[] }) {
  return forwardRequest(req, params);
}
