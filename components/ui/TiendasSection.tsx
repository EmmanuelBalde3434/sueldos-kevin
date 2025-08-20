"use client";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Plus, Trash2 } from "lucide-react";
import { Tienda, TiendasTam } from "@/lib/types";

export default function TiendasSection({ tiendas, addTienda, remove }:{
  tiendas:Tienda[];
  addTienda:(nombre:string,tamano:TiendasTam)=>void;
  remove:(id:number)=>void;
}) {
  return (
    <Card>
      <div className="label mb-2">Agregar tienda</div>
      <div className="grid md:grid-cols-4 gap-2 items-end">
        <Input placeholder="Nombre" id="t-nombre" />
        <select id="t-tamano" className="input">
          <option value="grande">Grande</option><option value="mediana">Mediana</option><option value="pequena">Pequeña</option>
        </select>
        <button className="btn btn-primary" onClick={()=>{
          const n=(document.getElementById('t-nombre') as HTMLInputElement).value.trim();
          const tam=(document.getElementById('t-tamano') as HTMLSelectElement).value as TiendasTam;
          if(!n) return alert('Pon un nombre'); addTienda(n,tam); (document.getElementById('t-nombre') as HTMLInputElement).value='';
        }}><Plus className="w-4 h-4"/>Agregar</button>
      </div>

      <table className="mt-4">
        <thead><tr><th>ID</th><th>Nombre</th><th>Tamaño</th><th></th></tr></thead>
        <tbody>
          {tiendas.map(t=>(
            <tr key={t.id} className="border-t border-zinc-200/70 dark:border-zinc-800">
              <td>{t.id}</td><td>{t.nombre}</td><td>{t.tamano}</td>
              <td><button className="btn" onClick={()=>remove(t.id)}><Trash2 className="w-4 h-4"/></button></td>
            </tr>
          ))}
        </tbody>
      </table>
    </Card>
  );
}
