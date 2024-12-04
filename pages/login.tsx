
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import Page from "@/components/page"
import Section from "@/components/section"
import { useRouter } from "next/router"
import { pb } from "@/lib/pb"


export default function LoginForm() {

    const router = useRouter()
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        const form = e.target as HTMLFormElement;
        try {
            
            const authData = await pb.collection('Users').authWithPassword(
                form.email.value,
                form.password.value
            );
            console.log(authData);
            localStorage.setItem('user', JSON.stringify(authData));
            router.push('/');
        } catch (error) {
            console.log(error);
            
        }
        
        console.log(form.email.value);
        console.log(form.password.value);

    }


    return (
        <div  >
              <div className='fixed top-0 left-0 z-20 w-full bg-zinc-900 pt-safe'>
            <header className='border-b bg-zinc-100 px-safe dark:border-zinc-800 dark:bg-zinc-900'>
                <div className='mx-auto flex h-16 max-w-screen-md items-center justify-between px-6'>
                        <button onClick={() => router.back()} className='text-blue-600'>
                            {"< Back"}
                        </button>
                </div>
            </header>
        </div>
            <Section>
                <Card className="m-4 mt-40" >
                    <CardHeader>
                        <CardTitle>Login</CardTitle>
                        <CardDescription>Enter your email and password to log in.</CardDescription>
                    </CardHeader>
                    <form onSubmit={handleSubmit}>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="email">Email</Label>
                                <Input id="email" name="email" type="email" required value={"aliff@foo.bar"} />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="password">Password</Label>
                                <Input id="password" name="password" type="password" value={"12345678"} required />
                            </div>
                        </CardContent>
                        <CardFooter>
                            <Button type="submit" className="w-full">Log in</Button>
                        </CardFooter>
                    </form>
                </Card>
            </Section>
        </div>
    )
}

