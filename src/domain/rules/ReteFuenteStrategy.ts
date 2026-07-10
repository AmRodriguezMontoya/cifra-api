import { WithholdingStrategy, DatosFactura, ResultadoRetencion } from './WithholdingStrategy';

export class ReteFuenteStrategy implements WithholdingStrategy {
    private readonly TARIFA = 0.025;
    private readonly BASE_MINIMA = 100000;

    public calcular(datos: DatosFactura): ResultadoRetencion {
        if (datos.subtotal < this.BASE_MINIMA) {
            return {
                impuesto: "ReteFuente",
                valorAplicado: 0,
                justificacion: `No aplica: Subtotal ($${datos.subtotal}) menor a base mínima ($${this.BASE_MINIMA}).`
            };
        }

        return {
            impuesto: "ReteFuente",
            valorAplicado: datos.subtotal * this.TARIFA,
            justificacion: `Aplica 2.5% sobre subtotal ($${datos.subtotal}).`
        };
    }
}
