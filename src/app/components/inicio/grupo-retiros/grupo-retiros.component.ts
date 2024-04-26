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


@Component({
    selector: 'app-grupo-retiros',
    standalone: true,
    imports: [TableModule, ButtonModule, ListboxModule, MultiSelectModule, FormsModule, DialogModule, ToastModule, DropdownModule, DividerModule],
    providers: [MessageService],
    templateUrl: './grupo-retiros.component.html',
    styleUrl: './grupo-retiros.component.css'
})
export class GrupoRetirosComponent {
    data: any
    registrosSeleccionados: any = []

    cols: any
    selectedColumns: any

    socios: Socio[] = []
    socio!: Socio

    grupo_retiros: Grupo_retiro[] = []
    grupo_retiro!: Grupo_retiro

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
                this.getGrupoRetiros()
            },
            (err: any) => {
                console.error(err)
            }
        )
    }
    getGrupoRetiros() {
        this.grupo_retiros = []
        this.cs.apiGet('grupo_retiros').subscribe(
            (res: any) => {
                this.grupo_retiros = res.data
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
    seleccionar(grupo_retiro: Grupo_retiro) {
        this.grupo_retiro = grupo_retiro
        this.visible = true
    }
    nuevo() {
        this.grupo_retiro = {
            _id: '',
            descripcion: '',
            socios: [],
        }
        this.visible = true
    }
    agregarSocio() {
        var socio_agregar: any = this.socios.find((e: Socio) => { return e._id == this.socioAgregar.id })

        if (!socio_agregar) return this.messageService.add({ severity: 'error', summary: 'Error', detail: "Socio no encontrado" });

        this.grupo_retiro.socios.push({
            razon_social: socio_agregar.razon_social,
            id: socio_agregar._id
        })
    }

    guardar() {
        this.cs.apiPost('grupo_retiros', this.suprimirID(this.grupo_retiro)).subscribe(
            (res: any) => {
                console.log(res)
                this.messageService.add({ severity: 'success', summary: 'Exito!', detail: 'Guardado con exito' });
                this.getGrupoRetiros()
                this.visible = false
            },
            (err: any) => {
                console.error(err)
                this.messageService.add({ severity: 'error', summary: 'Error', detail: err.error.error ? err.error.message : "Detalles en consola" });
            }
        )
    }
    editar() {
        this.cs.apiUpdate('grupo_retiros', this.grupo_retiro).subscribe(
            (res: any) => {
                console.log(res)
                this.messageService.add({ severity: 'info', summary: 'Exito!', detail: 'Editado con exito' });
                this.getGrupoRetiros()
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
            this.cs.apiDelete('grupo_retiros', this.grupo_retiro._id).subscribe(
                (res: any) => {
                    console.log(res)
                    this.messageService.add({ severity: 'info', summary: 'Exito!', detail: 'Eliminado con exito' });
                    this.getGrupoRetiros()
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
