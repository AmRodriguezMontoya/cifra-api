# Cifra-API: Motor de Auditoría y Retenciones Tributarias 🇨🇴
Cifra-API es un microservicio de alto rendimiento diseñado para la automatización inteligente del procesamiento de facturas electrónicas (XML) bajo la normativa vigente de la DIAN.
El sistema no solo calcula retenciones, sino que **audita** cada documento. Aplica reglas de exclusividad fiscal (evitando la doble tributación en Régimen Simple) y entrega una trazabilidad técnica detallada de cada decisión contable tomada por el motor.

---

## 🚀 Arquitectura 
Este proyecto ha sido diseñado bajo principios de **Clean Architecture**, garantizando que el núcleo del negocio (dominio) sea independiente de la infraestructura:

*   **Dominio:** Reglas tributarias puras (Strategy Pattern).
*   **Aplicación:** Orquestación de casos de uso y lógica de exclusividad.
*   **Infraestructura:** Parsers dinámicos y adaptadores de entrada (Express/Postman).

---

## 📋 Ejemplo de Respuesta (API Output)
Cuando la API procesa una factura, devuelve un objeto detallado con la auditoría fiscal realizada:
{
    "mensaje": "Auditoría fiscal completada con éxito",
    "resultados": [
        {
            "estado": "Procesado con éxito",
            "archivo": "2025-08-03_FLA115451_e64ed6fd1495fc84.xml",
            "proveedor": {
                "nit": "Desconocido",
                "razon_social": "Desconocido",
                "responsabilidad_fiscal": "R-99-PN"
            },
            "totales": {
                "subtotal": 0,
                "iva": 0,
                "total_factura": 0,
                "total_retenciones": 0,
                "total_a_pagar": 0
            },
            "retenciones_aplicadas": [],
            "retenciones_omitidas": [
                {
                    "impuesto": "ReteIVA",
                    "justificacion": "No aplica: Factura sin IVA."
                },
                {
                    "impuesto": "ReteFuente",
                    "justificacion": "No aplica: Subtotal ($0) menor a base mínima ($100000)."
                },
                {
                    "impuesto": "ReteICA",
                    "justificacion": "No aplica: Subtotal inválido."
                }
            ]
        },
        {
            "estado": "Procesado con éxito",
            "archivo": "2025-09-05_P12206_499c1c1fd58b39f6.xml",
            "proveedor": {
                "nit": "900290912",
                "razon_social": "INSTINCTS HUMAINS SAS",
                "responsabilidad_fiscal": "R-99-PN"
            },
            "totales": {
                "subtotal": 43738800,
                "iva": 8310372,
                "total_factura": 52049172,
                "total_retenciones": 1246555.8,
                "total_a_pagar": 50802616.2
            },
            "retenciones_aplicadas": [
                {
                    "impuesto": "ReteIVA",
                    "valor_retenido": 1246555.8,
                    "justificacion": "Aplica 15% sobre IVA base ($8310372)."
                }
            ],
            "retenciones_omitidas": [
                {
                    "impuesto": "ReteFuente",
                    "justificacion": "Omitida por exclusividad: Ya se aplicó ReteIVA (15%) al régimen del proveedor."
                },
                {
                    "impuesto": "ReteIca",
                    "justificacion": "Omitida por exclusividad: Ya se aplicó ReteIVA (15%) al régimen del proveedor."
                }
            ]
        },
        {
            "estado": "Procesado con éxito",
            "archivo": "2025-12-17_MRBA27913_bde00ee01ae83f48.xml",
            "proveedor": {
                "nit": "800095007",
                "razon_social": "IMPORTADORA NIPON S.A.",
                "responsabilidad_fiscal": "R-99-PN"
            },
            "totales": {
                "subtotal": 2273057,
                "iva": 431881,
                "total_factura": 2704938,
                "total_retenciones": 64782.149999999994,
                "total_a_pagar": 2640155.85
            },
            "retenciones_aplicadas": [
                {
                    "impuesto": "ReteIVA",
                    "valor_retenido": 64782.149999999994,
                    "justificacion": "Aplica 15% sobre IVA base ($431881)."
                }
            ],
            "retenciones_omitidas": [
                {
                    "impuesto": "ReteFuente",
                    "justificacion": "Omitida por exclusividad: Ya se aplicó ReteIVA (15%) al régimen del proveedor."
                },
                {
                    "impuesto": "ReteIca",
                    "justificacion": "Omitida por exclusividad: Ya se aplicó ReteIVA (15%) al régimen del proveedor."
                }
            ]
        },
        {
            "estado": "Procesado con éxito",
            "archivo": "2025-08-04_FEAM168587_719ce8fd88c792c1.xml",
            "proveedor": {
                "nit": "900419249",
                "razon_social": "PARQUEADERO ZONA CENTRO LA AMERICA",
                "responsabilidad_fiscal": "R-99-PN"
            },
            "totales": {
                "subtotal": 1429,
                "iva": 271,
                "total_factura": 1700,
                "total_retenciones": 40.65,
                "total_a_pagar": 1659.35
            },
            "retenciones_aplicadas": [
                {
                    "impuesto": "ReteIVA",
                    "valor_retenido": 40.65,
                    "justificacion": "Aplica 15% sobre IVA base ($271)."
                }
            ],
            "retenciones_omitidas": [
                {
                    "impuesto": "ReteFuente",
                    "justificacion": "Omitida por exclusividad: Ya se aplicó ReteIVA (15%) al régimen del proveedor."
                },
                {
                    "impuesto": "ReteIca",
                    "justificacion": "Omitida por exclusividad: Ya se aplicó ReteIVA (15%) al régimen del proveedor."
                }
            ]
        },
        {
            "estado": "Procesado con éxito",
            "archivo": "2026-04-22_FES23029_4ea525948bd872b9.xml",
            "proveedor": {
                "nit": "901557847",
                "razon_social": "COMERCIALIZADORA DE PESCADOS Y MARISCOS SEMIMAR SAS",
                "responsabilidad_fiscal": "R-99-PN"
            },
            "totales": {
                "subtotal": 310000,
                "iva": 0,
                "total_factura": 310000,
                "total_retenciones": 10745,
                "total_a_pagar": 299255
            },
            "retenciones_aplicadas": [
                {
                    "impuesto": "ReteFuente",
                    "valor_retenido": 7750,
                    "justificacion": "Aplica 2.5% sobre subtotal ($310000)."
                },
                {
                    "impuesto": "ReteICA",
                    "valor_retenido": 2995,
                    "justificacion": "Aplica 9.66x1000 sobre subtotal ($310000)."
                }
            ],
            "retenciones_omitidas": [
                {
                    "impuesto": "ReteIVA",
                    "justificacion": "No aplica: Factura sin IVA."
                }
            ]
        }
    ]
}


