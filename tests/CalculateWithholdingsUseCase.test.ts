import { CalculateWithholdingsUseCase } from '../src/application/use-cases/CalculateWithholdingsUseCase';
import { ReteIvaStrategy } from '../src/domain/rules/ReteIvaStrategy';
import { ReteFuenteStrategy } from '../src/domain/rules/ReteFuenteStrategy';
import { ReteIcaStrategy } from '../src/domain/rules/ReteIcaStrategy';
import { DatosFactura } from '../src/domain/rules/WithholdingStrategy';

describe('Pruebas Unitarias para CalculateWithholdingsUseCase', () => {
    let useCase: CalculateWithholdingsUseCase;

    // Antes de cada prueba, inicializamos el caso de uso con sus 3 estrategias reales
    beforeEach(() => {
        useCase = new CalculateWithholdingsUseCase([
            new ReteIvaStrategy(),
            new ReteFuenteStrategy(),
            new ReteIcaStrategy()
        ]);
    });

    test('Debería aplicar todas las retenciones si cumple con bases y responsabilidades', () => {
        const datosFactura: DatosFactura = {
            subtotal: 1000000, // Supera base mínima de ReteFuente ($100,000)
            valorIvaCobrado: 190000, // Hay IVA para aplicar ReteIVA
            responsabilidadProveedor: 'R-99-PN', // Aplica ReteIVA
            nit: '900419249',
            razonSocial: 'PARQUEADERO TEST SAS'
        };

        const resultado = useCase.execute(datosFactura, 'factura_perfecta.xml');

        expect(resultado.retenciones_aplicadas.length).toBe(3); // ReteFuente, ReteICA y ReteIVA aplicadas
        expect(resultado.retenciones_omitidas.length).toBe(0);
        
        // Verificamos cálculos matemáticos exactos
        expect(resultado.totales.total_retenciones).toBe(190000 * 0.15 + 1000000 * 0.025 + (1000000 * 9.66 / 1000));
    });

    test('Debería omitir ReteFuente si el subtotal es menor a la base mínima', () => {
        const datosFactura: DatosFactura = {
            subtotal: 50000, // Menor a $100,000
            valorIvaCobrado: 9500,
            responsabilidadProveedor: 'R-99-PN',
            nit: '900419249',
            razonSocial: 'PARQUEADERO TEST SAS'
        };

        const resultado = useCase.execute(datosFactura, 'factura_pequena.xml');

        // Buscar si ReteFuente quedó en la lista de omitidas
        const reteFuenteOmitida = resultado.retenciones_omitidas.find(r => r.impuesto === 'ReteFuente');
        
        expect(reteFuenteOmitida).toBeDefined();
        expect(reteFuenteOmitida?.justificacion).toContain('No aplica. El subtotal ($50000) no supera la base mínima');
    });

    test('Debería omitir ReteIVA si la factura viene con IVA en cero', () => {
        const datosFactura: DatosFactura = {
            subtotal: 500000,
            valorIvaCobrado: 0, // Sin IVA
            responsabilidadProveedor: 'R-99-PN',
            nit: '900419249',
            razonSocial: 'PARQUEADERO TEST SAS'
        };

        const resultado = useCase.execute(datosFactura, 'factura_sin_iva.xml');

        const reteIvaOmitido = resultado.retenciones_omitidas.find(r => r.impuesto === 'ReteIVA');
        
        expect(reteIvaOmitido).toBeDefined();
        expect(reteIvaOmitido?.justificacion).toContain('La factura no presenta cobro de IVA');
    });
});
