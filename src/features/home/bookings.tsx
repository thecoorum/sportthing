import { Skeleton } from "@/components/ui/skeleton";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge, BadgeProps } from "@/components/ui/badge";

import { motion } from "framer-motion";
import { format } from "date-fns";

import { useBookings } from "@/hooks/bookings";

const per = 3;

export const Bookings = () => {
  const { data, error, loading } = useBookings({ per });

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
          >
            <Skeleton className="w-full h-[150px]" />
          </motion.div>
        </div>
      </div>
    );
  }

  if (error || !data?.length) return null;

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
                <div className="flex items-start justify-between gap-2">
                  <CardTitle>{booking.activity.name}</CardTitle>
                  <Badge variant={variant as BadgeProps["variant"]}>
                    {booking.status}
                  </Badge>
                </div>
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
