"use client";
export default function TabsNav({ tab, setTab }:{ tab:string; setTab:(t:string)=>void }) {
  const items = [["semana","Semana"],["tiendas","Tiendas"],["empleados","Empleados"],["ventas","Ventas/Gastos"],["asistencia","Asistencia"],["faltantes","Faltantes"]];
  return (
    <nav className="flex flex-wrap gap-2">
      {items.map(([id,label])=>(
        <button key={id} className={`btn ${tab===id?'btn-primary text-white':''}`} onClick={()=>setTab(id)}>{label}</button>
      ))}
    </nav>
  );
}
