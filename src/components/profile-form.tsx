import { useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

import { useUser } from "@/hooks/useUser";

import { Loader2 } from "lucide-react";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

export type FormValues = z.infer<typeof formSchema>;

type Props = {
  onSubmit: (data: FormValues) => void;
  onCancel: () => void;
};

const formSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  username: z.string().min(2, {
    message: "Username must be at least 2 characters.",
  }),
});

export const ProfileForm = ({ onSubmit, onCancel }: Props) => {
  const [loading, setLoading] = useState<boolean>(false);

  const user = useUser();

  const form = useForm<z.infer<typeof formSchema>>({
    defaultValues: {
      name: user?.name,
      username: user?.username,
    },
    resolver: zodResolver(formSchema),
  });

  const handleSubmit = (data: z.infer<typeof formSchema>) => {
    setLoading(true);

    onSubmit(data);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-3">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input placeholder="Your name" {...field} />
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
              <FormControl>
                <Input placeholder="@username" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex justify-center items-center gap-2">
          <Button size="sm" onClick={onCancel} variant="outline">
            Cancel
          </Button>
          <Button
            size="sm"
            type="submit"
            disabled={loading || !form.formState.isDirty}
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
