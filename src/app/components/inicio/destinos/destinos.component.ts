import { Component } from '@angular/core';
import { ComunicacionService } from '../../../services/comunicacion/comunicacion.service';
import { FormsModule } from '@angular/forms';


import { Table, TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { ListboxModule } from 'primeng/listbox';
import { MultiSelectModule } from 'primeng/multiselect';
import { Destino } from '../../../interfaces/destinos.interface';
import { DialogModule } from 'primeng/dialog';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { DropdownModule } from 'primeng/dropdown';


@Component({
    selector: 'app-destinos',
    standalone: true,
    imports: [TableModule, ButtonModule, ListboxModule, MultiSelectModule, FormsModule, DialogModule, ToastModule, DropdownModule],
    providers: [MessageService],
    templateUrl: './destinos.component.html',
    styleUrl: './destinos.component.css'
})
export class DestinosComponent {
    data: any
    registrosSeleccionados: any = []

    cols: any
    selectedColumns: any

    destinos: Destino[] = []
    destino!: Destino

    visible: boolean = false;

    constructor(
        private cs: ComunicacionService,
        private messageService: MessageService
    ) { }

    ngOnInit() {

        this.cols = [

            { field: 'razon_social', header: 'Razon Social', type: 'text' },
            { field: 'cuit', header: 'C.U.I.T.', type: 'numeric' },
            { field: 'condicion_iva', header: 'COND. IVA', type: 'text' },
            { field: 'domicilio', header: 'DOMICILIO', type: 'text' },
            { field: 'localidad', header: 'LOCALIDAD', type: 'text' },
            { field: 'provincia', header: 'PROVINCIA', type: 'text' },
            { field: 'telefono', header: 'TELEFONO', type: 'text' },

        ]
        this.selectedColumns = [
            { field: 'razon_social', header: 'Razon Social', type: 'text' },
            { field: 'cuit', header: 'C.U.I.T.', type: 'numeric' },
            { field: 'condicion_iva', header: 'COND. IVA', type: 'text' },
            { field: 'domicilio', header: 'DOMICILIO', type: 'text' },
            { field: 'localidad', header: 'LOCALIDAD', type: 'text' },
            { field: 'provincia', header: 'PROVINCIA', type: 'text' },
            { field: 'telefono', header: 'TELEFONO', type: 'text' },
        ]
        //type text, date, numeric
        this.getDestinos()
    }
    getDestinos() {
        this.destinos = []
        this.cs.apiGet('destinos').subscribe(
            (res: any) => {
                this.destinos = res.data
            },
            (err: any) => {
                console.error(err)
            }
        )
    }

    clear(table: Table) {
        table.clear()
    }
    seleccionar(destino: Destino) {
        this.destino = destino
        this.visible = true
    }
    nuevo() {
        this.destino = {
            _id: "",
            razon_social: "",
            cuit: 0,
            condicion_iva: "",
            domicilio: "",
            localidad: "",
            provincia: "",
            telefono: ""
        }
        this.visible = true
    }

    guardar() {
        this.cs.apiPost('destinos', this.suprimirID(this.destino)).subscribe(
            (res: any) => {
                console.log(res)
                this.messageService.add({ severity: 'success', summary: 'Exito!', detail: 'Guardado con exito' });
                this.getDestinos()
                this.visible = false
            },
            (err: any) => {
                console.error(err)
                this.messageService.add({ severity: 'error', summary: 'Error', detail: err.error.error ? err.error.message : "Detalles en consola" });
            }
        )
    }
    editar() {
        this.cs.apiUpdate('destinos', this.destino).subscribe(
            (res: any) => {
                console.log(res)
                this.messageService.add({ severity: 'info', summary: 'Exito!', detail: 'Editado con exito' });
                this.getDestinos()
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
            this.cs.apiDelete('destinos', this.destino._id).subscribe(
                (res: any) => {
                    console.log(res)
                    this.messageService.add({ severity: 'info', summary: 'Exito!', detail: 'Eliminado con exito' });
                    this.getDestinos()
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
