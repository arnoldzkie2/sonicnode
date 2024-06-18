import { NextRequest, NextResponse } from "next/server";

export const GET = async (req: NextRequest) => {

    const ip = req.ip

    console.log(req)

    return NextResponse.json({ test: ip })
}