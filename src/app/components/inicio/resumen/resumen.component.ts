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

    datosRindes: any = []
    datosRetiros: any = []
    datosRetiradoresPorSocio: any = []

    constructor(
        private cs: ComunicacionService
    ) { }

    ngOnInit() {
        this.getEstablecimientos()
    }

    getEstablecimientos() {
        this.cs.apiGet('establecimientos').subscribe(
            (res: any) => {
                res.data.forEach((establecimiento: any) => {
                    this.establecimientos[establecimiento._id] = establecimiento
                })
                this.getSociedades()
            },
            (err: any) => {
                console.error(err)
            }
        )
    }
    getSociedades() {
        this.cs.apiGet('sociedades').subscribe(
            (res: any) => {
                res.data.forEach((sociedad: any) => {
                    this.sociedades[sociedad._id] = sociedad
                })
                this.getGrupoRetiros()
            },
            (err: any) => {
                console.error(err)
            }
        )
    }
    getGrupoRetiros() {
        this.cs.apiGet('grupo_retiros').subscribe(
            (res: any) => {
                res.data.forEach((grupo_retiro: any) => {
                    this.grupo_retiros[grupo_retiro._id] = grupo_retiro

                    grupo_retiro.socios.forEach((socio: any) => {
                        this.datosRetiradoresPorSocio[socio.id] = grupo_retiro._id
                    });
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

    calcularRindes() {
        var datos = this.remitos.map((e: Remito) => {
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

        this.datosRindes = datos.reduce((result: any, item: any) => {

            if (!result.some((e: any) => { return e.produccion == item.produccion })) {
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
            var datosProduccion = result.find((e: any) => { return e.produccion == item.produccion })

            if (!datosProduccion.establecimientos.some((e: any) => { return e.establecimiento == item.establecimiento })) {
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
            var datosEstablecimiento = datosProduccion.establecimientos.find((e: any) => { return e.establecimiento == item.establecimiento })

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
    calcularRetiros() {
        var datos = this.remitos.map((e: Remito) => {
            var dato = {
                produccion: e.origen.id_sociedad,
                retira: this.datosRetiradoresPorSocio[e.socio._id],

                cantidad: e.cantidad,
                neto: e.kg_destino_neto,
                fibra: e.kg_fibra,
            }
            return dato
        })

        this.datosRetiros = [
            {
                produccion: '662b0030386e826755f3eb0b',//id sociedad
                retiradores: [
                    {
                        retira: '662b181db7404d8ab0405b9e',//id establecimiento
                        porcentaje: 50,

                        neto_corresponde: 2,
                        neto_retiros: 3,
                        neto_saldo: 4,
                        fibra_corresponde: 5,
                        fibra_retiros: 6,
                        fibra_saldo: 7,
                        rollos_corresponde: 8,
                        rollos_retiros: 9,
                        rollos_saldo: 10,
                    },
                    {
                        retira: '662b1828b7404d8ab0405ba5',//id establecimiento
                        porcentaje: 50,

                        neto_corresponde: 2,
                        neto_retiros: 3,
                        neto_saldo: 4,
                        fibra_corresponde: 5,
                        fibra_retiros: 6,
                        fibra_saldo: 7,
                        rollos_corresponde: 8,
                        rollos_retiros: 9,
                        rollos_saldo: 10,
                    },
                ],
                porcentaje: 100,
                neto_corresponde: 2,
                neto_retiros: 3,
                neto_saldo: 4,
                fibra_corresponde: 5,
                fibra_retiros: 6,
                fibra_saldo: 7,
                rollos_corresponde: 8,
                rollos_retiros: 9,
                rollos_saldo: 10,

            }
        ]

        this.datosRetiros = datos.reduce((result: any, item: any) => {

            if (!result.some((e: any) => { return e.produccion == item.produccion })) {
                result.push({
                    produccion: item.produccion,
                    retiradores: [],
                    porcentaje: 100,
                    neto_corresponde: 0,
                    neto_retiros: 0,
                    neto_saldo: 0,
                    fibra_corresponde: 0,
                    fibra_retiros: 0,
                    fibra_saldo: 0,
                    rollos_corresponde: 0,
                    rollos_retiros: 0,
                    rollos_saldo: 0
                })
            }
            var datosProduccion = result.find((e: any) => { return e.produccion == item.produccion })

            if (!datosProduccion.retiradores.some((e: any) => { return e.retira == item.retira })) {
                datosProduccion.retiradores.push({
                    retira: item.retira,
                    porcentaje: this.porcentajeDeRetiradorEnSociedad(item.retira, item.produccion),
                    neto_corresponde: 0,
                    neto_retiros: 0,
                    neto_saldo: 0,
                    fibra_corresponde: 0,
                    fibra_retiros: 0,
                    fibra_saldo: 0,
                    rollos_corresponde: 0,
                    rollos_retiros: 0,
                    rollos_saldo: 0
                })
            }

            var datosRetirador = datosProduccion.retiradores.find((e: any) => { return e.retira == item.retira })

            var porcentajePorRetirador = datosRetirador.porcentaje/100

            //datosProduccion.cantidad += item.cantidad;
            //datosProduccion.neto += item.neto;
            //datosProduccion.fibra += item.fibra;
            //datosProduccion.semilla += item.semilla;

            //datosProduccion.rinde = datosProduccion.neto / datosProduccion.ha





            datosRetirador.neto_corresponde += item.neto*porcentajePorRetirador;
            datosRetirador.neto_retiros += item.neto;
            datosRetirador.neto_saldo += (item.neto*porcentajePorRetirador - item.neto);

            datosRetirador.fibra_corresponde += item.fibra*porcentajePorRetirador;
            datosRetirador.fibra_retiros += item.fibra;
            datosRetirador.fibra_saldo += (item.fibra*porcentajePorRetirador - item.fibra);

            datosRetirador.rollos_corresponde += item.cantidad*porcentajePorRetirador;
            datosRetirador.rollos_retiros += item.cantidad;
            datosRetirador.rollos_saldo += (item.cantidad*porcentajePorRetirador - item.cantidad);


            return result;
        }, [])

        console.log(this.datosRetiros)

    }
    porcentajeDeRetiradorEnSociedad(id_retirador:string, id_sociedad:string){
        var porcentaje = 0
        this.grupo_retiros[id_retirador].socios.forEach((socio:any) => {
            //por cada socio del grupo de retiradores:
            if(this.sociedades[id_sociedad].socios.some((soc:any) => { return soc.id == socio.id })){

                var socioEncontrado = this.sociedades[id_sociedad].socios.find((soc:any) => { return soc.id == socio.id })
                porcentaje += socioEncontrado.porcentaje
            }

            socio.id
        });
        return porcentaje
    }

    toNumero(numero: any, decimales: number = 0) {
        if (!numero) return '-'
        return numero.toLocaleString('es-ES', {
            minimumFractionDigits: decimales,
            maximumFractionDigits: 2
        });
    }
}
