import * as React from "react";

export const Card = ({ className = "", ...props }: React.HTMLAttributes<HTMLDivElement>) => {
  return (
    <div
      className={`border rounded-lg shadow-sm bg-white p-4 ${className}`}
      {...props}
    />
  );
};

export const CardContent = ({ className = "", ...props }: React.HTMLAttributes<HTMLDivElement>) => {
  return (
    <div className={`p-2 ${className}`} {...props} />
  );
};
