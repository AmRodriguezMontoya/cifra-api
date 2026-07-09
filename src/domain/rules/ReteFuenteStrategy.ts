// src/domain/rules/ReteFuenteStrategy.ts
import { WithholdingStrategy, WithholdingResult } from './WithholdingStrategy.js';
import { Invoice } from '../entities/Invoice.js';

export class ReteFuenteStrategy implements WithholdingStrategy {
    calculate(invoice: Invoice, config: any): WithholdingResult {
        // Calculamos el tope real basado en la UVT del config
        const topeCompras = config.VALOR_UVT_2026 * config.TOPES.RETEFUENTE_COMPRAS_UVT;
        
        if (invoice.subtotal >= topeCompras) {
            const valorRetenido = Math.round(invoice.subtotal * 0.025);
            return {
                impuesto: 'ReteFuente',
                aplicado: true,
                valorRetenido: valorRetenido,
                baseCalculada: invoice.subtotal,
                justificacion: `[Compras] Retención del 2.5% sobre base $${invoice.subtotal} (Supera tope de $${topeCompras}).`
            };
        }

        return {
            impuesto: 'ReteFuente',
            aplicado: false,
            valorRetenido: 0,
            baseCalculada: invoice.subtotal,
            justificacion: `[Compras] Omitido sobre base $${invoice.subtotal} (No supera tope de $${topeCompras}).`
        };
    }
}
