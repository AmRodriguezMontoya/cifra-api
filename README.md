# Cifra-API: Motor de Auditoría y Retenciones Tributarias 🇨🇴

Cifra-API es una solución de backend de alto rendimiento, diseñada para la automatización inteligente del procesamiento de facturas electrónicas bajo la normativa vigente de la DIAN. El sistema no solo calcula retenciones, sino que **audita** cada documento, entregando una justificación técnica detallada por cada decisión fiscal aplicada.

---

## 🏗️ Arquitectura Senior

Este proyecto fue construido aplicando **Clean Architecture** para separar claramente las responsabilidades, asegurar la escalabilidad y facilitar el testing:

*   **Capa de Dominio (`domain/rules`):** Contiene el núcleo tributario. Se implementó el **Patrón Strategy** para el cálculo de impuestos. Esto permite agregar nuevas reglas tributarias sin modificar el código existente.
*   **Capa de Aplicación (`use-cases`):** Orquesta el flujo de negocio (`CalculateWithholdingsUseCase`), ejecutando las estrategias y aplicando **lógica de exclusividad fiscal**. Si el sistema detecta la aplicación de **ReteIVA (15%)**, el motor bloquea automáticamente la aplicación de ReteFuente o ReteICA, garantizando el cumplimiento normativo.
*   **Capa de Infraestructura (`infrastructure/parsers`):** Se encarga del procesamiento dinámico de XML (UBL 2.1), utilizando encadenamiento opcional para prevenir fallos ante variaciones de estructura.

---

## 🛠️ Stack Tecnológico
*   **Runtime:** Node.js
*   **Lenguaje:** TypeScript (Tipado estricto)
*   **Testing:** Jest (Suite de pruebas unitarias)
*   **Arquitectura:** Clean Architecture / Strategy Pattern
*   **Procesamiento:** `xml2js` (con normalización de prefijos DIAN)

---

## 🧾 Reglas de Negocio Implementadas

| Impuesto | Criterio de Aplicación | Lógica de Exclusividad |
| :--- | :--- | :--- |
| **ReteIVA** | Responsabilidad 'O-47' o 'R-99-PN' | Tiene prioridad absoluta. |
| **ReteFuente** | Subtotal > $100.000 | Se omite si ya se aplicó ReteIVA. |
| **ReteICA** | Aplicable s/ subtotal (9.66x1000) | Se omite si ya se aplicó ReteIVA. |

---

## 📋 Ejemplo de Respuesta (Auditoría Fiscal)
Cuando la API procesa una factura, devuelve un objeto detallado con la auditoría realizada. Así se ve la exclusividad en acción:

```json
{
  "archivo": "Factura_2026_001.xml",
  "proveedor": {
    "nit": "900419249",
    "razon_social": "SOLUCIONES TECNOLÓGICAS SAS"
  },
  "totales": {
    "total_retenciones": 28500,
    "total_a_pagar": 1161500
  },
  "retenciones_aplicadas": [
    {
      "impuesto": "ReteIVA",
      "valor_retenido": 28500,
      "justificacion": "Aplica 15% sobre IVA base ($190000)."
    }
  ],
  "retenciones_omitidas": [
    {
      "impuesto": "ReteFuente",
      "justificacion": "Omitida por exclusividad: Ya se aplicó ReteIVA."
    }
  ]
}

🚀 Instalación y Ejecución
Clonar el repositorio: git clone [url-tu-repo]
Instalar dependencias: npm install
Ejecutar en modo desarrollo: npx tsx src/app.ts

🧪 Testing Automatizado
El proyecto cuenta con una suite de pruebas unitarias para validar la lógica contable y el comportamiento del motor bajo diversos escenarios.
Bash
npx jest

👩‍💻 Sobre la Autora
Este proyecto fue desarrollado con dedicación por Ana Maria Rodriguez Montoya.
¡Gracias por revisar este proyecto!
