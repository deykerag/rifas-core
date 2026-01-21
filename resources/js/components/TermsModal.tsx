import { useState, useEffect } from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

export const TermsModal = () => {
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        const accepted = localStorage.getItem("terms_accepted");
        if (!accepted) {
            setIsOpen(true);
        }

        const handleOpen = () => setIsOpen(true);
        window.addEventListener("open-terms-modal", handleOpen);
        return () => window.removeEventListener("open-terms-modal", handleOpen);
    }, []);

    const handleAccept = () => {
        localStorage.setItem("terms_accepted", "true");
        setIsOpen(false);
    };

    return (
        <Dialog open={isOpen} onOpenChange={() => { }}>
            <DialogContent className="sm:max-w-[600px] max-h-[90vh] flex flex-col gap-0 p-0 overflow-hidden" onPointerDownOutside={(e) => e.preventDefault()} onEscapeKeyDown={(e) => e.preventDefault()}>
                <DialogHeader className="p-6 pb-2">
                    <DialogTitle className="text-2xl font-bold">Términos y Condiciones</DialogTitle>
                    <DialogDescription>
                        Por favor, lee y acepta nuestros términos para continuar.
                    </DialogDescription>
                </DialogHeader>

                <div className="flex-grow overflow-y-auto p-6 pt-2">
                    <div className="prose prose-sm dark:prose-invert max-w-none">
                        <section className="mb-6">
                            <p>
                                1) Al acceder y utilizar este sitio web, usted acepta cumplir y estar sujeto a los siguientes términos y condiciones de uso. Si no está de acuerdo con alguna parte de estos términos, no debe utilizar nuestro sitio web.
                            </p>
                            <br />
                            <p>
                                2) VERIFICAR LA DISPONIBILIDAD de los boletos antes de realizar el pago.
                            </p>
                            <br />
                            <p>
                                3) Solo pueden participar personas naturales mayores de 18 años.
                            </p>
                            <br />
                            <p>
                                4)  PUEDES PARTICIPAR A PARTIR DE 1 TICKET, se asignan de manera aleatoria y enviados a su correo después de confirmarse su pago.
                            </p>
                            <br />
                            <p>
                                5) Los premios deben ser retirados personalmente en el lugar indicado en cada rifa, entregaremos personalmente solamente en la dirección indicada por el ganador del primer premio o premio mayor.
                            </p>
                            <br />
                            <p>
                                6) PARA RECLAMAR TU PREMIO tiene un lapso de 72 horas.
                            </p>
                            <br />
                            <p>
                                7) LOS GANADORES AUTORIZAN aparecer en contenido audiovisual del sorteo, mostrando su presencia en las redes sociales y entrega de los premios. ESTO ES OBLIGATORIO.
                            </p>
                        </section>
                    </div>
                </div>

                <DialogFooter className="p-6 pt-4 border-t border-border bg-muted/50">
                    <Button onClick={handleAccept} className="w-full sm:w-auto font-bold px-12">
                        Aceptar y Continuar
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};
