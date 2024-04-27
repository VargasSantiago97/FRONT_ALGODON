import { Component } from '@angular/core';
import { ComunicacionService } from '../../../services/comunicacion/comunicacion.service';
import { FormsModule } from '@angular/forms';

import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { ListboxModule } from 'primeng/listbox';
import { MultiSelectModule } from 'primeng/multiselect';
import { Socio } from '../../../interfaces/socios.interface';
import { DialogModule } from 'primeng/dialog';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { DropdownModule } from 'primeng/dropdown';
import { DividerModule } from 'primeng/divider';
import { Remito } from '../../../interfaces/remitos.interface';
import { CalendarModule } from 'primeng/calendar';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';


@Component({
    selector: 'app-resumen',
    standalone: true,
    imports: [TableModule, ButtonModule, ListboxModule, MultiSelectModule, FormsModule, DialogModule, ToastModule, DropdownModule, DividerModule, CalendarModule, InputTextModule, InputTextareaModule],
    providers: [MessageService],
    templateUrl: './resumen.component.html',
    styleUrl: './resumen.component.css'
})
export class ResumenComponent {

    remitos: Remito[] = []
    establecimientos: any = {}
    sociedades: any = {}
    grupo_retiros: any = {}

    datosRindes: any

    constructor(
        private cs: ComunicacionService
    ) { }

    ngOnInit() {
        this.getEstablecimientos()
    }

    getEstablecimientos(){
        this.cs.apiGet('establecimientos').subscribe(
            (res: any) => {
                res.data.forEach((establecimiento:any) => {
                    this.establecimientos[establecimiento._id] = establecimiento
                })
                console.log(this.establecimientos)
                this.getSociedades()
            },
            (err: any) => {
                console.error(err)
            }
        )
    }
    getSociedades(){
        this.cs.apiGet('sociedades').subscribe(
            (res: any) => {
                res.data.forEach((sociedad:any) => {
                    this.sociedades[sociedad._id] = sociedad
                })
                this.getGrupoRetiros()
            },
            (err: any) => {
                console.error(err)
            }
        )
    }
    getGrupoRetiros(){
        this.cs.apiGet('grupo_retiros').subscribe(
            (res: any) => {
                res.data.forEach((grupo_retiro:any) => {
                    this.grupo_retiros[grupo_retiro._id] = grupo_retiro
                })
                this.getRemitos()
            },
            (err: any) => {
                console.error(err)
            }
        )
    }

    getRemitos() {
        this.remitos = []
        this.cs.apiGet('remitos').subscribe(
            (res: any) => {
                this.remitos = res.data
                this.calcularRindes()
            },
            (err: any) => {
                console.error(err)
            }
        )
    }

    calcularRindes(){
        var datos = this.remitos.map((e:Remito) => {
            var dato = {
                produccion: e.origen.id_sociedad,
                establecimiento: e.origen._id,
                cantidad: e.cantidad,
                neto: e.kg_destino_neto,
                fibra: e.kg_fibra,
                semilla: e.kg_semilla,
            }
            return dato
        })

        this.datosRindes = datos.reduce((result:any, item:any) => {

            if(!result.some((e:any) => { return e.produccion == item.produccion })){
                result.push({
                    produccion: item.produccion,
                    establecimientos: [],
                    cantidad: 0,
                    ha: 0,
                    neto: 0,
                    fibra: 0,
                    semilla: 0,
                    rinde: 0
                })
            }
            var datosProduccion = result.find((e:any) => { return e.produccion == item.produccion })

            if(!datosProduccion.establecimientos.some((e:any) => { return e.establecimiento == item.establecimiento })){
                datosProduccion.establecimientos.push({
                    establecimiento: item.establecimiento,
                    cantidad: 0,
                    ha: this.establecimientos[item.establecimiento].hectareas,
                    neto: 0,
                    fibra: 0,
                    semilla: 0,
                    rinde: 0
                })
                datosProduccion.ha += this.establecimientos[item.establecimiento].hectareas;
            }
            var datosEstablecimiento = datosProduccion.establecimientos.find((e:any) => { return e.establecimiento == item.establecimiento })

            datosProduccion.cantidad += item.cantidad;
            datosProduccion.neto += item.neto;
            datosProduccion.fibra += item.fibra;
            datosProduccion.semilla += item.semilla;

            datosProduccion.rinde = datosProduccion.neto / datosProduccion.ha


            datosEstablecimiento.cantidad += item.cantidad;
            datosEstablecimiento.neto += item.neto;
            datosEstablecimiento.fibra += item.fibra;
            datosEstablecimiento.semilla += item.semilla;

            datosEstablecimiento.rinde = datosEstablecimiento.neto / this.establecimientos[datosEstablecimiento.establecimiento].hectareas

            return result;
        }, []);

        this.calcularRetiros()
    }
    calcularRetiros(){
        var datos = this.remitos.map((e:Remito) => {
            var dato = {
                produccion: e.origen.id_sociedad,
                socio: e.socio._id,
                establecimiento: e.origen._id,
                cantidad: e.cantidad,
                neto: e.kg_destino_neto,
                fibra: e.kg_fibra,
                semilla: e.kg_semilla,
            }
            return dato
        })

        var datosRindes = datos.reduce((result:any, item:any) => {

            if(!result.some((e:any) => { return e.produccion == item.produccion })){
                result.push({
                    produccion: item.produccion,
                    establecimientos: [],
                    cantidad: 0,
                    ha: 0,
                    neto: 0,
                    fibra: 0,
                    semilla: 0,
                    rinde: 0
                })
            }
            var datosProduccion = result.find((e:any) => { return e.produccion == item.produccion })

            if(!datosProduccion.establecimientos.some((e:any) => { return e.establecimiento == item.establecimiento })){
                datosProduccion.establecimientos.push({
                    establecimiento: item.establecimiento,
                    cantidad: 0,
                    ha: this.establecimientos[item.establecimiento].hectareas,
                    neto: 0,
                    fibra: 0,
                    semilla: 0,
                    rinde: 0
                })
                datosProduccion.ha += this.establecimientos[item.establecimiento].hectareas;
            }
            var datosEstablecimiento = datosProduccion.establecimientos.find((e:any) => { return e.establecimiento == item.establecimiento })

            datosProduccion.cantidad += item.cantidad;
            datosProduccion.neto += item.neto;
            datosProduccion.fibra += item.fibra;
            datosProduccion.semilla += item.semilla;

            datosProduccion.rinde = datosProduccion.neto / datosProduccion.ha


            datosEstablecimiento.cantidad += item.cantidad;
            datosEstablecimiento.neto += item.neto;
            datosEstablecimiento.fibra += item.fibra;
            datosEstablecimiento.semilla += item.semilla;

            datosEstablecimiento.rinde = datosEstablecimiento.neto / this.establecimientos[datosEstablecimiento.establecimiento].hectareas

            return result;
        }, []);
    }

    toNumero(numero:any, decimales: number = 0){
        return numero.toLocaleString('es-ES', {
            minimumFractionDigits: decimales,
            maximumFractionDigits: 2
        });
    }
}
