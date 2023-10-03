"use client";

import { useState, useEffect } from "react";

// import { Button } from "@/components/ui/button";
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
// import { Loader2 } from "lucide-react";

import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { useApi } from "@/hooks/useApi";
import { useToast } from "@/components/ui/use-toast";
import { useMainButton, useBackButton } from "@twa.js/sdk-react";

import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const formSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  description: z
    .string()
    .min(2, {
      message: "Description must be at least 2 characters.",
    })
    .max(512, {
      message: "Description must be less than 512 characters.",
    })
    .optional(),
  address: z
    .string()
    .min(2, {
      message: "Address must be at least 2 characters.",
    })
    .max(256, {
      message: "Address must be less than 256 characters.",
    })
    .optional(),
});

const LocationCreate = () => {
  const [loading, setLoading] = useState<boolean>(false);

  const mainButton = useMainButton();
  const backButton = useBackButton();

  const api = useApi();
  const router = useRouter();

  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  useEffect(() => {
    const handleSubmit = (data: z.infer<typeof formSchema>) => {
      setLoading(true);

      api
        .post("/locations", data)
        .then(() => {
          router.replace("/locations");
        })
        .catch((error: Error) => {
          console.error(error);

          toast({
            title: "Error occured",
            description: error.message,
          });
        })
        .finally(() => {
          setLoading(false);
        });
    };

    const handleFormSubmit = () => {
      form.handleSubmit(handleSubmit)();
    };

    const handleCancel = () => {
      router.replace("/locations");
    };

    backButton.show();
    backButton.on("click", handleCancel);

    mainButton.setText("Create");
    mainButton.on("click", handleFormSubmit);
    mainButton.show();

    return () => {
      mainButton.off("click", handleFormSubmit);
      mainButton.hide();
      backButton.hide();
    };
  }, [mainButton, backButton, router, api, toast, form]);

  useEffect(() => {
    console.log(form.formState.isValid);
    if (form.formState.isValid) {
      mainButton.enable();
    } else {
      mainButton.disable();
    }
  }, [form.formState.isValid, mainButton]);

  useEffect(() => {
    if (loading) {
      mainButton.showProgress();
    } else {
      mainButton.hideProgress();
    }
  }, [loading, mainButton]);

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-medium">Create new location</h2>
      <Form {...form}>
        <form className="space-y-3">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Location name</FormLabel>
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
                <FormLabel>Location address (optional)</FormLabel>
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
                <FormLabel>Location description</FormLabel>
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
          {/* <div className="flex items-center gap-2">
            <Button size="lg" onClick={handleCancel} variant="outline">
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
                  Creating...
                </>
              )}
              {!loading && "Create"}
            </Button>
          </div> */}
        </form>
      </Form>
    </div>
  );
};

export default LocationCreate;
