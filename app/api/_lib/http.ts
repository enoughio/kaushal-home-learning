import { NextResponse } from "next/server";

interface ErrorOptions {
  error: string;
  message: string;
  status?: number;
  details?: unknown;
}

interface SuccessOptions<T> {
  data: T;
  message?: string;
  status?: number;
  meta?: Record<string, unknown>;
}

export function respondWithError({
  error,
  message,
  status = 400,
  details,
}: ErrorOptions) {
  return NextResponse.json(
    {
      error,
      message,
      code: status,
      status,
      ...(details ? { details } : {}),
    },
    { status }
  );
}

export function respondWithSuccess<T>({
  data,
  message,
  status = 200,
  meta,
}: SuccessOptions<T>) {
  return NextResponse.json(
    {
      data,
      ...(message ? { message } : {}),
      ...(meta ? { meta } : {}),
      status,
      code: status,
    },
    { status }
  );
}
