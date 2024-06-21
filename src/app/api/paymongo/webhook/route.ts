import { NextRequest, NextResponse } from "next/server";

export const POST = async (req: NextRequest) => {
    try {

        const data = await req.json()

        console.log(data)

        return NextResponse.json({ data }, { status: 200 })

    } catch (error) {
        console.log(error);
        return NextResponse.json({ message: "Server error", err: error }, { status: 500 })
    }
}