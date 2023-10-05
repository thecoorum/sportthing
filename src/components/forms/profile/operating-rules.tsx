import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { X } from "lucide-react";

import { Control, UseFormWatch, useFieldArray } from "react-hook-form";

import { formSchema } from ".";

import { days } from '@/constants'
import { generateTimes } from "@/utils";

import * as zod from "zod";

type Props = {
  control: Control<zod.infer<typeof formSchema>>;
  watch: UseFormWatch<zod.infer<typeof formSchema>>;
};

export const OperatingRules = ({ control, watch }: Props) => {
  const { fields, append, remove } = useFieldArray({
    control,
    name: "operating_rules",
  });

  const handleAddRule = () => {
    append({ day: "monday", start_time: "", end_time: "" });
  };

  return (
    <div className="space-y-3">
      <Label>Operating rules</Label>
      {!fields.length && (
        <div className="flex justify-center items-center p-6">
          <span className="text-sm text-muted-foreground">
            You have no operating rules configured
          </span>
        </div>
      )}
      <div className="grid grid-cols-[repeat(3,_1fr)_max-content] gap-2">
        {!!fields.length && (
          <>
            <Label className="w-full text-muted-foreground">Day</Label>
            <Label className="w-full text-muted-foreground">From</Label>
            <Label className="w-full text-muted-foreground col-span-2">
              Till
            </Label>
          </>
        )}
        {fields.map((field, index) => {
          const from = watch(`operating_rules.${index}.start_time`);
          const till = watch(`operating_rules.${index}.end_time`);

          const handleRemoveRule = () => {
            if (field.id) {
              // TODO: Remove from database
            }

            remove(index);
          };

          return (
            <>
              <FormField
                control={control}
                name={`operating_rules.${index}.day` as const}
                render={({ field: dayField }) => (
                  <FormItem>
                    <Select
                      onValueChange={dayField.onChange}
                      defaultValue={dayField.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="When" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {days.map(({ name, value }) => (
                          <SelectItem key={value} value={value}>
                            {name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={control}
                name={`operating_rules.${index}.start_time` as const}
                render={({ field: startTimeField }) => (
                  <FormItem>
                    <Select
                      onValueChange={startTimeField.onChange}
                      defaultValue={startTimeField.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="From" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="max-h-[40vh]">
                        <ScrollArea>
                          {generateTimes({ till }).map((value) => (
                            <SelectItem key={value} value={value}>
                              {value}
                            </SelectItem>
                          ))}
                        </ScrollArea>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={control}
                name={`operating_rules.${index}.end_time` as const}
                render={({ field: endTimeField }) => (
                  <FormItem>
                    <Select
                      onValueChange={endTimeField.onChange}
                      defaultValue={endTimeField.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Till" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="max-h-[40vh]">
                        <ScrollArea>
                          {generateTimes({ from }).map((value) => (
                            <SelectItem key={value} value={value}>
                              {value}
                            </SelectItem>
                          ))}
                        </ScrollArea>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button variant="ghost" onClick={handleRemoveRule}>
                <X className="w-4 h-4" />
              </Button>
            </>
          );
        })}
      </div>
      <Button
        size="lg"
        variant="outline"
        className="w-full"
        onClick={handleAddRule}
        type="button"
      >
        Add rule
      </Button>
    </div>
  );
};
