"use client";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Plus } from "lucide-react";
import { Tienda, Venta } from "@/lib/types";
import { pesos } from "@/lib/utils";

export default function VentasSection({ tiendas, ventas, addVenta }:{
  tiendas:Tienda[]; ventas:Venta[]; addVenta:(tienda:number, venta:number, gastos:number)=>void;
}) {
  return (
    <Card>
      <div className="label mb-2">Capturar venta/gastos del domingo</div>
      <div className="grid md:grid-cols-5 gap-2 items-end">
        <select id="v-tienda" className="input">{tiendas.map(t=> <option key={t.id} value={t.id}>{t.nombre}</option>)}</select>
        <Input placeholder="Venta" id="v-venta" type="number" />
        <Input placeholder="Gastos" id="v-gastos" type="number" />
        <button className="btn btn-primary" onClick={()=>{
          const t=Number((document.getElementById('v-tienda') as HTMLSelectElement).value);
          const v=Number((document.getElementById('v-venta') as HTMLInputElement).value||0);
          const g=Number((document.getElementById('v-gastos') as HTMLInputElement).value||0);
          addVenta(t,v,g);
          (document.getElementById('v-venta') as HTMLInputElement).value='';
          (document.getElementById('v-gastos') as HTMLInputElement).value='';
        }}><Plus className="w-4 h-4"/>Agregar</button>
      </div>

      <table className="mt-4">
        <thead><tr><th>Tienda</th><th>Venta</th><th>Gastos</th><th>Disponible</th></tr></thead>
        <tbody>
          {ventas.map((r,i)=> {
            const tn = tiendas.find(t=>t.id===r.tienda_id)?.nombre || r.tienda_id;
            return (
              <tr key={i} className="border-t border-zinc-200/70 dark:border-zinc-800">
                <td>{tn}</td><td>{pesos(r.venta)}</td><td>{pesos(r.gastos)}</td><td>{pesos(r.venta-r.gastos)}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </Card>
  );
}
