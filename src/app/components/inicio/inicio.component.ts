import { Component } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { AccordionModule } from 'primeng/accordion';

import { User } from '../../interfaces/user.interface';

@Component({
  selector: 'app-inicio',
  standalone: true,
  imports: [ButtonModule, AccordionModule],
  templateUrl: './inicio.component.html',
  styleUrl: './inicio.component.css'
})

export class InicioComponent {
  varr = false;
  varw: User = {
    id: 22,
    username: 'string',
    email: 'string'
  }

  varrr = [1, 2, 3, 4]

  activeIndex: any = 0

  ngOnInit(){
    this.varw.email = 's'

  }

}
