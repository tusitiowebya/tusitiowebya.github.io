import { Wifi, Car, Coffee, Wind, ShieldCheck, Sun } from "lucide-react"

const services = [
  {
    icon: Coffee,
    title: "Desayuno",
    description: "Desayuno incluido todas las mañanas con productos frescos y caseros.",
  },
  {
    icon: Wifi,
    title: "Wi-Fi",
    description: "Conexion Wi-Fi gratuita en todas las areas de la hosteria.",
  },
  {
    icon: Car,
    title: "Estacionamiento",
    description: "Estacionamiento privado y seguro para nuestros huespedes.",
  },
  {
    icon: Wind,
    title: "Aire acondicionado",
    description: "Climatización en todas las habitaciones para tu confort.",
  },
  {
    icon: ShieldCheck,
    title: "Caja de seguridad",
    description: "Caja de seguridad individual en cada habitación.",
  },
  {
    icon: Sun,
    title: "Solarium",
    description: "Espacio al aire libre para disfrutar del sol y relajarte.",
  },
]

export function Services() {
  return (
    <section id="servicios" className="bg-secondary py-24 md:py-32">
      <div className="mx-auto max-w-6xl px-6">
        <div className="text-center">
          <p className="mb-3 text-xs uppercase tracking-[0.25em] text-accent">
            Servicios
          </p>
          <h2 className="font-serif text-3xl text-foreground md:text-4xl text-balance">
            Todo lo que necesitas para descansar
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-muted-foreground">
            La hosteria cuenta con una amplia linea de servicios pensada para el mejor bienestar de los veraneantes.
          </p>
        </div>

        <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((service) => (
            <div
              key={service.title}
              className="group rounded-xl border border-border bg-card p-6 transition-shadow hover:shadow-md"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent/10">
                <service.icon className="h-5 w-5 text-accent" />
              </div>
              <h3 className="mt-4 font-serif text-lg text-card-foreground">
                {service.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {service.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
