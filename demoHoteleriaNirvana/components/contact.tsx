"use client"

import { useState } from "react"
import { MapPin, Phone, Mail } from "lucide-react"

export function Contact() {
  const [formData, setFormData] = useState({
    nombre: "",
    telefono: "",
    email: "",
    fechaDesde: "",
    fechaHasta: "",
    adultos: "2",
    ninos: "0",
    consulta: "",
  })

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const message = `Hola, quisiera hacer una reserva:\n\nNombre: ${formData.nombre}\nTelefono: ${formData.telefono}\nEmail: ${formData.email}\nFecha desde: ${formData.fechaDesde}\nFecha hasta: ${formData.fechaHasta}\nAdultos: ${formData.adultos}\nNinos: ${formData.ninos}\nConsulta: ${formData.consulta}`
    const encoded = encodeURIComponent(message)
    window.open(`https://wa.me/5492255405324?text=${encoded}`, "_blank")
  }

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  return (
    <section id="contacto" className="py-24 md:py-32">
      <div className="mx-auto max-w-6xl px-6">
        <div className="grid gap-12 lg:grid-cols-5 lg:gap-16">
          {/* Info */}
          <div className="lg:col-span-2">
            <p className="mb-3 text-xs uppercase tracking-[0.25em] text-accent">
              Contacto
            </p>
            <h2 className="font-serif text-3xl text-foreground md:text-4xl text-balance">
              Realiza tu reserva o consulta
            </h2>
            <p className="mt-4 leading-relaxed text-muted-foreground">
              Completa el formulario y te responderemos por WhatsApp,
              o contactanos directamente por cualquiera de estos medios.
            </p>

            <div className="mt-8 flex flex-col gap-6">
              <div className="flex items-start gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-accent/10">
                  <MapPin className="h-5 w-5 text-accent" />
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">Direccion</p>
                  <p className="mt-0.5 text-sm text-muted-foreground">
                    Av. 2 y Paseo 126 bis, Villa Gesell
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-accent/10">
                  <Phone className="h-5 w-5 text-accent" />
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">Telefono</p>
                  <a
                    href="tel:+5492255405324"
                    className="mt-0.5 text-sm text-muted-foreground hover:text-foreground"
                  >
                    +54 9 2255 40-5324
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-accent/10">
                  <Mail className="h-5 w-5 text-accent" />
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">Email</p>
                  <a
                    href="mailto:hosterianirvana@gmail.com"
                    className="mt-0.5 text-sm text-muted-foreground hover:text-foreground"
                  >
                    hosterianirvana@gmail.com
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Form */}
          <form
            onSubmit={handleSubmit}
            className="rounded-2xl border border-border bg-card p-6 lg:col-span-3 md:p-8"
          >
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <label htmlFor="nombre" className="mb-1.5 block text-sm font-medium text-card-foreground">
                  Nombre y Apellido *
                </label>
                <input
                  id="nombre"
                  name="nombre"
                  type="text"
                  required
                  value={formData.nombre}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-input bg-background px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
                  placeholder="Tu nombre completo"
                />
              </div>

              <div>
                <label htmlFor="email" className="mb-1.5 block text-sm font-medium text-card-foreground">
                  Email *
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-input bg-background px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
                  placeholder="tu@email.com"
                />
              </div>

              <div>
                <label htmlFor="telefono" className="mb-1.5 block text-sm font-medium text-card-foreground">
                  Telefono
                </label>
                <input
                  id="telefono"
                  name="telefono"
                  type="tel"
                  value={formData.telefono}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-input bg-background px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
                  placeholder="+54 9..."
                />
              </div>

              <div>
                <label htmlFor="fechaDesde" className="mb-1.5 block text-sm font-medium text-card-foreground">
                  Fecha desde *
                </label>
                <input
                  id="fechaDesde"
                  name="fechaDesde"
                  type="date"
                  required
                  value={formData.fechaDesde}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-input bg-background px-4 py-2.5 text-sm text-foreground focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
                />
              </div>

              <div>
                <label htmlFor="fechaHasta" className="mb-1.5 block text-sm font-medium text-card-foreground">
                  Fecha hasta *
                </label>
                <input
                  id="fechaHasta"
                  name="fechaHasta"
                  type="date"
                  required
                  value={formData.fechaHasta}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-input bg-background px-4 py-2.5 text-sm text-foreground focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
                />
              </div>

              <div>
                <label htmlFor="adultos" className="mb-1.5 block text-sm font-medium text-card-foreground">
                  Adultos *
                </label>
                <select
                  id="adultos"
                  name="adultos"
                  value={formData.adultos}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-input bg-background px-4 py-2.5 text-sm text-foreground focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
                >
                  {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
                    <option key={n} value={n}>
                      {n}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="ninos" className="mb-1.5 block text-sm font-medium text-card-foreground">
                  Ninos
                </label>
                <select
                  id="ninos"
                  name="ninos"
                  value={formData.ninos}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-input bg-background px-4 py-2.5 text-sm text-foreground focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
                >
                  {[0, 1, 2, 3, 4, 5, 6].map((n) => (
                    <option key={n} value={n}>
                      {n}
                    </option>
                  ))}
                </select>
              </div>

              <div className="sm:col-span-2">
                <label htmlFor="consulta" className="mb-1.5 block text-sm font-medium text-card-foreground">
                  Consultas
                </label>
                <textarea
                  id="consulta"
                  name="consulta"
                  rows={3}
                  value={formData.consulta}
                  onChange={handleChange}
                  className="w-full resize-none rounded-lg border border-input bg-background px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
                  placeholder="Escribi tu consulta..."
                />
              </div>
            </div>

            <button
              type="submit"
              className="mt-6 w-full rounded-lg bg-primary py-3 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90"
            >
              Enviar consulta por WhatsApp
            </button>
          </form>
        </div>
      </div>
    </section>
  )
}
