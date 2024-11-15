import Link from 'next/link'
import { useRouter } from 'next/router'

const links = [
    { label: 'Story', href: '/story' },
    { label: 'Recipes', href: '/recipes' },
]

const Appbar = () => {
    const router = useRouter()
    const isHomePage = router.pathname === '/' 
    const isChatPage = router.pathname === '/chat' 
    const isOrderPage = router.pathname === '/order' 



    return (
        <div className='fixed top-0 left-0 z-20 w-full bg-zinc-900 pt-safe'>
            <header className='border-b bg-zinc-100 px-safe dark:border-zinc-800 dark:bg-zinc-900'>
                <div className='mx-auto flex h-16 max-w-screen-md items-center justify-between px-6'>
                    {isHomePage || isChatPage ||isOrderPage? (
                        <Link href='/'>
                            <img src="/images/logo-dark.png" className='h-12' alt="Logo" />
                        </Link>
                    ) : (
                        <button onClick={() => router.back()} className='text-blue-600'>
                            {"< Back"}
                        </button>
                    )}

                    <nav className='flex items-center space-x-6'>
                        <div
                            title='Gluten Free'
                            className='h-10 w-10 rounded-full bg-zinc-200 bg-cover bg-center shadow-inner dark:bg-zinc-800'
                            style={{
                                backgroundImage:
                                    'url(https://pb.alifz.xyz/api/files/pkabvjjh5y2mdu8/m6msfu6khc8e0u5/avatar_9dYacWgGcd.jpg)',
                            }}
                        />
                    </nav>
                </div>
            </header>
        </div>
    )
}

export default Appbar