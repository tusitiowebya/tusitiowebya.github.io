import Image from "next/image"

export function About() {
  return (
    <section id="nosotros" className="py-24 md:py-32">
      <div className="mx-auto max-w-6xl px-6">
        <div className="grid items-center gap-12 md:grid-cols-2 md:gap-16">
          {/* Text */}
          <div>
            <p className="mb-3 text-xs uppercase tracking-[0.25em] text-accent">
              Sobre nosotros
            </p>
            <h2 className="font-serif text-3xl leading-tight text-foreground md:text-4xl text-balance">
              Un refugio atendido
              <br />
              por sus dueños
            </h2>
            <p className="mt-6 leading-relaxed text-muted-foreground">
              La hosteria esta ubicada en Villa Gesell, en la zona tranquila del Sur, a 150 metros de la playa del muelle de los pescadores y a 20 cuadras de la zona centrica y comercial de la villa.
            </p>
            <p className="mt-4 leading-relaxed text-muted-foreground">
              Inaugurada el 1 de diciembre de 2009, Hosteria Nirvana es el lugar ideal para un descanso, armonizando la naturaleza con las comodidades y confort necesarios para hacer de la estadia un momento inolvidable.
            </p>

            {/* Quick info */}
            <div className="mt-8 grid grid-cols-2 gap-6">
              <div>
                <p className="font-serif text-2xl text-foreground">Playa</p>
                <p className="mt-1 text-sm text-muted-foreground">a 150m</p>
              </div>
              <div>
                <p className="font-serif text-2xl text-foreground">Desde</p>
                <p className="mt-1 text-sm text-muted-foreground">2009</p>
              </div>
            </div>
          </div>

          {/* Image */}
          <div className="relative aspect-[4/5] overflow-hidden rounded-2xl">
            <Image
              src="/images/exterior2.jpg"
              alt="Exterior de Hosteria Nirvana"
              fill
              className="object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  )
}
