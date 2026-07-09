// src/app.ts
import express, { Request, Response } from 'express';
import multer from 'multer';
import { XmlInvoiceParser } from './infrastructure/parsers/XmlInvoiceParser.js';
import { CalculateWithholdingsUseCase } from './application/use-cases/CalculateWithholdingsUseCase.js';
import { ReteFuenteStrategy } from './domain/rules/ReteFuenteStrategy.js';
import { ReteIvaStrategy } from './domain/rules/ReteIvaStrategy.js';
import { ReteIcaStrategy } from './domain/rules/ReteIcaStrategy.js';
import { FISCAL_CONFIG } from './infrastructure/config/constants.js';

const app = express();
const port = 3000;
const upload = multer({ storage: multer.memoryStorage() });

app.use(express.json());

app.post('/api/v1/invoices/calculate', upload.any(), (req: Request, res: Response): void => {
    const files = req.files as Express.Multer.File[];
    const parser = new XmlInvoiceParser();
    const strategies = [new ReteFuenteStrategy(), new ReteIvaStrategy(), new ReteIcaStrategy()];
    const useCase = new CalculateWithholdingsUseCase(strategies);

    const resultados = files.map(file => {
        const xmlContent = file.buffer.toString('utf-8');
        if (!xmlContent.includes('<Invoice')) {
            return { archivo: file.originalname, error: "Omitido", detalle: "No es una factura válida." };
        }
        try {
            const invoice = parser.parse(xmlContent);
            return useCase.execute(invoice, FISCAL_CONFIG); // Pasamos toda la config dinámica
        } catch (err: any) {
            return { archivo: file.originalname, error: "Error al procesar", detalle: err.message };
        }
    });

    res.status(200).json({ cantidad: resultados.length, resultados });
});

app.listen(port, () => console.log(`🚀 Auditor Fiscal online en http://localhost:${port}`));
