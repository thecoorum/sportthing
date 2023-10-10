import { Skeleton } from "@/components/ui/skeleton";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge, BadgeProps } from "@/components/ui/badge";
import { ChevronRight } from "lucide-react";

import { motion } from "framer-motion";
import { format } from "date-fns";
import Link from "next/link";

import { useBookings } from "@/hooks/bookings";

const per = 3;

export const Bookings = () => {
  const { data, error, loading } = useBookings({
    per,
    status: ["confirmed", "pending"],
    from: new Date(),
  });

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

  if (error || !data?.length) return null;

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between gap-2">
        <h3 className="text-2xl font-semibold leading-none tracking-tight">
          Upcoming bookings
        </h3>
        <Link href="/bookings" className="flex items-center gap-1">
          <span className="text-sm">View all</span>
          <ChevronRight className="w-4 h-4" />
        </Link>
      </div>
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
                <CardTitle>{booking.activity.name}</CardTitle>
                <CardDescription>
                  {format(new Date(booking.booking_date), "MMMM do, yyyy")}
                </CardDescription>
                <CardDescription>
                  {booking.start_time} - {booking.end_time}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div>
                  <Badge
                    variant={variant as BadgeProps["variant"]}
                    className="inline-flex px-4 py-2"
                  >
                    {booking.status.toUpperCase()}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};
