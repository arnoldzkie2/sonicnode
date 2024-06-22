'use client'
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/no-unescaped-entities */
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import useAuthStore from "@/stores/authStore";
import LoginForm from "@/components/auth/login";
import SignupForm from "@/components/auth/signup";
import Image from "next/image";
import Link from "next/link";
import { useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

const Page = () => {

    const router = useRouter()
    const session = useSession()
    const authPage = useAuthStore(s => s.authPage)
    const setAuthPage = useAuthStore(s => s.setAuthPage)

    useEffect(() => {
        if (session.status === 'authenticated') {
            router.push('/dashboard')
        }
    }, [session])

    return (
        <div className='flex flex-col w-screen h-screen justify-center items-center px-5 sm:px-10'>
            <Link className='pb-10 text-2xl flex items-center gap-3' href="/">
                <Image src={"/logo.svg"} alt="Logo" width={35} height={35} />
                <h1 className="font-[1000] text-3xl">SonicNode</h1>
            </Link>
            <Tabs defaultValue="signin" value={authPage} onValueChange={(page) => setAuthPage(page)} className="w-full max-w-[400px]">
                <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="signin">Sign In</TabsTrigger>
                    <TabsTrigger value="signup">Sign Up</TabsTrigger>
                </TabsList>
                <TabsContent value="signin">
                    <LoginForm />
                </TabsContent>
                <TabsContent value="signup">
                    <SignupForm />
                </TabsContent>
            </Tabs>
        </div>
    )
}

export default Page;
