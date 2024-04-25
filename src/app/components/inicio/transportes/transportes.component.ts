import { Component } from '@angular/core';
import { ComunicacionService } from '../../../services/comunicacion/comunicacion.service';
import { FormsModule } from '@angular/forms';


import { Table, TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { ListboxModule } from 'primeng/listbox';
import { MultiSelectModule } from 'primeng/multiselect';
import { Transporte } from '../../../interfaces/transportes.interface';
import { DialogModule } from 'primeng/dialog';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { DropdownModule } from 'primeng/dropdown';

@Component({
    selector: 'app-transportes',
    standalone: true,
    imports: [TableModule, ButtonModule, ListboxModule, MultiSelectModule, FormsModule, DialogModule, ToastModule, DropdownModule],
    providers: [MessageService],
    templateUrl: './transportes.component.html',
    styleUrl: './transportes.component.css'
})
export class TransportesComponent {
    data: any
    registrosSeleccionados: any = []

    cols: any
    selectedColumns: any

    transportes: Transporte[] = []
    transporte!: Transporte

    visible: boolean = false;

    constructor(
        private cs: ComunicacionService,
        private messageService: MessageService
    ) { }

    ngOnInit() {

        this.cols = [
            { field: 'razon_social', header: 'Razon Social', type: 'text' },
            { field: 'cuit', header: 'C.U.I.T.', type: 'numeric' },
            { field: 'chofer', header: 'Chofer', type: 'text' },
            { field: 'patente_chasis', header: 'Patente Chasis', type: 'text' },
            { field: 'patente_acoplado', header: 'Patente Acoplado', type: 'text' },
            { field: 'domicilio', header: 'Domicilio', type: 'text' },
        ]
        this.selectedColumns = [
            { field: 'razon_social', header: 'Razon Social', type: 'text' },
            { field: 'cuit', header: 'C.U.I.T.', type: 'numeric' },
            { field: 'chofer', header: 'Chofer', type: 'text' },
            { field: 'patente_chasis', header: 'Patente Chasis', type: 'text' },
            { field: 'patente_acoplado', header: 'Patente Acoplado', type: 'text' }
        ]
        //type text, date, numeric
        this.getTransportes()
    }
    getTransportes() {
        this.transportes = []
        this.cs.apiGet('transportes').subscribe(
            (res: any) => {
                this.transportes = res.data
            },
            (err: any) => {
                console.error(err)
            }
        )
    }

    clear(table: Table) {
        table.clear()
    }
    seleccionar(transporte: Transporte) {
        this.transporte = transporte
        this.visible = true
    }
    nuevo() {
        this.transporte = {
            _id: '',
            razon_social: '',
            cuit: 0,
            domicilio: '',
            chofer: '',
            patente_chasis: '',
            patente_acoplado: ''
        }
        this.visible = true
    }

    guardar() {
        this.cs.apiPost('transportes', this.suprimirID(this.transporte)).subscribe(
            (res: any) => {
                console.log(res)
                this.messageService.add({ severity: 'success', summary: 'Exito!', detail: 'Guardado con exito' });
                this.getTransportes()
                this.visible = false
            },
            (err: any) => {
                console.error(err)
                this.messageService.add({ severity: 'error', summary: 'Error', detail: err.error.error ? err.error.message : "Detalles en consola" });
            }
        )
    }
    editar() {
        this.cs.apiUpdate('transportes', this.transporte).subscribe(
            (res: any) => {
                console.log(res)
                this.messageService.add({ severity: 'info', summary: 'Exito!', detail: 'Editado con exito' });
                this.getTransportes()
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
            this.cs.apiDelete('transportes', this.transporte._id).subscribe(
                (res: any) => {
                    console.log(res)
                    this.messageService.add({ severity: 'info', summary: 'Exito!', detail: 'Eliminado con exito' });
                    this.getTransportes()
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
