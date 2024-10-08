import { create } from 'zustand'
import { signIn } from 'next-auth/react'
import { toast } from 'sonner';

interface AuthProps {
    formDataSignUp: {
        username: string;
        email: string;
        password: string;
        confirm_password: string;
    }
    setFormDataSignUp: (data: {
        username: string;
        email: string;
        password: string;
        confirm_password: string;
    }) => void
    formData: {
        username: string;
        password: string;
    }
    setFormData: (data: {
        username: string;
        password: string;
    }) => void
    loading: boolean
    authPage: string
    setAuthPage: (value: string) => void
    setLoading: (status: boolean) => void
    logiNUser(e: React.FormEvent): Promise<void>
}

const useAuthStore = create<AuthProps>((set, get) => ({
    formDataSignUp: {
        username: '',
        email: '',
        password: '',
        confirm_password: ''
    },
    setFormDataSignUp: (data: {
        username: string;
        email: string;
        password: string;
        confirm_password: string;
    }) => set({ formDataSignUp: data }),
    formData: {
        username: '',
        password: ''
    },
    setFormData: (data: {
        username: string
        password: string;
    }) => set({ formData: data }),
    loading: false,
    authPage: 'signin',
    setAuthPage: (value) => set({ authPage: value }),
    setLoading: (status: boolean) => set({ loading: status }),
    logiNUser: async (e: React.FormEvent) => {
        e.preventDefault()
        try {

            const { setLoading, formData, setFormData } = get()

            setLoading(true)
            const result = await signIn('credentials', {
                username: formData.username,
                password: formData.password,
                redirect: false
            })
            setLoading(false)
            if (result?.error) {
                toast.error('Invalid Credentials.', {
                    position: 'bottom-center'
                })
            } else {
                setFormData({ username: '', password: '' })
                toast.success('Login Successfully!', {
                    position: 'bottom-center'
                })
            }

        } catch (error) {
            console.log(error);
            alert("Something went wrong")
        }
    }
}))

export default useAuthStore