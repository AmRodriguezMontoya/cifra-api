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
El servidor estará disponible en http://localhost:3000.📂 

Estructura del ProyectoUn vistazo rápido a cómo está organizado el código para mantener la arquitectura limpia:Plaintextcifra-api/

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
