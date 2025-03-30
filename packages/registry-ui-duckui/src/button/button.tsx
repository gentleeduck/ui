import * as React from "react";

import { buttonVariants } from "./button.constants";
import { ButtonProps } from "./button.types";

import { cn } from "@gentelduck/libs/cn";
import { Loader } from "lucide-react";
import { toast } from "sonner";
import { useDuckShortcut } from "@ahmedayob/duck-shortcut";
// import { useDuckShortcut } from "../command";

// this is the slot component we removed the slot from radix-ui
function Slot({ children, ...props }: React.ComponentPropsWithoutRef<"div">) {
  if (!React.isValidElement(children)) {
    return <div {...props}>{children}</div>;
  }

  return React.cloneElement(children, {
    ...props,
    ...(children as React.JSX.Element).props,
  });
}

function Button({
  children,
  variant,
  size,
  border,
  asChild,
  className,
  label,
  loading,
  isCollapsed,
  icon,
  secondIcon,
  animationIcon,
  ref,
  ...props
}: ButtonProps & { ref?: React.Ref<HTMLButtonElement> }) {
  const Component = (asChild ? Slot : "button") as React.ElementType;

  const Button = (
    <Component
      {...props}
      ref={ref}
      className={cn(
        buttonVariants({
          variant,
          size: isCollapsed ? "icon" : size,
          border,
          className,
        })
      )}
      disabled={loading}
    >
      <div className="flex items-center gap-2">
        {animationIcon?.icon && animationIcon.iconPlacement === "left" && (
          <div className="w-0 translate-x-[-1.3em] pr-0 opacity-0 transition-all duration-200 group-hover:w-5 group-hover:-translate-x-1 group-hover:pr-2 group-hover:opacity-100">
            {animationIcon?.icon}
          </div>
        )}
        {!loading ? icon : <Loader className="animate-spin" />}
        {!isCollapsed && size !== "icon" && children}
        {!isCollapsed && secondIcon && secondIcon}
        {animationIcon?.icon && animationIcon.iconPlacement === "right" && (
          <div className="w-0 translate-x-[1.3em] pl-0 opacity-0 transition-all duration-200 group-hover:w-5 group-hover:translate-x-0 group-hover:pl-2 group-hover:opacity-100">
            {animationIcon?.icon}
          </div>
        )}
      </div>
    </Component>
  );

  return Button;
}

export { Button, Slot };

export interface CommandProps extends React.HTMLProps<HTMLElement> {}

export function ButtonCommand({ className, ...props }: CommandProps) {
  useDuckShortcut({
    keys: "ctrl+k",
    onKeysPressed: () => {
      window.event?.preventDefault();
      console.log('asdfasdf')
    },
  });

  return (
    <kbd
      className={cn(
        "inline-flex items-center font-semibold transition-colors focus:outline-hidden focus:ring-2 focus:ring-ring focus:offset-2 bg-secondary text-[.7rem] py-[.12rem] px-2 rounded-xs text-secondary-foreground !font-sans",
        className
      )}
      {...props}
    />
  );
}

// {!isCollapsed && command?.children && !showCommand && (
//   <CommandComponent />
// )}
//
// {!isCollapsed && label && !showLabel && (
//   <Badge
//     variant={label.variant ?? 'secondary'}
//     size={label.size ?? 'default'}
//     className={cn(
//       'text-[.8rem] py-0 rounded-md px-1 font-medium',
//       label.variant === 'nothing' && 'text-accent',
//       label.className,
//     )}
//     {...labelProps}
//   />
// )}

//

// const {
//   className: commandClassName,
//   show: commandShow,
//   key,
//   action,
//   ...commandProps
// } = command ?? {}
//
// if (key && action) {
//   useDuckShortcut({ keys: [key], onKeysPressed: action })
// }
//
// // Handle keyboard shortcut Badge
// const CommandComponent = () =>
//   (commandShow ?? true) && (
//     <kbd
//       className={cn(
//         'inline-flex items-center font-semibold transition-colors focus:outline-hidden focus:ring-2 focus:ring-ring focus:offset-2 bg-secondary text-[.7rem] py-[.12rem] px-2 rounded-xs text-secondary-foreground !font-sans',
//         commandClassName,
//       )}
//       {...commandProps}
//     />
//   )
//
// const {
//   side,
//   delayDuration,
//   open,
//   onOpenChange,
//   showLabel,
//   showCommand,
//   ...labelProps
// } = label || {}
