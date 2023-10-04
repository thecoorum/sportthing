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
    <CardHeader>
      <CardTitle>{data.name}</CardTitle>
      <div className="space-y-4">
        {!!data.address && (
          <>
            <CardDescription>{data.address}</CardDescription>
            <hr />
          </>
        )}
        {!!data.description && (
          <CardDescription>{data.description}</CardDescription>
        )}
      </div>
    </CardHeader>
  </Card>
);
