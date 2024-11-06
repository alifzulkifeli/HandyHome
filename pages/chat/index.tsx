import Page from "@/components/page"
import Section from "@/components/section"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useRouter } from "next/router"

type Message = {
  id: string
  name: string
  avatar: string
  lastMessage: string
}

const messages: Message[] = [
  {
    id: '1',
    name: 'Alice Johnson',
    avatar: '/placeholder.svg?height=40&width=40',
    lastMessage: 'Hey, how are you doing?'
  },
  {
    id: '2',
    name: 'Bob Smith',
    avatar: '/placeholder.svg?height=40&width=40',
    lastMessage: 'Did you see the latest project update?'
  },
  {
    id: '3',
    name: 'Charlie Brown',
    avatar: '/placeholder.svg?height=40&width=40',
    lastMessage: 'Let\'s catch up soon!'
  },
  {
    id: '3',
    name: 'Charlie Brown',
    avatar: '/placeholder.svg?height=40&width=40',
    lastMessage: 'Let\'s catch up soon!'
  },  {
    id: '3',
    name: 'Charlie Brown',
    avatar: '/placeholder.svg?height=40&width=40',
    lastMessage: 'Let\'s catch up soon!'
  },  {
    id: '3',
    name: 'Charlie Brown',
    avatar: '/placeholder.svg?height=40&width=40',
    lastMessage: 'Let\'s catch up soon!'
  },  {
    id: '3',
    name: 'Charlie Brown',
    avatar: '/placeholder.svg?height=40&width=40',
    lastMessage: 'Let\'s catch up soon!'
  },  {
    id: '3',
    name: 'Charlie Brown',
    avatar: '/placeholder.svg?height=40&width=40',
    lastMessage: 'Let\'s catch up soon!'
  },  {
    id: '3',
    name: 'Charlie Brown',
    avatar: '/placeholder.svg?height=40&width=40',
    lastMessage: 'Let\'s catch up soon!'
  },  {
    id: '3',
    name: 'Charlie Brown',
    avatar: '/placeholder.svg?height=40&width=40',
    lastMessage: 'Let\'s catch up soon!'
  },  {
    id: '3',
    name: 'Charlie Brown',
    avatar: '/placeholder.svg?height=40&width=40',
    lastMessage: 'Let\'s catch up soon!'
  },
  // Add more messages here...
]

export default function Chat() {

  const router = useRouter();
  return (
    <Page padding={0} >
      <Section>
        <div className="h-full bg-background text-foreground w-full">
          <ScrollArea className="h-full">
            <div className="p-1 space-y-1">
              {messages.map((message) => (
                <Card key={message.id} className="hover:bg-accent transition-colors" onClick={() => router.push('/chat/' + message.name)} >
                  <CardContent className="p-4 flex items-center space-x-4">
                    <Avatar>
                      <AvatarImage src={message.avatar} alt={message.name} />
                      <AvatarFallback>{message.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold truncate">{message.name}</p>
                      <p className="text-sm text-muted-foreground truncate">{message.lastMessage}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </ScrollArea>
        </div>
      </Section>
    </Page>
  )
}