import { pb } from '@/lib/pb'
import { useParams } from 'next/navigation'
import { useEffect, useState } from 'react'

import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import Page from '@/components/page'
import Section from '@/components/section'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { list_city_postcodes } from '@/lib/data'




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
    email:string;
    zip_code:string;
}


const ServiceDetails = () => {
    const [service, setService] = useState<Service | null>(null);
    const [provider, setProvider] = useState<Provider | null>(null);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const params = useParams();
    const serviceId = params?.service_id as string;

    useEffect(() => {
        const fetchServiceDetails = async () => {
            if (!serviceId) {
                setError('No service ID provided');
                setLoading(false);
                return;
            }

            try {
                // Fetch the service details using the service_id
                const serviceData: any = await pb.collection('Services').getOne(serviceId);
                const serviceProviderData: any = await pb.collection('ServiceProviders').getOne(serviceData.provider_id);

                console.log(serviceData);
                console.log(serviceProviderData);


                setService(serviceData);
                setProvider(serviceProviderData)
            } catch (error) {
                console.error("Error fetching service details:", error);
                setError('Failed to fetch service details');
            } finally {
                setLoading(false);
            }
        };

        fetchServiceDetails();
    }, [serviceId]);

    if (loading) {
        return <div className="p-4">Loading...</div>;
    }

    const findCityByZip = (zipCode: number|string): string | undefined => {
        for (const [city, postcodes] of Object.entries(list_city_postcodes)) {
            if (postcodes.includes(zipCode as number)) {
                return city;
            }
        }
        return undefined; // Return undefined if no match is found
    };


    return (
        <Page padding={1} >
            <Section>
                {service && provider ?
                    <div className="p-1">
                        <Card className="">
                            <CardHeader>
                                <CardTitle className='text-xl' >{service.service_name}</CardTitle>
                                <CardDescription>{service.description}</CardDescription>
                            </CardHeader>

                            <CardHeader>
                                <div className="flex">
                                    <CardDescription className='w-1/2 ' >Price</CardDescription>
                                    <CardDescription className=' justify-right ' >Time Taken</CardDescription>
                                </div>
                                <div className="flex">
                                    <CardTitle className='w-1/2 text-lg ' >RM {service.price}</CardTitle>
                                    <CardTitle className=' justify-right text-xl' >{service.time_taken} Hours</CardTitle>
                                </div>
                            </CardHeader>
                        </Card>

                        <Card className="mt-1">
                            <CardHeader>
                                <CardDescription className='text-xl flex' >
                                    <Avatar className='h-14 w-14' >
                                        <AvatarImage src={`https://pb.alifz.xyz/api/files/${provider.collectionId}/${provider.id}/${provider.avatar}`} />
                                        <AvatarFallback>HH</AvatarFallback>
                                    </Avatar>
                                    <div className='ml-2' >
                                        <p>
                                            {provider.name}
                                        </p>
                                        <span className='text-sm' >
                                            {provider.email}
                                        </span>

                                    </div>
                                </CardDescription>
                                <CardDescription className='text-lg font-semibold' >{provider.zip_code + " - " +findCityByZip(provider.zip_code)}</CardDescription>


                            </CardHeader>

                        </Card>
                    </div>
                    : null}

            </Section>
        </Page>
    );
};

export default ServiceDetails;