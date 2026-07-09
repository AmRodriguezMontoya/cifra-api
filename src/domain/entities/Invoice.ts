// src/domain/entities/Invoice.ts

// Molde del proveedor (quien emite la factura a Cifrato)
export interface Provider {
    nit: string;
    razonSocial: string;
    regimen: 'Comun' | 'Simplificado' | 'GranContribuyente' | 'Autorretenedor';
}

// Molde de cada línea o producto que nos están cobrando
export interface InvoiceItem {
    id: string;
    descripcion: string;
    tipoConcepto: 'Compras' | 'Servicios' | 'Honorarios' | 'Arrendamientos';
    valorBase: number; // El precio sin impuestos
    valorIva: number;
}

// Molde principal de la Factura
export class Invoice {
    constructor(
        public readonly id: string,
        public readonly proveedor: Provider,
        public readonly items: InvoiceItem[],
        public readonly subtotal: number,
        public readonly totalIva: number,
        public readonly totalFactura: number
    ) {}
}
