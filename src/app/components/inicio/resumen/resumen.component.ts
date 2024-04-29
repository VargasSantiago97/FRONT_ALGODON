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
import { Campana } from '../../../interfaces/campanas.interface';


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
    datosRetirosTotales: any = []

    datosRetiradoresPorSocio: any = []

    campanas: Campana[] = []
    campana!: Campana

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
                this.getCampanas()
            },
            (err: any) => {
                console.error(err)
            }
        )
    }
    getCampanas() {
        this.cs.apiGet('campanas').subscribe(
            (res: any) => {
                this.campanas = res.data
                this.campana = this.campanas.find((e:any) => { return e._id == localStorage.getItem('campana_seleccioanda') }) || {_id: '', descripcion: ''}

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
                this.remitos = res.data.filter((e:Remito) => { return e.campana._id == this.campana._id})
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

        var totalesPorProduccion = datos.reduce((result: any, item: any) => {
            if(!result[item.produccion]){
                result[item.produccion] = {
                    cantidad: 0,
                    neto: 0,
                    fibra: 0
                }
            }

            result[item.produccion].cantidad += item.cantidad
            result[item.produccion].neto += item.neto
            result[item.produccion].fibra += item.fibra

            return result
        }, {})


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


            //suma por retirador
            datosRetirador.neto_corresponde = totalesPorProduccion[item.produccion].neto*porcentajePorRetirador;
            datosRetirador.neto_retiros += item.neto;
            datosRetirador.neto_saldo = (totalesPorProduccion[item.produccion].neto*porcentajePorRetirador - datosRetirador.neto_retiros);

            datosRetirador.fibra_corresponde = totalesPorProduccion[item.produccion].fibra*porcentajePorRetirador;
            datosRetirador.fibra_retiros += item.fibra;
            datosRetirador.fibra_saldo = (totalesPorProduccion[item.produccion].fibra*porcentajePorRetirador - datosRetirador.fibra_retiros);

            datosRetirador.rollos_corresponde = totalesPorProduccion[item.produccion].cantidad*porcentajePorRetirador;
            datosRetirador.rollos_retiros += item.cantidad;
            datosRetirador.rollos_saldo = (totalesPorProduccion[item.produccion].cantidad*porcentajePorRetirador - datosRetirador.rollos_retiros);

            //suma a totales
            datosProduccion.neto_corresponde = totalesPorProduccion[item.produccion].neto;
            datosProduccion.neto_retiros += item.neto;
            datosProduccion.neto_saldo = (totalesPorProduccion[item.produccion].neto - datosProduccion.neto_retiros);

            datosProduccion.fibra_corresponde = totalesPorProduccion[item.produccion].fibra;
            datosProduccion.fibra_retiros += item.fibra;
            datosProduccion.fibra_saldo = (totalesPorProduccion[item.produccion].fibra - datosProduccion.fibra_retiros);

            datosProduccion.rollos_corresponde = totalesPorProduccion[item.produccion].cantidad;
            datosProduccion.rollos_retiros += item.cantidad;
            datosProduccion.rollos_saldo = (totalesPorProduccion[item.produccion].cantidad - datosProduccion.rollos_retiros);

            return result;
        }, [])

        this.calcularRetirosTotales()
    }
    calcularRetirosTotales(){
        console.log(this.datosRetiros)

        this.datosRetirosTotales = {
            fibra_corresponde : 0,
            fibra_retiros : 0,
            fibra_saldo : 0,

            neto_corresponde : 0,
            neto_retiros : 0,
            neto_saldo : 0,

            rollos_corresponde : 0,
            rollos_retiros : 0,
            rollos_saldo : 0,

            retiradores : [],
        }

        this.datosRetiros.forEach((e:any) => {
            this.datosRetirosTotales.fibra_corresponde += e.fibra_corresponde
            this.datosRetirosTotales.fibra_retiros += e.fibra_retiros
            this.datosRetirosTotales.fibra_saldo += e.fibra_saldo
            this.datosRetirosTotales.neto_corresponde += e.neto_corresponde
            this.datosRetirosTotales.neto_retiros += e.neto_retiros
            this.datosRetirosTotales.neto_saldo += e.neto_saldo
            this.datosRetirosTotales.rollos_corresponde += e.rollos_corresponde
            this.datosRetirosTotales.rollos_retiros += e.rollos_retiros
            this.datosRetirosTotales.rollos_saldo += e.rollos_saldo

            e.retiradores.forEach((ret:any) => {
                if(!this.datosRetirosTotales.retiradores.some((reti:any) => { return reti.retira == ret.retira })){
                    this.datosRetirosTotales.retiradores.push({
                        retira: ret.retira,

                        fibra_corresponde: 0,
                        fibra_retiros: 0,
                        fibra_saldo: 0,

                        neto_corresponde: 0,
                        neto_retiros: 0,
                        neto_saldo: 0,

                        rollos_corresponde: 0,
                        rollos_retiros: 0,
                        rollos_saldo: 0,
                    })
                }

                var retirad = this.datosRetirosTotales.retiradores.find((retirador:any) => { return retirador.retira == ret.retira })
                retirad.fibra_corresponde += ret.fibra_corresponde
                retirad.fibra_retiros += ret.fibra_retiros
                retirad.fibra_saldo += ret.fibra_saldo

                retirad.neto_corresponde += ret.neto_corresponde
                retirad.neto_retiros += ret.neto_retiros
                retirad.neto_saldo += ret.neto_saldo

                retirad.rollos_corresponde += ret.rollos_corresponde
                retirad.rollos_retiros += ret.rollos_retiros
                retirad.rollos_saldo += ret.rollos_saldo
            });
        });
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
