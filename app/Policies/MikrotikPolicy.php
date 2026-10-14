<?php

namespace App\Policies;

use App\Models\Mikrotik;
use App\Models\User;
use Illuminate\Auth\Access\Response;

class MikrotikPolicy
{
    /**
     * Determine whether the user can view any models.
     */
    public function viewAny(User $user): bool
    {
        return true;
    }

    /**
     * Determine whether the user can view the model.
     */
    public function view(User $user, Mikrotik $mikrotik): bool|Response
    {
        return $this->belongsToUser($user, $mikrotik)
            ? Response::allow()
            : Response::denyAsNotFound();
    }

    /**
     * Determine whether the user can create models.
     */
    public function create(User $user): bool
    {
        return true;
    }

    /**
     * Determine whether the user can update the model.
     */
    public function update(User $user, Mikrotik $mikrotik): bool|Response
    {
        return $this->belongsToUser($user, $mikrotik)
            ? Response::allow()
            : Response::denyAsNotFound();
    }

    /**
     * Determine whether the user can delete the model.
     */
    public function delete(User $user, Mikrotik $mikrotik): bool|Response
    {
        return $this->belongsToUser($user, $mikrotik)
            ? Response::allow()
            : Response::denyAsNotFound();
    }

    private function belongsToUser(User $user, Mikrotik $mikrotik): bool
    {
        return $user->id === $mikrotik->user_id;
    }
}
