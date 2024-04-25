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


@Component({
    selector: 'app-socios',
    standalone: true,
    imports: [TableModule, ButtonModule, ListboxModule, MultiSelectModule, FormsModule, DialogModule, ToastModule],
    providers: [MessageService],
    templateUrl: './socios.component.html',
    styleUrl: './socios.component.css'
})
export class SociosComponent {
    data: any
    registrosSeleccionados: any = []

    cols: any
    selectedColumns: any

    socios: Socio[] = []
    socio: Socio = {
        _id: '',
        razon_social: '',
        cuit: 0,
        fondo_remito: '',
        punto_venta: 0
    }

    visible: boolean = false;

    constructor(
        private cs: ComunicacionService,
        private messageService: MessageService
    ) { }

    ngOnInit() {

        this.cols = [
            { field: 'razon_social', header: 'Razon Social', type: 'text' },
            { field: 'cuit', header: 'CUIT', type: 'text' },
            { field: 'fondo_remito', header: 'Fondo', type: 'text' },
            { field: 'punto_venta', header: 'P.V.', type: 'numeric' }
        ]
        this.selectedColumns = [
            { field: 'razon_social', header: 'Razon Social', type: 'text' },
            { field: 'cuit', header: 'CUIT', type: 'text' },
            { field: 'punto_venta', header: 'P.V.', type: 'numeric' }
        ]
        //type text, date, numeric
        this.getSocios()
    }
    getSocios(){
        this.socios = []
        this.cs.apiGet('socios').subscribe(
            (res:any) => {
                console.log(res)
                this.socios = res.data
                console.log(this.socios)
            },
            (err:any) => {
                console.error(err)
            }
        )
    }

    clear(table: Table) {
        table.clear()
    }
    seleccionar(socio: Socio){
        this.socio = socio
        this.visible = true
    }
    nuevo(){
        this.socio = {
            _id: '',
            razon_social: '',
            cuit: 0,
            fondo_remito: '',
            punto_venta: 0
        }
        this.visible = true
    }

    guardar(){
        this.cs.apiPost('socios', this.suprimirID(this.socio)).subscribe(
            (res:any) => {
                console.log(res)
                this.messageService.add({ severity: 'success', summary: 'Exito!', detail: 'Guardado con exito' });
                this.getSocios()
                this.visible = false
            },
            (err:any) => {
                console.error(err)
                this.messageService.add({ severity: 'error', summary: 'Error', detail: err.error.error ? err.error.message : "Detalles en consola" });
            }
        )
    }
    editar(){
        this.cs.apiUpdate('socios', this.socio).subscribe(
            (res:any) => {
                console.log(res)
                this.messageService.add({ severity: 'info', summary: 'Exito!', detail: 'Editado con exito' });
                this.getSocios()
                this.visible = false
            },
            (err:any) => {
                console.error(err)
                this.messageService.add({ severity: 'error', summary: 'Error', detail: err.error.error ? err.error.message : "Detalles en consola" });
            }
        )
    }
    eliminar(){
        if(confirm('Desea eliminar?')){
            this.cs.apiDelete('socios', this.socio._id).subscribe(
                (res:any) => {
                    console.log(res)
                    this.messageService.add({ severity: 'info', summary: 'Exito!', detail: 'Eliminado con exito' });
                    this.getSocios()
                    this.visible = false
                },
                (err:any) => {
                    console.error(err)
                    this.messageService.add({ severity: 'error', summary: 'Error', detail: err.error.error ? err.error.message : "Detalles en consola" });
                }
            )
        }
    }
    suprimirID(ent:any){
        var sal: any = { ...ent }
        delete sal._id
        return sal
    }
}
