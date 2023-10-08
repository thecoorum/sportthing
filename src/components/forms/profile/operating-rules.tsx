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
import { RotateCcw, Trash } from "lucide-react";

import { useFormContext, useFieldArray } from "react-hook-form";

import { formSchema } from ".";

import { days } from "@/constants";
import { generateTimes } from "@/utils";

import * as zod from "zod";

export const OperatingRules = () => {
  const { control, watch, setValue } =
    useFormContext<zod.infer<typeof formSchema>>();

  const { fields, append } = useFieldArray({
    control,
    name: "operating_rules",
  });

  const handleAddRule = () => {
    append({ day: "monday", start_time: "", end_time: "", _delete: false });
  };

  const handleToggleRemove = (index: number) => {
    const pendingDelete = watch(`operating_rules.${index}._delete`);

    setValue(`operating_rules.${index}._delete`, !pendingDelete, {
      shouldDirty: true,
    });
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
      <div className="grid grid-cols-3 gap-2 overflow-x-auto">
        {!!fields.length && (
          <>
            <Label className="text-muted-foreground">Day</Label>
            <Label className="text-muted-foreground">From</Label>
            <Label className="text-muted-foreground">Till</Label>
          </>
        )}
        {fields.map((_, index) => {
          const [from, till, pendingDelete] = watch([
            `operating_rules.${index}.start_time`,
            `operating_rules.${index}.end_time`,
            `operating_rules.${index}._delete`,
          ]);

          return (
            <>
              <FormField
                control={control}
                name={`operating_rules.${index}.day` as const}
                render={({ field }) => (
                  <FormItem>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      disabled={pendingDelete}
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
                render={({ field }) => (
                  <FormItem>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      disabled={pendingDelete}
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
                render={({ field }) => (
                  <FormItem>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      disabled={pendingDelete}
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
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleToggleRemove(index)}
                type="button"
                className="col-span-3"
              >
                {pendingDelete ? (
                  <RotateCcw className="w-4 h-4" />
                ) : (
                  <Trash className="w-4 h-4" />
                )}
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
