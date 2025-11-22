import Link from "next/link";
import type { ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary";
  children: ReactNode;
  href?: string;
};

export function Button({ variant = "primary", className, children, href, ...props }: Props) {
  const base =
    "inline-flex items-center justify-center rounded-full px-4 py-2 text-sm font-medium transition-colors";
  const variants: Record<string, string> = {
    primary: "bg-primary text-white hover:bg-primary/90 shadow-sm",
    secondary: "border border-gray-300 text-gray-900 hover:bg-gray-50",
  };

  const classes = cn(base, variants[variant], className);

  if (href) {
    return (
      <Link href={href} className={classes}>
        {children}
      </Link>
    );
  }

  return (
    <button className={classes} {...props}>
      {children}
    </button>
  );
}
