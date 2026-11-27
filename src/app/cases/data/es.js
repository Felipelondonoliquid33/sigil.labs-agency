import { pacifista } from "./pacifista";
import { praxuz } from "./praxuz";
import { nexus } from "./nexus";
import { agents } from "./agents";

/* Spanish versions. Only the words are written here: figures, scenes and
   chapter ids come from the English stories, so the two can never disagree. */
function translate(base, es) {
  return {
    ...base,
    ...es,
    lang: "es",
    chapters: base.chapters.map((chapter, i) => {
      const c = es.chapters[i];
      return {
        ...chapter,
        label: c.label,
        title: c.title,
        body: c.body,
        note: chapter.note ? c.note : undefined,
        metrics: chapter.metrics.map((m, k) => ({ ...m, label: c.metrics[k] })),
      };
    }),
    method: { ...es.method },
    next: { ...base.next, href: `/es${base.next.href}`, label: es.next },
    work: base.work ? { href: base.work.href.startsWith("/services/") ? `/es${base.work.href}` : base.work.href, label: es.work } : undefined,
  };
}

export const caseStoriesEs = {
  pacifista: translate(pacifista, {
    card: "Una década de periodismo de paz recuperada tras perder el servidor y las copias, con todas sus direcciones históricas intactas.",
    seoTitle: "Caso: recuperamos un archivo periodístico | SIGIL LABS",
    seoDescription: "Cómo recuperamos un archivo de periodismo de paz tras perder servidor y copias: 4.229 publicaciones funcionando y las URLs históricas intactas.",
    eyebrow: "Caso de éxito / Sistemas editoriales / Preservación digital",
    title: "El archivo no se perdió. Se desconectó.",
    lead: "Una década de periodismo de paz en Colombia salió del aire junto con su servidor y sus copias locales. Reconstruimos la casa sin cambiar la dirección.",
    facts: [
      { k: "Periodo recuperado", v: "2014–2025" },
      { k: "Rol", v: "De la arquitectura de recuperación a la formación de la redacción" },
      { k: "Construido en", v: "Ago–Oct 2026" },
    ],
    chapters: [
      { label: "La pérdida", title: "Cayó el sitio. Y también las copias.", body: "Un incidente de servidor sacó al medio del aire y las copias locales fueron borradas. El dominio anterior cayó con él y puso en riesgo años de citas académicas, referencias de prensa y enlaces compartidos. Quedaban las capturas de Internet Archive.", metrics: ["años de periodismo en riesgo"] },
      { label: "La evidencia", title: "Lo primero no fue diseñar. Fue reunir pruebas.", body: "Inventariamos las URLs históricas con la API CDX de Internet Archive, elegimos la mejor captura de cada artículo, extrajimos el HTML a datos estructurados y mapeamos imágenes, audio y video.", metrics: ["artículos únicos recuperables", "imágenes descargadas de las capturas", "perfiles de autor reconstruidos"], note: "Pipeline de extracción, cerrado el 18 de agosto de 2026." },
      { label: "Saneamiento", title: "Separamos el periodismo del ataque.", body: "Las capturas traían código de redirección inyectado, invisible para el lector, y spam de casinos en ruso mezclado con el contenido. Se eliminó durante la extracción, no con una limpieza superficial, y se verificó por más de un camino.", metrics: ["artículos limpiados de código de redirección inyectado", "etiquetas de spam en cirílico aisladas y excluidas", "rastros del redirector en el corpus verificado"] },
      { label: "Permalinks", title: "Cada dirección histórica quedó intacta.", body: "La URL es parte del patrimonio. Conservamos nombres, fechas, autores y rutas por sección, incluida /notas/%postname%/, para que el rediseño no rompiera búsquedas, citas ni años de enlaces.", metrics: ["elementos en el archivo de importación de WordPress"] },
      { label: "Base de conocimiento", title: "Un archivo para investigar, no solo para leer.", body: "Un Centro de Memoria convierte el archivo en una colección consultable: buscador y filtros por formato, año y tema, citación formal, exportación RIS para Zotero, Mendeley y EndNote, datos en CSV, PDF por pieza y metadatos Dublin Core y Highwire Press.", metrics: ["piezas de audio y video, sin ninguna rota", "tutoriales en video y PDF para la redacción"] },
      { label: "Honestidad", title: "Lo que sobrevive se publica. Lo que no, se declara.", body: "Algunas imágenes nunca fueron capturadas. En vez de inventar una foto o dejar una caja rota, el lector ve una nota editorial discreta: archivo no conservado. Un reemplazo habría falsificado el registro.", metrics: ["del archivo gráfico visible en el sitio"] },
      { label: "Resultado", title: "Un archivo limpio que la redacción puede operar.", body: "El medio tiene un sistema limpio y buscable, con su historia de vuelta en las direcciones originales y un equipo capacitado para publicar, corregir, programar y administrar por su cuenta.", metrics: ["publicaciones cargadas y funcionando", "imágenes visibles en el sitio", "imágenes rotas dentro de los artículos"], note: "Medido en el sitio de desarrollo el 5 de septiembre de 2026." },
    ],
    method: {
      eyebrow: "Cómo se construyó",
      title: "La IA hace el volumen. Una persona firma.",
      body: "SIGIL construye con un flujo agéntico: planear, implementar y revisar, con aprobación humana. Agentes Claude, GPT y DeepSeek se reparten la generación de código, el control de la plataforma y la verificación.",
      steps: [
        { t: "Planear sobre evidencia", b: "El alcance se escribe a partir de lo que las capturas contienen de verdad, antes de programar. Decisiones como conservar cada permalink quedan fijadas como reglas." },
        { t: "Implementar en pasos cortos", b: "Los agentes escriben las capas de extracción, limpieza y WordPress. Los modelos económicos toman lo repetitivo y los más potentes, la arquitectura y la revisión." },
        { t: "Verificar por un segundo camino", b: "Los resultados se contrastan con el contenido registrado, los archivos guardados y muestras del sistema cargado, no solo con la herramienta que los produjo." },
        { t: "Aprobación humana", b: "Nada se publica por la palabra de un agente. Al grabar los tutoriales aparecieron cuatro fallos reales del modo editorial que las vistas estáticas no mostraban, y se corrigieron." },
      ],
    },
    next: "Siguiente caso: PRAXUZ",
    work: "Ver el showcase del proyecto",
  }),

  praxuz: translate(praxuz, {
    card: "Un proceso manual de venta y entrega convertido en una tienda conectada a un campus Moodle.",
    seoTitle: "Caso: campus Moodle con tienda WooCommerce | SIGIL LABS",
    seoDescription: "Cómo reemplazamos la venta de cursos por chats y carpetas con una tienda WooCommerce conectada a un campus Moodle 5.2 que operan agentes de IA.",
    eyebrow: "Caso de éxito / Arquitectura LMS / Operación agéntica",
    title: "De los chats a un campus.",
    lead: "Un centro de formación en ciencias del deporte vendía y entregaba sus cursos por redes, carpetas compartidas y videollamadas. Diseñamos la tienda, el campus y el puente entre ambos.",
    facts: [
      { k: "Sector", v: "Educación en ciencias del deporte, Latinoamérica" },
      { k: "Tecnología", v: "WordPress, WooCommerce, Moodle 5.2, React 19" },
      { k: "Inicio", v: "Sep 2026" },
    ],
    chapters: [
      { label: "El desorden", title: "Cada venta vivía en un chat.", body: "Instagram para que te encuentren, WhatsApp para vender, Drive para entregar y videollamadas para enseñar. Cada matrícula dependía de que alguien recordara el siguiente paso.", metrics: ["herramientas desconectadas para una sola venta"] },
      { label: "El puente", title: "Una tienda. Un campus. Un puente.", body: "Una tienda en WordPress y WooCommerce vende. Un campus en Moodle 5.2 enseña. Edwiser Bridge y el inicio de sesión único los conectan en un servidor Linux, para que una compra pueda convertirse en acceso.", metrics: ["plataformas, cada una con un solo trabajo"] },
      { label: "El campus", title: "Un Moodle que no parece Moodle.", body: "Un tema hijo de Boost en SCSS y Mustache: estructura de aplicación, acceso con marca, portadas de curso con anillos de progreso, modo oscuro real y componentes React 19 con las herramientas oficiales de Moodle.", metrics: ["páginas auditadas en modo claro y oscuro", "problemas de contraste WCAG AA en ellas"] },
      { label: "Rendimiento", title: "De 7,8 segundos a 0,03.", body: "La lentitud no era la plataforma. El modo diseñador de temas había desactivado la caché y el código vivía en un sistema de archivos de Windows montado en Docker. Mover todo al sistema de archivos de Linux resolvió ambas cosas.", metrics: ["más rápido al cargar: de 7,8 s a 0,03 s"], note: "Medido en el entorno de desarrollo." },
      { label: "Control con agentes", title: "Agentes de IA que operan el campus.", body: "Un servidor MCP expone los servicios web de Moodle a los agentes, así que cursos, usuarios y configuración se crean por programa y no clic por clic.", metrics: ["funciones de servicios web disponibles para los agentes"] },
      { label: "Entrega", title: "Tres instancias para mostrar la diferencia.", body: "Una instancia del cliente, una plantilla del estudio y un Moodle sin personalizar, lado a lado, con H5P, certificados propios, formato de mosaicos y gamificación. Una auditoría de integridad corrigió lo que encontró sin tocar el núcleo.", metrics: ["instancias en la demo comercial", "errores corregidos por la auditoría", "archivos del núcleo de Moodle modificados"] },
    ],
    method: {
      eyebrow: "Cómo se construyó",
      title: "Los agentes operan. El código queda versionado.",
      body: "SIGIL construye con un flujo agéntico: planear, implementar y revisar, con aprobación humana. Distintos agentes toman la generación de código, el control de la plataforma y la verificación.",
      steps: [
        { t: "Primero un entorno rápido", b: "Un entorno Docker reproducible sobre Linux, parecido al servidor final, para que cada iteración sea barata." },
        { t: "Repartir el trabajo", b: "Un agente controla la plataforma por MCP y verifica. Otros escriben el tema y el código React a partir de instrucciones autocontenidas." },
        { t: "Nunca tocar el núcleo", b: "Solo cambian el tema y los complementos propios, en un repositorio versionado con scripts de instalación, respaldo y migración." },
        { t: "Verificar en el navegador", b: "Diseño, modo oscuro y contraste se revisan en páginas vivas, y los tiempos de carga se miden, no se suponen." },
      ],
    },
    next: "Siguiente caso: Nexus",
    work: "Ver el showcase del proyecto",
  }),

  nexus: translate(nexus, {
    card: "Un puente en Python con la API del LMS y un flujo de agentes de IA que audita cursos.",
    seoTitle: "Caso: automatización de LMS y auditoría con IA | SIGIL LABS",
    seoDescription: "Un puente con la API del LMS para usuarios, cursos y publicación en lote, y agentes de IA que auditaron cerca de 40 cursos de formación.",
    eyebrow: "Caso de éxito / Automatización LMS / Auditoría de cursos con IA",
    title: "Menos clics. Más auditoría.",
    lead: "En un equipo de enablement de una empresa EdTech, la operación de cursos era manual y su calidad se juzgaba a mano. Nexus puso una API entre el equipo y el LMS, y agentes sobre el contenido.",
    facts: [
      { k: "Contexto", v: "Cargo interno anterior del fundador de SIGIL" },
      { k: "Tecnología", v: "Python, Flask, API REST del LMS, agentes de IA" },
      { k: "Rol", v: "Diseño y construcción" },
    ],
    chapters: [
      { label: "La fricción", title: "La operación avanzaba fila por fila.", body: "Matrículas, búsqueda y creación de cursos del entorno de formación del equipo comercial dependían de trabajo repetitivo en la interfaz de administración.", metrics: ["tareas repetitivas: matricular, buscar y crear cursos"] },
      { label: "El puente", title: "Una API entre el equipo y el LMS.", body: "Una aplicación en Python y Flask habla con la API del LMS y muestra el avance mientras trabaja, así una operación larga se ve en vez de quedarse cargando.", metrics: ["interfaz para todo el flujo"] },
      { label: "En lote", title: "Usuarios por lotes, no por tickets.", body: "Búsqueda, creación y eliminación de usuarios desde una hoja de cálculo, con resultados descargables, además de reportes de matrícula y un tablero de enablement.", metrics: ["operaciones en lote: buscar, crear y eliminar"] },
      { label: "Publicación", title: "Cursos y páginas creados desde código.", body: "La aplicación crea cursos y publica en ellos documentos con componentes HTML. Una herramienta complementaria convierte un documento de Word en componentes listos para pegar.", metrics: ["vías de contenido: publicación por API y de Word a componente"] },
      { label: "Auditoría", title: "Ver de qué está hecho un curso.", body: "Una extracción de solo lectura recorre el curso por la API, descarga cada componente HTML y lo clasifica por tipo, sin cambiar nada en el curso en vivo. Las torres son un curso real: cada una mide lo que su conteo.", metrics: ["nodos de contenido recorridos en un curso", "componentes extraídos y clasificados", "descargados; 1 marcado como archivo faltante"], note: "Un informe de extracción de solo lectura. Torres: 60, 7, 6, 2, 2, 1, 1, 1, 1, 1." },
      { label: "Resultado", title: "De una auditoría a cursos publicados.", body: "Un flujo de agentes de IA auditó el catálogo en calidad de diseño instruccional. Una selección se perfeccionó con expertos de producto como material interactivo y se publicó.", metrics: ["cursos auditados en calidad instruccional", "seleccionados para perfeccionar con expertos", "planes y cursos co-creados y publicados"] },
    ],
    method: {
      eyebrow: "Cómo se construyó",
      title: "Primero leer. Cambiar solo a propósito.",
      body: "El sistema se construyó alrededor de una regla: un agente puede mirar todo lo que tiene permiso de leer, y una persona decide qué cambia.",
      steps: [
        { t: "Extraer sin tocar", b: "Las auditorías corren en solo lectura contra la API y dejan el curso en vivo como estaba." },
        { t: "Escribir las reglas", b: "Las reglas de componentes y de marca quedan fijadas en documentos que los agentes deben seguir, para que el resultado sea consistente." },
        { t: "Afinar con expertos", b: "El flujo encuentra y ordena. Los expertos de producto deciden qué está bien y qué se rehace." },
        { t: "Publicar con aprobación", b: "Nada llega a un curso en vivo sin que el cambio se revise y apruebe." },
      ],
    },
    next: "Siguiente caso: agentes de SIGIL",
  }),

  agents: translate(agents, {
    card: "Nuestros propios agentes: prospección local que no contacta a nadie sin aprobación, operada desde el teléfono.",
    seoTitle: "Caso: agente de prospección con IA | SIGIL LABS",
    seoDescription: "Cómo construimos nuestros agentes: búsqueda de negocios locales sin duplicados, mensajes que esperan aprobación humana y operación desde el teléfono.",
    eyebrow: "Caso de éxito / Sistemas agénticos / Producto interno",
    title: "Agentes que esperan un sí.",
    lead: "Usamos nuestros propios agentes antes de venderlos. Uno busca y prepara oportunidades de negocios locales. Otro nos deja operar desde el teléfono. Ninguno le habla a un desconocido por su cuenta.",
    facts: [
      { k: "Tipo", v: "Producto interno de SIGIL" },
      { k: "Tecnología", v: "Python, Playwright, SQLite, Telegram, modelos de lenguaje" },
      { k: "Regla", v: "Enviar exige aprobación explícita" },
    ],
    chapters: [
      { label: "El problema", title: "El próximo cliente está a unas calles.", body: "Encontrar negocios locales con los que valga la pena hablar, ver cómo contactarlos y escribir algo relevante es trabajo repetitivo que ocurre antes de cualquier conversación real.", metrics: ["prospectos contactables como meta diaria"] },
      { label: "Búsqueda", title: "Un radio que crece solo si hace falta.", body: "Primero una fuente estructurada de datos de negocios y, como respaldo, la búsqueda en mapas. Empieza cerca y se amplía solo si faltan prospectos válidos. Los contactos públicos se completan desde el sitio de cada negocio; nunca se inventa un correo.", metrics: ["límite: 3, luego 5 y luego 10"] },
      { label: "Memoria", title: "Nunca toca la misma puerta dos veces.", body: "Una base local recuerda cada negocio visto. Los repetidos se descartan y los que no tienen contacto se guardan para una segunda revisión.", metrics: ["negocios en el registro"], note: "Estado de la base, 1 de septiembre de 2026." },
      { label: "Borradores", title: "Cada mensaje se prepara, no se envía.", body: "Para cada prospecto el sistema elige un showcase real de SIGIL, redacta un texto consultivo y arma una hoja de cálculo con enlaces listos para abrir; luego envía el resumen de la mañana por Telegram.", metrics: ["negocios contactados de ese registro"], note: "Estado de la base, 1 de septiembre de 2026." },
      { label: "Aprobación", title: "Nada sale sin una persona.", body: "Buscar, listar y preparar nunca contacta a nadie. Un mensaje sale solo tras una aprobación explícita, como: apruebo los primeros cinco. El envío real está apagado por defecto.", metrics: ["aprobación explícita antes de cualquier envío"] },
      { label: "Operador", title: "Mando, memoria, modelos y máquinas, por separado.", body: "Un agente persistente recibe órdenes desde Telegram, Android o el escritorio. Guarda memoria, usa por defecto un modelo económico y uno más potente cuando se necesita, y ejecuta en máquinas remotas, donde los cambios esperan aprobación.", metrics: ["capas separadas: mando, orquestador, cognición y ejecución"] },
    ],
    method: {
      eyebrow: "Cómo se construyó",
      title: "Un flujo. Varias puertas. Una sola compuerta.",
      body: "El principio de diseño: la autonomía crece donde la acción se puede deshacer y se detiene donde llega a otra persona.",
      steps: [
        { t: "Una sola tarea central", b: "El programador, el bot y el agente de escritorio arrancan el mismo flujo, así no hay un segundo comportamiento que sincronizar." },
        { t: "Económico por defecto", b: "Lo rutinario corre en modelos baratos; el generador de textos puede funcionar sin conexión y sin gasto de API." },
        { t: "La aprobación es estructural", b: "Un envío necesita un plan pendiente y un sí explícito. Está en el código, no en un ajuste que alguien deba recordar." },
        { t: "Declarar los límites", b: "Parte de los negocios no tiene un teléfono utilizable, así que nunca se les escribe. El sistema lo registra en vez de adivinar." },
      ],
    },
    next: "Siguiente caso: PACIFISTA",
    work: "Productos Agénticos",
  }),
};
