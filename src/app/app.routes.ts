import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { InicioComponent } from './components/inicio/inicio.component';
import { RemitosComponent } from './components/inicio/remitos/remitos.component';

export const routes: Routes = [
    {
        path: 'inicio', component: InicioComponent, children: [
            { path: '', redirectTo: 'remitos', pathMatch: 'full' },
            { path: 'remitos', component: RemitosComponent },
        ]
    },

    { path: 'remitos', component: RemitosComponent },
    { path: 'login', component: LoginComponent },
    { path: '', redirectTo: '/inicio', pathMatch: 'full' },
    { path: '**', redirectTo: '/inicio' },
];