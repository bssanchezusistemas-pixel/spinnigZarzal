# CONTRATO DE PRESTACIÓN DE SERVICIOS DE DESARROLLO DE PLATAFORMA WEB Y MANTENIMIENTO

**CONTRATANTE:** [NOMBRE DEL CLIENTE / REPRESENTANTE LEGAL]  
**NIT / C.C.:** [NÚMERO DE IDENTIFICACIÓN]  
**ESTABLECIMIENTO:** PANTHER RIDE INDOOR CYCLING  
**DOMICILIO:** Zarzal, Valle del Cauca, Colombia  

**CONTRATISTA:** [TU NOMBRE / NOMBRE COMERCIAL O EMPRESA]  
**NIT / C.C.:** [TU NÚMERO DE IDENTIFICACIÓN]  
**DOMICILIO:** [TU CIUDAD, COLOMBIA]  

Entre los suscritos a saber, por una parte **[NOMBRE DEL CLIENTE]**, mayor de edad, identificado como aparece al pie de su firma, actuando en calidad de propietario y/o representante de **PANTHER RIDE INDOOR CYCLING**, quien en adelante se denominará **EL CONTRATANTE**; y por la otra parte **[TU NOMBRE]**, mayor de edad, identificado como aparece al pie de su firma, quien en adelante se denominará **EL CONTRATISTA**, hemos convenido celebrar el presente **CONTRATO DE PRESTACIÓN DE SERVICIOS PROFESIONALES DE DESARROLLO TECNOLÓGICO Y MANTENIMIENTO**, el cual se regirá por la legislación comercial y civil colombiana aplicable y por las siguientes cláusulas:

---

### CLÁUSULA PRIMERA: OBJETO DEL CONTRATO
**EL CONTRATISTA** se compromete para con **EL CONTRATANTE** a realizar el diseño, programación, configuración, pruebas y puesta en producción de una **Plataforma Web y Web App Interactiva (PWA)** especializada para la reserva de clases, gestión de bicicletas y administración general del estudio deportivo **PANTHER RIDE INDOOR CYCLING**, ubicado en el municipio de Zarzal, Valle del Cauca.

---

### CLÁUSULA SEGUNDA: ALCANCE TÉCNICO Y FUNCIONES INCLUIDAS
La plataforma web contará con las siguientes funcionalidades y módulos desarrollados a medida:

#### 1. Módulo Público y Experiencia del Alumno (Frontend Móvil y Web)
* **Portal de Inicio y Marca:** Pantalla de bienvenida con identidad visual deportiva de *Panther Ride* (esquema de color oscuro con acentos neón de alta energía), logotipo oficial, eslogan institucional y accesos directos.
* **Selección y Reserva de Clases:** Selector interactivo de fecha, horario (mañanas y tardes), modalidad de clase (*Indoor Cycling*) y asignación de coach/instructor con fotografía.
* **Indicador de Cupos en Vivo:** Barra de progreso visual que muestra en tiempo real la disponibilidad de la sala (ejemplo: 14/14 cupos disponibles).
* **Mapa Interactivo de Sala (14 Bicicletas tipo Cine):** Representación visual exacta de la sala física con perspectiva de tarima frontal (*PANTALLA / INSTRUCTOR*), permitiendo al alumno seleccionar su bicicleta preferida entre los puestos `01` al `14`. Los estados visuales incluyen:
  * *Disponible* (indicador verde)
  * *Seleccionada* (resplandor amarillo neón)
  * *Reservada por otro alumno* (indicador rojo, bloqueada para selección)
  * *En Mantenimiento* (indicador ámbar)
* **Resumen de Reserva:** Pantalla de validación con el detalle de la sesión, bicicleta elegida y constancia de pago/política de cobro en recepción ($0 reserva previa).
* **Ticket Digital con Código QR de Ingreso:** Generación automática de código único de reserva (formato `PR-AAAAMMDD-XXX`) y código QR de alta resolución para validación rápida en la entrada del local.
* **Simulación de pase digital:** Botón para agregar y conservar el pase en el teléfono móvil.
* **Módulo "Mis Clases":** Sección privada para el alumno con pestañas de *Próximas Clases* (con opción de ver ticket QR y detalles) e *Historial de Clases asistidas*.
* **Calendario Mensual de Disponibilidad:** Visualizador tipo calendario con navegación por meses y días para consultar toda la programación semanal de entrenamientos.

