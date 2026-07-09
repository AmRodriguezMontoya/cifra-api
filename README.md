# Cifra API - Motor de Auditoría de Facturación Electrónica

Cifra API es una solución backend robusta desarrollada en **Node.js**, **Express** y **TypeScript**, diseñada para la ingesta y auditoría masiva de facturas electrónicas en formato XML (estándar de la DIAN en Colombia). 

El sistema procesa lotes de archivos, extrae la información clave de cada documento y ejecuta un motor de reglas fiscales dinámico para calcular y justificar detalladamente las retenciones aplicables (**ReteFuente**, **ReteIVA** y **ReteICA**).

## 🚀 Características Principales

- **Procesamiento en Lote (Batch Processing):** Capacidad para recibir múltiples archivos XML simultáneamente en una sola petición HTTP.
- **Tolerancia a Fallos (Resilience):** El procesamiento de un lote no se interrumpe si uno o varios archivos están dañados o no corresponden a una factura válida; el sistema reporta el error específico por archivo y continúa con los demás.
- **Arquitectura Limpia (Clean Architecture):** Separación estricta de responsabilidades en capas (Dominio, Aplicación e Infraestructura) para garantizar la mantenibilidad y escalabilidad del software.
- **Patrón de Diseño Strategy:** Las reglas de retención fiscal están desacopladas del flujo principal, permitiendo añadir o modificar impuestos (como normativas locales o cambios de tarifas) sin alterar la lógica de negocio central.
- **Configuración Fiscal Dinámica:** Los topes legales y valores de referencia (como la UVT) están centralizados, permitiendo actualizaciones rápidas sin intervención del código fuente.

---

## 🏗️ Arquitectura del Proyecto

El proyecto sigue los principios de la Arquitectura Hexagonal / Limpia:

```text
src/
├── domain/                      # Capa de Dominio (Reglas de negocio puras)
│   ├── entities/               # Entidades de negocio (Invoice, Proveedor)
│   └── rules/                  # Estrategias de retención (Strategy Pattern)
├── application/                 # Capa de Aplicación (Casos de uso)
│   └── use-cases/              # Flujos lógicos de ejecución
└── infrastructure/              # Capa de Infraestructura (Detalles tecnológicos)
    ├── config/                 # Constantes y configuraciones dinámicas
    ├── parsers/                # Analizadores sintácticos (XmlInvoiceParser)
    └── app.ts                  # Punto de entrada y servidor Express

    🛠️ Requisitos Previos
Asegúrate de tener instalado en tu entorno local:

Node.js (Versión 18 o superior recomendada)
npm (Gestor de paquetes de Node)

🏁 Instalación y Ejecución
1. Clonar el repositorio e instalar las dependencias:
npm install
2. Compilar el proyecto (TypeScript a JavaScript):
npx tsc
3. Iniciar el servidor de desarrollo:
node dist/app.js
El servidor iniciará con éxito en http://localhost:3000.

🧪 Guía de Pruebas (API Endpoints)
Calcular Retenciones (Lote Masivo)
Endpoint: /api/v1/invoices/calculate

Método: POST
Formato de entrada: form-data
Parámetros del Body: - Selecciona un campo de tipo File y adjunta uno o varios archivos XML de facturas electrónicas. El servidor procesará los archivos independientemente del nombre de la clave enviada.

Ejemplo de Respuesta Exitosa (JSON)
{
  "cantidad": 2,
  "resultados": [
    {
      "factura_id": "P12206",
      "proveedor": {
        "nit": "900290912",
        "razon_social": "INSTINCTS HUMAINS SAS"
      },
      "totales": {
        "subtotal": 43738800,
        "iva": 8310372,
        "total_factura": 52049172,
        "total_retenciones": 2822902,
        "total_a_pagar": 49226270
      },
      "retenciones_aplicadas": [
        {
          "impuesto": "ReteFuente",
          "valor_retenido": 1093470,
          "justificacion": "[Compras] Retención del 2.5% sobre base $43738800 (Supera tope de $1356183)."
        },
        {
          "impuesto": "ReteIVA",
          "valor_retenido": 1246556,
          "justificacion": "ReteIVA aplicado al 15% del IVA facturado ($8310372)."
        },
        {
          "impuesto": "ReteICA",
          "valor_retenido": 482876,
          "justificacion": "ReteICA calculado al 1.104% sobre la base de $43738800."
        }
      ],
      "retenciones_omitidas": []
    },
    {
      "archivo": "documento_invalido.xml",
      "error": "Omitido",
      "detalle": "El archivo no contiene la estructura <Invoice> necesaria."
    }
  ]
}

⚙️ Configuración y Mantenimiento
Para actualizar el valor de la UVT o modificar los topes base de retención establecidos por ley para los próximos años fiscales, modifique el archivo centralizado de configuración sin alterar el core de la aplicación:
src/infrastructure/config/constants.ts
export const FISCAL_CONFIG = {
    VALOR_UVT_2026: 50229,
    TOPES: {
        RETEFUENTE_COMPRAS_UVT: 27, 
        RETEFUENTE_SERVICIOS_UVT: 4, 
    }
};

---
## 📦 Buenas Prácticas de Entrega y Control de Versiones

Para garantizar una entrega limpia y profesional, el repositorio incluye las siguientes configuraciones:

- **Control de Versiones (`.gitignore`):** Se configuró para excluir de forma estricta las dependencias locales (`node_modules/`), el código compilado (`dist/`) y archivos temporales del sistema. Esto asegura que el repositorio contenga únicamente código fuente puro y mantenga un peso ligero.
- **Colección de Pruebas Integrada:** El archivo `Cifra_API_Postman_Collection.json` se encuentra en la raíz del proyecto para facilitar la importación inmediata de los endpoints configurados en cualquier entorno de pruebas local.

---

## ✒️ Autor y Agradecimientos

Este proyecto fue desarrollado en su totalidad por **Ana Maria Rodríguez** como parte de la prueba técnica solicitada por el equipo de ingeniería de **Cifrato**. 

La solución fue construida bajo estrictos estándares de calidad de software, aplicando principios de **Diseño Guiado por el Dominio (DDD)**, **Clean Architecture** y patrones de diseño orientados a objetos, garantizando que el motor de auditoría fiscal sea robusto, mantenible y fácilmente escalable ante futuras normativas de la DIAN. 🚀
