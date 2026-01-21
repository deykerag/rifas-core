<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Pago Aprobado</title>
</head>
<body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f4f4f4; color: #333;">
    <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px; margin: 20px auto; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 15px rgba(0,0,0,0.1);">
        <!-- Header -->
        <tr>
            <td align="center" style="padding: 40px 20px; background-color: #1a1a1a; color: #ffffff;">
                <h1 style="margin: 0; font-size: 28px; letter-spacing: 1px; color: #d4af37;">¡PAGO APROBADO!</h1>
                <p style="margin: 10px 0 0; font-size: 16px; opacity: 0.8;">Tu participación ha sido confirmada</p>
            </td>
        </tr>

        <!-- Content -->
        <tr>
            <td style="padding: 40px 30px;">
                <p style="font-size: 18px; margin-top: 0;">Hola, <strong>{{ $shopping->name }}</strong>,</p>
                <p style="line-height: 1.6; color: #666;">Te informamos que tu pago para la rifa <strong style="color: #333;">{{ $shopping->raffle->name }}</strong> ha sido validado con éxito. ¡Ya estás participando!</p>

                <!-- Order Details -->
                <div style="margin: 30px 0; padding: 25px; border: 1px solid #eee; border-radius: 8px; background-color: #fafafa;">
                    <h3 style="margin-top: 0; font-size: 16px; text-transform: uppercase; color: #888; border-bottom: 1px solid #ddd; padding-bottom: 10px;">Detalles de la Compra</h3>
                    <table width="100%" cellpadding="5" cellspacing="0">
                        <tr>
                            <td style="color: #888; width: 40%;">Nombre:</td>
                            <td style="font-weight: 600;">{{ $shopping->name }}</td>
                        </tr>
                        <tr>
                            <td style="color: #888;">Teléfono:</td>
                            <td style="font-weight: 600;">{{ $shopping->phone }}</td>
                        </tr>
                        <tr>
                            <td style="color: #888;">Tickets comprados:</td>
                            <td style="font-weight: 600;">{{ $shopping->quantity }}</td>
                        </tr>
                        <tr>
                            <td style="color: #888;">Monto pagado:</td>
                            <td style="font-weight: 600; color: #28a745;">${{ number_format($shopping->amount, 2) }}</td>
                        </tr>
                    </table>
                </div>

                <!-- Assigned Numbers -->
                <div style="text-align: center; margin: 30px 0;">
                    <h3 style="margin-bottom: 20px; color: #1a1a1a;">Tus Números Asignados</h3>
                    <div style="display: block;">
                        @foreach($shopping->assigned_numbers as $number)
                            <span style="display: inline-block; background-color: #1a1a1a; color: #d4af37; padding: 10px 15px; margin: 5px; border-radius: 6px; font-weight: bold; font-size: 18px; border: 1px solid #d4af37;">
                                {{ $number }}
                            </span>
                        @endforeach
                    </div>
                </div>

                <div style="text-align: center; margin-top: 40px;">
                    <p style="font-style: italic; color: #888;">"¡Mucha suerte en el sorteo!"</p>
                </div>
            </td>
        </tr>

        <!-- Footer -->
        <tr>
            <td align="center" style="padding: 30px; background-color: #f9f9f9; border-top: 1px solid #eee;">
                <p style="margin: 0; font-size: 12px; color: #aaa;">
                    Este es un correo automático, por favor no respondas a este mensaje.<br>
                    &copy; {{ date('Y') }} {{ $shopping->raffle->company->name ?? 'Emprende y Gana' }}. Todos los derechos reservados.
                </p>
            </td>
        </tr>
    </table>
</body>
</html>