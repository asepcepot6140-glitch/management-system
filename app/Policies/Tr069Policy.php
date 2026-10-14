<?php

namespace App\Policies;

use App\Models\Tr069;
use App\Models\User;
use Illuminate\Auth\Access\Response;

class Tr069Policy
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
    public function view(User $user, Tr069 $tr069): bool|Response
    {
        return $this->belongsToUser($user, $tr069)
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
    public function update(User $user, Tr069 $tr069): bool|Response
    {
        return $this->belongsToUser($user, $tr069)
            ? Response::allow()
            : Response::denyAsNotFound();
    }

    /**
     * Determine whether the user can delete the model.
     */
    public function delete(User $user, Tr069 $tr069): bool|Response
    {
        return $this->belongsToUser($user, $tr069)
            ? Response::allow()
            : Response::denyAsNotFound();
    }

    private function belongsToUser(User $user, Tr069 $tr069): bool
    {
        return $user->id === $tr069->user_id;
    }
}
