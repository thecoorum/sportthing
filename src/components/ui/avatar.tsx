"use client";

import * as React from "react";
import * as RadixAvatarPrimitive from "@radix-ui/react-avatar";

import { cn } from "@/utils";

const AvatarPrimitive = React.forwardRef<
  React.ElementRef<typeof RadixAvatarPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof RadixAvatarPrimitive.Root>
>(({ className, ...props }, ref) => (
  <RadixAvatarPrimitive.Root
    ref={ref}
    className={cn(
      "relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full",
      className
    )}
    {...props}
  />
));
AvatarPrimitive.displayName = RadixAvatarPrimitive.Root.displayName;

const AvatarImagePrimitive = React.forwardRef<
  React.ElementRef<typeof RadixAvatarPrimitive.Image>,
  React.ComponentPropsWithoutRef<typeof RadixAvatarPrimitive.Image>
>(({ className, ...props }, ref) => (
  <RadixAvatarPrimitive.Image
    ref={ref}
    className={cn("aspect-square h-full w-full", className)}
    {...props}
  />
));
AvatarImagePrimitive.displayName = RadixAvatarPrimitive.Image.displayName;

const AvatarFallbackPrimitive = React.forwardRef<
  React.ElementRef<typeof RadixAvatarPrimitive.Fallback>,
  React.ComponentPropsWithoutRef<typeof RadixAvatarPrimitive.Fallback>
>(({ className, ...props }, ref) => (
  <RadixAvatarPrimitive.Fallback
    ref={ref}
    className={cn(
      "flex h-full w-full items-center justify-center rounded-full bg-muted",
      className
    )}
    {...props}
  />
));
AvatarFallbackPrimitive.displayName = RadixAvatarPrimitive.Fallback.displayName;

type AvatarProps = {
  name: string;
  image?: string | null;
  className?: string;
};

const Avatar = ({ name, image, className, ...props }: AvatarProps) => {
  const initials = String(name)
    .split(" ")
    .map((part: string) => part[0])
    .join("");

  return (
    <AvatarPrimitive className={className}>
      {image && <AvatarImagePrimitive src={image} alt={name} />}
      <AvatarFallbackPrimitive>{initials}</AvatarFallbackPrimitive>
    </AvatarPrimitive>
  );
};

export {
  Avatar,
  AvatarPrimitive,
  AvatarImagePrimitive,
  AvatarFallbackPrimitive,
};
