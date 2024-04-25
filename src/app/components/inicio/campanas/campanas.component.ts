import { Component } from '@angular/core';
import { ComunicacionService } from '../../../services/comunicacion/comunicacion.service';
import { FormsModule } from '@angular/forms';


import { Table, TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { ListboxModule } from 'primeng/listbox';
import { MultiSelectModule } from 'primeng/multiselect';
import { DialogModule } from 'primeng/dialog';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { DropdownModule } from 'primeng/dropdown';
import { Campana } from '../../../interfaces/campanas.interface';

@Component({
    selector: 'app-campanas',
    standalone: true,
    imports: [TableModule, ButtonModule, ListboxModule, MultiSelectModule, FormsModule, DialogModule, ToastModule, DropdownModule],
    providers: [MessageService],
    templateUrl: './campanas.component.html',
    styleUrl: './campanas.component.css'
})
export class CampanasComponent {
    data: any
    registrosSeleccionados: any = []

    cols: any
    selectedColumns: any

    campanas: Campana[] = []
    campana!: Campana

    visible: boolean = false;

    constructor(
        private cs: ComunicacionService,
        private messageService: MessageService
    ) { }

    ngOnInit() {

        this.cols = [
            { field: 'descripcion', header: 'Descripcion', type: 'text' }
        ]
        this.selectedColumns = [
            { field: 'descripcion', header: 'Descripcion', type: 'text' }
        ]
        //type text, date, numeric
        this.getCampanas()
    }
    getCampanas() {
        this.campanas = []
        this.cs.apiGet('campanas').subscribe(
            (res: any) => {
                this.campanas = res.data
            },
            (err: any) => {
                console.error(err)
            }
        )
    }

    clear(table: Table) {
        table.clear()
    }
    seleccionar(campana: Campana) {
        this.campana = campana
        this.visible = true
    }
    nuevo() {
        this.campana = {
            _id: "",
            descripcion: "" 
        }
        this.visible = true
    }

    guardar() {
        this.cs.apiPost('campanas', this.suprimirID(this.campana)).subscribe(
            (res: any) => {
                console.log(res)
                this.messageService.add({ severity: 'success', summary: 'Exito!', detail: 'Guardado con exito' });
                this.getCampanas()
                this.visible = false
            },
            (err: any) => {
                console.error(err)
                this.messageService.add({ severity: 'error', summary: 'Error', detail: err.error.error ? err.error.message : "Detalles en consola" });
            }
        )
    }
    editar() {
        this.cs.apiUpdate('campanas', this.campana).subscribe(
            (res: any) => {
                console.log(res)
                this.messageService.add({ severity: 'info', summary: 'Exito!', detail: 'Editado con exito' });
                this.getCampanas()
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
            this.cs.apiDelete('campanas', this.campana._id).subscribe(
                (res: any) => {
                    console.log(res)
                    this.messageService.add({ severity: 'info', summary: 'Exito!', detail: 'Eliminado con exito' });
                    this.getCampanas()
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
