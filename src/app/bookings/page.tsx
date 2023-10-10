"use client";

import { Skeleton } from "@/components/ui/skeleton";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge, BadgeProps } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { ServerCrash, XCircle } from "lucide-react";

import { motion } from "framer-motion";
import { format } from "date-fns";

import { useBookings } from "@/hooks/bookings";

const Page = () => {
  const { data, error, loading } = useBookings();

  if (loading) {
    return (
      <div className="space-y-3">
        <Skeleton className="w-[130px] h-[30px]" />
        <div className="space-y-2">
          <motion.div
            initial={{ opacity: 0, translateY: 20 }}
            animate={{ opacity: 1, translateY: 0 }}
          >
            <Skeleton className="w-full h-[150px]" />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, translateY: 20 }}
            animate={{ opacity: 1, translateY: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Skeleton className="w-full h-[150px]" />
          </motion.div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <Alert>
        <ServerCrash className="w-4 h-4" />
        <AlertTitle>Oops, something went wrong</AlertTitle>
        <AlertDescription>
          There was an error during fetching your bookings, please try again. If
          the problem persists, please contact the support.
        </AlertDescription>
      </Alert>
    );
  }

  if (!data?.length) {
    return (
      <Alert>
        <XCircle className="w-4 h-4" />
        <AlertTitle>No bookings found</AlertTitle>
        <AlertDescription>
          You have no bookings yet. Book an activity to get started.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-3">
      <h2 className="text-3xl font-semibold leading-none tracking-tight">
        Your bookings
      </h2>
      <div className="space-y-2">
        {data.map((booking) => {
          let variant = "outline";

          switch (booking.status) {
            case "confirmed":
              variant = "default";
              break;
            case "cancelled":
              variant = "destructive";
              break;
            case "pending":
              variant = "outline";
              break;
          }

          return (
            <Card key={booking.id} className="w-full">
              <CardHeader>
                <div className="mb-3">
                  <Badge
                    variant={variant as BadgeProps["variant"]}
                    className="inline-flex px-4 py-2"
                  >
                    {booking.status.toUpperCase()}
                  </Badge>
                </div>
                <CardTitle>{booking.activity.name}</CardTitle>
                <CardDescription>
                  {format(new Date(booking.booking_date), "MMMM do, yyyy")}
                </CardDescription>
                <CardDescription>
                  {booking.start_time} - {booking.end_time}
                </CardDescription>
              </CardHeader>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default Page;
