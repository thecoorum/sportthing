import { useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Loader2 } from "lucide-react";

import { useForm } from "react-hook-form";
import { useToast } from "@/components/ui/use-toast";
import { useLocations } from "@/hooks/locations";
import { useEmployees } from "@/hooks/employees";

import * as zod from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import type { Tables } from "@/database.extensions";

type Props = {
  onSubmit: (data: zod.infer<typeof schema>) => Promise<void>;
  onCancel: () => void;
  type?: "create" | "edit";
  activity?: Tables<"activities"> | null;
  locationId?: string | null;
};

export const schema = zod.object({
  name: zod.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  description: zod
    .string()
    .max(512, {
      message: "Description must be less than 512 characters.",
    })
    .optional(),
  location_id: zod.string().uuid().optional(),
  employee_id: zod.number().int().optional(),
  duration: zod.number().int().positive(),
  price: zod
    .number()
    .positive()
    .transform((value) => value * 100),
});

const messages = {
  create: {
    default: "Create",
    loading: "Creating...",
  },
  edit: {
    default: "Save",
    loading: "Saving...",
  },
};

export const ActivityForm = ({
  onSubmit,
  onCancel,
  type = "create",
  activity,
  locationId,
}: Props) => {
  const [loading, setLoading] = useState<boolean>(false);

  const { toast } = useToast();

  const form = useForm<zod.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: activity?.name || "",
      description: activity?.description || "",
      location_id: locationId || activity?.location_id || "",
      employee_id: activity?.employee_id || undefined,
      duration: activity?.duration || undefined,
      price: activity?.price ? activity.price / 100 : undefined,
    },
  });

  const { data: locations } = useLocations();
  const { data: coaches } = useEmployees({
    location_id: form.watch("location_id"),
  });

  const handleSubmit = (data: zod.infer<typeof schema>) => {
    setLoading(true);

    onSubmit(data)
      .catch((error) => {
        toast({
          title: "Oops, an error occured",
          description: error.message,
        });
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <div className="pb-20 space-y-3">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input placeholder="Personal Training" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description (optional)</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Training under personal supervision of one of our professional coaches"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="duration"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Duration (in minutes)</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="60"
                    {...field}
                    {...form.register("duration", { valueAsNumber: true })}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="price"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Price</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="250"
                    {...field}
                    {...form.register("price", { valueAsNumber: true })}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex items-start gap-2">
            <FormField
              control={form.control}
              name="location_id"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>Location (optional)</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Location" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {locations?.map((location) => (
                        <SelectItem key={location.id} value={location.id}>
                          {location.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    If the location is not selected then this activity will be
                    available in all locations
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="employee_id"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>Coach (optional)</FormLabel>
                  <Select
                    onValueChange={(value) => field.onChange(Number(value))}
                    defaultValue={String(field.value)}
                    disabled={!form.watch("location_id") || !coaches?.length}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Coach" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {coaches?.map((coach) => (
                        <SelectItem key={coach.id} value={String(coach.id)}>
                          {coach.user.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    If the coach is not selected then any coach can pick this
                    activity
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button size="lg" onClick={onCancel} variant="outline">
            Cancel
          </Button>
          <Button
            size="lg"
            type="submit"
            disabled={loading || !form.formState.isDirty}
            className="w-full"
          >
            {loading && (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {messages[type].loading}
              </>
            )}
            {!loading && messages[type].default}
          </Button>
        </div>
      </form>
    </Form>
  );
};
