import { NextResponse } from "next/server";

export const GET = async () => {
  return NextResponse.json(
    {
      message: "this is an archived route",
      error: "INVALID_ROUTE",
      code: 403,
    },
    {
      status: 403,
    }
  );
};
