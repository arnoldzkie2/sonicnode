import React from 'react'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../ui/card'
import { Label } from '../ui/label'
import { Input } from '../ui/input'
import { Button } from '../ui/button'

const LoginForm = () => {

    return (
        <form >
            <Card>
                <CardHeader>
                    <CardTitle>Sign In</CardTitle>
                    <CardDescription>
                        Enter your username and password below to sign in and continue your session.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-2">
                    <div className="space-y-1">
                        <Label htmlFor="name">Username</Label>
                        <Input
                            id="name"
                            name="username"
                            placeholder='Username' />
                    </div>
                    <div className="space-y-1">
                        <Label htmlFor="password">Password</Label>
                        <div className="relative w-full">
                            <Input
                                id="password"
                                name="password"
                                placeholder='Enter password' />
                            {/* {loginForm.password && <FontAwesomeIcon icon={isText ? faEyeSlash : faEye} onClick={() => setIsText(prevState => !prevState)} className='cursor-pointer absolute top-2.5 right-3 text-muted-foreground' />} */}
                        </div>
                    </div>
                </CardContent>
                <CardFooter>
                    <Button className='w-full'>Login</Button>
                </CardFooter>
            </Card>
        </form>
    )
}

export default LoginForm