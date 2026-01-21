<?php

namespace App\Mail;

use App\Models\Shopping;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class OrderApprovedMail extends Mailable
{
    use Queueable, SerializesModels;

    public $shopping;

    public function __construct(Shopping $shopping)
    {
        $this->shopping = $shopping;
    }

    public function build()
    {
        return $this->subject('¡Tu pago ha sido aprobado! - Emprende y Gana con Carmelo')
                    ->view('emails.order_approved'); 
    }
}
