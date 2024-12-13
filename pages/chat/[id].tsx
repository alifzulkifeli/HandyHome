'use client'

import { useState, useEffect, useRef } from 'react'
import { Send } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useParams } from 'next/navigation'
import Page from '@/components/page'
import Section from '@/components/section'
import { pb } from '@/lib/pb' // Replace with your PocketBase import

type Message = {
    id: string
    message_text: string
    senderId: string
    recipientId: string
    timestamp: string
}

export default function ChatDetails() {
    const [messages, setMessages] = useState<any[]>([])
    const [newMessage, setNewMessage] = useState('')
    const scrollAreaRef = useRef<HTMLDivElement>(null)
    const lastMessageRef = useRef<HTMLDivElement>(null)
    const [user, setUser] = useState<any>(null)
    const [otherUserData, setOtherUserData] = useState<any>([])
    const [userId, setUserId] = useState<any>(null)

    const params = useParams()
    const userChatname: any = params?.id ?? 'Chat' // Recipient ID

    // const currentUser = localStorage.getItem('user')
    console.log(pb.authStore.token);


    const scrollToBottom = () => {
        lastMessageRef.current?.scrollIntoView({ behavior: 'instant' })
    }

    // Fetch initial messages
    useEffect(() => {
        const fetchMessages = async () => {
            try {
                let user: { record: { id: string } } | null = null;
                const userStorage = localStorage.getItem('user');
                if (userStorage) {
                    user = JSON.parse(userStorage);
                } else {
                    console.log('No user found in localStorage');
                    return;
                }

                if (user) {
                    setUserId(user.record.id)
                    setUser(user.record)
                }

                if (userChatname !== 'Chat') {
                    try {
                        const sp = await pb.collection('ServiceProviders').getOne(userChatname);
                        setOtherUserData(sp)
                        console.log(sp);


                        const fetchedMessages = await pb.collection('Messages').getFullList<Message>({
                            filter: `(senderId="${userId}" && recipientId="${userChatname}") || (senderId="${userChatname}" && recipientId="${userId}")`,
                            sort: 'created',
                        })
                        setMessages(fetchedMessages)
                        console.log(fetchedMessages);

                    } catch (error) {
                        console.log('Error fetching messages:', error)
                    }
                }
            } catch (error) {
                console.log('Error fetching user:', error)
            }

        }
        fetchMessages()
    }, [userChatname])

    // Initialize userId and user from localStorage
    useEffect(() => {
        const userStorage = localStorage.getItem('user');
        if (userStorage) {
            const user = JSON.parse(userStorage);
            setUserId(user.record.id);
            setUser(user.record);
        } else {
            console.log('No user found in localStorage');
        }
    }, []);


    // Fetch messages once userId is set
    useEffect(() => {
        const fetchMessages = async () => {
            if (!userId || userChatname === 'Chat') return;

            try {
                const sp = await pb.collection('ServiceProviders').getOne(userChatname);
                setOtherUserData(sp);

                const fetchedMessages = await pb.collection('Messages').getFullList<Message>({
                    filter: `(senderId="${userId}" && recipientId="${userChatname}") || (senderId="${userChatname}" && recipientId="${userId}")`,
                    sort: 'created',
                });

                setMessages(fetchedMessages);
            } catch (error) {
                console.log('Error fetching messages:', error);
            }
        };

        fetchMessages();
    }, [userId, userChatname]);

    useEffect(() => {
        const timer = setTimeout(() => {
            scrollToBottom();
        }, 100); // Debounce for smoother UI
        return () => clearTimeout(timer);
    }, [messages]);


    const handleSendMessage = async () => {
        if (newMessage.trim() === '') return;

    
        const messageData: Partial<Message> = {
            message_text: newMessage,
            senderId: userId,
            recipientId: userChatname,
            timestamp: new Date().toISOString(),
        };
    
        try {
            const savedMessage = await pb.collection('Messages').create(messageData);

            setNewMessage(''); // Clear the input field
            scrollToBottom(); // Ensure scroll to the latest message
        } catch (error) {
            console.log('Error sending message:', error);
        }
    };



    useEffect(() => {
        if (!userId || userChatname === 'Chat') return;
    
        const subscribeToMessages = async () => {
            try {
                // Subscribe to new messages
                pb.collection('Messages').subscribe('*', function (e) {
                    if (e.action === 'create') {
                        const newMessage = e.record;

                        // Check if the new message belongs to the current chat
                        if (
                            (newMessage.senderId === userId && newMessage.recipientId === userChatname) ||
                            (newMessage.senderId === userChatname && newMessage.recipientId === userId)
                        ) {
                            setMessages((prevMessages) => {
                                
                                // log the message object
                                console.log(newMessage);
                                console.log(prevMessages);

                                // Avoid duplicate messages by checking for existing IDs
                                if (!prevMessages.some((msg) => msg.id === newMessage.id)) {
                                    return [...prevMessages, newMessage];
                                }
                                return prevMessages;
                            });
                            scrollToBottom(); // Ensure scroll to latest message
                        }
                    }
                    console.log(e.action);
                    console.log(e.record);
                }, { /* other options like expand, custom headers, etc. */ });
            } catch (error) {
                console.log('Error subscribing to messages:', error);
            }
        };
    
        subscribeToMessages();
    }, [userId, userChatname]); // Dependencies to reinitialize subscription

    
    return (
        <div className="">
            <Page padding={0} nav={false}>
                <Section>
                    <div className="flex flex-col h-[80vh] bg-background">
                        <ScrollArea className="flex-grow p-4 h-full" ref={scrollAreaRef}>
                            <div className="mx-auto">
                                {messages.map((message, index) => (
                                    <div
                                        key={index}
                                        className={`flex ${message.senderId === userId ? 'justify-end' : 'justify-start'} mb-4`}
                                        ref={index === messages.length - 1 ? lastMessageRef : null}
                                    >
                                        <div
                                            className={`flex items-start max-w-[80%] ${message.senderId === userId ? 'flex-row-reverse' : 'flex-row'}`}
                                        >
                                            <Avatar className="w-8 h-8">
                                                <AvatarFallback>
                                                    {message.senderId === userId ?
                                                        'U'
                                                        : 'R'}
                                                </AvatarFallback>
                                                <AvatarImage
                                                    src={
                                                        message.senderId === userId
                                                            ? `https://pb.alifz.xyz/api/files/_pb_users_auth_/${user.id}/${user.avatar}`
                                                            : `https://pb.alifz.xyz/api/files/${otherUserData.collectionId}/${otherUserData.id}/${otherUserData.avatar}`
                                                    }
                                                />
                                            </Avatar>
                                            <div
                                                className={`mx-2 p-3 rounded-lg ${message.senderId === userId
                                                    ? 'bg-primary text-primary-foreground'
                                                    : 'bg-secondary text-secondary-foreground'
                                                    }`}
                                            >
                                                {message.message_text}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </ScrollArea>
                        <div className="p-4 bg-background border-t">
                            <div className="max-w-2xl mx-auto">
                                <form
                                    onSubmit={(e) => {
                                        e.preventDefault()
                                        handleSendMessage()
                                    }}
                                    className="flex space-x-2"
                                >
                                    <Input
                                        type="text"
                                        placeholder="Type your message..."
                                        value={newMessage}
                                        onChange={(e) => setNewMessage(e.target.value)}
                                        className="flex-grow"
                                    />
                                    <Button type="submit" size="icon">
                                        <Send className="h-4 w-4" />
                                        <span className="sr-only">Send</span>
                                    </Button>
                                </form>
                            </div>
                        </div>
                    </div>
                </Section>
            </Page>
        </div>
    )
}
