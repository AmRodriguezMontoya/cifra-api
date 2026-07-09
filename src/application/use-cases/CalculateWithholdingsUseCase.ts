// src/application/use-cases/CalculateWithholdingsUseCase.ts
import { Invoice } from '../../domain/entities/Invoice.js';
import { WithholdingStrategy } from '../../domain/rules/WithholdingStrategy.js';

export class CalculateWithholdingsUseCase {
    constructor(private readonly strategies: WithholdingStrategy[]) {}

    public execute(invoice: Invoice, config: any): any {
        const aplicadas: any[] = [];
        const omitidas: any[] = [];
        let totalRetenciones = 0;

        for (const strategy of this.strategies) {
            const resultado = strategy.calculate(invoice, config);

            if (resultado.aplicado) {
                totalRetenciones += resultado.valorRetenido;
                aplicadas.push({
                    impuesto: resultado.impuesto,
                    valor_retenido: resultado.valorRetenido,
                    justificacion: resultado.justificacion
                });
            } else {
                omitidas.push({
                    impuesto: resultado.impuesto,
                    justificacion: resultado.justificacion
                });
            }
        }

        return {
            factura_id: invoice.id,
            proveedor: { nit: invoice.proveedor.nit, razon_social: invoice.proveedor.razonSocial },
            totales: {
                subtotal: invoice.subtotal,
                iva: invoice.totalIva,
                total_factura: invoice.totalFactura,
                total_retenciones: totalRetenciones,
                total_a_pagar: invoice.totalFactura - totalRetenciones
            },
            retenciones_aplicadas: aplicadas,
            retenciones_omitidas: omitidas
        };
    }
}
