"use client";
import { Button } from "@/components/ui/button";

export default function Header({ onClear }:{ onClear:()=>void }) {
  return (
    <header className="flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-2xl bg-brand-600 text-white grid place-content-center font-bold">FD</div>
        <div>
          <h1 className="text-xl font-semibold">Faltantes del Domingo</h1>
          <p className="text-xs text-zinc-500">LocalStorage • Semana 6+1</p>
        </div>
      </div>
      <Button onClick={onClear}>Borrar todo</Button>
    </header>
  );
}
