import { useState } from "react";

import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";

import { OperatingRules } from "./operating-rules";

import { useUser } from "@/hooks/useUser";

import * as zod from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormProvider, useForm } from "react-hook-form";

export type FormValues = zod.infer<typeof formSchema>;

type Props = {
  onSubmit: (data: FormValues) => void;
  onCancel: () => void;
};

export const formSchema = zod.object({
  name: zod.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  username: zod.string().min(2, {
    message: "Username must be at least 2 characters.",
  }),
  description: zod
    .string()
    .min(2, {
      message: "Description must be at least 2 characters.",
    })
    .optional(),
  operating_rules: zod
    .array(
      zod.object({
        id: zod.string().uuid().optional(),
        day: zod.string().min(1, {
          message: "Day is required.",
        }),
        start_time: zod.string().min(1, {
          message: "From time is required.",
        }),
        end_time: zod.string().min(1, {
          message: "Till time is required.",
        }),
        _delete: zod.boolean().optional(),
      })
    )
    .optional(),
});

export const ProfileForm = ({ onSubmit, onCancel }: Props) => {
  const [loading, setLoading] = useState<boolean>(false);

  const user = useUser();

  const form = useForm<zod.infer<typeof formSchema>>({
    defaultValues: {
      name: user?.name ?? "",
      username: user?.username ?? "",
      description: user?.description ?? "",
      operating_rules: user?.operating_rules ?? [],
    },
    resolver: zodResolver(formSchema),
  });

  const handleSubmit = (data: zod.infer<typeof formSchema>) => {
    setLoading(true);

    onSubmit(data);
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSubmit)}
        className="w-full space-y-3"
      >
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="John Doe" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input placeholder="@username" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {user.role === "coach" && (
          <>
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="A professional coach with more than 20 years of experience"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormProvider {...form}>
              <OperatingRules />
            </FormProvider>
          </>
        )}
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
                Updating...
              </>
            )}
            {!loading && "Submit"}
          </Button>
        </div>
      </form>
    </Form>
  );
};
