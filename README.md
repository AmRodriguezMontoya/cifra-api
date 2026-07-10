# Cifra-API: Motor de Auditoría y Retenciones Tributarias 🇨🇴

Cifra-API es una solución de backend de alto rendimiento, diseñada para la automatización inteligente del procesamiento de facturas electrónicas bajo la normativa vigente de la DIAN. El sistema no solo calcula retenciones, sino que **audita** cada documento, entregando una justificación técnica detallada por cada decisión fiscal aplicada.

---

## 🏗️ Arquitectura 

Este proyecto fue construido aplicando **Clean Architecture** para asegurar la escalabilidad y facilitar el testing:

*   **Dominio (`domain/rules`):** Contiene el núcleo tributario. Se implementó el **Patrón Strategy** para el cálculo de impuestos, permitiendo agregar nuevas reglas sin modificar el código central.
*   **Aplicación (`use-cases`):** Orquesta el flujo de negocio y aplica **lógica de exclusividad fiscal**. Si el sistema detecta la aplicación de **ReteIVA (15%)**, el motor bloquea automáticamente otras retenciones.
*   **Infraestructura (`infrastructure/parsers`):** Procesamiento dinámico de XML (UBL 2.1) con manejo seguro de nodos.

---

## 🛠️ Stack Tecnológico
*   **Runtime:** Node.js | **Lenguaje:** TypeScript
*   **Testing:** Jest | **Arquitectura:** Clean Architecture
*   **Procesamiento:** `xml2js` (con normalización de prefijos DIAN)

---

## 🧾 Reglas de Negocio Implementadas

| Impuesto | Criterio de Aplicación | Lógica de Exclusividad |
| :--- | :--- | :--- |
| **ReteIVA** | Responsabilidad 'O-47' o 'R-99-PN' | Tiene prioridad absoluta. |
| **ReteFuente** | Subtotal > $100.000 | Se omite si ya se aplicó ReteIVA. |
| **ReteICA** | Aplicable s/ subtotal (9.66x1000) | Se omite si ya se aplicó ReteIVA. |

---

## 📋 Requisitos Previos
Antes de comenzar, asegúrate de tener instalado en tu entorno de desarrollo:

*   **Node.js:** Versión 18.0.0 o superior ([descargar aquí](https://nodejs.org/)).
*   **npm:** Suele instalarse automáticamente con Node.js.
*   **Git:** Para gestionar el repositorio ([descargar aquí](https://git-scm.com/)).
*   **Postman:** Para realizar las pruebas de los endpoints de manera sencilla.

---

## 🚀 Instalación y Ejecución

1. **Clonar el repositorio:** `git clone https://github.com/AmRodriguezMontoya/cifra-api`
2. **Instalar dependencias:** `npm install`
3. **Ejecutar en modo desarrollo:** `npx tsx src/app.ts`

---

## 💡 Cómo usar la API
Una vez que el servidor esté activo en `http://localhost:3000`, puedes realizar peticiones:

1. Abre **Postman** y crea una petición **POST** a `http://localhost:3000/api/v1/invoices/calculate`.
2. En la pestaña **Body**, selecciona **form-data**.
3. Crea un campo con la clave `facturas`, cambia el tipo de "Text" a **"File"**.
4. Selecciona tus archivos XML de facturas y haz clic en **Send**.

---

## 📋 Ejemplo de Respuesta (Auditoría Fiscal)
```json
{
  "archivo": "Factura_2026_001.xml",
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


🧪 Testing Automatizado
El proyecto cuenta con una suite de pruebas unitarias para validar la lógica contable y el comportamiento del motor bajo diversos escenarios.
Bash
npx jest

👩‍💻 Sobre la Autora
Este proyecto fue desarrollado con dedicación por Ana Maria Rodriguez Montoya.
¡Gracias por revisar este proyecto!
