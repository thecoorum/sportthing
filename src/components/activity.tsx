import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import type { Tables } from "@/database.extensions";

type Props = {
  data: Tables<'activities'> & {
    coach: Tables<'coaches'>;
    location: Tables<'locations'>;
  };
}

export const Activity = ({ data }: Props) => (
  <Card className="w-full">
    <CardHeader>
      <CardTitle>{data.name}</CardTitle>
      <CardDescription>{data.location.name}</CardDescription>
      <div className="flex items-center gap-1">
        <CardDescription>
          {Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "USD",
          }).format(data.price / 100)}
        </CardDescription>
        <span className="text-sm text-muted-foreground">•</span>
        <CardDescription>{data.duration} mins</CardDescription>
      </div>
    </CardHeader>
    {data.description && (
      <CardContent>
        <CardDescription>{data.description}</CardDescription>
      </CardContent>
    )}
    {data.coach && (
      <CardFooter className="flex-col items-start space-y-2">
        <CardDescription>This activity is held by:</CardDescription>
        <div className="flex items-center gap-2">
          <Avatar>
            <AvatarImage src={data.coach.photo_url || ""} />
            <AvatarFallback>
              {data.coach.name
                .split(" ")
                .map((part) => part.at(0)?.toUpperCase())}
            </AvatarFallback>
          </Avatar>
          <h2 className="text-lg font-medium">{data.coach.name}</h2>
        </div>
      </CardFooter>
    )}
  </Card>
);
