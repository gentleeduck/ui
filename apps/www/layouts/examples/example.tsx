"use client";

import { ButonCommand, Button, ButtonCommand } from "@gentelduck/registry-ui-duckui/button";
import { Label } from "@gentelduck/registry-ui-duckui/label";
import {
  RadioGroup,
  RadioGroupItem,
} from "@gentelduck/registry-ui-duckui/radio-group";
import {
  Tooltip,
  TooltipContent,
} from "@gentelduck/registry-ui-duckui/tooltip";
import {
  ArrowBigDown,
  Calendar,
  Command,
  Grab,
  LineChart,
  Pointer,
} from "lucide-react";

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
        <Tooltip>
          <TooltipContent>5 meetings remaining for today.</TooltipContent>
          <Button variant={"outline"} size={"default"} icon={<Calendar />}>
            Mettings
          </Button>
        </Tooltip>
      </div>

      <Button variant={"outline"} size={"default"} icon={<Calendar />}>
        Mettings
        <ButtonCommand>
          <Command className="!size-3" />
          +K
        </ButtonCommand>
      </Button>

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
