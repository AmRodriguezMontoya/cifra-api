// src/domain/rules/ReteIvaStrategy.ts
import { WithholdingStrategy, WithholdingResult } from './WithholdingStrategy.js';
import { Invoice } from '../entities/Invoice.js';

export class ReteIvaStrategy implements WithholdingStrategy {
    calculate(invoice: Invoice, config: { valorUvt: number }): WithholdingResult {
        // En Colombia, el ReteIVA suele ser el 15% del valor del IVA facturado
        const ivaTotal = invoice.totalIva;
        
        if (ivaTotal <= 0) {
            return {
                impuesto: 'ReteIVA',
                aplicado: false,
                valorRetenido: 0,
                baseCalculada: 0,
                justificacion: "No se aplica ReteIVA porque la factura no tiene IVA."
            };
        }

        const valorRetenido = Math.round(ivaTotal * 0.15);

        return {
            impuesto: 'ReteIVA',
            aplicado: true,
            valorRetenido: valorRetenido,
            baseCalculada: ivaTotal,
            justificacion: `ReteIVA aplicado al 15% del IVA facturado ($${ivaTotal}).`
        };
    }
}
