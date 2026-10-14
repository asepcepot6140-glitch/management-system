<?php

namespace App\Policies;

use App\Models\Olt;
use App\Models\User;
use Illuminate\Auth\Access\Response;

class OltPolicy
{
    public function viewAny(User $user): bool
    {
        return true;
    }

    public function view(User $user, Olt $olt): bool|Response
    {
        return $this->belongsToUser($user, $olt)
            ? Response::allow()
            : Response::denyAsNotFound();
    }

    public function create(User $user): bool
    {
        return true;
    }

    public function update(User $user, Olt $olt): bool|Response
    {
        return $this->belongsToUser($user, $olt)
            ? Response::allow()
            : Response::denyAsNotFound();
    }

    public function delete(User $user, Olt $olt): bool|Response
    {
        return $this->belongsToUser($user, $olt)
            ? Response::allow()
            : Response::denyAsNotFound();
    }

    private function belongsToUser(User $user, Olt $olt): bool
    {
        return $user->id === $olt->user_id;
    }
}
