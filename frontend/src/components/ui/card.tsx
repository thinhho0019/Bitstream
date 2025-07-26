import * as React from "react";

export function Card({ className = "", children }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={`rounded-2xl border bg-white p-4 shadow-md ${className}`}
    >
      {children}
    </div>
  );
}

export function CardContent({ className = "", children }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={`pt-2 ${className}`}>
      {children}
    </div>
  );
}
