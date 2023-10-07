import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import type { Tables } from "@/database.extensions";

type Props = {
  data: Tables<"locations">;
};

export const LocationCard = ({ data }: Props) => (
  <Card className="w-full">
    <CardHeader className="space-y-3">
      <CardTitle>{data.name}</CardTitle>
      <div className="space-y-1.5">
        {!!data.address && <CardDescription>{data.address}</CardDescription>}
        {!!data.description && (
          <CardDescription className="text-md text-black">{data.description}</CardDescription>
        )}
      </div>
    </CardHeader>
  </Card>
);
