'use client'
import React, { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope, faSpinner } from '@fortawesome/free-solid-svg-icons';
import { toast } from 'sonner';
import { Button } from '../ui/button';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { SOCIAL } from '@/constant/links';
import { trpc } from '@/app/_trpc/client';
import ReCAPTCHA from 'react-google-recaptcha';
import useAuthStore from '@/stores/authStore';

const Contact = () => {

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        message: ''
    })
    const recaptchaRef: any = React.createRef();
    const { loading, setLoading } = useAuthStore()

    const verifyRecaptcha = trpc.user.verifyRecaptcha.useMutation()
    const { mutateAsync } = trpc.contact.send.useMutation({
        onError: (err) => toast.error(err.message),
        onSuccess: () => {
            setFormData({ name: "", email: '', message: "" })
            toast.success("Thankyou for leaving us a message!")
            setLoading(false)
        }
    })

    const sendEmail = async (e: React.FormEvent) => {
        e.preventDefault()
        const recaptchaValue = await recaptchaRef.current.executeAsync();
        if (!recaptchaValue) return toast.error("Verify recaptcha")
        setLoading(true)
        await verifyRecaptcha.mutateAsync(recaptchaValue)
            .then(async () => {
                setLoading(false)
                await mutateAsync(formData)
            })
            .catch(err => {
                toast.error(err.message)
                setLoading(false)
            })
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target
        setFormData(prev => ({ ...prev, [name]: value }))
    }

    return (

        <div className='flex items-center w-full flex-col gap-10 lg:flex-row lg:h-screen lg:justify-between' id='contact'  >
            <div className='flex flex-col gap-4 lg:w-1/3'>
                <h2 className='text-primary text-xl'>Contact Us</h2>
                <h1 className='text-3xl lg:text-4xl font-black'>Send Us Your Thoughts</h1>
                <p className='text-muted-foreground'>{"Hello! Have questions about Minecraft server hosting or looking to start a new server? Feel free to message  us. We're here to help!"}</p>
                <Button variant={'secondary'} onClick={() => {
                    navigator.clipboard.writeText('support@sonicnode.xyz')
                    toast.success("Email Copied", { position: 'bottom-center' })
                }
                } className='flex items-center w-full justify-start gap-5 mt-5'>
                    <FontAwesomeIcon icon={faEnvelope} width={20} height={20} className='text-xl' />
                    support@sonicnode.xyz
                </Button>
                <div className='flex items-center justify-evenly mt-10'>
                    {[1, 2, 3, 4, 5].map(num => (
                        <div key={num} className='bg-muted w-10 h-1 hover:bg-primary'></div>
                    ))}
                </div>
            </div>
            <Card className='w-full sm:block hidden lg:w-1/2'>
                <CardHeader>
                    <CardTitle className='text-xl'>Contact Us</CardTitle>
                    <CardDescription>We just need a few quick details</CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={sendEmail} className='flex flex-col gap-5 w-full'>
                        <div className='flex flex-col w-full gap-5 md:flex-row'>
                            <div className='space-y-2 w-full'>
                                <Label>Name</Label>
                                <Input type="text" name='name' required className='w-full' placeholder='Full Name' value={formData.name} onChange={handleChange} />
                            </div>
                            <div className='space-y-2 w-full'>
                                <Label>Email</Label>
                                <Input type="email" required name='email' className='w-full' placeholder='Email Address' value={formData.email} onChange={handleChange} />
                            </div>
                        </div>
                        <div className='space-y-2'>
                            <Label>Message</Label>
                            <Textarea name='message' required placeholder='Your message here...' value={formData.message} onChange={handleChange} />
                        </div>
                        <div className='flex items-center w-full justify-between'>
                            <div className='flex items-center'>
                                {SOCIAL.map(link => (
                                    <Link href={link.link} key={link.link}>
                                        <Button variant={'ghost'}><FontAwesomeIcon icon={link.icon} width={18} height={18} className='text-lg' /></Button>
                                    </Link>
                                ))}
                            </div>
                            <Button className='self-end w-44 mt-1' disabled={loading}>
                                {loading ? <FontAwesomeIcon icon={faSpinner} width={16} height={16} className='animate-spin' /> : 'Send'}
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
            <form onSubmit={sendEmail} className='flex flex-col gap-5 w-full sm:hidden'>
                <div className='space-y-2'>
                    <Label>Name</Label>
                    <Input type="text" name='name' required placeholder='Full Name' value={formData.name} onChange={handleChange} />
                </div>
                <div className='space-y-2'>
                    <Label>Email</Label>
                    <Input type="email" name='email' required placeholder='Email Address' value={formData.email} onChange={handleChange} />
                </div>
                <div className='space-y-2'>
                    <Label>Message</Label>
                    <Textarea name='message' required placeholder='Your message here...' value={formData.message} onChange={handleChange} />
                </div>
                <Button className='mt-1' disabled={loading}>
                    {loading ? <FontAwesomeIcon icon={faSpinner} width={16} height={16} className='animate-spin' /> : 'Send'}
                </Button>
                <ReCAPTCHA size='invisible' ref={recaptchaRef} sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_CLIENT as string} />
            </form>
        </div>
    )
}


export default Contact