import React from 'react'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../ui/card'
import { Label } from '../ui/label'
import { Input } from '../ui/input'
import { Button } from '../ui/button'
import useAuthStore from '@/stores/authStore'
import { LoaderCircle } from 'lucide-react'

const LoginForm = () => {

    const { formData, setFormData, logiNUser, loading } = useAuthStore()

    return (
        <form onSubmit={(e) => logiNUser(e)} >
            <Card>
                <CardHeader>
                    <CardTitle>Sign In</CardTitle>
                    <CardDescription>
                        Welcome back! Sign in to manage your Minecraft server.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-2">
                    <div className="space-y-1">
                        <Label htmlFor="name">Username</Label>
                        <Input
                            id="name"
                            required
                            value={formData.username}
                            onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                            placeholder='Username' />
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
                </CardContent>
                <CardFooter>
                    <Button disabled={loading} className='w-full'>{loading ? <LoaderCircle className='animate-spin' size={18} /> : 'Sign In'}</Button>
                </CardFooter>
            </Card>
        </form>
    )
}

export default LoginForm