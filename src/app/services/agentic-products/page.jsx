import s from "./products.module.css";

const BLOCKS = [
  {
    cls: s.b1,
    num: "01",
    title: "Vender más",
    body: "Tu equipo comercial pierde leads en el chat, en el WhatsApp y en el correo. Un agente atiende, califica y agenda sin que nadie esté mirando la pantalla.",
    items: [
      "Agente de WhatsApp que responde, califica y agenda",
      "Seguimiento automático de cotizaciones enviadas",
      "Reactivación de clientes dormidos con contexto real",
    ],
  },
  {
    cls: s.b2,
    num: "02",
    title: "Atender mejor",
    body: "Las mismas preguntas, mil veces al día. El agente responde con tus documentos, y escala a una persona solo cuando de verdad hace falta.",
    items: [
      "Soporte sobre tus manuales, políticas y catálogo",
      "Bandeja unificada: web, WhatsApp y correo",
      "Escalamiento con resumen y contexto al humano",
    ],
  },
  {
    cls: s.b3,
    num: "03",
    title: "Operar sin fricción",
    body: "Cotizaciones, reportes, facturas, actas. El trabajo repetitivo que consume las horas de tu equipo se convierte en un flujo que corre solo.",
    items: [
      "Documentos generados desde datos, no copiados a mano",
      "Reportes armados de varias fuentes cada semana",
      "Alertas cuando algo se sale del rango esperado",
    ],
  },
  {
    cls: s.b4,
    num: "04",
    title: "Crear más rápido",
    body: "Tu equipo ya usa IA, pero cada uno a su manera. Un sistema de agentes y skills le da a todos la misma capacidad, el mismo criterio y el mismo control.",
    items: [
      "Sistema de agentes internos para el equipo",
      "Enrutamiento: la tarea fácil al modelo barato",
      "Criterios de calidad y revisión compartidos",
    ],
  },
];

const WAYS = [
  {
    tag: "Build",
    title: "Lo construimos contigo",
    body: "Un agente o flujo completo, en producción. Trabajamos junto a tu equipo, con tus datos y tus reglas de aprobación.",
    when: "Cuando ya sabes qué quieres resolver.",
  },
  {
    tag: "Enable",
    title: "Enseñamos a tu equipo",
    body: "Diagnóstico, un primer sistema construido en abierto, y el método transferido para que el segundo lo hagan solos.",
    when: "Cuando quieres la capacidad, no la dependencia.",
  },
  {
    tag: "Audit",
    title: "Auditamos lo que ya tienes",
    body: "Revisamos tus procesos, tus herramientas y tu gasto en IA, y devolvemos un plan priorizado de dónde sí vale la pena.",
    when: "Cuando ya inviertes y no ves el retorno.",
  },
];

const AUDIT = [
  {
    n: "01",
    t: "Mapa de procesos",
    b: "Dónde se va el tiempo hoy, con datos y no con impresiones.",
  },
  {
    n: "02",
    t: "Candidatos a agente",
    b: "Qué flujos la IA resuelve bien y cuáles solo añadirían ruido.",
  },
  {
    n: "03",
    t: "Costo y retorno",
    b: "Qué cuesta operar cada flujo y qué ahorra o produce.",
  },
  {
    n: "04",
    t: "Plan priorizado",
    b: "Qué construir primero, qué aplazar y qué descartar.",
  },
];

export const metadata = {
  title: "Productos agénticos y diagnóstico de IA | SIGIL LABS",
  description:
    "Agentes de WhatsApp, atención al cliente, operaciones y sistemas internos. Diagnóstico de IA para saber dónde vale la pena antes de invertir. SIGIL LABS, Bogotá.",
  alternates: { canonical: "/services/agentic-products" },
};

export default function AgenticProductsPage() {
  return (
    <main className={s.page}>
      <div className={s.wrap}>
        <header className={s.hero}>
          <span className={s.kicker}>Productos agénticos · IA aplicada</span>
          <h1 className={s.heroTitle}>
            Tu empresa necesita <em>agentes</em> para algo concreto.
          </h1>
          <p className={s.heroLead}>
            No vendemos "IA". Montamos el agente que atiende tu WhatsApp, cotiza por
            ti o arma tus reportes. Y si todavía no sabes dónde empezar, lo
            diagnosticamos antes de que inviertas un peso.
          </p>
        </header>

        <section>
          <h2 className={s.blocksTitle}>¿Para qué los necesitas?</h2>
          <p className={s.blocksLead}>
            Cuatro frentes donde la IA ya está funcionando en empresas reales. Si te
            reconoces en uno, ese es el punto de partida.
          </p>
          <div className={s.grid}>
            {BLOCKS.map((b) => (
              <article key={b.num} className={`${s.block} ${b.cls}`}>
                <span className={s.block__num}>{b.num}</span>
                <h3 className={s.block__title}>{b.title}</h3>
                <p className={s.block__body}>{b.body}</p>
                <ul className={s.block__items}>
                  {b.items.map((i) => (
                    <li key={i}>{i}</li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </section>

        <section className={s.ways}>
          <h2 className={s.waysTitle}>Tres formas de trabajar juntos</h2>
          <div className={s.wayGrid}>
            {WAYS.map((w) => (
              <article key={w.tag} className={s.way}>
                <span className={s.way__tag}>{w.tag}</span>
                <h3 className={s.way__title}>{w.title}</h3>
                <p className={s.way__body}>{w.body}</p>
                <p className={s.way__when}>{w.when}</p>
              </article>
            ))}
          </div>
        </section>

        <section className={s.audit}>
          <h2 className={s.audit__title}>Auditoría: antes de invertir, saber</h2>
          <p className={s.audit__lead}>
            Dos a tres semanas. Salimos con un documento que dice qué flujos
            resuelve la IA en tu empresa, qué cuesta operarlos y cuál construir
            primero. Si la respuesta es "ninguno todavía", también lo decimos.
          </p>
          <div className={s.auditGrid}>
            {AUDIT.map((a) => (
              <div key={a.n} className={s.auditStep}>
                <div className={s.auditStep__n}>{a.n}</div>
                <h3 className={s.auditStep__t}>{a.t}</h3>
                <p className={s.auditStep__b}>{a.b}</p>
              </div>
            ))}
          </div>
        </section>

        <section className={s.cta}>
          <h2 className={s.cta__title}>¿Por dónde empezamos?</h2>
          <p className={s.cta__body}>
            Cuéntanos qué proceso te está costando más tiempo o más dinero. En una
            llamada corta te decimos si un agente lo resuelve y por dónde iría.
          </p>
          <a className={s.cta__btn} href="/contact">
            Hablemos
          </a>
        </section>
      </div>
    </main>
  );
}
