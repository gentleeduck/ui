"use client";

import {
  Button,
  ButtonTooltip,
  TooltipExample,
  TooltipTrigger,
} from "@gentelduck/registry-ui-duckui/button";
import { Label } from "@gentelduck/registry-ui-duckui/label";
import {
  RadioGroup,
  RadioGroupItem,
} from "@gentelduck/registry-ui-duckui/radio-group";
import {
  Tooltip,
  TooltipContent,
} from "@gentelduck/registry-ui-duckui/tooltip";
import { Calendar, Grab, LineChart, Pointer } from "lucide-react";

export function MainExample() {
  // <Button
  //   variant={'outline'}
  //   size={'default'}
  //   icon={<Calendar />}
  //   // asChild
  //   label={[ButtonTooltip, , { open: true }]}
  //   // command{[]}
  // >
  //   <div>Mettings</div>
  // </Button>

  // return (
  //   <>
  //     <TooltipExample />
  //   </>
  // );
  return (
    <div className="flex flex-col gap-3 items-center">
      <div className="relative w-full">
        <Pointer className="size-4 absolute top-3 right-0 z-10 fill-white" />
        <Tooltip
          variant={"outline"}
          content={[
            TooltipContent,
            {
              children: "5 meetings remaining for today.",
              sideOffset: 4,
              className: "w-[250px]",
            },
          ]}
        >
          Mettings
        </Tooltip>
      </div>

      <Button variant={"outline"} size={"default"} icon={<Calendar />}>
        Mettings
      </Button>
      <div className="relative">
        <Grab className="size-4 absolute -top-2 right-8 z-10 fill-white" />

        <Button
          variant={"outline"}
          size={"default"}
          className="bg-secondary"
          icon={<LineChart />}
        >
          Analytics
        </Button>
      </div>
    </div>
  );
}

export function RadioGroupDemo() {
  return (
    <RadioGroup
      defaultValue="comfortable"
      // defaultValue : 'default' | 'comfortable' | 'compact'
    >
      <div className="flex items-center space-x-2">
        <RadioGroupItem value="default" id="r1" />
        <Label htmlFor="r1">Default</Label>
      </div>
      <div className="flex items-center space-x-2">
        <RadioGroupItem value="comfortable" id="r2" />
        <Label htmlFor="r2">Comfortable</Label>
      </div>
      <div className="flex items-center space-x-2">
        <RadioGroupItem value="compact" id="r3" />
        <Label htmlFor="r3">Compact</Label>
      </div>
    </RadioGroup>
  );
}
