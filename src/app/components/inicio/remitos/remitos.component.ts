import { Component } from '@angular/core';
import { ComunicacionService } from '../../../services/comunicacion/comunicacion.service';
import { FormsModule } from '@angular/forms';

import { Table, TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { ListboxModule } from 'primeng/listbox';
import { MultiSelectModule } from 'primeng/multiselect';
import { Socio } from '../../../interfaces/socios.interface';
import { DialogModule } from 'primeng/dialog';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { DropdownModule } from 'primeng/dropdown';
import { Sociedad } from '../../../interfaces/sociedades.interface';
import { DividerModule } from 'primeng/divider';
import { Grupo_retiro } from '../../../interfaces/grupo_retiros.interface';
import { Remito } from '../../../interfaces/remitos.interface';
import { Campana } from '../../../interfaces/campanas.interface';
import { Establecimiento } from '../../../interfaces/establecimientos.interface';
import { Destino } from '../../../interfaces/destinos.interface';
import { Transporte } from '../../../interfaces/transportes.interface';
import { Articulo } from '../../../interfaces/articulos.interface';
import { CalendarModule } from 'primeng/calendar';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';

@Component({
    selector: 'app-remitos',
    standalone: true,
    imports: [TableModule, ButtonModule, ListboxModule, MultiSelectModule, FormsModule, DialogModule, ToastModule, DropdownModule, DividerModule, CalendarModule, InputTextModule, InputTextareaModule],
    providers: [MessageService],
    templateUrl: './remitos.component.html',
    styleUrl: './remitos.component.css'
})
export class RemitosComponent {
    data: any
    registrosSeleccionados: any = []

    cols: any
    selectedColumns: any

    remitos: Remito[] = []
    remito!: Remito

    socios: Socio[] = []
    campanas: Campana[] = []
    establecimientos: Establecimiento[] = []
    destinos: Destino[] = []
    transportes: Transporte[] = []
    articulos: Articulo[] = []

    visible: boolean = false;

    datosTabla: any = []

    constructor(
        private cs: ComunicacionService,
        private messageService: MessageService
    ) { }

    ngOnInit() {
        this.cols = [
            { field: 'fecha', header: 'FECHA', type: 'date' },
            { field: 'punto_venta', header: 'P.V.', type: 'numeric' },
            { field: 'numero_remito', header: 'NUMERO', type: 'numeric' },
            { field: 'cantidad', header: 'CANT.', type: 'numeric' },
            { field: 'kg_origen_bruto', header: 'Orig. BRUTO', type: 'numeric' },
            { field: 'kg_origen_tara', header: 'Orig. TARA', type: 'numeric' },
            { field: 'kg_origen_neto', header: 'Orig. NETO', type: 'numeric' },
            { field: 'kg_destino_bruto', header: 'Dest. BRUTO', type: 'numeric' },
            { field: 'kg_destino_tara', header: 'Dest. TARA', type: 'numeric' },
            { field: 'kg_destino_neto', header: 'Dest. NETO', type: 'numeric' },
            { field: 'kg_fibra', header: 'FIBRA', type: 'numeric' },
            { field: 'kg_semilla', header: 'SEMILLA', type: 'numeric' },
            { field: 'rendimiento', header: 'REND.', type: 'numeric' },
            { field: 'romaneo', header: 'ROMANEO', type: 'text' },
            { field: 'parte', header: 'PARTE', type: 'text' },
            { field: 'recibo', header: 'RECIBO', type: 'text' },
            { field: 'observaciones', header: 'OBS', type: 'text' }
        ]
        this.selectedColumns = [
            { field: 'fecha', header: 'FECHA', type: 'date' },
            { field: 'punto_venta', header: 'P.V.', type: 'numeric' },
            { field: 'numero_remito', header: 'NUMERO', type: 'numeric' },
            { field: 'cantidad', header: 'CANT.', type: 'numeric' },
            { field: 'kg_origen_bruto', header: 'Orig. BRUTO', type: 'numeric' },
            { field: 'kg_origen_tara', header: 'Orig. TARA', type: 'numeric' },
            { field: 'kg_origen_neto', header: 'Orig. NETO', type: 'numeric' },
            { field: 'kg_destino_bruto', header: 'Dest. BRUTO', type: 'numeric' },
            { field: 'kg_destino_tara', header: 'Dest. TARA', type: 'numeric' },
            { field: 'kg_destino_neto', header: 'Dest. NETO', type: 'numeric' },
            { field: 'kg_fibra', header: 'FIBRA', type: 'numeric' },
            { field: 'kg_semilla', header: 'SEMILLA', type: 'numeric' },
            { field: 'rendimiento', header: 'REND.', type: 'numeric' },
            { field: 'romaneo', header: 'ROMANEO', type: 'text' },
            { field: 'parte', header: 'PARTE', type: 'text' },
            { field: 'recibo', header: 'RECIBO', type: 'text' },
            { field: 'observaciones', header: 'OBS', type: 'text' }
        ]
        //type text, date, numeric
        this.getSocios()
    }
    getSocios() {
        this.socios = []
        this.cs.apiGet('socios').subscribe(
            (res: any) => {
                this.socios = res.data.map((e:any) => { 
                    var dat: Socio = {
                        _id: e._id,
                        razon_social: e.razon_social,
                        cuit: e.cuit,
                        fondo_remito: e.fondo_remito,
                        punto_venta: e.punto_venta
                    }
                    return dat
                })
                this.getCampanas()
            },
            (err: any) => {
                console.error(err)
            }
        )
    }
    getCampanas() {
        this.campanas = []
        this.cs.apiGet('campanas').subscribe(
            (res: any) => {
                this.campanas = res.data.map((e:any) => { 
                    var dat: Campana = {
                        _id: e._id,
                        descripcion: e.descripcion
                    }
                    return dat
                })
                this.getEstablecimientos()
            },
            (err: any) => {
                console.error(err)
            }
        )
    }
    getEstablecimientos() {
        this.establecimientos = []
        this.cs.apiGet('establecimientos').subscribe(
            (res: any) => {
                this.establecimientos = res.data.map((e:any) => { 
                    var dat: Establecimiento = {
                        _id: e._id,
                        descripcion: e.descripcion,
                        id_sociedad: e.id_sociedad,
                        id_campana: e.id_campana,
                        hectareas: e.hectareas
                    }
                    return dat
                })
                this.getDestinos()
            },
            (err: any) => {
                console.error(err)
            }
        )
    }
    getDestinos() {
        this.destinos = []
        this.cs.apiGet('destinos').subscribe(
            (res: any) => {
                this.destinos = res.data.map((e:any) => { 
                    var dat: Destino = {
                        _id: e._id,
                        razon_social: e.razon_social,
                        cuit: e.cuit,
                        condicion_iva: e.condicion_iva,
                        domicilio: e.domicilio,
                        localidad: e.localidad,
                        provincia: e.provincia,
                        telefono: e.telefono
                    }
                    return dat
                })
                this.getTransportes()
            },
            (err: any) => {
                console.error(err)
            }
        )
    }
    getTransportes() {
        this.transportes = []
        this.cs.apiGet('transportes').subscribe(
            (res: any) => {
                this.transportes = res.data.map((e:any) => { 
                    var dat: Transporte = {
                        _id: e._id,
                        razon_social: e.razon_social,
                        cuit: e.cuit,
                        domicilio: e.domicilio,
                        chofer: e.chofer,
                        patente_chasis: e.patente_chasis,
                        patente_acoplado: e.patente_acoplado
                    }
                    return dat
                })
                this.getArticulos()
            },
            (err: any) => {
                console.error(err)
            }
        )
    }
    getArticulos() {
        this.articulos = []
        this.cs.apiGet('articulos').subscribe(
            (res: any) => {
                this.articulos = res.data.map((e:any) => { 
                    var dat: Articulo = {
                        _id: e._id,
                        codigo: e.codigo,
                        unidad_medida: e.unidad_medida,
                        descripcion: e.descripcion
                    }
                    return dat
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
                this.armarDatosTabla()
            },
            (err: any) => {
                console.error(err)
            }
        )
    }

    armarDatosTabla() {
        this.datosTabla = []
        this.remitos.forEach((remito: Remito) => {
            var dato = {
                _id: remito._id,
                fecha: new Date(remito.fecha).toLocaleDateString('es-AR'),
                fecha_filtro: new Date(remito.fecha),
                punto_venta: remito.punto_venta,
                numero_remito: remito.numero_remito,
                cantidad: remito.cantidad,
                kg_origen_bruto: remito.kg_origen_bruto,
                kg_origen_tara: remito.kg_origen_tara,
                kg_origen_neto: remito.kg_origen_neto,
                kg_destino_bruto: remito.kg_destino_bruto,
                kg_destino_tara: remito.kg_destino_tara,
                kg_destino_neto: remito.kg_destino_neto,
                kg_fibra: remito.kg_fibra,
                kg_semilla: remito.kg_semilla,
                rendimiento: remito.rendimiento,
                romaneo: remito.romaneo,
                parte: remito.parte,
                recibo: remito.recibo,
                observaciones: remito.observaciones,
            }

            this.datosTabla.push(dato)
        })
    }

    pdf(idd: string, ver: string = 'v') {
        var remito = this.remitos.find((e:Remito) => { return e._id == idd })

        var data = {
            copias: ['ORIGINAL', 'DUPLICADO', 'TRIPLICADO'],
            numero: remito?.numero_remito,
            punto: remito?.punto_venta,
            fecha: new Date(remito?.fecha || 0).toLocaleDateString(),
            fondo: remito?.socio.fondo_remito,
            beneficiario_razon: remito?.destino.razon_social,
            beneficiario_cuit: remito?.destino.cuit,
            beneficiario_codigo: '-',
            beneficiario_domicilio: remito?.destino.domicilio,
            beneficiario_localidad: remito?.destino.localidad,
            beneficiario_provincia: remito?.destino.provincia,
            beneficiario_condicion_iva: remito?.destino.condicion_iva,
            beneficiario_telefono: remito?.destino.telefono,
            transporte_razon: remito?.transporte.razon_social,
            transporte_domicilio: remito?.transporte.domicilio,
            transporte_cuit: remito?.transporte.cuit,
            transporte_conductor: remito?.transporte.chofer,
            transporte_chasis: remito?.transporte.patente_chasis,
            transporte_acoplado: remito?.transporte.patente_acoplado,
            conceptos: [
                {
                    codigo: remito?.articulos.codigo,
                    cantidad: remito?.cantidad,
                    unidad: remito?.articulos.unidad_medida,
                    descripcion: remito?.articulos.descripcion,
                    origen: remito?.origen.descripcion,
                    precio: "$ -,--",
                    total: "$ -,--"
                }
            ],
            observaciones: remito?.observaciones,
        }
        this.cs.generarPDF(data).subscribe(
            (res: any) => {
                if (ver == 'v') {
                    const file = new Blob([res], { type: 'application/pdf' });
                    const fileURL = URL.createObjectURL(file);
                    window.open(fileURL);
                } else {
                    // Crear un objeto URL para el Blob
                    const fileURL = URL.createObjectURL(res);

                    // Crear un enlace temporal y simular un clic en él para iniciar la descarga
                    const a = document.createElement('a');
                    a.href = fileURL;
                    a.download = 'archivo.pdf'; // Nombre del archivo para descargar
                    document.body.appendChild(a);
                    a.click();

                    // Limpiar después de la descarga
                    window.URL.revokeObjectURL(fileURL);
                    document.body.removeChild(a);
                }
            },
            (err: any) => {
                console.error(err)
            }
        )
    }
    mostrar() {
        console.log(this.remito)
    }

    clear(table: Table) {
        table.clear()
    }
    seleccionar(idd: string) {

        var remito_buscado:any = this.remitos.find((e: Remito) => { return e._id == idd })

        this.remito = remito_buscado
        this.remito.fecha = new Date(remito_buscado.fecha)

        this.visible = true
    }
    nuevo() {
        this.remito = {
            _id: '',
            socio: {
                _id: '',
                razon_social: '',
                cuit: 0,
                fondo_remito: '',
                punto_venta: 0
            },
            campana: {
                _id: '',
                descripcion: ''
            },
            punto_venta: 1,
            numero_remito: 1,
            fecha: new Date(),
            origen: {
                _id: '',
                descripcion: '',
                id_sociedad: '',
                id_campana: '',
                hectareas: 0
            },
            destino: {
                _id: '',
                razon_social: '',
                cuit: 0,
                condicion_iva: '',
                domicilio: '',
                localidad: '',
                provincia: '',
                telefono: ''
            },
            transporte: {
                _id: '',
                razon_social: '',
                cuit: 0,
                domicilio: '',
                chofer: '',
                patente_chasis: '',
                patente_acoplado: ''
            },
            observaciones: '',
            articulos: {
                _id: '',
                codigo: '',
                unidad_medida: '',
                descripcion: ''
            },
            cantidad: 0,
            kg_origen_bruto: 0,
            kg_origen_tara: 0,
            kg_origen_neto: 0,
            kg_destino_bruto: 0,
            kg_destino_tara: 0,
            kg_destino_neto: 0,
            kg_fibra: 0,
            kg_semilla: 0,
            rendimiento: 0,
            romaneo: '',
            parte: '',
            recibo: ''
        }
        this.visible = true
    }

    guardar() {
        this.cs.apiPost('remitos', this.suprimirID(this.remito)).subscribe(
            (res: any) => {
                this.messageService.add({ severity: 'success', summary: 'Exito!', detail: 'Guardado con exito' });
                this.getRemitos()
                this.visible = false
            },
            (err: any) => {
                console.error(err)
                this.messageService.add({ severity: 'error', summary: 'Error', detail: err.error.error ? err.error.message : "Detalles en consola" });
            }
        )
    }

    editar() {
        this.cs.apiUpdate('remitos', this.remito).subscribe(
            (res: any) => {
                this.messageService.add({ severity: 'info', summary: 'Exito!', detail: 'Editado con exito' });
                this.getRemitos()
                this.visible = false
            },
            (err: any) => {
                console.error(err)
                this.messageService.add({ severity: 'error', summary: 'Error', detail: err.error.error ? err.error.message : "Detalles en consola" });
            }
        )
    }
    eliminar() {
        if (confirm('Desea eliminar?')) {
            this.cs.apiDelete('remitos', this.remito._id).subscribe(
                (res: any) => {
                    this.messageService.add({ severity: 'info', summary: 'Exito!', detail: 'Eliminado con exito' });
                    this.getRemitos()
                    this.visible = false
                },
                (err: any) => {
                    console.error(err)
                    this.messageService.add({ severity: 'error', summary: 'Error', detail: err.error.error ? err.error.message : "Detalles en consola" });
                }
            )
        }
    }
    suprimirID(ent: any) {
        var sal: any = { ...ent }
        delete sal._id
        return sal
    }
}
