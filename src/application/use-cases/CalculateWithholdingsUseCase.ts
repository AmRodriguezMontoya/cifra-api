import { WithholdingStrategy, DatosFactura } from '../../domain/rules/WithholdingStrategy';

export class CalculateWithholdingsUseCase {
    private strategies: WithholdingStrategy[];

    constructor(strategies: WithholdingStrategy[]) {
        this.strategies = strategies;
    }

    public execute(datosFactura: DatosFactura, nombreArchivo: string) {
        const aplicadas: any[] = [];
        const omitidas: any[] = [];
        let totalRetenciones = 0;
        let reteIvaApplied = false; // Flag para controlar la exclusividad

        for (const strategy of this.strategies) {
            // Identificador de la clase actual
            const nombreEstrategia = strategy.constructor.name;
            const isReteIva = nombreEstrategia === 'ReteIvaStrategy';

            // LÓGICA DE EXCLUSIVIDAD: Si ya se aplicó ReteIVA, omitimos las demás
            if (reteIvaApplied && !isReteIva) {
                omitidas.push({
                    impuesto: nombreEstrategia.replace('Strategy', ''),
                    justificacion: "Omitida por exclusividad: Ya se aplicó ReteIVA (15%) al régimen del proveedor."
                });
                continue; // Saltamos a la siguiente estrategia
            }

            const resultado = strategy.calcular(datosFactura);

            if (resultado.valorAplicado > 0) {
                totalRetenciones += resultado.valorAplicado;
                aplicadas.push({
                    impuesto: resultado.impuesto,
                    valor_retenido: resultado.valorAplicado,
                    justificacion: resultado.justificacion
                });

                // Si la que acabamos de aplicar es ReteIva, activamos el flag de bloqueo
                if (isReteIva) {
                    reteIvaApplied = true;
                }
            } else {
                omitidas.push({
                    impuesto: resultado.impuesto,
                    justificacion: resultado.justificacion
                });
            }
        }

        const totalFactura = datosFactura.subtotal + datosFactura.valorIvaCobrado;
        const totalAPagar = totalFactura - totalRetenciones;

        return {
            archivo: nombreArchivo,
            proveedor: { 
                nit: datosFactura.nit,
                razon_social: datosFactura.razonSocial,
                responsabilidad_fiscal: datosFactura.responsabilidadProveedor 
            },
            totales: {
                subtotal: datosFactura.subtotal,
                iva: datosFactura.valorIvaCobrado,
                total_factura: totalFactura,
                total_retenciones: totalRetenciones,
                total_a_pagar: totalAPagar
            },
            retenciones_aplicadas: aplicadas,
            retenciones_omitidas: omitidas
        };
    }
}
