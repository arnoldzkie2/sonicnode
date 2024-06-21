import db from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

interface PaymongoMetaData {
    userID: number
    webhookSecret: string
    amount: number
}

export type { PaymongoMetaData }

export const POST = async (req: NextRequest) => {
    try {

        const signature = req.headers.get("paymongo-signature")
        if (!signature) return NextResponse.json({ msg: "Signature not found" }, { status: 404 })
        //verify the signature

        const data = await req.json()

        //compare the webhook secret
        const metadata = await JSON.parse(data.data.attributes.data.attributes.remarks) as PaymongoMetaData

        if (metadata.webhookSecret !== process.env.PAYMONGO_WEBHOOK_SECRET) return NextResponse.json({ msg: "Webhook is not matched" }, { status: 400 })

        //get the user
        const user = await db.users.findUnique({ where: { id: metadata.userID } })
        if (!user) return NextResponse.json({ msg: "User not found" }, { status: 404 })

        //update user balance
        const updateUserCoin = await db.users.update({
            where: { id: metadata.userID }, data: {
                sonic_coin: user.sonic_coin + metadata.amount
            }
        })
        if (!updateUserCoin) return NextResponse.json({ msg: "Failed to update user coin" }, { status: 400 })

        //return 200 response
        return NextResponse.json({ ok: true }, { status: 200 })

    } catch (error) {
        console.log(error);
        return NextResponse.json({ message: "Server error", err: error }, { status: 500 })
    } finally {
        await db.$disconnect()
    }
}
