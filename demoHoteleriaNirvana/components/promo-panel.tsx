{/* 
  PANEL DE PROMOCIONES
  =====================
  Este componente es un placeholder para el panel de promociones que el cliente 
  implementara por su cuenta. El espacio esta reservado y listo para ser 
  reemplazado con contenido dinamico.
  
  Ejemplo de uso: ofertas semanales, informacion coyuntural, avisos temporales.
*/}

export function PromoPanel() {
  return (
    <section id="promociones" className="py-16 md:py-20">
      <div className="mx-auto max-w-6xl px-6">
        <div className="relative overflow-hidden rounded-2xl border border-border bg-card p-8 md:p-12">
          {/* Decorative accent line */}
          <div className="absolute left-0 top-0 h-1 w-full bg-accent" />
          
          <div className="text-center">
            <p className="mb-2 text-xs uppercase tracking-[0.25em] text-accent">
              Novedades
            </p>
            <h2 className="font-serif text-2xl text-card-foreground md:text-3xl text-balance">
              Promociones y novedades
            </h2>
            <p className="mx-auto mt-3 max-w-lg text-muted-foreground">
              {/* Aqui el cliente puede colocar el contenido de la promo actual */}
              Consulta nuestras ofertas vigentes. Contactanos por WhatsApp para conocer las promociones de la temporada.
            </p>
            <a
              href="https://wa.me/5492255405324?text=Hola%2C%20quisiera%20consultar%20las%20promociones%20vigentes"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 inline-flex items-center gap-2 rounded-lg bg-accent px-5 py-2.5 text-sm font-medium text-accent-foreground transition-opacity hover:opacity-90"
            >
              Consultar promociones
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
