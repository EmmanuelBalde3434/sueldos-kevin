import { Card } from "@/components/ui/card";
import { Building2, CalendarDays, Coins, TrendingDown } from "lucide-react";

export default function Kpis({ semanaTxt, tiendas, disponible, faltante }:{
  semanaTxt:string; tiendas:number; disponible:number; faltante:number;
}) {
  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <Card><div className="label">Semana</div><div className="kpi flex items-center gap-2"><CalendarDays className="w-5 h-5"/>{semanaTxt||"—"}</div></Card>
      <Card><div className="label">Tiendas</div><div className="kpi flex items-center gap-2"><Building2 className="w-5 h-5"/>{tiendas}</div></Card>
      <Card><div className="label">Disponible total</div><div className="kpi flex items-center gap-2"><Coins className="w-5 h-5"/>${disponible.toFixed(2)}</div></Card>
      <Card><div className="label">Faltante total</div><div className="kpi flex items-center gap-2 text-rose-600"><TrendingDown className="w-5 h-5"/>${faltante.toFixed(2)}</div></Card>
    </div>
  );
}
