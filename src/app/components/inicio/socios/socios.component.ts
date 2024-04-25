import { Component } from '@angular/core';
import { ComunicacionService } from '../../../services/comunicacion/comunicacion.service';
import { FormsModule } from '@angular/forms';


import { Table, TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';

import { MultiSelectModule } from 'primeng/multiselect';

@Component({
    selector: 'app-socios',
    standalone: true,
    imports: [TableModule, ButtonModule, MultiSelectModule, FormsModule],
    templateUrl: './socios.component.html',
    styleUrl: './socios.component.css'
})
export class SociosComponent {
    data: any
    selectedProducts: any = []

    cols: any
    selectedColumns: any

    constructor(
        private cs: ComunicacionService
    ){}

    ngOnInit(){
        this.cols = [
            {field: 'code', header:'Code', type:'text'},
            {field: 'name', header:'Name', type:'text'},
            {field: 'category', header:'Category', type:'text'},
            {field: 'quantity', header:'Quantity', type:'numeric'}
        ]
        this.selectedColumns = [
            {field: 'code', header:'Code', type:'text'},
            {field: 'name', header:'Name', type:'text'},
            {field: 'category', header:'Category', type:'text'},
            {field: 'quantity', header:'Quantity', type:'numeric'}
        ]
        //type text, date, numeric

        this.data = [{
            "id": "10001",
            "code": "value",
            "name": "Reloj de Bambú",
            "category": "Accesorios",
            "quantity": 24
          },
          {
            "id": "10002",
            "code": "value",
            "name": "Libro de Cocina Mediterránea",
            "category": "Libros",
            "quantity": 10
          },
          {
            "id": "10003",
            "code": "value",
            "name": "Camisa de Cuadros",
            "category": "Ropa",
            "quantity": 50
          },
          {
            "id": "10004",
            "code": "value",
            "name": "Zapatillas Deportivas",
            "category": "Calzado",
            "quantity": 30
          },
          {
            "id": "10005",
            "code": "value",
            "name": "Botella de Agua Reutilizable",
            "category": "Hogar",
            "quantity": 15
          },
          {
            "id": "10006",
            "code": "value",
            "name": "Auriculares Bluetooth",
            "category": "Tecnología",
            "quantity": 20
          },
          {
            "id": "10007",
            "code": "value",
            "name": "Silla Plegable",
            "category": "Muebles",
            "quantity": 8
          },
          {
            "id": "10008",
            "code": "value",
            "name": "Juego de Tazas de Té",
            "category": "Cocina",
            "quantity": 12
          },
          {
            "id": "10009",
            "code": "value",
            "name": "Cámara Fotográfica Digital",
            "category": "Electrónica",
            "quantity": 5
          },
          {
            "id": "10010",
            "code": "value",
            "name": "Mochila Resistente al Agua",
            "category": "Viajes",
            "quantity": 18
          },
          {
            "id": "10011",
            "code": "value",
            "name": "Plantas de Interior Variadas",
            "category": "Jardinería",
            "quantity": 40
          },
          {
            "id": "10012",
            "code": "value",
            "name": "Caja de Herramientas Completa",
            "category": "Bricolaje",
            "quantity": 7
          },
          {
            "id": "10013",
            "code": "value",
            "name": "Saco de Dormir para Acampar",
            "category": "Deportes",
            "quantity": 22
          },
          {
            "id": "10014",
            "code": "value",
            "name": "Maletín de Cuero",
            "category": "Moda",
            "quantity": 11
          },
          {
            "id": "10015",
            "code": "value",
            "name": "Peluche de Unicornio",
            "category": "Juguetes",
            "quantity": 14
          },
          {
            "id": "10016",
            "code": "value",
            "name": "Tablero de Ajedrez de Madera",
            "category": "Entretenimiento",
            "quantity": 9
          },
          {
            "id": "10017",
            "code": "value",
            "name": "Lámpara de Escritorio LED",
            "category": "Iluminación",
            "quantity": 25
          },
          {
            "id": "10018",
            "code": "value",
            "name": "Perfume Floral",
            "category": "Belleza",
            "quantity": 13
          },
          {
            "id": "10019",
            "code": "value",
            "name": "Pantalones Vaqueros Desgastados",
            "category": "Moda",
            "quantity": 28
          },
          {
            "id": "10020",
            "code": "value",
            "name": "Bolígrafo de Tinta Negra",
            "category": "Papelería",
            "quantity": 36
          },
          {
            "id": "10021",
            "code": "value",
            "name": "Portafolios de Cuero",
            "category": "Oficina",
            "quantity": 19
          },
          {
            "id": "10022",
            "code": "value",
            "name": "Cargador Solar para Dispositivos Móviles",
            "category": "Tecnología",
            "quantity": 6
          },
          {
            "id": "10023",
            "code": "value",
            "name": "Puzzle de 1000 Piezas",
            "category": "Juguetes",
            "quantity": 16
          },
          {
            "id": "10024",
            "code": "value",
            "name": "Termo de Acero Inoxidable",
            "category": "Hogar",
            "quantity": 21
          },
          {
            "id": "10025",
            "code": "value",
            "name": "Gorra de Béisbol",
            "category": "Accesorios",
            "quantity": 32
          },
          {
            "id": "10026",
            "code": "value",
            "name": "Cámara de Seguridad WiFi",
            "category": "Hogar",
            "quantity": 4
          },
          {
            "id": "10027",
            "code": "value",
            "name": "Teclado Inalámbrico",
            "category": "Tecnología",
            "quantity": 17
          },
          {
            "id": "10028",
            "code": "value",
            "name": "Cafetera Eléctrica",
            "category": "Cocina",
            "quantity": 23
          },
          {
            "id": "10029",
            "code": "value",
            "name": "Set de Pinceles para Arte",
            "category": "Arte",
            "quantity": 27
          },
          {
            "id": "10030",
            "code": "value",
            "name": "Alfombra de Yoga Antideslizante",
            "category": "Deportes",
            "quantity": 20
          },
          {
            "id": "10031",
            "code": "value",
            "name": "Cuchillos de Cocina Profesionales",
            "category": "Cocina",
            "quantity": 15
          }]
    }

    clear(table: Table){
        table.clear()
    }

}
