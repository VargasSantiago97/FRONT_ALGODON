import { Component } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { AccordionModule } from 'primeng/accordion';

import { Articulo } from '../../interfaces/articulos.interface';
import { Campana } from '../../interfaces/campanas.interface';
import { Sociedad } from '../../interfaces/sociedades.interface';
import { RouterLink, RouterOutlet } from '@angular/router';
import { ComunicacionService } from '../../services/comunicacion/comunicacion.service';

@Component({
    selector: 'app-inicio',
    standalone: true,
    imports: [RouterOutlet, ButtonModule, AccordionModule, RouterLink],
    templateUrl: './inicio.component.html',
    styleUrl: './inicio.component.css'
})

export class InicioComponent {
    articulos!: Articulo[]
    campanas!: Campana[]
    sociedades!: Sociedad[]

    varr = false;

    varrr = [1, 2, 3, 4]

    activeIndex: any = 0

    constructor(
        private cs: ComunicacionService
    ){}

    ngOnInit() {
    }

    press(){
        this.cs.apiGet('articulos').subscribe(
            (res:any) => {
                console.log(res)
            },
            (err: any) => {
                if(err.error.error){
                    alert(err.error.message)
                }
            }
        )
    }
    press2(){
        var art: Articulo = {
            _id: '234',
            unidad_medida: 'asasdasdasddsss',
            descripcion: 'desc'
        }

        this.cs.apiPost('articulos', this.suprimirID(art)).subscribe(
            (res:any) => {
                console.log(res)
            },
            (err: any) => {
                if(err.error.error){
                    alert(err.error.message)
                }
            }
        )
    }
    press3(){
        var art: Articulo = {
            _id: "6629be4cb606373d1db9e386",
            unidad_medida: 'u.m. edit',
            descripcion: 'desc edit'
        }

        this.cs.apiUpdate('articulos', art).subscribe(
            (res:any) => {
                console.log(res)
            },
            (err: any) => {
                if(err.error.error){
                    alert(err.error.message)
                }
            }
        )
    }
    press4(){

        this.cs.apiDelete('articulos', "6629be4cb606373d1db9e386").subscribe(
            (res:any) => {
                console.log(res)
            },
            (err: any) => {
                if(err.error.error){
                    alert(err.error.message)
                }
            }
        )
    }
    suprimirID(ent:any){
        var sal: any = { ...ent }
        delete sal._id
        return sal
    }

}
