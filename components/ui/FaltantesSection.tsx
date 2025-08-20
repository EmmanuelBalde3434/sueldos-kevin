import { Card } from "@/components/ui/card";
import { pesos } from "@/lib/utils";

export default function FaltantesSection({ rows }:{ rows:{tienda_id:number; tienda:string; disponible:number; necesario:number; faltante:number;}[] }) {
  return (
    <Card>
      <table>
        <thead><tr><th>ID</th><th>Tienda</th><th>Disponible</th><th>Necesario</th><th>Faltante</th></tr></thead>
        <tbody>
          {rows.map(x=>{
            const ok = x.faltante<=0;
            return (
              <tr key={x.tienda_id} className="border-t border-zinc-200/70 dark:border-zinc-800">
                <td>{x.tienda_id}</td><td>{x.tienda}</td>
                <td>{pesos(x.disponible)}</td><td>{pesos(x.necesario)}</td>
                <td><span className={`badge ${ok? 'text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40':'text-rose-600 bg-rose-50 dark:bg-rose-950/40'}`}><b>{pesos(x.faltante)}</b></span></td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </Card>
  );
}
