import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ChevronLeft, ChevronRight, Check, ShoppingCart, CreditCard, User, FileText, CheckCircle, Upload, X, AlertCircle } from "lucide-react";
import { router } from "@inertiajs/react";
import { toast } from "sonner";

interface PaymentMethod {
    id: number;
    name: string;
    description: string;
    status: string;
    currency?: {
        id: number;
        name: string;
        symbol: string;
    };
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
        quantity: 1, // Cantidad mínima de tickets
        payment_method_id: "",
        dni: "",
        name: "",
        phone: "",
        email: "",
        reference: "",
        voucher: null,
    });

    const [errors, setErrors] = useState<Record<string, string>>({});
    const [assignedTickets, setAssignedTickets] = useState<string[]>([]);

    const steps = [
        { number: 1, title: "Pago", icon: CreditCard },
        { number: 2, title: "Cantidad", icon: ShoppingCart },
        { number: 3, title: "Datos", icon: User },
        { number: 4, title: "Comprobante", icon: FileText },
        { number: 5, title: "Éxito", icon: CheckCircle },
    ];

    const quickQuantities = [1];

    const validateStep = (step: number): boolean => {
        const newErrors: Record<string, string> = {};

        switch (step) {
            case 1:
                // Step 1: Payment Method
                if (!formData.payment_method_id) {
                    newErrors.payment_method_id = "Debes seleccionar un método de pago";
                }
                break;
            case 2:
                // Step 2: Quantity
                if (formData.quantity < 1) {
                    newErrors.quantity = "Debes seleccionar al menos 1 ticket";
                }
                break;
            case 3:
                // Step 3: Client Information
                if (!formData.dni.trim()) {
                    newErrors.dni = "La cédula/DNI es requerida";
                }
                if (!formData.name.trim()) {
                    newErrors.name = "El nombre completo es requerido";
                }
                if (!formData.phone.trim()) {
                    newErrors.phone = "El teléfono es requerido";
                } else if (!/^\+\d+/.test(formData.phone)) {
                    newErrors.phone = "El teléfono debe incluir el código de país (ej. +58)";
                }
                if (!formData.email.trim()) {
                    newErrors.email = "El correo electrónico es requerido";
                } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
                    newErrors.email = "El correo electrónico no es válido";
                }
                break;
            case 4:
                // Step 4: Payment Voucher
                if (!formData.reference.trim()) {
                    newErrors.reference = "El número de referencia es requerido";
                }
                if (!formData.voucher) {
                    newErrors.voucher = "Debes subir el comprobante de pago";
                }
                break;
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleNext = () => {
        if (validateStep(currentStep)) {
            if (currentStep < 5) {
                setCurrentStep(currentStep + 1);
                setErrors({});
            }
        } else {
            toast.error("Por favor completa todos los campos requeridos");
        }
    };

    const handleBack = () => {
        if (currentStep > 1) setCurrentStep(currentStep - 1);
    };

    const handleVoucherChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setFormData({ ...formData, voucher: file });
            if (errors.voucher) setErrors({ ...errors, voucher: "" });
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
        // Validate step 4 before submitting
        if (!validateStep(4)) {
            toast.error("Por favor completa todos los campos requeridos");
            return;
        }

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
        const selectedMethod = paymentMethods.find(m => m.id === Number(formData.payment_method_id));
        const isBolivares = selectedMethod?.currency?.symbol === "Bs" || selectedMethod?.currency?.name.toLowerCase().includes("bolivar");
        const finalAmount = isBolivares ? totalBS : totalUSD;

        submitData.append('amount', String(finalAmount));
        submitData.append('status', 'pending');

        if (formData.voucher) {
            submitData.append('voucher', formData.voucher);
        }
        fetch('/purchase', {
            method: 'POST',
            body: submitData,
            headers: {
                'Accept': 'application/json',
                'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || ''
            }
        })
            .then(async response => {
                const data = await response.json();
                if (response.ok) {
                    setIsSubmitting(false);
                    setAssignedTickets(data.tickets || []);
                    setCurrentStep(5);
                } else {
                    if (response.status === 422 && data.errors) {
                        const validationErrors: Record<string, string> = {};
                        Object.keys(data.errors).forEach(key => {
                            validationErrors[key] = data.errors[key][0];
                        });
                        setErrors(validationErrors);
                        // If there is a reference error, it was likely from step 4
                        // and we are already on step 4, so just show the errors.
                        throw new Error(data.message || 'Error de validación');
                    }
                    throw new Error(data.message || 'Error al procesar la compra');
                }
            })
            .catch(error => {
                setIsSubmitting(false);
                // Only show general toast if it's not a handled validation error that we already displayed
                if (error.message !== 'Error de validación') {
                    toast.error(error.message);
                } else {
                    toast.error("Por favor revisa los errores en el formulario");
                }
                console.error(error);
            });
    };

    const handleClose = () => {
        onClose();
        setTimeout(() => {
            setCurrentStep(1);
            setFormData({
                quantity: 1,
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
        <Dialog open={isOpen} onOpenChange={handleClose} >
            <DialogContent className="sm:max-w-[650px] h-full max-h-[700px] overflow-hidden flex flex-col">
                {currentStep < 5 && (
                    <div className="flex justify-between mb-4 flex-shrink-0">
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
                <div className="flex-1 overflow-y-auto px-1">
                    {/* Step 1: Payment Method */}
                    {currentStep === 1 && (
                        <div className="space-y-2 sm:space-y-4">
                            <Label className="text-lg font-semibold">Selecciona el método de pago</Label>
                            {paymentMethods.length === 0 ? (
                                <div className="text-center py-8 text-muted-foreground">
                                    No hay métodos de pago disponibles
                                </div>
                            ) : (
                                <>
                                    <div className="grid gap-3">
                                        {paymentMethods.map((method) => (
                                            <button
                                                key={method.id}
                                                type="button"
                                                onClick={() => {
                                                    setFormData({ ...formData, payment_method_id: String(method.id) });
                                                    if (errors.payment_method_id) setErrors({ ...errors, payment_method_id: "" });
                                                }}
                                                className={`p-4 rounded-lg border-2 transition-all text-left ${formData.payment_method_id === String(method.id)
                                                    ? 'border-primary bg-primary/5'
                                                    : errors.payment_method_id ? 'border-red-500' : 'border-gray-200 hover:border-primary/50'
                                                    }`}
                                            >
                                                <div className="flex items-center justify-between">
                                                    <div className="w-full">
                                                        <h4 className="font-bold text-lg">{method.name}</h4>
                                                        {method.description && (
                                                            <p className="text-sm text-muted-foreground mt-1">{method.description}</p>
                                                        )}
                                                    </div>
                                                    {formData.payment_method_id === String(method.id) && (
                                                        <Check className="w-6 h-6 text-primary flex-shrink-0 ml-2" />
                                                    )}
                                                </div>
                                            </button>
                                        ))}
                                    </div>
                                    {errors.payment_method_id && (
                                        <p className="text-red-500 text-sm mt-2 flex items-center gap-1">
                                            <AlertCircle className="w-4 h-4" />
                                            {errors.payment_method_id}
                                        </p>
                                    )}
                                </>
                            )}
                        </div>
                    )}

                    {/* Step 2: Quantity with Payment Details */}
                    {currentStep === 2 && (
                        <div className="space-y-3 sm:space-y-6">
                            <div>
                                <Label className="text-lg font-semibold mb-2 sm:mb-4 block">Selecciona la cantidad de tickets</Label>
                                <div className="grid grid-cols-6 gap-2">
                                    {quickQuantities.map((qty) => (
                                        <div key={qty} className="relative">
                                            <Button
                                                type="button"
                                                variant={formData.quantity === qty ? "default" : "outline"}
                                                className={`aspect-square text-sm font-bold w-full ${formData.quantity === qty
                                                    ? 'bg-gradient-brand'
                                                    : 'hover:border-primary'
                                                    }`}
                                                onClick={() => setFormData({ ...formData, quantity: qty })}
                                            >
                                                {qty}
                                            </Button>
                                            {qty === 10 && (
                                                <span className="absolute -top-2 -right-2 bg-gradient-to-r from-orange-500 to-red-500 text-white text-xs font-bold px-2 py-1 rounded-full shadow-lg">
                                                    Popular
                                                </span>
                                            )}
                                        </div>
                                    ))}
                                </div>
                                <div className="space-y-2 mt-4">
                                    <Label htmlFor="custom-quantity" className="text-sm font-medium">Cantidad personalizada:</Label>
                                    <div className="flex items-center gap-2">
                                        {/*<Button
                                            type="button"
                                            variant="outline"
                                            size="icon"
                                            onClick={() => setFormData({ ...formData, quantity: Math.max(1, formData.quantity - 1) })}
                                            className="h-10 w-10"
                                        >
                                            <ChevronLeft className="h-4 w-4" />
                                        </Button>*/}
                                        <Input
                                            id="custom-quantity"
                                            type="number"
                                            min="1"
                                            value={formData.quantity}
                                            onChange={(e) => setFormData({ ...formData, quantity: Math.max(1, Number(e.target.value)) })}
                                            className="text-center text-lg font-bold"
                                            disabled
                                        />
                                        {/*<Button
                                            type="button"
                                            variant="outline"
                                            size="icon"
                                            onClick={() => setFormData({ ...formData, quantity: formData.quantity + 1 })}
                                            className="h-10 w-10"
                                        >
                                            <ChevronRight className="h-4 w-4" />
                                        </Button>*/}
                                    </div>
                                </div>
                            </div>

                            {/* Payment Details and Summary - Side by Side */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {/* Payment Details */}
                                {formData.payment_method_id && (
                                    <div className="bg-primary/5 border-2 border-primary/20 p-4 rounded-lg">
                                        <h3 className="font-bold text-base mb-3 text-primary">Datos de Pago</h3>
                                        <div className="bg-white p-3 rounded border border-primary/10">
                                            <div className="mb-2 pb-2 border-b border-gray-200">
                                                <p className="text-xs text-gray-500 mb-1">Método seleccionado:</p>
                                                <p className="font-bold text-sm">
                                                    {paymentMethods.find(m => m.id === Number(formData.payment_method_id))?.name}
                                                </p>
                                            </div>
                                            <p className="text-xs whitespace-pre-line">
                                                {paymentMethods.find(m => m.id === Number(formData.payment_method_id))?.description}
                                            </p>
                                        </div>
                                    </div>
                                )}

                                {/* Purchase Summary */}
                                <div className="bg-gradient-brand p-4 rounded-lg border-2 border-primary/20 bg-opacity-10">
                                    <h3 className="font-bold text-base mb-3">Resumen de Compra</h3>
                                    <div className="space-y-2">
                                        <div className="flex justify-between text-sm">
                                            <span>Precio por ticket:</span>
                                            <span className="font-bold">
                                                {paymentMethods.find(m => m.id === Number(formData.payment_method_id))?.currency?.symbol === "Bs" || paymentMethods.find(m => m.id === Number(formData.payment_method_id))?.currency?.name.toLowerCase().includes("bolivar")
                                                    ? `Bs ${raffle.price_bs}`
                                                    : `$${raffle.price_usd} USD`
                                                }
                                            </span>
                                        </div>
                                        <div className="flex justify-between text-sm">
                                            <span>Cantidad:</span>
                                            <span className="font-bold text-primary">{formData.quantity} tickets</span>
                                        </div>
                                        <div className="border-t pt-2 mt-2">
                                            <div className="flex justify-between">
                                                <span className="font-bold">Total a Pagar:</span>
                                                <div className="text-right">
                                                    <div className="text-primary font-bold text-lg">
                                                        {paymentMethods.find(m => m.id === Number(formData.payment_method_id))?.currency?.symbol || "$"}
                                                        {" "}
                                                        {paymentMethods.find(m => m.id === Number(formData.payment_method_id))?.currency?.symbol === "Bs" || paymentMethods.find(m => m.id === Number(formData.payment_method_id))?.currency?.name.toLowerCase().includes("bolivar")
                                                            ? totalBS
                                                            : totalUSD
                                                        }
                                                        {!(paymentMethods.find(m => m.id === Number(formData.payment_method_id))?.currency?.symbol === "Bs" || paymentMethods.find(m => m.id === Number(formData.payment_method_id))?.currency?.name.toLowerCase().includes("bolivar")) && " USD"}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Step 3: Client Information */}
                    {currentStep === 3 && (
                        <div className="space-y-2 sm:space-y-4">
                            <Label className="text-lg font-semibold mb-2 sm:mb-4 block">Información del cliente</Label>
                            <div>
                                <Label htmlFor="dni">Cédula / DNI *</Label>
                                <Input
                                    id="dni"
                                    value={formData.dni}
                                    onChange={(e) => {
                                        const value = e.target.value.replace(/\D/g, '');
                                        setFormData({ ...formData, dni: value });
                                        if (errors.dni) setErrors({ ...errors, dni: "" });
                                    }}
                                    placeholder="12345678"
                                    className={`mt-2 ${errors.dni ? 'border-red-500' : ''}`}
                                    required
                                />
                                {errors.dni && (
                                    <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                                        <AlertCircle className="w-4 h-4" />
                                        {errors.dni}
                                    </p>
                                )}
                            </div>
                            <div>
                                <Label htmlFor="name">Nombre Completo *</Label>
                                <Input
                                    id="name"
                                    value={formData.name}
                                    onChange={(e) => {
                                        setFormData({ ...formData, name: e.target.value });
                                        if (errors.name) setErrors({ ...errors, name: "" });
                                    }}
                                    placeholder="Juan Pérez"
                                    className={`mt-2 ${errors.name ? 'border-red-500' : ''}`}
                                    required
                                />
                                {errors.name && (
                                    <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                                        <AlertCircle className="w-4 h-4" />
                                        {errors.name}
                                    </p>
                                )}
                            </div>
                            <div>
                                <Label htmlFor="phone">Teléfono *</Label>
                                <Input
                                    id="phone"
                                    value={formData.phone}
                                    onChange={(e) => {
                                        const value = e.target.value.replace(/[^\d+ ]/g, '');
                                        setFormData({ ...formData, phone: value });
                                        if (errors.phone) setErrors({ ...errors, phone: "" });
                                    }}
                                    placeholder="+58 4121234567"
                                    className={`mt-2 ${errors.phone ? 'border-red-500' : ''}`}
                                    required
                                />
                                {errors.phone && (
                                    <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                                        <AlertCircle className="w-4 h-4" />
                                        {errors.phone}
                                    </p>
                                )}
                            </div>
                            <div>
                                <Label htmlFor="email">Correo Electrónico *</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    value={formData.email}
                                    onChange={(e) => {
                                        setFormData({ ...formData, email: e.target.value });
                                        if (errors.email) setErrors({ ...errors, email: "" });
                                    }}
                                    placeholder="correo@ejemplo.com"
                                    className={`mt-2 ${errors.email ? 'border-red-500' : ''}`}
                                    required
                                />
                                {errors.email && (
                                    <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                                        <AlertCircle className="w-4 h-4" />
                                        {errors.email}
                                    </p>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Step 4: Payment Reference & Voucher Upload */}
                    {currentStep === 4 && (
                        <div className="space-y-2 sm:space-y-4">
                            <Label className="text-lg font-semibold mb-2 sm:mb-4 block">Comprobante de pago</Label>
                            <div>
                                <Label htmlFor="reference">Número de Referencia *</Label>
                                <Input
                                    id="reference"
                                    value={formData.reference}
                                    onChange={(e) => {
                                        setFormData({ ...formData, reference: e.target.value });
                                        if (errors.reference) setErrors({ ...errors, reference: "" });
                                    }}
                                    placeholder="123456789"
                                    className={`mt-2 ${errors.reference ? 'border-red-500' : ''}`}
                                    required
                                />
                                {errors.reference && (
                                    <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                                        <AlertCircle className="w-4 h-4" />
                                        {errors.reference}
                                    </p>
                                )}
                            </div>

                            <div>
                                <Label htmlFor="voucher">Subir Comprobante *</Label>
                                <div className="mt-2">
                                    {!voucherPreview ? (
                                        <label
                                            htmlFor="voucher"
                                            className={`flex flex-col items-center justify-center w-full h-32 sm:h-48 border-2 border-dashed rounded-lg cursor-pointer hover:border-primary transition-colors ${errors.voucher ? 'border-red-500' : 'border-gray-300'
                                                }`}
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
                                {errors.voucher && (
                                    <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                                        <AlertCircle className="w-4 h-4" />
                                        {errors.voucher}
                                    </p>
                                )}
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
                        <div className="flex flex-col items-center justify-center h-full py-4 space-y-4">
                            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-green-100 flex items-center justify-center animate-pulse">
                                <CheckCircle className="w-12 h-12 sm:w-16 sm:h-16 text-green-600" />
                            </div>
                            <div className="text-center space-y-2">
                                <h3 className="text-2xl sm:text-3xl font-bold text-green-600">¡Compra Exitosa!</h3>
                                <p className="text-lg font-semibold text-gray-700">
                                    Estamos validando tu pago
                                </p>
                                <p className="text-sm text-muted-foreground max-w-md px-2">
                                    Tu compra ha sido registrada correctamente. Nuestro equipo está verificando tu comprobante de pago.
                                </p>
                            </div>
                            <div className="bg-green-50 border border-green-200 p-4 rounded-lg w-full space-y-2">
                                <div className="flex justify-between text-base">
                                    <span className="text-gray-600">Método de pago:</span>
                                    <span className="font-bold">
                                        {paymentMethods.find(m => m.id === Number(formData.payment_method_id))?.name}
                                    </span>
                                </div>
                                <div className="flex justify-between text-base">
                                    <span className="text-gray-600">Tickets comprados:</span>
                                    <span className="font-bold">{formData.quantity}</span>
                                </div>
                                <div className="flex justify-between text-base">
                                    <span className="text-gray-600">Total pagado:</span>
                                    <div className="text-right">
                                        <div className="font-bold text-green-600">
                                            {paymentMethods.find(m => m.id === Number(formData.payment_method_id))?.currency?.symbol || "$"}
                                            {" "}
                                            {paymentMethods.find(m => m.id === Number(formData.payment_method_id))?.currency?.symbol === "Bs" || paymentMethods.find(m => m.id === Number(formData.payment_method_id))?.currency?.name.toLowerCase().includes("bolivar")
                                                ? totalBS
                                                : totalUSD
                                            }
                                            {!(paymentMethods.find(m => m.id === Number(formData.payment_method_id))?.currency?.symbol === "Bs" || paymentMethods.find(m => m.id === Number(formData.payment_method_id))?.currency?.name.toLowerCase().includes("bolivar")) && " USD"}
                                        </div>
                                    </div>
                                </div>
                                <div className="flex justify-between text-base">
                                    <span className="text-gray-600">Referencia:</span>
                                    <span className="font-bold">{formData.reference}</span>
                                </div>

                                {assignedTickets.length > 0 && (
                                    <div className="border-t pt-2 mt-2">
                                        <p className="text-sm font-semibold text-gray-700 mb-2">Tus números asignados:</p>
                                        <div className="grid grid-cols-4 sm:grid-cols-5 gap-2">
                                            {assignedTickets.map((ticket, index) => (
                                                <div key={index} className="bg-primary/10 text-primary font-bold text-center py-1.5 rounded border border-primary/20 text-sm">
                                                    {ticket}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                            <div className="bg-blue-50 border border-blue-200 p-3 rounded-lg w-full">
                                <p className="text-sm text-blue-800 text-center">
                                    📧 Recibirás un correo de confirmación en <strong>{formData.email}</strong>
                                </p>
                            </div>
                            <Button onClick={handleClose} size="lg" className="w-full bg-green-600 hover:bg-green-700 text-base">
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
        </Dialog >
    );
};
