import { Socio } from "./socios.interface";
import { Campana } from "./campanas.interface";
import { Establecimiento } from "./establecimientos.interface";
import { Destino } from "./destinos.interface";
import { Transporte } from "./transportes.interface";
import { Articulo } from "./articulos.interface";

/** SOCIEDADES */
export interface Remitos {
    _id: string;
    socio: Socio;
    campana: Campana;
    punto_venta: number;
    numero_remito: number;
    fecha: Date;
    origen: Establecimiento;
    destino: Destino;
    transporte: Transporte;
    observaciones: string;
    articulos: Articulo;
    cantidad: number;
    kg_origen_bruto: number;
    kg_origen_tara: number;
    kg_origen_neto: number;
    kg_destino_bruto: number;
    kg_destino_tara: number;
    kg_destino_neto: number;
    kg_fibra: number;
    kg_semilla: number;
    rendimiento: number;
    romaneo: string;
    parte: string;
    recibo: string;
}