#### 2. Módulo Administrativo y Operativo (Panel de Control para Recepción / Dueño)
* **Panel Principal con Métricas en Vivo:** Visualización del porcentaje de ocupación del día y accesos directos de gestión rápida.
* **Gestión de Sala y Bicicletas en Tiempo Real:** Monitor interactivo de las 14 bicicletas donde el administrador puede:
  * Consultar el nombre, teléfono y hora del cliente que reservó cada bicicleta.
  * Cambiar el estado de cualquier puesto a *"En Mantenimiento"* ante fallas mecánicas.
  * Liberar cupos o cancelar reservas de manera manual si un usuario no asiste.
* **Directorio de Clientes (CRM Básico):** Listado de usuarios registrados con búsqueda en vivo, filtro por activos/inactivos, datos de contacto (correo y celular) y botón de enlace directo para **abrir chat de WhatsApp** con un solo clic.
* **Control de Concurrencia en Base de Datos:** Reglas de seguridad que impiden técnicamente la doble reserva o sobreventa simultánea de la misma bicicleta.
* **Arquitectura Responsive / PWA:** La plataforma funciona con máxima fluidez en teléfonos inteligentes (iOS y Android) sin necesidad de descargas forzosas, adaptándose también a tablets y computadores de escritorio.

---

### CLÁUSULA TERCERA: VALOR DEL PROYECTO Y FORMA DE PAGO
El valor total acordado por el desarrollo, configuración e implementación de la plataforma web descrita en la Cláusula Segunda es de **UN MILLÓN QUINIENTOS MIL PESOS MONEDA CORRIENTE ($1.500.000 COP)**, pagaderos de la siguiente manera:

1. **PRIMER PAGO (Anticipo del 50%):** La suma de **SETECIENTOS CINCUENTA MIL PESOS ($750.000 COP)**, cancelados a la firma del presente contrato, requisito indispensable para el inicio de las labores de desarrollo.
2. **SEGUNDO PAGO (Saldo final del 50%):** La suma de **SETECIENTOS CINCUENTA MIL PESOS ($750.000 COP)**, cancelados una vez finalizado el proyecto, realizadas las pruebas de funcionamiento y realizada la entrega formal de la plataforma web en funcionamiento.

> **Medio de pago:** Transferencia a la cuenta bancaria / Nequi / Daviplata a nombre de **EL CONTRATISTA**:  
> * Banco / Entidad: `[INDICAR BANCO O NEQUI]`  
> * Tipo de cuenta: `[AHORROS / CORRIENTE]`  
> * Número de cuenta: `[NÚMERO DE CUENTA / CELULAR]`  

---

### CLÁUSULA CUARTA: SERVICIO MENSUAL DE HOSPEDAJE, MANTENIMIENTO Y SOPORTE (MENSUALIDAD)
Una vez entregada la página web y puesta en marcha, para garantizar su funcionamiento ininterrumpido en internet, **EL CONTRATANTE** tomará el servicio de Mantenimiento y Soporte Continuo con **EL CONTRATISTA** bajo las siguientes condiciones:

