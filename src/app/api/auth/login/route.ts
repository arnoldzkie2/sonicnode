import db from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from 'bcrypt'

export const POST = async (req: NextRequest) => {
    try {

        const { username, password } = await req.json()

        const user = await db.users.findFirst({
            where: {
                OR: [
                    { username: username },
                    { email: username }
                ]
            }
        })
        if (!user) return NextResponse.json(null)
        //check if user exist

        //compare the password 
        const normalizedPassword = user.password.replace(/^\$2y\$/, '$2b$');
        const passwordMatch = await bcrypt.compare(password, normalizedPassword);
        if (!passwordMatch) return NextResponse.json(null)

        //return the user
        return NextResponse.json(user, { status: 200 })

    } catch (error) {
        console.log(error);
        return NextResponse.json({ msg: "Server error", error }, { status: 500 })
    } finally {
        await db.$disconnect()
    }
}