import React from 'react'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../ui/card'
import { Label } from '../ui/label'
import { Input } from '../ui/input'
import { Button } from '../ui/button'

const SignupForm = () => {

    return (
        <form >
            <Card>
                <CardHeader>
                    <CardTitle>Sign Up</CardTitle>
                    <CardDescription>
                        Start your learning journey today. Sign up to explore a variety of subjects and connect with passionate educators.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-2">
                    <div className="space-y-1">
                        <Label htmlFor="username">Username</Label>
                        <Input
                            id="username"
                            name="username"
                            placeholder="Enter Username" />
                    </div>
                    <div className="relative w-full">
                        <Label htmlFor="password">Password</Label>
                        <Input
                            id="password"
                            name="password"
                            placeholder="Enter password" />
                        {/* {signupForm.password && <FontAwesomeIcon icon={isText ? faEyeSlash : faEye} onClick={() => setIsText(prevState => !prevState)} className='cursor-pointer absolute top-[35px] right-3 text-muted-foreground' />} */}
                    </div>
                    <div className="relative w-full">
                        <Label htmlFor="confirm_password">Confirm Password</Label>
                        <Input
                            id="confirm_password"
                            name="confirm_password"
                            placeholder="Confirm password" />
                        {/* {signupForm.password && <FontAwesomeIcon icon={isText ? faEyeSlash : faEye} onClick={() => setIsText(prevState => !prevState)} className='cursor-pointer absolute top-[35px] right-3 text-muted-foreground' />} */}
                    </div>
                </CardContent>
                <CardFooter>
                    <Button>Sign Up</Button>
                </CardFooter>
            </Card>
        </form>

    )
}

export default SignupForm