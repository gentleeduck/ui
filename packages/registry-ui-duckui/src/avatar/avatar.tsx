"use client";

import * as React from "react";
import { cn } from "@gentelduck/libs/cn";

export interface AvatarProps extends React.HTMLProps<HTMLImageElement> {}

function Avatar({ className, alt, ref, ...props }: AvatarProps) {
  const [isValid, setIsValid] = React.useState(false);

  return (
    <picture className="relative shrink-0 overflow-hidden rounded-full size-10">
      <img
        ref={ref}
        {...props}
        onLoad={() => setIsValid(true)}
        onError={() => setIsValid(false)}
        className={
          "relative flex shrink-0 overflow-hidden rounded-full object-cover w-full h-full text-transparent"
        }
        alt={alt}
      />
      {!isValid && (
        <span
          aria-label={alt}
          role="img"
          className="absolute flex bg-muted items-center justify-center inset-0 w-full h-full rounded-full"
        >
          {alt?.slice(0,2)}
        </span>
      )}
    </picture>
  );
}

export { Avatar };

// AvatarGroup Component
interface UserType {
  id: string;
  name?: string;
  avatarUrl?: string;
}

export interface AvatarGroupProps extends React.HTMLProps<HTMLDivElement> {
  users: UserType[];
  max_users?: number;
}

const AvatarGroup = React.forwardRef<HTMLDivElement, AvatarGroupProps>(
  ({ max_users, users, className, ...props }, ref) => {
    const max = max_users ?? users.length;
    return (
      <div className={cn("flex items-center", className)} {...props} ref={ref}>
        {users.slice(0, max).map((user) => (
          <Avatar
            src={user.avatarUrl}
            alt={user?.name?.toString().slice(0, 2)}
            key={user.id}
          />
        ))}
      </div>
    );
  }
);
