import { Component } from '@angular/core';
import { ComunicacionService } from '../../../services/comunicacion/comunicacion.service';
import { FormsModule } from '@angular/forms';


import { Table, TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { ListboxModule } from 'primeng/listbox';
import { MultiSelectModule } from 'primeng/multiselect';
import { Establecimiento } from '../../../interfaces/establecimientos.interface';
import { DialogModule } from 'primeng/dialog';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { DropdownModule } from 'primeng/dropdown';
import { Sociedad } from '../../../interfaces/sociedades.interface';
import { Campana } from '../../../interfaces/campanas.interface';

@Component({
    selector: 'app-establecimientos',
    standalone: true,
    imports: [TableModule, ButtonModule, ListboxModule, MultiSelectModule, FormsModule, DialogModule, ToastModule, DropdownModule],
    providers: [MessageService],
    templateUrl: './establecimientos.component.html',
    styleUrl: './establecimientos.component.css'
})
export class EstablecimientosComponent {
    data: any
    registrosSeleccionados: any = []

    cols: any
    selectedColumns: any

    establecimientos: Establecimiento[] = []
    establecimiento!: Establecimiento

    
    sociedades: Sociedad[] = []
    campanas: Campana[] = []

    visible: boolean = false;

    dic_sociedades: any = {}
    dic_campanas: any = {}

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
        this.getCampanas()
    }

    getCampanas() {
        this.campanas = []
        this.cs.apiGet('campanas').subscribe(
            (res: any) => {
                this.campanas = res.data
                res.data.forEach((e:any) => { this.dic_campanas[e._id] = e.descripcion });
                console.log(this.dic_campanas)
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
                res.data.forEach((e:any) => { this.dic_sociedades[e._id] = e.descripcion });
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
                this.establecimientos = res.data
            },
            (err: any) => {
                console.error(err)
            }
        )
    }

    clear(table: Table) {
        table.clear()
    }
    seleccionar(establecimiento: Establecimiento) {
        this.establecimiento = establecimiento
        this.visible = true
    }
    nuevo() {
        this.establecimiento = {
            _id: '',
            descripcion: '',
            id_sociedad: '',
            id_campana: '',
            hectareas: 0
        }
        this.visible = true
    }

    guardar() {
        this.cs.apiPost('establecimientos', this.suprimirID(this.establecimiento)).subscribe(
            (res: any) => {
                console.log(res)
                this.messageService.add({ severity: 'success', summary: 'Exito!', detail: 'Guardado con exito' });
                this.getEstablecimientos()
                this.visible = false
            },
            (err: any) => {
                console.error(err)
                this.messageService.add({ severity: 'error', summary: 'Error', detail: err.error.error ? err.error.message : "Detalles en consola" });
            }
        )
    }
    editar() {
        this.cs.apiUpdate('establecimientos', this.establecimiento).subscribe(
            (res: any) => {
                console.log(res)
                this.messageService.add({ severity: 'info', summary: 'Exito!', detail: 'Editado con exito' });
                this.getEstablecimientos()
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
            this.cs.apiDelete('establecimientos', this.establecimiento._id).subscribe(
                (res: any) => {
                    console.log(res)
                    this.messageService.add({ severity: 'info', summary: 'Exito!', detail: 'Eliminado con exito' });
                    this.getEstablecimientos()
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
