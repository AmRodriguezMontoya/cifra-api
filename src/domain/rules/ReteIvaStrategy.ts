import { WithholdingStrategy, DatosFactura, ResultadoRetencion } from './WithholdingStrategy';

export class ReteIvaStrategy implements WithholdingStrategy {
    private readonly TARIFA = 0.15;
    private readonly RESPONSABILIDADES = ['O-47', 'R-99-PN'];

    public calcular(datos: DatosFactura): ResultadoRetencion {
        if (!this.RESPONSABILIDADES.includes(datos.responsabilidadProveedor)) {
            return {
                impuesto: "ReteIVA",
                valorAplicado: 0,
                justificacion: `No aplica por responsabilidad fiscal ${datos.responsabilidadProveedor}.`
            };
        }

        if (datos.valorIvaCobrado <= 0) {
            return {
                impuesto: "ReteIVA",
                valorAplicado: 0,
                justificacion: "No aplica: Factura sin IVA."
            };
        }

        return {
            impuesto: "ReteIVA",
            valorAplicado: datos.valorIvaCobrado * this.TARIFA,
            justificacion: `Aplica 15% sobre IVA base ($${datos.valorIvaCobrado}).`
        };
    }
}
