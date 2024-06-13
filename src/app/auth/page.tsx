/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/no-unescaped-entities */
'use client'
import { useSession } from "next-auth/react";
import { useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import useAuthStore from "@/stores/authStore";
import { useRouter } from "next/navigation";
import LoginForm from "@/components/auth/login";
import SignupForm from "@/components/auth/signup";


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
        <div className='flex flex-col w-screen h-screen justify-center items-center'>
            <h1 className='pb-10 text-2xl'>SONICNODE</h1>
            <Tabs defaultValue="signin" value={authPage} onValueChange={(page) => setAuthPage(page)} className="w-[400px]">
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
        </div >
    )
}

export default Page;
