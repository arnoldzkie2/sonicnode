'use client'
import React, { useState } from 'react'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../ui/card'
import { Label } from '../ui/label'
import { Input } from '../ui/input'
import { Button } from '../ui/button'
import useAuthStore from '@/stores/authStore'
import { Eye, EyeOff, LoaderCircle } from 'lucide-react'
import { trpc } from '@/app/_trpc/client'
import { toast } from 'sonner'

const SignupForm = () => {

    const { formDataSignUp, setFormDataSignUp, setAuthPage } = useAuthStore()
    const [eye, setEye] = useState(false)
    const { isPending, mutateAsync } = trpc.user.registerUser.useMutation({
        onError: (err) => {
            toast.error(err.message)
        },
        onSuccess: () => {
            setAuthPage('signin')
            return toast.success("Success! you have successfully create an account.", {
                position: 'bottom-center'
            })
        }
    })

    return (
        <form onSubmit={(e) => {
            e.preventDefault()
            mutateAsync(formDataSignUp)
        }}>
            <Card>
                <CardHeader>
                    <CardTitle>Sign Up</CardTitle>
                    <CardDescription>
                        Ready to start your Minecraft adventure? Fill out the form below to get started!
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-2">
                    <div className="space-y-1">
                        <Label htmlFor="username">Username</Label>
                        <Input
                            id="username"
                            name="username"
                            required
                            value={formDataSignUp.username}
                            onChange={(e) => setFormDataSignUp({ ...formDataSignUp, username: e.target.value })}
                            placeholder="Enter Username" />
                    </div>
                    <div className="space-y-1">
                        <Label htmlFor="email">Email</Label>
                        <Input
                            id="email"
                            type='email'
                            name="email"
                            required
                            onChange={(e) => setFormDataSignUp({ ...formDataSignUp, email: e.target.value })}
                            value={formDataSignUp.email}
                            placeholder="Email address" />
                    </div>
                    <div className="relative w-full">
                        <Label htmlFor="password">Password</Label>
                        <Input
                            id="password"
                            type={eye ? 'text' : 'password'}
                            required
                            value={formDataSignUp.password}
                            onChange={(e) => setFormDataSignUp({ ...formDataSignUp, password: e.target.value })}
                            name="password"
                            placeholder="Enter password" />
                    </div>
                    <div className="relative w-full">
                        <Label htmlFor="confirm_password">Confirm Password</Label>
                        <Input
                            id="confirm_password"
                            name="confirm_password"
                            type={eye ? 'text' : 'password'}
                            required
                            value={formDataSignUp.confirm_password}
                            onChange={(e) => setFormDataSignUp({ ...formDataSignUp, confirm_password: e.target.value })}
                            placeholder="Confirm password" />
                        {formDataSignUp.password && <div className='absolute right-4 text-muted-foreground hover:text-foreground cursor-pointer top-9' onClick={() => setEye(prev => !prev)}>
                            {
                                eye ?
                                    <EyeOff size={18} /> :
                                    <Eye size={18} />
                            }
                        </div>}
                    </div>
                </CardContent>
                <CardFooter>
                    <Button className='w-full'>{isPending ? <LoaderCircle className='animate-spin' size={18} /> : 'Sign Up'}</Button>
                </CardFooter>
            </Card>
        </form >

    )
}

export default SignupForm