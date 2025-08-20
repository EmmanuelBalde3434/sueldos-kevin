"use client";
import { useEffect, useMemo, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button, PrimaryButton } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Building2, CalendarDays, Coins, TrendingDown, Plus, Trash2 } from "lucide-react";

type Tienda = { id:number; nombre:string; tamano:'grande'|'mediana'|'pequena' };
type Empleado = { id:number; nombre:string; rol:string; sueldo_semanal:number; tienda_base_id:number };
type Venta = { tienda_id:number; semana_id:number; venta:number; gastos:number };
type Asistencia = { empleado_id:number; semana_id:number; dias_trabajados:number };

function pesos(n:number){ return `$${n.toFixed(2)}`; }

export default function Page(){
  // --- storage ---
  const [tiendas, setTiendas] = useState<Tienda[]>([]);
  const [empleados, setEmpleados] = useState<Empleado[]>([]);
  const [ventas, setVentas] = useState<Venta[]>([]);
  const [asistencias, setAsistencias] = useState<Asistencia[]>([]);
  const [semana, setSemana] = useState<{id:number; inicio:string; fin:string} | null>(null);
  const [nextId, setNextId] = useState(1);

  // init from localStorage
  useEffect(()=>{
    const get = (k:string)=>{ try{ return JSON.parse(localStorage.getItem(k)||"null"); }catch{ return null; } };
    setTiendas(get("tiendas")||[]);
    setEmpleados(get("empleados")||[]);
    setVentas(get("ventas")||[]);
    setAsistencias(get("asistencias")||[]);
    setSemana(get("semana"));
    setNextId(get("nextId")||1);
  }, []);

  // save to localStorage on change
  useEffect(()=>{ localStorage.setItem("tiendas", JSON.stringify(tiendas)); }, [tiendas]);
  useEffect(()=>{ localStorage.setItem("empleados", JSON.stringify(empleados)); }, [empleados]);
  useEffect(()=>{ localStorage.setItem("ventas", JSON.stringify(ventas)); }, [ventas]);
  useEffect(()=>{ localStorage.setItem("asistencias", JSON.stringify(asistencias)); }, [asistencias]);
  useEffect(()=>{ localStorage.setItem("semana", JSON.stringify(semana)); }, [semana]);
  useEffect(()=>{ localStorage.setItem("nextId", JSON.stringify(nextId)); }, [nextId]);

  // --- helpers ---
  function addTienda(nombre:string, tamano:TiendasTam){ 
    const id = nextId; setNextId(id+1);
    setTiendas([...tiendas, { id, nombre, tamano } as Tienda ]);
  }
  function addEmpleado(nombre:string, rol:string, sueldo:number, tienda:number){
    const id = nextId; setNextId(id+1);
    setEmpleados([...empleados, { id, nombre, rol, sueldo_semanal: sueldo, tienda_base_id: tienda }]);
  }
  function addVenta(tienda_id:number, venta:number, gastos:number){
    if(!semana) return alert("Crea la semana primero");
    setVentas([...ventas, { tienda_id, venta, gastos, semana_id: semana.id }]);
  }
  function setAsis(empleado_id:number, dias:number){
    if(!semana) return alert("Crea la semana primero");
    const week = semana.id;
    const rest = asistencias.filter(a => !(a.empleado_id===empleado_id && a.semana_id===week));
    setAsistencias([...rest, { empleado_id, semana_id: week, dias_trabajados: dias }]);
  }
  function clearAll(){ if(confirm("¿Borrar todo del navegador?")){ localStorage.clear(); location.reload(); }}

  // --- calculations ---
  const resumen = useMemo(()=>{
    if(!semana) return [];
    // disponible por tienda
    const dispMap = new Map<number, number>();
    for(const t of tiendas) dispMap.set(t.id, 0);
    for(const v of ventas.filter(v=>v.semana_id===semana.id)){
      dispMap.set(v.tienda_id, (dispMap.get(v.tienda_id)||0) + (v.venta - v.gastos));
    }
    // necesario por tienda (regla 6+1 -> pago = dias * (sueldo/6))
    const necMap = new Map<number, number>();
    for(const e of empleados){
      const a = asistencias.find(a=> a.empleado_id===e.id && a.semana_id===semana.id);
      const dias = a ? Math.max(0, Math.min(7, a.dias_trabajados)) : 0;
      const pago = dias * (e.sueldo_semanal/6);
      necMap.set(e.tienda_base_id, (necMap.get(e.tienda_base_id)||0) + pago);
    }
    // rows
    return tiendas.map(t => {
      const disponible = dispMap.get(t.id)||0;
      const necesario = necMap.get(t.id)||0;
      const faltante = Math.max(0, necesario - disponible);
      return { tienda_id: t.id, tienda: t.nombre, disponible, necesario, faltante };
    });
  }, [tiendas, empleados, ventas, asistencias, semana]);

  const kpis = useMemo(()=>{
    const tiendasN = resumen.length;
    const disponible = resumen.reduce((a,b)=>a+b.disponible,0);
    const faltante = resumen.reduce((a,b)=>a+b.faltante,0);
    return { tiendas: tiendasN, disponible, faltante };
  }, [resumen]);

  // UI state
  const [tab, setTab] = useState<"semana"|"tiendas"|"empleados"|"ventas"|"asistencia"|"faltantes">("semana");

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-6">
      {/* Header */}
      <header className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-brand-600 text-white grid place-content-center font-bold">FD</div>
          <div>
            <h1 className="text-xl font-semibold">Faltantes del Domingo</h1>
            <p className="text-xs text-zinc-500">LocalStorage • Semana 6+1</p>
          </div>
        </div>
        <Button onClick={clearAll}>Borrar todo</Button>
      </header>

      {/* KPIs */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card><div className="label">Semana</div><div className="kpi flex items-center gap-2"><CalendarDays className="w-5 h-5"/>{semana ? `${semana.inicio} → ${semana.fin}` : "—"}</div></Card>
        <Card><div className="label">Tiendas</div><div className="kpi flex items-center gap-2"><Building2 className="w-5 h-5"/>{kpis.tiendas}</div></Card>
        <Card><div className="label">Disponible total</div><div className="kpi flex items-center gap-2"><Coins className="w-5 h-5"/>${kpis.disponible.toFixed(2)}</div></Card>
        <Card><div className="label">Faltante total</div><div className="kpi flex items-center gap-2 text-rose-600"><TrendingDown className="w-5 h-5"/>${kpis.faltante.toFixed(2)}</div></Card>
      </div>

      {/* Tabs */}
      <nav className="flex flex-wrap gap-2">
        {[
          ["semana","Semana"],
          ["tiendas","Tiendas"],
          ["empleados","Empleados"],
          ["ventas","Ventas/Gastos"],
          ["asistencia","Asistencia"],
          ["faltantes","Faltantes"],
        ].map(([id,label])=> (
          <button key={id} className={`btn ${tab===id? 'btn-primary text-white':''}`} onClick={()=>setTab(id as any)}>{label}</button>
        ))}
      </nav>

      {/* Content */}
      {tab==="semana" && (
        <Card>
          <div className="grid md:grid-cols-3 gap-3 items-end">
            <div>
              <div className="label">Inicio (Lunes)</div>
              <Input type="date" value={semana?.inicio||''} onChange={e=>setSemana({id:1,inicio:e.target.value, fin: semana?.fin||e.target.value})} />
            </div>
            <div>
              <div className="label">Fin (Domingo)</div>
              <Input type="date" value={semana?.fin||''} onChange={e=>setSemana({id:1,inicio:semana?.inicio||e.target.value, fin:e.target.value})} />
            </div>
            {!semana && <PrimaryButton onClick={()=>setSemana({id:1,inicio:new Date().toISOString().slice(0,10), fin:new Date().toISOString().slice(0,10)})}>Crear semana</PrimaryButton>}
          </div>
        </Card>
      )}

      {tab==="tiendas" && (
        <Card>
          <div className="label mb-2">Agregar tienda</div>
          <div className="grid md:grid-cols-4 gap-2 items-end">
            <Input placeholder="Nombre" id="t-nombre" />
            <select id="t-tamano" className="input">
              <option value="grande">Grande</option>
              <option value="mediana">Mediana</option>
              <option value="pequena">Pequeña</option>
            </select>
            <PrimaryButton onClick={()=>{
              const n=(document.getElementById('t-nombre') as HTMLInputElement).value.trim();
              const tam=(document.getElementById('t-tamano') as HTMLSelectElement).value as any;
              if(!n) return alert('Pon un nombre');
              addTienda(n, tam);
              (document.getElementById('t-nombre') as HTMLInputElement).value='';
            }}><Plus className="w-4 h-4"/>Agregar</PrimaryButton>
          </div>

          <table className="mt-4">
            <thead><tr><th>ID</th><th>Nombre</th><th>Tamaño</th><th></th></tr></thead>
            <tbody>
              {tiendas.map(t=> (
                <tr key={t.id} className="border-t border-zinc-200/70 dark:border-zinc-800">
                  <td>{t.id}</td><td>{t.nombre}</td><td>{t.tamano}</td>
                  <td><button className="btn" onClick={()=>setTiendas(tiendas.filter(x=>x.id!==t.id))}><Trash2 className="w-4 h-4"/></button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      )}

      {tab==="empleados" && (
        <Card>
          <div className="label mb-2">Agregar empleado</div>
          <div className="grid md:grid-cols-5 gap-2 items-end">
            <Input placeholder="Nombre" id="e-nombre" />
            <Input placeholder="Rol" id="e-rol" />
            <Input placeholder="Sueldo semanal (6d)" id="e-sueldo" type="number" />
            <select id="e-tienda" className="input">
              {tiendas.map(t=> <option key={t.id} value={t.id}>{t.nombre}</option>)}
            </select>
            <PrimaryButton onClick={()=>{
              const n=(document.getElementById('e-nombre') as HTMLInputElement).value.trim();
              const r=(document.getElementById('e-rol') as HTMLInputElement).value.trim();
              const s=Number((document.getElementById('e-sueldo') as HTMLInputElement).value);
              const t=Number((document.getElementById('e-tienda') as HTMLSelectElement).value);
              if(!n||!r||!s||!t) return alert('Completa todos los campos');
              addEmpleado(n,r,s,t);
              (document.getElementById('e-nombre') as HTMLInputElement).value='';
              (document.getElementById('e-rol') as HTMLInputElement).value='';
              (document.getElementById('e-sueldo') as HTMLInputElement).value='';
            }}><Plus className="w-4 h-4"/>Agregar</PrimaryButton>
          </div>

          <table className="mt-4">
            <thead><tr><th>ID</th><th>Nombre</th><th>Rol</th><th>Sueldo (6d)</th><th>Tienda</th><th></th></tr></thead>
            <tbody>
              {empleados.map(e=> (
                <tr key={e.id} className="border-t border-zinc-200/70 dark:border-zinc-800">
                  <td>{e.id}</td><td>{e.nombre}</td><td>{e.rol}</td><td>{pesos(e.sueldo_semanal)}</td>
                  <td>{tiendas.find(t=>t.id===e.tienda_base_id)?.nombre||e.tienda_base_id}</td>
                  <td><button className="btn" onClick={()=>setEmpleados(empleados.filter(x=>x.id!==e.id))}><Trash2 className="w-4 h-4"/></button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      )}

      {tab==="ventas" && (
        <Card>
          <div className="label mb-2">Capturar venta/gastos del domingo</div>
          <div className="grid md:grid-cols-5 gap-2 items-end">
            <select id="v-tienda" className="input">{tiendas.map(t=> <option key={t.id} value={t.id}>{t.nombre}</option>)}</select>
            <Input placeholder="Venta" id="v-venta" type="number" />
            <Input placeholder="Gastos" id="v-gastos" type="number" />
            <PrimaryButton onClick={()=>{
              const t=Number((document.getElementById('v-tienda') as HTMLSelectElement).value);
              const v=Number((document.getElementById('v-venta') as HTMLInputElement).value||0);
              const g=Number((document.getElementById('v-gastos') as HTMLInputElement).value||0);
              addVenta(t,v,g);
              (document.getElementById('v-venta') as HTMLInputElement).value='';
              (document.getElementById('v-gastos') as HTMLInputElement).value='';
            }}><Plus className="w-4 h-4"/>Agregar</PrimaryButton>
          </div>

          <table className="mt-4">
            <thead><tr><th>Tienda</th><th>Venta</th><th>Gastos</th><th>Disponible</th></tr></thead>
            <tbody>
              {ventas.map((r,i)=>{
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
      )}

      {tab==="asistencia" && (
        <Card>
          <div className="label mb-2">Días trabajados (0–7)</div>
          <table>
            <thead><tr><th>Empleado</th><th>Tienda</th><th>Sueldo (6d)</th><th>Días</th></tr></thead>
            <tbody>
              {empleados.map(e=>{
                const a = asistencias.find(a=> a.empleado_id===e.id && a.semana_id===(semana?.id||1));
                return (
                  <tr key={e.id} className="border-t border-zinc-200/70 dark:border-zinc-800">
                    <td>{e.nombre}</td>
                    <td>{tiendas.find(t=>t.id===e.tienda_base_id)?.nombre||e.tienda_base_id}</td>
                    <td>{pesos(e.sueldo_semanal)}</td>
                    <td>
                      <Input type="number" min={0} max={7} defaultValue={a?.dias_trabajados||0} onChange={ev=>setAsis(e.id, Math.max(0, Math.min(7, Number(ev.target.value))))} className="w-20" />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </Card>
      )}

      {tab==="faltantes" && (
        <Card>
          <table>
            <thead><tr><th>ID</th><th>Tienda</th><th>Disponible</th><th>Necesario</th><th>Faltante</th></tr></thead>
            <tbody>
              {resumen.map(x=>{
                const ok = x.faltante<=0;
                return (
                  <tr key={x.tienda_id} className="border-t border-zinc-200/70 dark:border-zinc-800">
                    <td>{x.tienda_id}</td>
                    <td>{x.tienda}</td>
                    <td>{pesos(x.disponible)}</td>
                    <td>{pesos(x.necesario)}</td>
                    <td><span className={`badge ${ok? 'text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40':'text-rose-600 bg-rose-50 dark:bg-rose-950/40'}`}><b>{pesos(x.faltante)}</b></span></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </Card>
      )}
    </div>
  );
}

// Type helper
type TiendasTam = 'grande' | 'mediana' | 'pequena';
