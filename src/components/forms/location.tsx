import { useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Loader2 } from "lucide-react";

import { useForm } from "react-hook-form";
import { useToast } from "../ui/use-toast";

import * as zod from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import type { Tables } from "@/database.extensions";

type Props = {
  onSubmit: (data: zod.infer<typeof schema>) => Promise<void>;
  onCancel: () => void;
  type?: "create" | "edit";
  location?: Tables<"locations"> | null;
};

export const schema = zod.object({
  name: zod.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  description: zod
    .string()
    .min(2, {
      message: "Description must be at least 2 characters.",
    })
    .max(512, {
      message: "Description must be less than 512 characters.",
    })
    .optional(),
  address: zod
    .string()
    .min(2, {
      message: "Address must be at least 2 characters.",
    })
    .max(256, {
      message: "Address must be less than 256 characters.",
    })
    .optional(),
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

export const LocationForm = ({
  onSubmit,
  onCancel,
  type = "create",
  location,
}: Props) => {
  const [loading, setLoading] = useState<boolean>(false);

  const { toast } = useToast();

  const form = useForm<zod.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: location?.name || "",
      description: location?.description || "",
      address: location?.address || "",
    },
  });

  const handleSubmit = (data: zod.infer<typeof schema>) => {
    setLoading(true);

    onSubmit(data)
      .catch((error) => {
        toast({
          title: "Error occured",
          description: error.message,
        });
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-3">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="GYM ONE" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="address"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Address (optional)</FormLabel>
              <FormControl>
                <Input
                  placeholder="Ukraine, Kyiv, Khreschyatik 1, 02000"
                  {...field}
                />
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
                  placeholder="Our new GYM located in the most city center"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
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