## 🛠️ Requisitos Previos
Antes de ejecutar el proyecto, asegúrate de tener instalado:
*   **Node.js** (v18.0.0 o superior recomendada).
*   **npm** o **yarn**.
*   **Postman** (para probar los endpoints de la API).
*   **Git** (para clonar el repositorio).

---

## ⚙️ Instalación y Ejecución

1. **Clonar el repositorio:**
   ```bash
   git clone
   cd cifra-api

   Instalar dependencias:Bashnpm install
Ejecutar en modo desarrollo:Bashnpx tsx src/app.ts
El servidor estará disponible en http://localhost:3000.📂 Estructura del ProyectoUn vistazo rápido a cómo está organizado el código para mantener la arquitectura limpia:Plaintextcifra-api/
├── src/
│   ├── application/    # Casos de uso y orquestación
│   ├── domain/         # Reglas de negocio y Estrategias (Estrategias de Rete)
│   ├── infrastructure/ # Parsers XML y adaptadores externos
│   └── app.ts          # Punto de entrada
├── tests/              # Pruebas unitarias con Jest
├── package.json        # Dependencias y scripts
└── tsconfig.json       # Configuración de TypeScript

🧪 Testing Automatizado
Validamos la precisión contable del motor mediante pruebas unitarias. Para ejecutar la suite de pruebas:Bashnpx jest

---

## 👩‍💻 Sobre la Autora

Este proyecto fue desarrollado por **Ana Maria Rodriguez Montoya**. 
*¡Gracias por revisar este proyecto!*
