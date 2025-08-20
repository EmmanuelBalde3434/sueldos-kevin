"use client";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Plus, Trash2 } from "lucide-react";
import { Empleado, Tienda } from "@/lib/types";
import { pesos } from "@/lib/utils";

export default function EmpleadosSection({ empleados, tiendas, addEmpleado, remove }:{
  empleados:Empleado[]; tiendas:Tienda[];
  addEmpleado:(n:string, rol:'Encargado'|'Auxiliar', sueldo:number, tienda:number)=>void;
  remove:(id:number)=>void;
}) {
  return (
    <Card>
      <div className="label mb-2">Agregar empleado</div>
      <div className="grid md:grid-cols-5 gap-2 items-end">
        <Input placeholder="Nombre" id="e-nombre" />
        <select id="e-rol" className="input" defaultValue="Encargado">
          <option value="Encargado">Encargado</option><option value="Auxiliar">Auxiliar</option>
        </select>
        <Input placeholder="Sueldo semanal (6d)" id="e-sueldo" type="number" />
        <select id="e-tienda" className="input">
          {tiendas.map(t=> <option key={t.id} value={t.id}>{t.nombre}</option>)}
        </select>
        <button className="btn btn-primary" onClick={()=>{
          const n=(document.getElementById('e-nombre') as HTMLInputElement).value.trim();
          const r=(document.getElementById('e-rol') as HTMLSelectElement).value as 'Encargado'|'Auxiliar';
          const s=Number((document.getElementById('e-sueldo') as HTMLInputElement).value);
          const t=Number((document.getElementById('e-tienda') as HTMLSelectElement).value);
          if(!n||!r||!s||!t) return alert('Completa todos los campos');
          addEmpleado(n,r,s,t);
          (document.getElementById('e-nombre') as HTMLInputElement).value='';
          (document.getElementById('e-sueldo') as HTMLInputElement).value='';
        }}><Plus className="w-4 h-4"/>Agregar</button>
      </div>

      <table className="mt-4">
        <thead><tr><th>ID</th><th>Nombre</th><th>Rol</th><th>Sueldo (6d)</th><th>Tienda</th><th></th></tr></thead>
        <tbody>
          {empleados.map(e=>(
            <tr key={e.id} className="border-t border-zinc-200/70 dark:border-zinc-800">
              <td>{e.id}</td><td>{e.nombre}</td><td>{e.rol}</td><td>{pesos(e.sueldo_semanal)}</td>
              <td>{tiendas.find(t=>t.id===e.tienda_base_id)?.nombre||e.tienda_base_id}</td>
              <td><button className="btn" onClick={()=>remove(e.id)}><Trash2 className="w-4 h-4"/></button></td>
            </tr>
          ))}
        </tbody>
      </table>
    </Card>
  );
}
