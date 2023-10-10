import { useEffect, useCallback } from "react";

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
import { useMainButton } from "@twa.js/sdk-react";

import * as zod from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormProvider, useForm } from "react-hook-form";

import { cn } from "@/utils";

export type FormValues = zod.infer<typeof formSchema>;

type Props = {
  onSubmit: (data: FormValues) => void;
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

export const ProfileForm = ({ onSubmit }: Props) => {
  const user = useUser();

  const mainButton = useMainButton();

  const form = useForm<zod.infer<typeof formSchema>>({
    defaultValues: {
      name: user?.name ?? "",
      username: user?.username ?? "",
      description: user?.description ?? "",
      operating_rules: user?.operating_rules ?? [],
    },
    resolver: zodResolver(formSchema),
  });

  const handleSubmit = useCallback(
    (data: zod.infer<typeof formSchema>) => {
      mainButton.disable();
      mainButton.showProgress();

      onSubmit(data);
    },
    [onSubmit, mainButton]
  );

  useEffect(() => {
    mainButton.disable();
    mainButton.setText("Save");
    mainButton.show();

    return () => {
      mainButton.hide();
    };
  }, [mainButton]);

  useEffect(() => {
    mainButton.on("click", form.handleSubmit(handleSubmit));

    return () => {
      mainButton.off("click", form.handleSubmit(handleSubmit));
    };
  }, [mainButton, handleSubmit, form]);

  useEffect(() => {
    if (form.formState.isDirty) {
      mainButton.enable();
    } else {
      mainButton.disable();
    }
  }, [mainButton, form.formState.isDirty]);

  return (
    <Form {...form}>
      <form className="w-full space-y-3">
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
            <div className={cn(user.role !== "coach" && "mb-20")}>
              <FormItem>
                <FormLabel>Username</FormLabel>
                <FormControl>
                  <Input placeholder="@username" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            </div>
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
      </form>
    </Form>
  );
};
