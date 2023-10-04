import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";

import {
  Control,
  UseFormRegister,
  UseFormWatch,
  useFieldArray,
} from "react-hook-form";

import { formSchema } from ".";

import * as zod from "zod";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";

type Props = {
  control: Control<zod.infer<typeof formSchema>>;
  watch: UseFormWatch<zod.infer<typeof formSchema>>;
};

const days = [
  { name: "Sunday", value: "sunday" },
  { name: "Monday", value: "monday" },
  { name: "Tuesday", value: "tuesday" },
  { name: "Wednesday", value: "wednesday" },
  { name: "Thursday", value: "thursday" },
  { name: "Friday", value: "friday" },
  { name: "Saturday", value: "saturday" },
  { name: "Weekdays", value: "weekdays" },
  { name: "Weekends", value: "weekends" },
];

const generateTimes = ({
  from,
  till,
}: { from?: string; till?: string } = {}) => {
  const times = [];
  const [fromHour, fromMinute] = !!from ? from.split(":").map(Number) : [0, 0];
  const [tillHour, tillMinute] = !!till ? till.split(":").map(Number) : [24, 0];

  for (let i = fromHour; i <= tillHour; i++) {
    const startMinute = i === fromHour ? fromMinute : 0;
    const endMinute = i === tillHour ? tillMinute : 60;

    for (let j = startMinute; j < endMinute; j += 15) {
      const hour = i < 10 ? `0${i}` : `${i}`;
      const minute = j === 0 ? "00" : `${j}`;

      times.push(`${hour}:${minute}`);
    }
  }

  return times;
};

export const OperatingRules = ({ control, watch }: Props) => {
  const { fields, append, remove } = useFieldArray({
    control,
    name: "operating_rules",
  });

  const handleAddRule = () => {
    append({ day: "monday", start_time: "", end_time: "" });
  };

  console.log(fields);

  return (
    <div className="space-y-3">
      <div className="space-y-2">
        {fields.map((field, index) => {
          const from = watch(`operating_rules.${index}.start_time`);
          const till = watch(`operating_rules.${index}.end_time`);

          return (
            <div key={`${field.id}_day`} className="flex items-start gap-2">
              <FormField
                control={control}
                name={`operating_rules.${index}.day` as const}
                render={({ field: dayField }) => (
                  <FormItem className="w-full">
                    <FormLabel>Day</FormLabel>
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
                  </FormItem>
                )}
              />
              <FormField
                control={control}
                name={`operating_rules.${index}.start_time` as const}
                render={({ field: startTimeField }) => (
                  <FormItem className="w-full">
                    <FormLabel>From</FormLabel>
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
                  </FormItem>
                )}
              />
              <FormField
                control={control}
                name={`operating_rules.${index}.end_time` as const}
                render={({ field: endTimeField }) => (
                  <FormItem className="w-full">
                    <FormLabel>Till</FormLabel>
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
                  </FormItem>
                )}
              />
            </div>
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
