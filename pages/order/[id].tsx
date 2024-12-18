import { pb } from "@/lib/pb";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import Page from '@/components/page'
import Section from '@/components/section'
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
import Link from 'next/link'



const OrderDetails = () => {

  const router = useRouter();
  const [order, setOrder] = useState<any>();
  const [service, setService] = useState<any>();
  const [provider, setProvider] = useState<any>();
  const [review, setReview] = useState<any>();
  const [newReview, setNewReview] = useState<any>("");
  const [rating, setRating] = useState<any>();

  useEffect(() => {
    const fetchOrder = async (id: string | string[] | undefined) => {
      if (!id || typeof id !== 'string') return;

      try {
        const records = await pb.collection('Bookings').getFullList({
          filter: `id="${id}"`,
          expand: 'user_id,service_id,provider_id',
        });

        if (!records || records.length === 0) {
          console.log("No order found");
          return;
        }

        const orderData = records[0];
        setOrder(orderData);

        const reviewRecords = await pb.collection('ReviewRatings').getFullList({
          filter: `booking_id="${orderData.id}"`,
        });

        if (reviewRecords.length > 0) {
          setReview(reviewRecords[0]);
          console.log("Fetched Review:", reviewRecords[0]);
        } else {
          console.log("No review found for this order");
        }

        // Log fetched data here (not the state) to ensure correct values:
        console.log("Fetched Order:", orderData);

        // Extract service data if available
        if (orderData.expand && orderData.expand.service_id) {
          const serviceData = orderData.expand.service_id;
          setService(serviceData);
          console.log("Fetched Service:", serviceData);

          // Fetch provider using service provider_id if available
          if (serviceData.provider_id) {
            const providerRecords = await pb.collection('ServiceProviders').getFullList({
              filter: `id="${serviceData.provider_id}"`,
            });

            if (providerRecords.length > 0) {
              setProvider(providerRecords[0]);
              console.log("Fetched Provider:", providerRecords[0]);
            } else {
              console.log("No provider found for this service");
            }
          }
        } else {
          console.log("This order does not have service_id expanded data");
        }
      } catch (error) {
        console.log("Error fetching order:", error);
      }
    }

    fetchOrder(router.query.id);

  }, [router.query.id]); // Depend on just the id, not the entire router.query object

  const handleNewReviewChange = (e: any) => {
    setNewReview(e.target.value);
  }

  return (
    <Page padding={0} nav={false}>
      <Section>
        {order ?
          <div className="p-2">


            <Card className="">
              <CardHeader>
                <CardTitle className='text-xl' >{service?.service_name}</CardTitle>
                <CardDescription >{service?.description}</CardDescription>
                <CardDescription className='text-md' >{`Time Taken: ${service?.time_taken ?? 0} ${Number(service?.time_taken) > 1 ? "Hours" : "Hour"}`}</CardDescription>
                <CardDescription className='text-md' >{`Provider: ${provider?.name}`}</CardDescription>
                <CardDescription className='text-md' >{`Provider: ${provider?.zip_code}`}</CardDescription>
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


            {review ?
              <Card className="mt-2">

                <CardHeader>
                  <CardTitle className='text-xl' >Review</CardTitle>
                  <div className="flex py-1" >
                    {Array.from({ length: review.rating }).map((_, i) => (
                      <svg key={i} className="w-5 h-5 text-gray-700 fill-current" viewBox="0 0 24 24">
                        <path d="M12 17.27L18.18 21L16.54 13.97L22 9.24L14.81 8.63L12 2L9.19 8.63L2 9.24L7.46 13.97L5.82 21L12 17.27Z"></path>
                      </svg>
                    ))}
                  </div>
                  <CardDescription className='text-md'>{review?.review_text}</CardDescription>
                </CardHeader>


              </Card>
              :
              <Card className="mt-2">
                <CardHeader>
                  <CardTitle>Enter Your Address</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="">
                    <Label htmlFor="rating">Rating (1-5)</Label>
                    <select
                      id="rating"
                      value={rating}
                      onChange={(e) => setRating(e.target.value)}
                      className="block w-full mt-1 border border-gray-300 rounded"
                      required
                    >
                      <option value="">Select a rating</option>
                      {[1, 2, 3, 4, 5].map((val) => (
                        <option key={val} value={val}>{val}</option>
                      ))}
                    </select>
                  </div>
                  <div className="">
                    <Label htmlFor="comment">Comment</Label>
                    <Input
                      value={newReview}
                      onChange={(e) => setNewReview(e.target.value)}
                      placeholder="Comment"
                      required
                    />
                  </div>
                    <Button
                      onClick={async () => {
                        if (!rating || !newReview) {
                          alert("Please enter rating and review");
                          return;
                        }

                        try {
                          const reviewRecord = await pb.collection('ReviewRatings').create({
                            booking_id: order.id,
                            rating: rating,
                            review_text: newReview,
                            user_id: order.expand.user_id.id,
                            provider_id: provider.id,
                            service_id: service.id,
                          });

                          console.log("Review created:", reviewRecord);
                          setReview(reviewRecord);

                        } catch (error) {
                          console.log("Error creating review:", error);
                        }
                      }}
                    >
                      Submit Review
                    </Button>

                </CardContent>

              </Card>}




          </div>
          : null}

      </Section>

    </Page>
  );
}

export default (OrderDetails);