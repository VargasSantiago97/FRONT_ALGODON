interface Socio {
    razon_social: string;
    id: string;
    porcentaje: number;
}

/** SOCIEDADES */
export interface Sociedad {
    _id: string;
    descripcion: string;
    socios: Socio[];
}