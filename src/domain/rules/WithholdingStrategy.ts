// src/domain/rules/WithholdingStrategy.ts
import { Invoice } from '../entities/Invoice.js';

export interface WithholdingResult {
    impuesto: 'ReteFuente' | 'ReteIVA' | 'ReteICA';
    aplicado: boolean;
    valorRetenido: number;
    baseCalculada: number;
    justificacion: string;
}

export interface WithholdingStrategy {
    calculate(invoice: Invoice, config: { valorUvt: number }): WithholdingResult;
}
