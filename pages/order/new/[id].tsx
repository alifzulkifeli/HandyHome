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
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Label } from '@/components/ui/label'

// Define proper types
interface Service {
    id: string;
    service_name: string;
    description: string;
    price: number;
    time_taken: string
}

interface Provider {
    avatar: string;
    collectionId: string;
    id: string;
    name: string;
    email: string;
    zip_code: string;
}

interface Availabilities {
    id: string;
    provider_id: string;
    date: string;
    time_block: string;
}

interface AddressState {
    Adress1: string
    Adress2: string
    postcode: string
}

export default function ChatDetails() {
    const [service, setService] = useState<Service | null>(null);
    const [provider, setProvider] = useState<Provider | null>(null);
    const [availbility, setAvailbility] = useState<Availabilities[] | null>(null);

    const [loading, setLoading] = useState(true);
    const [address, setAddress] = useState<AddressState>({
        Adress1: '',
        Adress2: '',
        postcode: ''
    })

    const params = useParams()
    const serviceId: any = params?.id ?? 'Pending' // Recipient ID
    const currentUserId = 'sbptzw4sjouas1a' // Replace with actual current user ID

    useEffect(() => {
        const fetchServiceDetails = async () => {
            if (!serviceId) {
                setLoading(false);
                return;
            }

            try {
                // Get today's date in yyyy-mm-dd format
                const today = new Date().toISOString().split('T')[0];

                // Get the date seven days from now in yyyy-mm-dd format
                const sevenDaysFromNow = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];


                // Fetch the service details using the service_id
                const serviceData: any = await pb.collection('Services').getOne(serviceId);
                const serviceProviderData: any = await pb.collection('ServiceProviders').getOne(serviceData.provider_id);
                const reviewsData: any = await pb.collection('ReviewRatings').getList(1, 5, {
                    filter: `service_id='${serviceData.id}'`
                });
                const availbilityData: any = await pb.collection('Availabilities').getList(1, 5, {
                    filter: `provider_id='${serviceData.provider_id}' && date>='${today}' && date<'${sevenDaysFromNow}'`
                });

                console.log(serviceData);
                console.log(serviceProviderData);
                console.log(availbilityData);

                setService(serviceData);
                setProvider(serviceProviderData)
                setAvailbility(availbilityData.items)
                setAddress({
                    Adress1: "",
                    Adress2: "",
                    postcode: serviceProviderData.zip_code
                })

            } catch (error) {
                console.log("Error fetching service details:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchServiceDetails();
    }, [serviceId]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        setAddress(prev => ({ ...prev, [name]: value }))
    }

    return (
        <Page padding={0} nav={false}>
            <Section>
                {!loading ?
                    <div className="p-2">


                        <Card className="">
                            <CardHeader>
                                <CardTitle className='text-xl' >{service?.service_name}</CardTitle>
                                <CardDescription >{service?.description}</CardDescription>
                                <CardDescription className='text-md pt-1' >{`Time Taken: ${service?.time_taken ?? 0} ${Number(service?.time_taken) > 1 ? "Hours" : "Hour"}`}</CardDescription>
                                <CardDescription className='text-md pt-1' >{`Provider: ${provider?.name}`}</CardDescription>
                                <CardDescription className='text-md pt-1' >{`Provider: ${provider?.zip_code}`}</CardDescription>
                            </CardHeader>
                        </Card>
                        <Card className="mt-2 p-3">
                            
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead className="w-[70%] text-left">Item</TableHead>
                                        <TableHead className="text-right">Price</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody >
                                    <TableRow >
                                        <TableCell className="font-medium">{"Base Charge"}</TableCell>
                                        <TableCell className="text-right">RM {service?.price.toFixed(2)}</TableCell>
                                    </TableRow>
                                    <TableRow >
                                        <TableCell className="font-medium">{"Platform Charge(10%)"}</TableCell>
                                        <TableCell className="text-right">RM {(service?.price! / 10).toFixed(2)}</TableCell>
                                    </TableRow>
                                    <TableRow >
                                        <TableCell className="font-medium">{"Total"}</TableCell>
                                        <TableCell className="text-right font-bold">RM {(service?.price! * 1.10).toFixed(2)}</TableCell>
                                    </TableRow>
                                </TableBody>
                            </Table>
                        </Card>


                        <Card className="mt-2">
                            <CardHeader>
                                <CardTitle>Enter Your Address</CardTitle>
                            </CardHeader>
                                <CardContent className="space-y-2">
                                    <div className="">
                                        <Label htmlFor="street">Address 1</Label>
                                        <Input
                                            id="address1"
                                            name="Adress1"
                                            value={address.Adress1}
                                            onChange={handleChange}
                                            placeholder="No, Street"
                                            required
                                        />
                                    </div>
                                    <div className="">
                                        <Label htmlFor="city">Address 2</Label>
                                        <Input
                                            id="address2"
                                            name="Adress2"
                                            value={address.Adress2}
                                            onChange={handleChange}
                                            placeholder="Area"
                                            required
                                        />
                                    </div>

                                    <div className="">
                                        <Label htmlFor="postcode">Postcode</Label>
                                        <Input
                                            id="postcode"
                                            name="postcode"
                                            value={address.postcode}
                                            onChange={handleChange}
                                            disabled
                                            className="bg-gray-100 text-gray-500"
                                        />
                                    </div>
                                </CardContent>
                     
                        </Card>



                    </div>
                    : null}

            </Section>
            {/* {provider ? <BottomNavService serviceroviderID={provider!.id} serviceId={serviceId} /> : null} */}

        </Page>
    )
}
