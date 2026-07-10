export interface DatosFacturaParaImpuestos {
    subtotal: number;
    valorIvaCobrado: number;
    responsabilidadProveedor: string;
    nit: string;
    razonSocial: string;
}

export class XmlInvoiceParser {
    
    public extraerDatosFiscales(xmlParseado: any): DatosFacturaParaImpuestos {
        const tipoDocumento = Object.keys(xmlParseado).find(key => 
            key === 'Invoice' || key === 'CreditNote' || key === 'DebitNote'
        ) || Object.keys(xmlParseado)[0];

        const documento = xmlParseado[tipoDocumento];

        if (!documento) {
            throw new Error("Estructura de documento XML no reconocida o vacía.");
        }
        
        // 1. Extraer Subtotal
        const subtotal = Number(documento.LegalMonetaryTotal?.[0]?.LineExtensionAmount?.[0] || 0);

        // 2. Extraer IVA
        let valorIvaCobrado = 0;
        const agrupacionesImpuestos = documento.TaxTotal || [];
        for (const impuesto of agrupacionesImpuestos) {
            const codigoImpuesto = impuesto.TaxSubtotal?.[0]?.TaxCategory?.[0]?.TaxScheme?.[0]?.ID?.[0];
            if (codigoImpuesto === '01') { 
                valorIvaCobrado = Number(impuesto.TaxAmount?.[0] || 0);
                break; 
            }
        }

        // 3. Extraer Datos del Proveedor (NIT, Razón Social y Responsabilidad)
        const proveedorNode = documento.AccountingSupplierParty?.[0]?.Party?.[0];
        const esquemaTributarioProveedor = proveedorNode?.PartyTaxScheme?.[0];
        
        const nit = String(esquemaTributarioProveedor?.CompanyID?.[0] || 'Desconocido');
        
        // Buscamos el nombre de la empresa en las dos etiquetas más comunes de la DIAN
        const razonSocial = String(esquemaTributarioProveedor?.RegistrationName?.[0] || proveedorNode?.PartyName?.[0]?.Name?.[0] || 'Desconocido');
        
        const responsabilidadProveedor = String(esquemaTributarioProveedor?.TaxLevelCode?.[0] || 'R-99-PN');

        return {
            subtotal,
            valorIvaCobrado,
            responsabilidadProveedor,
            nit,
            razonSocial
        };
    }
}
