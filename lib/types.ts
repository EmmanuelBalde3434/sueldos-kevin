export type TiendasTam = 'grande' | 'mediana' | 'pequena';
export type Tienda = { id:number; nombre:string; tamano:TiendasTam };
export type Empleado = { id:number; nombre:string; rol:'Encargado'|'Auxiliar'; sueldo_semanal:number; tienda_base_id:number };
export type Venta = { tienda_id:number; semana_id:number; venta:number; gastos:number };
export type Asistencia = { empleado_id:number; semana_id:number; dias_trabajados:number };
