import "./globals.css";
import { ReactNode } from "react";

export const metadata = {
  title: "Faltantes del Domingo (Local)",
  description: "Guarda en localStorage — sin backend",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}
