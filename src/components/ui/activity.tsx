import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar } from "@/components/ui/avatar";

import { motion } from "framer-motion";

import type { Tables } from "@/database.extensions";
import { ChevronsDownUp, ChevronsUpDown } from "lucide-react";

import { cn } from "@/utils";

type Props = {
  data: Tables<"activities"> & {
    employee: Tables<"employees"> & {
      user: Tables<"users">;
    };
    location: Tables<"locations">;
  };
};

type PlainActivityProps = Props & {
  collapsible?: boolean;
  collapsed?: boolean;
  hideEmployee?: boolean;
  onClick?: () => void;
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
          <Avatar
            name={data.employee.user.name}
            image={data.employee.user.photo_url}
          />
          <p className="text-md">{data.employee.user.name}</p>
        </div>
      </CardFooter>
    )}
  </Card>
);

export const PlainActivity = ({
  data,
  collapsed,
  collapsible,
  hideEmployee,
  onClick,
}: PlainActivityProps) => (
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
    <div className="flex flex-col gap-2 items-start">
      <motion.div
        initial={{ maxHeight: "1000px" }}
        animate={{ maxHeight: collapsed ? "60px" : "1000px" }}
        className={cn(
          "text-sm text-muted-foreground text-ellipsis overflow-hidden relative",
          collapsible &&
            collapsed &&
            "after:content-['...'] after:absolute after:top-[calc(100%_-_20px)] after:left-[calc(100%_-_12px)]"
        )}
      >
        {data.description}
      </motion.div>
      {collapsible && (
        <Button variant="ghost" size="sm" className="w-full" onClick={onClick}>
          {collapsed ? (
            <ChevronsUpDown className="w-4 h-4" />
          ) : (
            <ChevronsDownUp className="w-4 h-4" />
          )}
        </Button>
      )}
    </div>
    {data.employee && !hideEmployee && (
      <div className="space-y-2">
        <p className="text-sm text-muted-foreground">
          This activity is held by:
        </p>
        <div className="flex items-center gap-2">
          <Avatar
            name={data.employee.user.name}
            image={data.employee.user.photo_url}
          />
          <p className="text-md">{data.employee.user.name}</p>
        </div>
      </div>
    )}
  </div>
);
