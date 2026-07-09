// src/domain/rules/ReteIcaStrategy.ts
import { WithholdingStrategy, WithholdingResult } from './WithholdingStrategy.js';
import { Invoice } from '../entities/Invoice.js';

export class ReteIcaStrategy implements WithholdingStrategy {
    calculate(invoice: Invoice, config: { valorUvt: number }): WithholdingResult {
        // Tarifa de ejemplo: 1.104% (muy común en compras comerciales)
        const TARIFA_ICA = 0.01104; 
        
        const valorRetenido = Math.round(invoice.subtotal * TARIFA_ICA);

        return {
            impuesto: 'ReteICA',
            aplicado: true,
            valorRetenido: valorRetenido,
            baseCalculada: invoice.subtotal,
            justificacion: `ReteICA calculado al ${(TARIFA_ICA * 100).toFixed(3)}% sobre la base de $${invoice.subtotal}.`
        };
    }
}
