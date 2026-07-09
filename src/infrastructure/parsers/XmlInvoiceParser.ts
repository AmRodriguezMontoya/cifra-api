// src/infrastructure/parsers/XmlInvoiceParser.ts
import { XMLParser } from 'fast-xml-parser';
import { Invoice, InvoiceItem, Provider } from '../../domain/entities/Invoice';

export class XmlInvoiceParser {
    private parser: XMLParser;

    constructor() {
        // Configuramos el parser para que ignore los namespaces molestos como 'cac:' o 'cbc:'
        this.parser = new XMLParser({
            ignoreAttributes: false,
            removeNSPrefix: true, // ¡Este es el truco de magia! Convierte <cbc:ID> en <ID>
        });
    }

    public parse(xmlContent: string): Invoice {
        const jsonObj = this.parser.parse(xmlContent);
        
        // La etiqueta principal puede ser Invoice o AttachedDocument dependiendo si viene en contenedor
        const invoiceRoot = jsonObj.Invoice || jsonObj.AttachedDocument?.Attachment?.ExternalReference?.Description?.Invoice;
        
        if (!invoiceRoot) {
            throw new Error('Estructura XML no válida o no se encontró la etiqueta <Invoice>.');
        }

        // 1. Extraer datos del Proveedor (AccountingSupplierParty)
        const supplierParty = invoiceRoot.AccountingSupplierParty?.Party;
        const taxScheme = supplierParty?.PartyTaxScheme;
        
        const provider: Provider = {
            nit: taxScheme?.CompanyID?.['#text'] || taxScheme?.CompanyID?.toString() || 'NIT_NO_ENCONTRADO',
            razonSocial: taxScheme?.RegistrationName || 'RAZON_SOCIAL_NO_ENCONTRADA',
            regimen: taxScheme?.TaxLevelCode === 'O-47' ? 'GranContribuyente' : 'Comun' // Ejemplo básico de mapeo
        };

        // 2. Extraer Totales (LegalMonetaryTotal)
        const monetaryTotal = invoiceRoot.LegalMonetaryTotal;
        const subtotal = parseFloat(monetaryTotal?.LineExtensionAmount?.['#text'] || monetaryTotal?.LineExtensionAmount || '0');
        const totalIva = parseFloat(monetaryTotal?.TaxInclusiveAmount?.['#text'] || monetaryTotal?.TaxInclusiveAmount || '0') - subtotal;
        const totalFactura = parseFloat(monetaryTotal?.PayableAmount?.['#text'] || monetaryTotal?.PayableAmount || '0');

        // 3. Extraer Líneas de Detalle (InvoiceLine)
        // A veces es un array (muchos items), a veces un objeto (un solo item)
        let rawLines = invoiceRoot.InvoiceLine;
        if (!rawLines) rawLines = [];
        if (!Array.isArray(rawLines)) rawLines = [rawLines];

        const items: InvoiceItem[] = rawLines.map((line: any) => {
            const descripcion = line.Item?.Description || 'Sin descripción';
            const valorBase = parseFloat(line.LineExtensionAmount?.['#text'] || line.LineExtensionAmount || '0');
            
            // Heurística simple para determinar el concepto basado en el texto del item
            let tipoConcepto: 'Compras' | 'Servicios' | 'Honorarios' | 'Arrendamientos' = 'Compras';
            const textLower = descripcion.toString().toLowerCase();
            if (textLower.includes('servicio') || textLower.includes('mantenimiento') || textLower.includes('parqueadero')) {
                tipoConcepto = 'Servicios';
            } else if (textLower.includes('honorario') || textLower.includes('asesoría')) {
                tipoConcepto = 'Honorarios';
            } else if (textLower.includes('arriendo') || textLower.includes('alquiler')) {
                tipoConcepto = 'Arrendamientos';
            }

            return {
                id: line.ID?.toString() || '0',
                descripcion,
                tipoConcepto,
                valorBase,
                valorIva: 0 // Simplificado para este ejemplo
            };
        });

        // Retornamos nuestra entidad de dominio pura y limpia
        return new Invoice(
            invoiceRoot.ID?.toString() || 'SN',
            provider,
            items,
            subtotal,
            totalIva,
            totalFactura
        );
    }
}
