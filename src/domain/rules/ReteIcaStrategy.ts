import { WithholdingStrategy, DatosFactura, ResultadoRetencion } from './WithholdingStrategy';

export class ReteIcaStrategy implements WithholdingStrategy {
    private readonly TARIFA_POR_MIL = 9.66;

    public calcular(datos: DatosFactura): ResultadoRetencion {
        if (datos.subtotal <= 0) {
            return {
                impuesto: "ReteICA",
                valorAplicado: 0,
                justificacion: "No aplica: Subtotal inválido."
            };
        }

        return {
            impuesto: "ReteICA",
            valorAplicado: Math.round((datos.subtotal * this.TARIFA_POR_MIL) / 1000),
            justificacion: `Aplica ${this.TARIFA_POR_MIL}x1000 sobre subtotal ($${datos.subtotal}).`
        };
    }
}
