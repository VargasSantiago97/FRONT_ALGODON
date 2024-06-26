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
import { DividerModule } from 'primeng/divider';

@Component({
    selector: 'app-sociedades',
    standalone: true,
    imports: [TableModule, ButtonModule, ListboxModule, MultiSelectModule, FormsModule, DialogModule, ToastModule, DropdownModule, DividerModule],
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
    sociedad!: Sociedad

    visible: boolean = false;

    socioAgregar = {
        id: '',
        porcentaje: 0
    }

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
                console.log(res)
            },
            (err: any) => {
                console.error(err)
            }
        )
    }


    clear(table: Table) {
        table.clear()
    }
    seleccionar(sociedad: Sociedad) {
        this.sociedad = sociedad
        this.visible = true
    }
    nuevo() {
        this.sociedad = {
            _id: '',
            descripcion: '',
            socios: [],
        }
        this.visible = true
    }
    agregarSocio(){
        var socio_agregar:any = this.socios.find((e:Socio) => { return e._id == this.socioAgregar.id })

        if(!socio_agregar) return this.messageService.add({ severity: 'error', summary: 'Error', detail: "Socio no encontrado" });
        if(!this.socioAgregar.porcentaje) return this.messageService.add({ severity: 'error', summary: 'Error', detail: "Porcentaje debe ser mayor a cero" });

        this.sociedad.socios.push({
            razon_social: socio_agregar.razon_social,
            id: socio_agregar._id,
            porcentaje: this.socioAgregar.porcentaje
        })
    }

    guardar() {
        this.cs.apiPost('sociedades', this.suprimirID(this.sociedad)).subscribe(
            (res: any) => {
                console.log(res)
                this.messageService.add({ severity: 'success', summary: 'Exito!', detail: 'Guardado con exito' });
                this.getSociedades()
                this.visible = false
            },
            (err: any) => {
                console.error(err)
                this.messageService.add({ severity: 'error', summary: 'Error', detail: err.error.error ? err.error.message : "Detalles en consola" });
            }
        )
    }
    editar() {
        this.cs.apiUpdate('sociedades', this.sociedad).subscribe(
            (res: any) => {
                console.log(res)
                this.messageService.add({ severity: 'info', summary: 'Exito!', detail: 'Editado con exito' });
                this.getSociedades()
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
            this.cs.apiDelete('sociedades', this.sociedad._id).subscribe(
                (res: any) => {
                    console.log(res)
                    this.messageService.add({ severity: 'info', summary: 'Exito!', detail: 'Eliminado con exito' });
                    this.getSociedades()
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
