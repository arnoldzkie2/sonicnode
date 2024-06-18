import { NextRequest, NextResponse } from "next/server";

export const GET = async (req: NextRequest) => {

    console.log(req.headers.get('x-forwarded-for'))

    return NextResponse.json({ test: req })
}