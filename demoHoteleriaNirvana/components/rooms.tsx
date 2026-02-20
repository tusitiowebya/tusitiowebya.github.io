import Image from "next/image"

export function Rooms() {
  return (
    <section id="habitaciones" className="py-24 md:py-32">
      <div className="mx-auto max-w-6xl px-6">
        <div className="text-center">
          <p className="mb-3 text-xs uppercase tracking-[0.25em] text-accent">
            Habitaciones
          </p>
          <h2 className="font-serif text-3xl text-foreground md:text-4xl text-balance">
            Confort con vista a la naturaleza
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-muted-foreground">
            La privilegiada ubicacion permite que sus huespedes descansen en una playa serena, pesquen en el muelle y disfruten de los espectaculos y gastronomia de la villa.
          </p>
        </div>

        <div className="mt-16 grid gap-6 md:grid-cols-2">
          {/* Room image 1 */}
          <div className="relative aspect-[4/3] overflow-hidden rounded-2xl">
            <Image
              src="/images/room.jpg"
              alt="Habitacion de Hosteria Nirvana"
              fill
              className="object-cover transition-transform duration-500 hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-foreground/50 to-transparent" />
            <div className="absolute bottom-0 left-0 p-6">
              <h3 className="font-serif text-xl text-primary-foreground">Habitaciones</h3>
              <p className="mt-1 text-sm text-primary-foreground/80">
                Equipadas con aire acondicionado, TV, caja de seguridad y mas...
              </p>
            </div>
          </div>

          {/* Room image 2 */}
          <div className="relative aspect-[4/3] overflow-hidden rounded-2xl">
            <Image
              src="/images/breakfast.jpg"
              alt="Desayuno en Hosteria Nirvana"
              fill
              className="object-cover transition-transform duration-500 hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-foreground/50 to-transparent" />
            <div className="absolute bottom-0 left-0 p-6">
              <h3 className="font-serif text-xl text-primary-foreground">Desayuno incluido</h3>
              <p className="mt-1 text-sm text-primary-foreground/80">
                Cada mañana, un desayuno completo para empezar el dia
              </p>
            </div>
          </div>
        </div>

        {/* Tarifas */}
        <div className="mt-12 rounded-xl border border-border bg-card p-8 text-center">
          <h3 className="font-serif text-xl text-card-foreground">Tarifas</h3>
          <p className="mt-2 text-muted-foreground">
            Consultar con la recepción de la hosteria por WhatsApp
          </p>
          <a
            href="https://wa.me/5492255405324?text=Hola%2C%20quisiera%20consultar%20las%20tarifas%20de%20la%20hosteria"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
          >
            Consultar tarifas
          </a>
        </div>
      </div>
    </section>
  )
}
