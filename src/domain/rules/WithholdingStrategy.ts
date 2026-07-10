// Interfaz con los datos que nos entrega el parser
export interface DatosFactura {
    subtotal: number;
    valorIvaCobrado: number;
    responsabilidadProveedor: string;
    nit: string;
    razonSocial: string;
}

// Interfaz para la respuesta que exige Cifrato
export interface ResultadoRetencion {
    impuesto: string;
    valorAplicado: number;
    justificacion: string;
}

// El contrato que TODAS las estrategias deben cumplir
export interface WithholdingStrategy {
    calcular(datosFactura: DatosFactura): ResultadoRetencion;
}