1. **Valor de la Mensualidad:** La suma de **`$[MONTO_MENSUALIDAD, EJ: 80.000 a 120.000]` PESOS COP** mensuales, pagaderos dentro de los primeros cinco (5) días hábiles de cada mes calendario.
2. **Servicios Incluidos en la Mensualidad:**
   * **Hosting en la nube:** Alojamiento de alta velocidad con certificado de seguridad SSL (https://).
   * **Base de datos en la nube:** Mantenimiento y almacenamiento de datos de reservas, clases y clientes.
   * **Copias de seguridad periódicas (Backups):** Respaldo de la base de datos para prevención ante pérdidas de información.
   * **Soporte técnico prioritario:** Corrección de incidencias, errores inesperados o caídas del servicio en horarios laborales.
   * **Actualizaciones menores de contenido:** Modificación mensual de nombres de instructores, ajustes de horarios de clases o cambio de textos informativos (hasta 2 solicitudes al mes).
3. **Exclusiones de la Mensualidad:** No incluye desarrollo de nuevos módulos completos (ejemplo: integración de pasarelas de pago automáticas con bancos, facturación electrónica Dian, etc.), los cuales, si son solicitados a futuro, serán cotizados de forma independiente mediante anexo.

---

### CLÁUSULA QUINTA: PLAZO DE ENTREGA Y CRONOGRAMA
El plazo estimado para la entrega de la plataforma web completa para pruebas de usuario será de **`[NÚMERO, EJ: 15 A 20]` DÍAS HÁBILES**, contados a partir del cumplimiento de dos condiciones:
1. Recepción efectiva del primer pago (anticipo del 50%).
2. Entrega por parte de **EL CONTRATANTE** de la totalidad de insumos necesarios (fotografías finales, lista oficial de instructores y horarios).

---

### CLÁUSULA SEXTA: OBLIGACIONES DE LAS PARTES

#### Obligaciones de EL CONTRATISTA:
1. Diseñar y programar la plataforma web cumpliendo fielmente las especificaciones técnicas descritas.
2. Garantizar la correcta visualización en dispositivos móviles y de escritorio.
3. Brindar una sesión de inducción/capacitación virtual o presencial al personal de Panther Ride sobre el uso del Panel Administrativo.
4. Entregar la plataforma web configurada con su enlace de acceso público.
5. Garantizar la estabilidad del software durante un periodo de garantía de **treinta (30) días calendario** posteriores a la entrega final contra cualquier defecto propio de programación.

#### Obligaciones de EL CONTRATANTE:
1. Realizar los pagos en los plazos y montos acordados en las Cláusulas Tercera y Cuarta.
2. Suministrar oportunamente la información requerida (logotipos, fotos, datos de contacto de Zarzal).
3. Realizar las pruebas de usuario y validaciones en los tiempos coordinados para no retrasar el cronograma.

---

### CLÁUSULA SÉPTIMA: PROPIEDAD INTELECTUAL Y DERECHOS DE USO
Una vez cancelado el 100% del valor pactado en la Cláusula Tercera:
1. **EL CONTRATANTE** será el propietario exclusivo de todos los datos de sus clientes, reservas, contenidos y marcas comerciales depositadas en la plataforma.
2. **EL CONTRATANTE** recibe una licencia de uso comercial ilimitada para la explotación de la plataforma web en su sede de Zarzal, Valle del Cauca.
3. **EL CONTRATISTA** se reserva el derecho de exhibir el proyecto en su portafolio profesional como caso de éxito.

---

### CLÁUSULA OCTAVA: CONFIDENCIALIDAD Y PROTECCIÓN DE DATOS
Ambas partes se comprometen a guardar estricta reserva de la información comercial y datos personales de los clientes de Panther Ride a los que tengan acceso, en cumplimiento de la **Ley 1581 de 2012** (Habeas Data de Colombia) y normativas complementarias.

---

Para constancia de lo anterior y en señal de aceptación de todas y cada una de las cláusulas, se firma el presente documento en dos (2) ejemplares del mismo tenor y valor, en el municipio de Zarzal / `[Tu Ciudad]`, a los `[DÍA]` días del mes de `[MES]` de 2026.

<br><br>

_____________________________________________  
**EL CONTRATANTE**  
**Nombre:** [Nombre del Cliente]  
**C.C. / NIT:** _____________________________  
**En representación de:** Panther Ride Indoor Cycling  
**Teléfono:** _______________________________  

<br><br>

_____________________________________________  
**EL CONTRATISTA**  
**Nombre:** [Tu Nombre o Empresa]  
**C.C. / NIT:** _____________________________  
**Teléfono:** _______________________________  
**Correo electrónico:** _____________________  
