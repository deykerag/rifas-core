import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ChevronLeft, ChevronRight, Check, ShoppingCart, CreditCard, User, FileText, CheckCircle, Upload, X } from "lucide-react";
import { router } from "@inertiajs/react";
import { toast } from "sonner";

interface PaymentMethod {
    id: number;
    name: string;
    description: string;
    status: string;
}

interface PurchaseModalProps {
    isOpen: boolean;
    onClose: () => void;
    raffle: {
        id: number;
        description: string;
        price_usd: number;
        price_bs: number;
    };
    paymentMethods: PaymentMethod[];
}

interface FormData {
    quantity: number;
    payment_method_id: string;
    dni: string;
    name: string;
    phone: string;
    email: string;
    reference: string;
    voucher: File | null;
}

export const PurchaseModal = ({ isOpen, onClose, raffle, paymentMethods = [] }: PurchaseModalProps) => {
    const [currentStep, setCurrentStep] = useState(1);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [voucherPreview, setVoucherPreview] = useState<string | null>(null);
    const [formData, setFormData] = useState<FormData>({
        quantity: 5,
        payment_method_id: "",
        dni: "",
        name: "",
        phone: "",
        email: "",
        reference: "",
        voucher: null,
    });

    const steps = [
        { number: 1, title: "Cantidad", icon: ShoppingCart },
        { number: 2, title: "Pago", icon: CreditCard },
        { number: 3, title: "Datos", icon: User },
        { number: 4, title: "Comprobante", icon: FileText },
        { number: 5, title: "Éxito", icon: CheckCircle },
    ];

    const quickQuantities = [5, 10, 20, 30, 50, 100];

    const handleNext = () => {
        if (currentStep < 5) setCurrentStep(currentStep + 1);
    };

    const handleBack = () => {
        if (currentStep > 1) setCurrentStep(currentStep - 1);
    };

    const handleVoucherChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setFormData({ ...formData, voucher: file });
            const reader = new FileReader();
            reader.onloadend = () => {
                setVoucherPreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const removeVoucher = () => {
        setFormData({ ...formData, voucher: null });
        setVoucherPreview(null);
    };

    const handleSubmit = () => {
        setIsSubmitting(true);

        const submitData = new FormData();
        submitData.append('raffle_id', String(raffle.id));
        submitData.append('quantity', String(formData.quantity));
        submitData.append('payment_method_id', formData.payment_method_id);
        submitData.append('dni', formData.dni);
        submitData.append('name', formData.name);
        submitData.append('phone', formData.phone);
        submitData.append('email', formData.email);
        submitData.append('reference', formData.reference);
        submitData.append('amount', String(formData.quantity * raffle.price_usd));
        submitData.append('status', 'pending');

        if (formData.voucher) {
            submitData.append('voucher', formData.voucher);
        }

        router.post('/shoppings', submitData, {
            onSuccess: () => {
                setIsSubmitting(false);
                setCurrentStep(5); // Show success screen
            },
            onError: (errors) => {
                setIsSubmitting(false);
                toast.error('Error al procesar la compra');
                console.error(errors);
            }
        });
    };

    const handleClose = () => {
        onClose();
        setTimeout(() => {
            setCurrentStep(1);
            setFormData({
                quantity: 5,
                payment_method_id: "",
                dni: "",
                name: "",
                phone: "",
                email: "",
                reference: "",
                voucher: null,
            });
            setVoucherPreview(null);
        }, 300);
    };

    const totalUSD = formData.quantity * raffle.price_usd;
    const totalBS = formData.quantity * raffle.price_bs;

    return (
        <Dialog open={isOpen} onOpenChange={handleClose}>
            <DialogContent className="sm:max-w-[650px] max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                        {currentStep === 5 ? '¡Compra Exitosa!' : `Comprar Tickets - ${raffle.description}`}
                    </DialogTitle>
                </DialogHeader>

                {/* Progress Steps - Hide on success */}
                {currentStep < 5 && (
                    <div className="flex justify-between mb-8">
                        {steps.slice(0, 4).map((step) => {
                            const Icon = step.icon;
                            const isActive = currentStep === step.number;
                            const isCompleted = currentStep > step.number;

                            return (
                                <div key={step.number} className="flex flex-col items-center flex-1">
                                    <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-2 transition-all ${isCompleted ? 'bg-green-500 text-white' :
                                        isActive ? 'bg-primary text-white' :
                                            'bg-gray-200 text-gray-400'
                                        }`}>
                                        {isCompleted ? <Check className="w-6 h-6" /> : <Icon className="w-6 h-6" />}
                                    </div>
                                    <span className={`text-xs font-medium ${isActive ? 'text-primary' : 'text-gray-500'}`}>
                                        {step.title}
                                    </span>
                                </div>
                            );
                        })}
                    </div>
                )}

                {/* Step Content */}
                <div className="min-h-[350px]">
                    {/* Step 1: Quantity with Quick Buttons */}
                    {currentStep === 1 && (
                        <div className="space-y-6">
                            <div>
                                <Label className="text-lg font-semibold mb-4 block">Selecciona la cantidad de tickets</Label>
                                <div className="grid grid-cols-3 gap-3 mb-4">
                                    {quickQuantities.map((qty) => (
                                        <div key={qty} className="relative">
                                            <Button
                                                type="button"
                                                variant={formData.quantity === qty ? "default" : "outline"}
                                                className={`h-16 text-lg font-bold w-full ${formData.quantity === qty
                                                    ? 'bg-gradient-to-r from-primary to-accent'
                                                    : 'hover:border-primary'
                                                    }`}
                                                onClick={() => setFormData({ ...formData, quantity: qty })}
                                            >
                                                {qty}
                                            </Button>
                                            {qty === 10 && (
                                                <span className="absolute -top-2 -right-2 bg-gradient-to-r from-orange-500 to-red-500 text-white text-xs font-bold px-2 py-1 rounded-full shadow-lg">
                                                    Más Popular
                                                </span>
                                            )}
                                        </div>
                                    ))}
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="custom-quantity" className="text-sm font-medium">Cantidad personalizada:</Label>
                                    <div className="flex items-center gap-2">
                                        <Button
                                            type="button"
                                            variant="outline"
                                            size="icon"
                                            onClick={() => setFormData({ ...formData, quantity: Math.max(1, formData.quantity - 1) })}
                                            className="h-10 w-10"
                                        >
                                            <ChevronLeft className="h-4 w-4" />
                                        </Button>
                                        <Input
                                            id="custom-quantity"
                                            type="number"
                                            min="1"
                                            value={formData.quantity}
                                            onChange={(e) => setFormData({ ...formData, quantity: Math.max(1, Number(e.target.value)) })}
                                            className="text-center text-lg font-bold"
                                        />
                                        <Button
                                            type="button"
                                            variant="outline"
                                            size="icon"
                                            onClick={() => setFormData({ ...formData, quantity: formData.quantity + 1 })}
                                            className="h-10 w-10"
                                        >
                                            <ChevronRight className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-gradient-to-r from-primary/10 to-accent/10 p-6 rounded-lg border-2 border-primary/20">
                                <h3 className="font-bold text-lg mb-3">Resumen</h3>
                                <div className="space-y-2">
                                    <div className="flex justify-between">
                                        <span>Precio por ticket:</span>
                                        <span className="font-bold">${raffle.price_usd} USD / Bs {raffle.price_bs}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>Cantidad seleccionada:</span>
                                        <span className="font-bold text-primary">{formData.quantity} tickets</span>
                                    </div>
                                    <div className="border-t pt-2 mt-2">
                                        <div className="flex justify-between text-xl font-bold">
                                            <span>Total:</span>
                                            <div className="text-right">
                                                <div className="text-primary">${totalUSD} USD</div>
                                                <div className="text-sm text-muted-foreground">Bs {totalBS}</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Step 2: Payment Method from DB */}
                    {currentStep === 2 && (
                        <div className="space-y-4">
                            <Label className="text-lg font-semibold">Selecciona el método de pago</Label>
                            {paymentMethods.length === 0 ? (
                                <div className="text-center py-8 text-muted-foreground">
                                    No hay métodos de pago disponibles
                                </div>
                            ) : (
                                <div className="grid gap-3">
                                    {paymentMethods.map((method) => (
                                        <button
                                            key={method.id}
                                            type="button"
                                            onClick={() => setFormData({ ...formData, payment_method_id: String(method.id) })}
                                            className={`p-4 rounded-lg border-2 transition-all text-left ${formData.payment_method_id === String(method.id)
                                                ? 'border-primary bg-primary/5'
                                                : 'border-gray-200 hover:border-primary/50'
                                                }`}
                                        >
                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <h4 className="font-bold text-lg">{method.name}</h4>
                                                    {method.description && (
                                                        <p className="text-sm text-muted-foreground mt-1">{method.description}</p>
                                                    )}
                                                </div>
                                                {formData.payment_method_id === String(method.id) && (
                                                    <Check className="w-6 h-6 text-primary" />
                                                )}
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}

                    {/* Step 3: Client Information */}
                    {currentStep === 3 && (
                        <div className="space-y-4">
                            <Label className="text-lg font-semibold mb-4 block">Información del cliente</Label>
                            <div>
                                <Label htmlFor="dni">Cédula / DNI *</Label>
                                <Input
                                    id="dni"
                                    value={formData.dni}
                                    onChange={(e) => setFormData({ ...formData, dni: e.target.value })}
                                    placeholder="V-12345678"
                                    className="mt-2"
                                    required
                                />
                            </div>
                            <div>
                                <Label htmlFor="name">Nombre Completo *</Label>
                                <Input
                                    id="name"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    placeholder="Juan Pérez"
                                    className="mt-2"
                                    required
                                />
                            </div>
                            <div>
                                <Label htmlFor="phone">Teléfono *</Label>
                                <Input
                                    id="phone"
                                    value={formData.phone}
                                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                    placeholder="+58 412-1234567"
                                    className="mt-2"
                                    required
                                />
                            </div>
                            <div>
                                <Label htmlFor="email">Correo Electrónico *</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    placeholder="correo@ejemplo.com"
                                    className="mt-2"
                                    required
                                />
                            </div>
                        </div>
                    )}

                    {/* Step 4: Payment Reference & Voucher Upload */}
                    {currentStep === 4 && (
                        <div className="space-y-4">
                            <Label className="text-lg font-semibold mb-4 block">Comprobante de pago</Label>
                            <div>
                                <Label htmlFor="reference">Número de Referencia *</Label>
                                <Input
                                    id="reference"
                                    value={formData.reference}
                                    onChange={(e) => setFormData({ ...formData, reference: e.target.value })}
                                    placeholder="123456789"
                                    className="mt-2"
                                    required
                                />
                            </div>

                            <div>
                                <Label htmlFor="voucher">Subir Comprobante *</Label>
                                <div className="mt-2">
                                    {!voucherPreview ? (
                                        <label
                                            htmlFor="voucher"
                                            className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-primary transition-colors"
                                        >
                                            <Upload className="w-12 h-12 text-gray-400 mb-2" />
                                            <span className="text-sm text-gray-500">Click para subir imagen</span>
                                            <span className="text-xs text-gray-400 mt-1">JPG, PNG o PDF</span>
                                            <Input
                                                id="voucher"
                                                type="file"
                                                accept="image/*,.pdf"
                                                onChange={handleVoucherChange}
                                                className="hidden"
                                            />
                                        </label>
                                    ) : (
                                        <div className="relative">
                                            <img
                                                src={voucherPreview}
                                                alt="Comprobante"
                                                className="w-full h-64 object-contain rounded-lg border-2 border-primary"
                                            />
                                            <Button
                                                type="button"
                                                variant="destructive"
                                                size="sm"
                                                className="absolute top-2 right-2"
                                                onClick={removeVoucher}
                                            >
                                                <X className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
                                <p className="text-sm text-blue-800">
                                    <strong>Importante:</strong> Asegúrate de que el comprobante sea legible y contenga toda la información de la transacción.
                                </p>
                            </div>
                        </div>
                    )}

                    {/* Step 5: Success Screen */}
                    {currentStep === 5 && (
                        <div className="flex flex-col items-center justify-center py-8 space-y-6">
                            <div className="w-24 h-24 rounded-full bg-green-100 flex items-center justify-center animate-pulse">
                                <CheckCircle className="w-16 h-16 text-green-600" />
                            </div>
                            <div className="text-center space-y-3">
                                <h3 className="text-3xl font-bold text-green-600">¡Compra Exitosa!</h3>
                                <p className="text-lg font-semibold text-gray-700">
                                    Estamos validando tu pago
                                </p>
                                <p className="text-sm text-muted-foreground max-w-md">
                                    Tu compra ha sido registrada correctamente. Nuestro equipo está verificando tu comprobante de pago.
                                </p>
                            </div>
                            <div className="bg-green-50 border border-green-200 p-6 rounded-lg w-full space-y-3">
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Tickets comprados:</span>
                                    <span className="font-bold">{formData.quantity}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Total pagado:</span>
                                    <span className="font-bold text-green-600">${totalUSD} USD</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Referencia:</span>
                                    <span className="font-bold">{formData.reference}</span>
                                </div>
                            </div>
                            <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg w-full">
                                <p className="text-sm text-blue-800 text-center">
                                    📧 Recibirás un correo de confirmación en <strong>{formData.email}</strong> una vez validemos tu pago
                                </p>
                            </div>
                            <Button onClick={handleClose} size="lg" className="w-full bg-green-600 hover:bg-green-700">
                                Entendido
                            </Button>
                        </div>
                    )}
                </div>

                {/* Navigation Buttons - Hide on success */}
                {currentStep < 5 && (
                    <div className="flex justify-between mt-6 pt-4 border-t">
                        <Button
                            variant="outline"
                            onClick={handleBack}
                            disabled={currentStep === 1}
                        >
                            <ChevronLeft className="w-4 h-4 mr-2" />
                            Atrás
                        </Button>

                        {currentStep < 4 ? (
                            <Button onClick={handleNext}>
                                Siguiente
                                <ChevronRight className="w-4 h-4 ml-2" />
                            </Button>
                        ) : (
                            <Button
                                onClick={handleSubmit}
                                disabled={isSubmitting}
                                className="bg-green-600 hover:bg-green-700"
                            >
                                {isSubmitting ? 'Procesando...' : (
                                    <>
                                        <Check className="w-4 h-4 mr-2" />
                                        Confirmar Compra
                                    </>
                                )}
                            </Button>
                        )}
                    </div>
                )}
            </DialogContent>
        </Dialog>
    );
};
