<?php

namespace App\Enums\Enums;

enum PaymentMethodEnum: string
{
    case CASH = 'cash';
    case CREDIT_CARD = 'credit_card';
    case DEBIT_CARD = 'debit_card';
    case PAYPAL = 'paypal';
    case STRIPE = 'stripe';
}
