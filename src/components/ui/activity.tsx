import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar } from "@/components/ui/avatar";

import type { Tables } from "@/database.extensions";

type Props = {
  data: Tables<"activities"> & {
    employee: Tables<"employees"> & {
      user: Tables<"users">;
    };
    location: Tables<"locations">;
  };
};

export const CardActivity = ({ data }: Props) => (
  <Card className="w-full">
    <CardHeader>
      <CardTitle>{data.name}</CardTitle>
      {data.location && <CardDescription>{data.location.name}</CardDescription>}
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
    {data.employee && (
      <CardFooter className="flex-col items-start space-y-2">
        <CardDescription>This activity is held by:</CardDescription>
        <div className="flex items-center gap-2">
          <Avatar name={data.employee.user.name} image={data.employee.user.photo_url} />
          <h2 className="text-lg font-medium">{data.employee.user.name}</h2>
        </div>
      </CardFooter>
    )}
  </Card>
);

export const PlainActivity = ({ data }: Props) => (
  <div className="space-y-6">
    <div className="space-y-1.5">
      <h2 className="text-3xl font-semibold leading-none tracking-tight">
        {data.name}
      </h2>
      {data.location && (
        <p className="text-sm text-muted-foreground">{data.location.name}</p>
      )}
      <div className="flex items-center gap-1">
        <p className="text-sm text-muted-foreground">
          {Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "USD",
          }).format(data.price / 100)}
        </p>
        <span className="text-sm text-muted-foreground">•</span>
        <p className="text-sm text-muted-foreground">{data.duration} mins</p>
      </div>
    </div>
    <div>
      <p className="text-sm text-muted-foreground">{data.description}</p>
    </div>
    {data.employee && (
      <div className="space-y-2">
        <p className="text-sm text-muted-foreground">
          This activity is held by:
        </p>
        <div className="flex items-center gap-2">
          <Avatar name={data.employee.user.name} image={data.employee.user.photo_url} />
          <h2 className="text-lg font-medium">{data.employee.user.name}</h2>
        </div>
      </div>
    )}
  </div>
);
