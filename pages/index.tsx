import Card from '@/components/card'
import Category from '@/components/dd-category'
import City from '@/components/location/dd-city'
import Postcode from '@/components/location/dd-postcode'
import State from '@/components/location/dd-state'
import Page from '@/components/page'
import Section from '@/components/section'
import { pb } from '@/lib/pb'
import { useEffect, useState } from 'react'

const Index = () => {
    const [negeri, setNegeri] = useState<any>();
    const [city, setCity] = useState<any>();
    const [postcode, setPostcode] = useState<any>();
    const [services, setServices] = useState<any[]>([]); // To store the fetched service data

    // useEffect to fetch data whenever the postcode changes
    useEffect(() => {
        if (postcode) {
            const fetchData = async () => {
                try {
                    // Step 1: Get provider_ids from ServiceProviders based on postcode
                    const providersList = await pb.collection('ServiceProviders').getList(1, 50, {
                        filter: `zip_code='${postcode}'`,
                    });
                    
                    console.log(JSON.stringify(providersList))
                    
					let providerIds:any[] = []

                    if (providersList.totalItems > 0) {
						for (let index = 0; index < providersList.totalItems; index++) {
							
							console.log(providersList.items[index].id);
							
							const servicesList = await pb.collection('Services').getList(1, 50, {
								filter: `provider_id='${providersList.items[index].id}'`,
							});
							providerIds = providerIds.concat(servicesList.items)
						}

						setServices((providerIds));
						console.log(providerIds);
						
						
                    } else {
                        setServices([]); // No providers found for the postcode
                    }
                } catch (error) {
                    console.error("Error fetching services:", error);
                    setServices([]); // Clear services on error
                }
            };
            fetchData();
        } else {
            setServices([]); // Reset services when postcode is cleared
        }
    }, [postcode]);

    return (
        <Page padding={6} >
            <Section>
                <div className='flex w-full'>
                    <State setNegeri={setNegeri} setCity={setCity} setPostcode={setPostcode} />
                    <City negeri={negeri} setCity={setCity} setPostcode={setPostcode} city={city} />
                    <Postcode city={city} setPostcode={setPostcode} negeri={negeri} />
                </div>
                <Category />

                {/* Render Cards based on the fetched services */}
                {services.length > 0 ? (
                    services.map((service, index) => (
                        <Card key={index} data={service}/>
                    ))
                ) : (
                    <p>No services found for the selected postcode.</p>
                )}
            </Section>
        </Page>
    );
}

export default Index;
