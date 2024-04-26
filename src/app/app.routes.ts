import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { InicioComponent } from './components/inicio/inicio.component';
import { ArticulosComponent } from './components/inicio/articulos/articulos.component';
import { CampanasComponent } from './components/inicio/campanas/campanas.component';
import { DestinosComponent } from './components/inicio/destinos/destinos.component';
import { EstablecimientosComponent } from './components/inicio/establecimientos/establecimientos.component';
import { GrupoRetirosComponent } from './components/inicio/grupo-retiros/grupo-retiros.component';
import { RemitosComponent } from './components/inicio/remitos/remitos.component';
import { ResumenComponent } from './components/inicio/resumen/resumen.component';
import { SociedadesComponent } from './components/inicio/sociedades/sociedades.component';
import { SociosComponent } from './components/inicio/socios/socios.component';
import { TransportesComponent } from './components/inicio/transportes/transportes.component';

export const routes: Routes = [
    {
        path: 'inicio', component: InicioComponent, children: [
            { path: '', redirectTo: 'remitos', pathMatch: 'full' },
            { path: 'articulos', component: ArticulosComponent },
            { path: 'campanas', component: CampanasComponent },
            { path: 'destinos', component: DestinosComponent },
            { path: 'establecimientos', component: EstablecimientosComponent },
            { path: 'grupo_retiros', component: GrupoRetirosComponent },
            { path: 'remitos', component: RemitosComponent },
            { path: 'resumen', component: ResumenComponent },
            { path: 'sociedades', component: SociedadesComponent },
            { path: 'socios', component: SociosComponent },
            { path: 'transportes', component: TransportesComponent }
        ]
    },
    { path: 'login', component: LoginComponent },
    { path: '', redirectTo: '/inicio', pathMatch: 'full' },
    { path: '**', redirectTo: '/inicio' },
];