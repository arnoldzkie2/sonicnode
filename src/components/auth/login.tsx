import React, { useState } from 'react'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../ui/card'
import { Label } from '../ui/label'
import { Input } from '../ui/input'
import { Button } from '../ui/button'
import useAuthStore from '@/stores/authStore'
import { LoaderCircle } from 'lucide-react'
import ReCAPTCHA from "react-google-recaptcha";
import { trpc } from '@/app/_trpc/client'
import { toast } from 'sonner'

const LoginForm = () => {

    const { formData, setFormData, logiNUser, loading, setLoading } = useAuthStore()
    const verifyRecaptcha = trpc.user.verifyRecaptcha.useMutation()
    const recaptchaRef: any = React.createRef();
    const [captchaVerified, setCaptchaVerified] = useState(false)

    return (
        <form onSubmit={async (e) => {
            e.preventDefault()

            if (!captchaVerified) {
                const recaptchaValue = await recaptchaRef.current.executeAsync();
                if (!recaptchaValue) return toast.error("Verify recaptcha")

                setLoading(true)
                await verifyRecaptcha.mutateAsync(recaptchaValue)
                    .then(_ => {
                        setCaptchaVerified(true)
                        logiNUser(e)
                    }).catch(err => {
                        toast.error(err.message)
                        setLoading(false)
                    })
            } else {
                await logiNUser(e)
            }
        }} >
            <Card>
                <CardHeader>
                    <CardTitle>Sign In</CardTitle>
                    <CardDescription>
                        Welcome back! Sign in to manage your Minecraft server.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-2">
                    <div className="space-y-1">
                        <Label htmlFor="name">Username or Email</Label>
                        <Input
                            id="name"
                            required
                            value={formData.username}
                            onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                            placeholder='Username or email' />
                    </div>
                    <div className="space-y-1">
                        <Label htmlFor="password">Password</Label>
                        <div className="relative w-full">
                            <Input
                                id="password"
                                required
                                value={formData.password}
                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                placeholder='Enter password' />
                        </div>
                    </div>
                    <div className='w-full justify-center flex items-center pt-4'>
                        <ReCAPTCHA size='invisible' ref={recaptchaRef} sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_CLIENT as string} />
                    </div>
                </CardContent>
                <CardFooter>
                    <Button disabled={loading} className='w-full'>{loading ? <LoaderCircle className='animate-spin' size={18} /> : 'Sign In'}</Button>
                </CardFooter>
            </Card>
        </form>
    )
}

export default LoginForm