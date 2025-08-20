"use client";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Empleado, Asistencia, Tienda } from "@/lib/types";

export default function AsistenciaSection({ empleados, asistencias, semanaId, tiendas, setAsis }:{
  empleados:Empleado[]; asistencias:Asistencia[]; semanaId:number; tiendas:Tienda[];
  setAsis:(empleado_id:number, dias:number)=>void;
}) {
  return (
    <Card>
      <div className="label mb-2">Días trabajados (0–7) — por defecto 6</div>
      <table>
        <thead><tr><th>Empleado</th><th>Tienda</th><th>Sueldo (6d)</th><th>Días</th></tr></thead>
        <tbody>
          {empleados.map(e=>{
            const a = asistencias.find(a=> a.empleado_id===e.id && a.semana_id===semanaId);
            return (
              <tr key={e.id} className="border-t border-zinc-200/70 dark:border-zinc-800">
                <td>{e.nombre}</td>
                <td>{tiendas.find(t=>t.id===e.tienda_base_id)?.nombre||e.tienda_base_id}</td>
                <td>${e.sueldo_semanal.toFixed(2)}</td>
                <td>
                  <Input type="number" min={0} max={7} defaultValue={a?.dias_trabajados ?? 6}
                    onChange={ev=>setAsis(e.id, Math.max(0, Math.min(7, Number(ev.target.value))))} className="w-20" />
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </Card>
  );
}
