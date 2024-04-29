import { Component } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { AccordionModule } from 'primeng/accordion';

import { Campana } from '../../interfaces/campanas.interface';
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

    campana!: Campana
    campanas: Campana[] = []

    constructor(
        private cs: ComunicacionService
    ){}

    ngOnInit() {
        this.getCampanas()
    }

    getCampanas(){
        this.cs.apiGet('campanas').subscribe(
            (res:any) => {
                this.campanas = res.data

                if(!localStorage.getItem('campana_seleccioanda')){
                    alert('Seleccionar Campaña a trabajar')
                } else {
                    var campp = this.campanas.find((e:Campana) => { return e._id == localStorage.getItem('campana_seleccioanda') })
                    if(campp){
                        this.campana = campp
                    }
                }
            },
            (err:any) => {
                console.error(err)
            }
        )
    }
    seleccionarCampana(idd: any){
        localStorage.setItem('campana_seleccioanda', idd)
        location.reload();
    }

}
