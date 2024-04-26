interface Socio {
    razon_social: string;
    id: string;
}

/** GRUPOS PARA RETIROS */
export interface Grupo_retiro {
    _id: string;
    descripcion: string;
    socios: Socio[];
}