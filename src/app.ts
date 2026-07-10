import express from 'express';
import multer from 'multer';
import { parseStringPromise, processors } from 'xml2js';
import { XmlInvoiceParser } from './infrastructure/parsers/XmlInvoiceParser';
import { CalculateWithholdingsUseCase } from './application/use-cases/CalculateWithholdingsUseCase';
import { ReteIvaStrategy } from './domain/rules/ReteIvaStrategy';
import { ReteFuenteStrategy } from './domain/rules/ReteFuenteStrategy';
import { ReteIcaStrategy } from './domain/rules/ReteIcaStrategy';

const app = express();
const port = 3000;

// Configuración de Multer para manejar la carga de archivos en memoria
const storage = multer.memoryStorage();
const upload = multer({ storage });

app.use(express.json());

// 1. Inicializamos el Parser de XML y las Estrategias Tributarias
const parser = new XmlInvoiceParser();

// 2. Instanciamos el Caso de Uso inyectándole las 3 estrategias (Patrón Strategy)
const calculateWithholdingsUseCase = new CalculateWithholdingsUseCase([
    new ReteIvaStrategy(),
    new ReteFuenteStrategy(),
    new ReteIcaStrategy()
]);

// Ruta POST principal para procesar las facturas de Cifrato
app.post('/api/v1/invoices/calculate', upload.array('facturas'), async (req, res) => {
    try {
        // Escudo de seguridad: Validar que existan archivos en la petición
        if (!req.files || !Array.isArray(req.files) || req.files.length === 0) {
            return res.status(400).json({ 
                error: "No se recibieron archivos. Asegúrate de usar la clave 'facturas' en el form-data de Postman." 
            });
        }

        // Procesamos el arreglo de archivos usando Promise.all debido al parseo asíncrono
        const resultados = await Promise.all(req.files.map(async (file: Express.Multer.File) => {
            try {
                // Convertir el buffer del archivo cargado a texto UTF-8
                const xmlString = file.buffer.toString('utf-8');
                
                // Normalizar el XML eliminando los prefijos "cac:" y "cbc:" de la DIAN
                const xmlParseado = await parseStringPromise(xmlString, {
                    tagNameProcessors: [processors.stripPrefix],
                    explicitArray: true,
                    ignoreAttrs: true
                });

                // Extraer subtotal, base de IVA y responsabilidad con el parser dinámico
                const datosFiscales = parser.extraerDatosFiscales(xmlParseado);

                // Ejecutar la lógica de auditoría mediante el Caso de Uso
                const resultadoAuditoria = calculateWithholdingsUseCase.execute(datosFiscales, file.originalname);

                return {
                    estado: "Procesado con éxito",
                    ...resultadoAuditoria
                };

            } catch (error: any) {
                return {
                    archivo: file.originalname,
                    estado: "Error al procesar",
                    detalle: error.message
                };
            }
        }));

        // Devolvemos la respuesta final consolidada
        return res.json({
            mensaje: "Auditoría fiscal completada con éxito",
            resultados
        });

    } catch (globalError: any) {
        return res.status(500).json({ 
            error: "Error interno del servidor", 
            detalle: globalError.message 
        });
    }
});

app.listen(port, () => {
    console.log(`🚀 Servidor corriendo con Arquitectura Limpia en http://localhost:${port}`);
});
