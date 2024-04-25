import { Component } from '@angular/core';
import { ComunicacionService } from '../../../services/comunicacion/comunicacion.service';
import { FormsModule } from '@angular/forms';


import { Table, TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { ListboxModule } from 'primeng/listbox';
import { MultiSelectModule } from 'primeng/multiselect';
import { Articulo } from '../../../interfaces/articulos.interface';
import { DialogModule } from 'primeng/dialog';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { DropdownModule } from 'primeng/dropdown';

@Component({
    selector: 'app-articulos',
    standalone: true,
    imports: [TableModule, ButtonModule, ListboxModule, MultiSelectModule, FormsModule, DialogModule, ToastModule, DropdownModule],
    providers: [MessageService], templateUrl: './articulos.component.html',
    styleUrl: './articulos.component.css'
})
export class ArticulosComponent {
    data: any
    registrosSeleccionados: any = []

    cols: any
    selectedColumns: any

    articulos: Articulo[] = []
    articulo!: Articulo

    visible: boolean = false;

    constructor(
        private cs: ComunicacionService,
        private messageService: MessageService
    ) { }

    ngOnInit() {

        this.cols = [
            { field: 'codigo', header: 'Codigo', type: 'text' },
            { field: 'descripcion', header: 'Descripcion', type: 'text' },
            { field: 'unidad_medida', header: 'U.M.', type: 'text' }
        ]
        this.selectedColumns = [
            { field: 'codigo', header: 'Codigo', type: 'text' },
            { field: 'descripcion', header: 'Descripcion', type: 'text' },
            { field: 'unidad_medida', header: 'U.M.', type: 'text' }
        ]
        //type text, date, numeric
        this.getArticulos()
    }
    getArticulos() {
        this.articulos = []
        this.cs.apiGet('articulos').subscribe(
            (res: any) => {
                this.articulos = res.data
            },
            (err: any) => {
                console.error(err)
            }
        )
    }

    clear(table: Table) {
        table.clear()
    }
    seleccionar(articulo: Articulo) {
        this.articulo = articulo
        this.visible = true
    }
    nuevo() {
        this.articulo = {
            _id: '',
            codigo: '',
            unidad_medida: '',
            descripcion: '',
        }
        this.visible = true
    }

    guardar() {
        this.cs.apiPost('articulos', this.suprimirID(this.articulo)).subscribe(
            (res: any) => {
                console.log(res)
                this.messageService.add({ severity: 'success', summary: 'Exito!', detail: 'Guardado con exito' });
                this.getArticulos()
                this.visible = false
            },
            (err: any) => {
                console.error(err)
                this.messageService.add({ severity: 'error', summary: 'Error', detail: err.error.error ? err.error.message : "Detalles en consola" });
            }
        )
    }
    editar() {
        this.cs.apiUpdate('articulos', this.articulo).subscribe(
            (res: any) => {
                console.log(res)
                this.messageService.add({ severity: 'info', summary: 'Exito!', detail: 'Editado con exito' });
                this.getArticulos()
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
            this.cs.apiDelete('articulos', this.articulo._id).subscribe(
                (res: any) => {
                    console.log(res)
                    this.messageService.add({ severity: 'info', summary: 'Exito!', detail: 'Eliminado con exito' });
                    this.getArticulos()
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
