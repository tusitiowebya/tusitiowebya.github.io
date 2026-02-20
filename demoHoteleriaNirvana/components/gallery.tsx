import Image from "next/image"

const images = [
  { src: "/images/hero.jpg", alt: "Vista exterior de Hosteria Nirvana" },
  { src: "/images/room.jpg", alt: "Habitacion confortable" },
  { src: "/images/beach.jpg", alt: "Playa del muelle de los pescadores" },
  { src: "/images/breakfast.jpg", alt: "Desayuno de la hosteria" },
  { src: "/images/garden.jpg", alt: "Jardin de la hosteria" },
  { src: "/images/exterior.jpg", alt: "Exterior de la hosteria al atardecer" },
  { src: "/images/baños.jpg", alt: "Baño de la hosteria" },
  { src: "/images/interior3.jpg", alt: "Uno de los interiores de la hosteria" },
  { src: "/images/exterior3.jpg", alt: "Vista exterior de la hosteria" },

]

export function Gallery() {
  return (
    <section id="galeria" className="bg-secondary py-24 md:py-32">
      <div className="mx-auto max-w-6xl px-6">
        <div className="text-center">
          <p className="mb-3 text-xs uppercase tracking-[0.25em] text-accent">
            Galeria
          </p>
          <h2 className="font-serif text-3xl text-foreground md:text-4xl">
            Imagenes de la Hosteria
          </h2>
        </div>

        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {images.map((img, i) => (
            <div
              key={img.src}
              className={`relative overflow-hidden rounded-xl ${
                i === 0 ? "sm:col-span-2 sm:row-span-2 aspect-[4/3]" : "aspect-[4/3]"
              }`}
            >
              <Image
                src={img.src}
                alt={img.alt}
                fill
                className="object-cover transition-transform duration-500 hover:scale-105"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
