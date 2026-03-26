import * as React from "react";

import { cn } from "./utils";

function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        "resize-none border-gray-200 placeholder:text-gray-400 placeholder:text-[11px] focus-visible:border-[#284497]/40 focus-visible:ring-[#284497]/10 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive flex field-sizing-content min-h-16 w-full rounded-[6px] border bg-gray-50/50 px-3 py-2 text-xs transition-[color,box-shadow,border-color] outline-none focus-visible:ring-1 disabled:cursor-not-allowed disabled:opacity-50",
        className,
      )}
      {...props}
    />
  );
}

export { Textarea };