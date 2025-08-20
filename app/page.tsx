"use client";
import { useEffect, useMemo, useState } from "react";
import Header from "@/components/ui/Header";
import Kpis from "@/components/ui/Kpis";
import TabsNav from "@/components/ui/TabsNav";
import SemanaSection from "@/components/ui/SemanaSection";
import TiendasSection from "@/components/ui/TiendasSection";
import EmpleadosSection from "@/components/ui/EmpleadosSection";
import VentasSection from "@/components/ui/VentasSection";
import AsistenciaSection from "@/components/ui/AsistenciaSection";
import FaltantesSection from "@/components/ui/FaltantesSection";
import { Tienda, Empleado, Venta, Asistencia, TiendasTam } from "@/lib/types";

export default function Page(){
  // estado principal
  const [tiendas, setTiendas] = useState<Tienda[]>([]);
  const [empleados, setEmpleados] = useState<Empleado[]>([]);
  const [ventas, setVentas] = useState<Venta[]>([]);
  const [asistencias, setAsistencias] = useState<Asistencia[]>([]);
  const [semana, setSemana] = useState<{id:number; inicio:string; fin:string} | null>(null);
  const [nextId, setNextId] = useState(1);
  const [tab, setTab] = useState("semana");

  // cargar/guardar localStorage
  useEffect(()=>{ const g=(k:string)=>{try{return JSON.parse(localStorage.getItem(k)||"null")}catch{return null}};
    setTiendas(g("tiendas")||[]); setEmpleados(g("empleados")||[]); setVentas(g("ventas")||[]);
    setAsistencias(g("asistencias")||[]); setSemana(g("semana")); setNextId(g("nextId")||1);
  },[]);
  useEffect(()=>{ localStorage.setItem("tiendas",JSON.stringify(tiendas)) },[tiendas]);
  useEffect(()=>{ localStorage.setItem("empleados",JSON.stringify(empleados)) },[empleados]);
  useEffect(()=>{ localStorage.setItem("ventas",JSON.stringify(ventas)) },[ventas]);
  useEffect(()=>{ localStorage.setItem("asistencias",JSON.stringify(asistencias)) },[asistencias]);
  useEffect(()=>{ localStorage.setItem("semana",JSON.stringify(semana)) },[semana]);
  useEffect(()=>{ localStorage.setItem("nextId",JSON.stringify(nextId)) },[nextId]);

  // helpers
  const addTienda=(nombre:string, tamano:TiendasTam)=>{ const id=nextId; setNextId(id+1); setTiendas([...tiendas,{id,nombre,tamano}]) };
  const removeTienda=(id:number)=> setTiendas(tiendas.filter(t=>t.id!==id));
  const addEmpleado=(n:string, rol:'Encargado'|'Auxiliar', s:number, t:number)=>{ const id=nextId; setNextId(id+1); setEmpleados([...empleados,{id:n? id: id, nombre:n, rol, sueldo_semanal:s, tienda_base_id:t}]) };
  const removeEmpleado=(id:number)=> setEmpleados(empleados.filter(e=>e.id!==id));
  const addVenta=(tienda_id:number, venta:number, gastos:number)=>{ if(!semana) return alert("Crea la semana"); setVentas([...ventas,{tienda_id, venta, gastos, semana_id:semana.id}]) };
  const setAsis=(empleado_id:number, dias:number)=>{ if(!semana) return alert("Crea la semana"); const wk=semana.id;
    const rest=asistencias.filter(a=>!(a.empleado_id===empleado_id&&a.semana_id===wk));
    setAsistencias([...rest,{empleado_id, semana_id:wk, dias_trabajados:dias}]) };
  const clearAll=()=>{ if(confirm("¿Borrar todo del navegador?")){ localStorage.clear(); location.reload(); } };

  // cálculo
  const resumen = useMemo(()=>{
    if(!semana) return [];
    const disp = new Map<number,number>(); tiendas.forEach(t=>disp.set(t.id,0));
    ventas.filter(v=>v.semana_id===semana.id).forEach(v=>disp.set(v.tienda_id,(disp.get(v.tienda_id)||0)+(v.venta-v.gastos)));
    const nec = new Map<number,number>();
    empleados.forEach(e=>{
      const a = asistencias.find(a=>a.empleado_id===e.id && a.semana_id===semana.id);
      const dias = a ? Math.max(0, Math.min(7, a.dias_trabajados)) : 6; // default 6
      const pago = dias * (e.sueldo_semanal/6);
      nec.set(e.tienda_base_id, (nec.get(e.tienda_base_id)||0) + pago);
    });
    return tiendas.map(t=>({ tienda_id:t.id, tienda:t.nombre, disponible:disp.get(t.id)||0, necesario:nec.get(t.id)||0, faltante:Math.max(0,(nec.get(t.id)||0)-(disp.get(t.id)||0)) }));
  },[tiendas,empleados,ventas,asistencias,semana]);

  const kpis = useMemo(()=>({
    tiendas: resumen.length,
    disponible: resumen.reduce((a,b)=>a+b.disponible,0),
    faltante: resumen.reduce((a,b)=>a+b.faltante,0),
  }),[resumen]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-6">
      <Header onClear={clearAll}/>
      <Kpis semanaTxt={semana?`${semana.inicio} → ${semana.fin}`:''} tiendas={kpis.tiendas} disponible={kpis.disponible} faltante={kpis.faltante}/>
      <TabsNav tab={tab} setTab={setTab}/>

      {tab==="semana"     && <SemanaSection semana={semana} setSemana={s=>setSemana(s)} />}
      {tab==="tiendas"    && <TiendasSection tiendas={tiendas} addTienda={addTienda} remove={removeTienda} />}
      {tab==="empleados"  && <EmpleadosSection empleados={empleados} tiendas={tiendas} addEmpleado={addEmpleado} remove={removeEmpleado} />}
      {tab==="ventas"     && <VentasSection tiendas={tiendas} ventas={ventas} addVenta={addVenta} />}
      {tab==="asistencia" && <AsistenciaSection empleados={empleados} asistencias={asistencias} semanaId={semana?.id||1} tiendas={tiendas} setAsis={setAsis} />}
      {tab==="faltantes"  && <FaltantesSection rows={resumen} />}
    </div>
  );
}
