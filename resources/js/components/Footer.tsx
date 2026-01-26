import { Ticket, MessageCircle } from "lucide-react";
import { Link, usePage } from "@inertiajs/react"; // 1. Importar usePage

export const Footer = () => {
  // 2. Extraer la información compartida de la compañía
  const { company_info, whatsapp_url } = usePage().props as any;

  // Definimos un nombre por defecto por si la tabla está vacía
  const companyName = company_info?.name || "MegaRifas";

  return (
    <>
      <footer className="bg-card border-t border-border py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8 mb-8">
            <div>
              <Link href="/" className="flex items-center gap-2 mb-4">
                <div className="bg-gradient-brand p-1.5 rounded-lg w-19 h-19 flex items-center justify-center overflow-hidden">
                  {company_info?.logo ? (
                    <img
                      src={`/storage/${company_info.logo}`}
                      alt="Logo"
                      className="w-full h-full object-cover rounded-md"
                    />
                  ) : (
                    // Logo
                    <Ticket className="h-6 w-6 text-white" />
                  )}
                </div>
                {/* 3. Mostrar nombre dinámico en el footer */}
                <span className="text-xl font-bold bg-gradient-brand bg-clip-text text-transparent">
                  {companyName}
                </span>
              </Link>
              <p className="text-muted-foreground">
                Tu plataforma confiable para participar en rifas emocionantes y ganar premios increíbles con <span className="font-bold">{companyName}</span>.
              </p>
            </div>

            <div>              <h3 className="font-bold mb-4">Enlaces Rápidos</h3>
              <ul className="space-y-2">
                <li><Link href="/" className="text-muted-foreground hover:text-primary transition-colors">Inicio</Link></li>
                <li><Link href="/verify" className="text-muted-foreground hover:text-primary transition-colors">Verificar Ticket</Link></li>
              </ul>
            </div>

            <div>
              <h3 className="font-bold mb-4">Legal</h3>
              <ul className="space-y-2">
                <li><button onClick={() => window.dispatchEvent(new CustomEvent("open-terms-modal"))} className="text-muted-foreground hover:text-primary transition-colors">Términos y Condiciones</button></li>
              </ul>

              <div className="flex justify-left space-x-4 mt-6">
                <img src="/img/conalot.png" alt="Conalot" className="w-15 h-auto" />
                <img src="/img/super-gana.png" alt="Super Gana" className="w-15 h-auto" />
                <img src="/img/loteria-tachira.png" alt="Loteria del Tachira" className="w-15 h-auto" />
              </div>
            </div>
          </div>

          <div className="border-t border-border pt-8 text-center text-muted-foreground">
            {/* 4. Mostrar nombre dinámico en el Copyright */}
            <p>&copy; {new Date().getFullYear()} <span className="font-bold">{companyName}</span>. Todos los derechos reservados.</p>
          </div>
        </div>
      </footer>

      {/* Contenedor del Botón Flotante */}
      <div className="fixed bottom-5 right-5 flex items-center gap-3 z-50 group">

        {/* Mensaje de ayuda (Tooltip) */}
        <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none md:pointer-events-auto">
          <div className="bg-background/90 backdrop-blur-sm border border-green-500/50 text-foreground px-4 py-2 rounded-2xl shadow-xl flex items-center gap-2">
            <span className="text-sm font-medium">¿Necesitas ayuda?</span>
          </div>
        </div>

        {/* Botón de WhatsApp */}
        <a
          href={whatsapp_url || "https://wa.me/1234567890"}
          target="_blank"
          rel="noopener noreferrer"
          className="bg-green-500 text-white rounded-[20px] p-3 shadow-[0_0_20px_rgba(34,197,94,0.4)] hover:scale-110 hover:bg-green-600 transition-all duration-300 flex items-center justify-center"
          aria-label="Soporte Técnico"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="28"
            height="28"
            viewBox="0 0 24 24"
            fill="currentColor"
          >
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.008-.57-.008-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
          </svg>
        </a>
      </div>
    </>
  );
};