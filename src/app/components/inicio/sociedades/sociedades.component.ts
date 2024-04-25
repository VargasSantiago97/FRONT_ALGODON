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
import { Campana } from '../../../interfaces/campanas.interface';

@Component({
    selector: 'app-sociedades',
    standalone: true,
    imports: [TableModule, ButtonModule, ListboxModule, MultiSelectModule, FormsModule, DialogModule, ToastModule, DropdownModule],
    providers: [MessageService], templateUrl: './sociedades.component.html',
    styleUrl: './sociedades.component.css'
})
export class SociedadesComponent {
    data: any
    registrosSeleccionados: any = []

    cols: any
    selectedColumns: any

    socios: Socio[] = []
    socio!: Socio

    sociedades: Sociedad[] = []
    sociedad: Sociedad = {
        _id: '',
        descripcion: '',
        socios: [{
            razon_social: '',
            id: '',
            porcentaje: 0
        }]
    }

    visible: boolean = false;

    constructor(
        private cs: ComunicacionService,
        private messageService: MessageService
    ) { }

    ngOnInit() {
        this.cols = [
            { field: 'descripcion', header: 'Descripcion', type: 'text' },
            { field: 'id_sociedad', header: 'Produce', type: 'text' },
            { field: 'id_campana', header: 'Campaña', type: 'text' },
            { field: 'hectareas', header: 'Hectareas', type: 'numeric' }
        ]
        this.selectedColumns = [
            { field: 'descripcion', header: 'Descripcion', type: 'text' },
            { field: 'id_sociedad', header: 'Produce', type: 'text' },
            { field: 'id_campana', header: 'Campaña', type: 'text' },
            { field: 'hectareas', header: 'Hectareas', type: 'numeric' }
        ]
        //type text, date, numeric
        this.getSocios()
    }
    getSocios() {
        this.socios = []
        this.cs.apiGet('socios').subscribe(
            (res: any) => {
                this.socios = res.data
                this.getSociedades()
            },
            (err: any) => {
                console.error(err)
            }
        )
    }
    getSociedades() {
        this.sociedades = []
        this.cs.apiGet('sociedades').subscribe(
            (res: any) => {
                this.sociedades = res.data
                console.log(res.data)
            },
            (err: any) => {
                console.error(err)
            }
        )
    }


    clear(table: Table) {
        table.clear()
    }
    seleccionar(socio: Socio) {
        this.socio = socio
        this.visible = true
    }
    nuevo() {
        this.socio = {
            _id: '',
            razon_social: '',
            cuit: 0,
            fondo_remito: '',
            punto_venta: 0
        }
        this.visible = true
    }

    guardar() {
        this.cs.apiPost('socios', this.suprimirID(this.socio)).subscribe(
            (res: any) => {
                console.log(res)
                this.messageService.add({ severity: 'success', summary: 'Exito!', detail: 'Guardado con exito' });
                this.getSocios()
                this.visible = false
            },
            (err: any) => {
                console.error(err)
                this.messageService.add({ severity: 'error', summary: 'Error', detail: err.error.error ? err.error.message : "Detalles en consola" });
            }
        )
    }
    editar() {
        this.cs.apiUpdate('socios', this.socio).subscribe(
            (res: any) => {
                console.log(res)
                this.messageService.add({ severity: 'info', summary: 'Exito!', detail: 'Editado con exito' });
                this.getSocios()
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
            this.cs.apiDelete('socios', this.socio._id).subscribe(
                (res: any) => {
                    console.log(res)
                    this.messageService.add({ severity: 'info', summary: 'Exito!', detail: 'Eliminado con exito' });
                    this.getSocios()
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
