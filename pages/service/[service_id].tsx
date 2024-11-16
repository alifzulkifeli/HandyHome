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
import BottomNav from '@/components/bottom-nav'
import BottomNavService from '@/components/bottom-nav-service'
import {
	Drawer,
	DrawerClose,
	DrawerContent,
	DrawerDescription,
	DrawerFooter,
	DrawerHeader,
	DrawerTitle,
	DrawerTrigger,
} from "@/components/ui/drawer"



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


const ServiceDetails = () => {
	const [service, setService] = useState<Service | null>(null);
	const [provider, setProvider] = useState<Provider | null>(null);
	const [reviews, setReviews] = useState<any | null>(null);
	const [availbility, setAvailbility] = useState<Availabilities[] | null>(null);
	const [bookedDateandTime, setBookedDateandTime] = useState<string | null>(null);
	const [drawerOpen, setDrawerOpen] = useState(false);
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
				console.log(reviewsData);

				console.log(availbilityData);



				setService(serviceData);
				setProvider(serviceProviderData)
				setReviews(reviewsData.items)
				setAvailbility(availbilityData.items)




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

	const findCityByZip = (zipCode: number | string): string | undefined => {
		for (const [city, postcodes] of Object.entries(list_city_postcodes)) {
			if (postcodes.includes(zipCode as number)) {
				return city;
			}
		}
		return undefined; // Return undefined if no match is found
	};

	const handleBooked = (date: string, tb: string) => {
		setBookedDateandTime(date + " " + tb + ":00");
		console.log(date + " " + tb + ":00");
		// scroll to top of the page
		window.scrollTo(0, 0);
		
	};

	return (
		<Page padding={0} nav={false}>
			<Section>
				{service && provider ?
					<div className="p-2">

					{ bookedDateandTime ? (
								<Card className="mb-2 p-2 pl-5 ">
									<CardDescription className='text-xl flex' >
										<div className='' >
											<span className='text-[15px] text-green-500' >
												Time slot booked for date <span className='underline'>{bookedDateandTime.substring(0, 10)} at {bookedDateandTime.substring(25, 30)}</span> .
											</span>
										</div>
									</CardDescription>
							</Card>) : null
					}
				


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

						<Card className="mt-2">
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
								<CardDescription className='text-lg font-semibold' >{provider.zip_code + " - " + findCityByZip(provider.zip_code)}</CardDescription>
							</CardHeader>
						</Card>

						<Card className="mt-2">
							<CardHeader>
								<CardDescription className='text-xl text-bold' >
									<CardDescription className='text-lg font-semibold' >{"Reviews"}</CardDescription>



									{reviews.length ? (
										reviews.map((review: any, _index: any) => (
											<div className='flex py-3' key={_index}>
												<Avatar className='h-10 w-10'>
													{/* <AvatarImage src={`https://pb.alifz.xyz/api/files/${provider.collectionId}/${provider.id}/${provider.avatar}`} /> */}
													<AvatarFallback>{review.user_id.substring(1, 3).toUpperCase()}</AvatarFallback>
												</Avatar>
												<div className='ml-2 text-sm'>
													<p className='flex items-center'>
														{/* Display star icons based on the rating */}
														{Array.from({ length: review.rating }, (_, i) => (
															<span key={i} className='text-yellow-500'>★</span> // Change class for color/style as needed
														))}
														{/* Show empty stars for ratings less than max (e.g., 5) */}
														{Array.from({ length: 5 - review.rating }, (_, i) => (
															<span key={`empty-${i}`} className='text-gray-300'>☆</span>
														))}
													</p>
													<span className='text-sm'>
														{review.review_text}
													</span>
												</div>
											</div>
										))
									) : (
										<CardDescription className='' >No reviews found for this service...yet</CardDescription>
									)}




								</CardDescription>
							</CardHeader>
						</Card>

						<Card className="mt-2">
							<CardHeader>
								<CardDescription className='text-xl text-bold'>
									<CardDescription className='text-lg font-semibold'>{"Availbility"}</CardDescription>

									{availbility?.length ? (
										[...new Set(availbility.map((avail: any) => avail.date))].map((date: any, _index: any) => (
											<div className='flex py-3' key={_index}>
												<div className='ml-2 text-sm'>
													<p className='flex items-center'>


														<Drawer >
															<DrawerTrigger asChild>
																<Button >{date.substring(0, 10)}</Button>
															</DrawerTrigger>
															<DrawerContent>
																<div className="mx-auto w-full max-w-sm">
																	<DrawerHeader>
																		<DrawerTitle>{date.substring(0, 10)}</DrawerTitle>
																		<DrawerDescription>Set time for booking.</DrawerDescription>
																	</DrawerHeader>
																	<div className="p-4 pb-0">


																	</div>
																	<DrawerFooter>

																		<DrawerClose asChild>
																			<div className="flex items-center justify-center space-x-2">

																				{availbility
																					.filter((avail: any) => avail.date === date)
																					.map((avail: any, index: any) => (
																						<Button key={index} size="sm" onClick={() => handleBooked(avail.date, avail.time_block)} >
																							{avail.time_block}:00
																						</Button>
																					))}
																			</div>
																			{/* <Button onClick={() => setDrawerOpen(false)} variant="outline">Cancel</Button> */}
																		</DrawerClose>
																	</DrawerFooter>
																</div>
															</DrawerContent>
														</Drawer>


													</p>
												</div>
											</div>
										))
									) : (
										<CardDescription className=''>No availbility found for this service...yet</CardDescription>
									)}

								</CardDescription>
							</CardHeader>
						</Card>

					</div>
					: null}

			</Section>
			{provider ? <BottomNavService serviceroviderID={provider!.id} /> : null}

		</Page>
	);
};

export default ServiceDetails;