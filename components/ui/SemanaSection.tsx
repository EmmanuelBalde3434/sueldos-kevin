"use client";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export default function SemanaSection({ semana, setSemana }:{
  semana: {id:number;inicio:string;fin:string} | null;
  setSemana: (s:{id:number;inicio:string;fin:string})=>void;
}) {
  return (
    <Card>
      <div className="grid md:grid-cols-3 gap-3 items-end">
        <div><div className="label">Inicio (Lunes)</div>
          <Input type="date" value={semana?.inicio||''} onChange={e=>setSemana({id:1,inicio:e.target.value, fin: semana?.fin||e.target.value})} />
        </div>
        <div><div className="label">Fin (Domingo)</div>
          <Input type="date" value={semana?.fin||''} onChange={e=>setSemana({id:1,inicio:semana?.inicio||e.target.value, fin:e.target.value})} />
        </div>
        {!semana && <button className="btn btn-primary" onClick={()=>setSemana({id:1,inicio:new Date().toISOString().slice(0,10), fin:new Date().toISOString().slice(0,10)})}>Crear semana</button>}
      </div>
    </Card>
  );
}
