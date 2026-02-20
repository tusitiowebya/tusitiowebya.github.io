import { MapPin, Phone, Mail } from "lucide-react"

export function Footer() {
  return (
    <footer className="border-t border-border bg-primary py-12 text-primary-foreground">
      <div className="mx-auto max-w-6xl px-6">
        <div className="grid gap-8 md:grid-cols-3">
          {/* Brand */}
          <div>
            <h3 className="font-serif text-xl">Hosteria Nirvana</h3>
            <p className="mt-3 text-sm leading-relaxed text-primary-foreground/70">
              Tu refugio en Villa Gesell. Descanso, naturaleza y confort junto al mar.
            </p>
          </div>

          {/* Quick links */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-primary-foreground/80">
              Secciones
            </h4>
            <ul className="mt-3 flex flex-col gap-2">
              {["Inicio", "Nosotros", "Servicios", "Habitaciones", "Galeria", "Contacto"].map(
                (link) => (
                  <li key={link}>
                    <a
                      href={`#${link.toLowerCase()}`}
                      className="text-sm text-primary-foreground/60 transition-colors hover:text-primary-foreground"
                    >
                      {link}
                    </a>
                  </li>
                )
              )}
            </ul>
          </div>

          {/* Contact info */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-primary-foreground/80">
              Contacto
            </h4>
            <div className="mt-3 flex flex-col gap-3">
              <div className="flex items-center gap-3">
                <MapPin className="h-4 w-4 shrink-0 text-primary-foreground/60" />
                <span className="text-sm text-primary-foreground/70">
                  Av. 2 y Paseo 126 bis, Villa Gesell
                </span>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="h-4 w-4 shrink-0 text-primary-foreground/60" />
                <a
                  href="tel:+5492255405324"
                  className="text-sm text-primary-foreground/70 hover:text-primary-foreground"
                >
                  +54 9 2255 40-5324
                </a>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="h-4 w-4 shrink-0 text-primary-foreground/60" />
                <a
                  href="mailto:hosterianirvana@gmail.com"
                  className="text-sm text-primary-foreground/70 hover:text-primary-foreground"
                >
                  hosterianirvana@gmail.com
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-10 border-t border-primary-foreground/10 pt-6 text-center">
          <p className="text-xs text-primary-foreground/50">
            Hosteria Nirvana &middot; Villa Gesell, Buenos Aires, Argentina
          </p>
        </div>
      </div>
    </footer>
  )
}
