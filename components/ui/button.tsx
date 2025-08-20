import { ButtonHTMLAttributes } from "react";
export function Button({ className="", ...props }: ButtonHTMLAttributes<HTMLButtonElement> & { className?: string }) {
  return <button {...props} className={`btn ${className}`} />;
}
export function PrimaryButton({ className="", ...props }: ButtonHTMLAttributes<HTMLButtonElement> & { className?: string }) {
  return <button {...props} className={`btn btn-primary ${className}`} />;
}
