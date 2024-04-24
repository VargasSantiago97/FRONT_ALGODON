import { Component } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { AccordionModule } from 'primeng/accordion';

import { Articulo } from '../../interfaces/articulos.interface';
import { Campana } from '../../interfaces/campanas.interface';
import { Sociedad } from '../../interfaces/sociedades.interface';
import { RouterOutlet } from '@angular/router';
import { ComunicacionService } from '../../services/comunicacion/comunicacion.service';


@Component({
    selector: 'app-inicio',
    standalone: true,
    imports: [RouterOutlet, ButtonModule, AccordionModule],
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
        this.cs.apiGetId('articulos', "6622f2ea4e721183b25f729").subscribe(
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

}
