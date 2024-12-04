import { pb } from '@/lib/pb'
import Link from 'next/link'
import { useRouter } from 'next/router'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from './ui/button'
import { useEffect, useState } from 'react'

const links = [
    { label: 'Story', href: '/story' },
    { label: 'Recipes', href: '/recipes' },
]



const Appbar: React.FC = () => {

    const router = useRouter()
    const isHomePage = router.pathname === '/'
    const isChatPage = router.pathname === '/chat'
    const isOrderPage = router.pathname === '/order'
    const [user, setUser] = useState<any>(null)
    
    const handleLogout = async () => {
        await pb.authStore.clear()
        setUser(null)

        router.push('/')
    }

    useEffect(() => {
        
        const fetchUser = async () => {
            try {
                const user = await pb.collection("users").authRefresh();
                setUser(user.record);
                console.log(user);
                
            } catch (error) {
                console.log(error);
            }
        }

       
        fetchUser();

        
    }, [pb.authStore]);

    return (
        <div className='fixed top-0 left-0 z-20 w-full bg-zinc-900 pt-safe'>
            <header className='border-b bg-zinc-100 px-safe dark:border-zinc-800 dark:bg-zinc-900'>
                <div className='mx-auto flex h-16 max-w-screen-md items-center justify-between px-6'>
                    <div>

                        {isHomePage || isChatPage || isOrderPage ? (
                            <Link href='/'>
                                <img src="/images/logo-dark.png" className='h-12' alt="Logo" />
                            </Link>
                        ) : (
                            <button onClick={() => router.back()} className='text-blue-600'>
                                {"< Back"}
                            </button>
                        )}
                    </div>
                    <div>

                        {user ? (
                            <DropdownMenu>
                                <DropdownMenuTrigger>
                                    <Avatar>
                                        <AvatarImage src={ `https://pb.alifz.xyz/api/files/_pb_users_auth_/${user.id}/${user.avatar}`} />
                                        <AvatarFallback>U</AvatarFallback>
                                    </Avatar>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent>
                                    <DropdownMenuLabel>My Account</DropdownMenuLabel>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem onClick={handleLogout} >Log out</DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                            // <p>asd</p>
                        ) : (
                            <Button onClick={() => router.push("/login")} >Login</Button>
                        )}

                    </div>


                </div>
            </header>
        </div>
    )
}

export default Appbar