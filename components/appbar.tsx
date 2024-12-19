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


// Extend the Window interface to include deferredPrompt
declare global {
    interface Window {
        deferredPrompt: any;
    }
}

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

    


    const handleInstall = async () => {
        let deferredPrompt: any;
        const addBtn = document.createElement('button');
        addBtn.style.display = 'none';
        document.body.appendChild(addBtn);

        window.addEventListener('beforeinstallprompt', (e) => {
            // Prevent Chrome 67 and earlier from automatically showing the prompt
            e.preventDefault();
            // Stash the event so it can be triggered later.
            deferredPrompt = e;
            // Update UI to notify the user they can add to home screen
            addBtn.style.display = 'block';
        
            addBtn.addEventListener('click', () => {
              // hide our user interface that shows our A2HS button
              addBtn.style.display = 'none';
              // Show the prompt
              deferredPrompt.prompt();
              // Wait for the user to respond to the prompt
              deferredPrompt.userChoice.then((choiceResult: any) => {
                if (choiceResult.outcome === 'accepted') {
                  console.log('User accepted the A2HS prompt');
                } else {
                  console.log('User dismissed the A2HS prompt');
                }
                deferredPrompt = null;
              });
            });
          });
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
                                        { user.avatar ?
                                        <AvatarImage src={ `https://pb.alifz.xyz/api/files/_pb_users_auth_/${user.id}/${user.avatar}`} />
                                        :<AvatarImage src='https://pb.alifz.xyz/api/files/novm4dln6wcco7x/tnxkz1axt5fvz16/l60_hf_1_QJJvJvC9BM.png'/> 
                                    }
                                    </Avatar>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent>
                                    <DropdownMenuLabel onClick={() => router.push('/profile')}  >My Account</DropdownMenuLabel>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem onClick={handleInstall} >Install</DropdownMenuItem>
                                    <DropdownMenuItem onClick={handleLogout} >Log out</DropdownMenuItem>

                                </DropdownMenuContent>
                            </DropdownMenu>
                            // <p>asd</p>
                        ) : (
                            <div>
                                <Button className='mr-4 install' onClick={handleInstall} >Install</Button>
                                <Button onClick={() => router.push("/login")} >Login</Button>
                            </div>
                        )}

                    </div>


                </div>
            </header>
        </div>
    )
}

export default Appbar