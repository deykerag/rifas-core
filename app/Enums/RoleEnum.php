<?php

namespace App\Enums;

enum RoleEnum: string
{
    /**
     * Roles list availables.
     */
    case SUPER_ADMIN = 'super-admin';
    case ADMIN = 'admin';
    case VERIFICATOR = 'verificator';
}
