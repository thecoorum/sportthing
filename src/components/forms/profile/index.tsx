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
import { Input } from "@/components/ui/input";

import { OperatingRules } from "./operating-rules";

import { useUser } from "@/hooks/useUser";

import * as zod from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

export type FormValues = zod.infer<typeof formSchema>;

type Props = {
  onSubmit?: (data: FormValues) => void;
  onCancel: () => void;
};

export const formSchema = zod.object({
  name: zod.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  username: zod.string().min(2, {
    message: "Username must be at least 2 characters.",
  }),
  operating_rules: zod
    .array(
      zod.object({
        id: zod.string().uuid().optional(),
        day: zod.string().nonempty({
          message: "Day is required.",
        }),
        start_time: zod.string().nonempty({
          message: "From time is required.",
        }),
        end_time: zod.string().nonempty({
          message: "Till time is required.",
        }),
      })
    )
    .optional(),
});

export const ProfileForm = ({ onSubmit, onCancel }: Props) => {
  const [loading, setLoading] = useState<boolean>(false);

  const user = useUser();

  // Add a hook to fetch the operating rules based on user id

  const form = useForm<zod.infer<typeof formSchema>>({
    defaultValues: {
      name: user?.name ?? "",
      username: user?.username ?? "",
      // operating_rules: user?.operating_rules ?? [],
    },
    resolver: zodResolver(formSchema),
  });

  const handleSubmit = (data: zod.infer<typeof formSchema>) => {
    setLoading(true);

    console.log(data);

    // onSubmit(data);
  };

  console.log(form.formState.errors);

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
        <OperatingRules control={form.control} watch={form.watch} />
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
