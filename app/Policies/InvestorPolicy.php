<?php

namespace App\Policies;

use App\Models\Investor;
use App\Models\User;

class InvestorPolicy
{
    /**
     * Determine whether the user can view any models.
     */
    public function viewAny(User $user): bool
    {
        // Allow all authenticated users to view investors list
        // You can modify this based on your requirements
        return true;
    }

    /**
     * Determine whether the user can view the model.
     */
    public function view(User $user, Investor $investor): bool
    {
        // Users can view their own investor records
        // You can also allow admins or other roles here
        return $user->id === $investor->user_id;
    }

    /**
     * Determine whether the user can create models.
     */
    public function create(User $user): bool
    {
        // Allow all authenticated users to create investor records
        // You can modify this based on your requirements
        return true;
    }

    /**
     * Determine whether the user can update the model.
     */
    public function update(User $user, Investor $investor): bool
    {
        // Users can update their own investor records
        // You can also allow admins or other roles here
        return $user->id === $investor->user_id;
    }

    /**
     * Determine whether the user can delete the model.
     */
    public function delete(User $user, Investor $investor): bool
    {
        // Users can delete their own investor records
        // You can also allow admins or other roles here
        return $user->id === $investor->user_id;
    }

    /**
     * Determine whether the user can restore the model.
     */
    public function restore(User $user, Investor $investor): bool
    {
        return $user->id === $investor->user_id;
    }

    /**
     * Determine whether the user can permanently delete the model.
     */
    public function forceDelete(User $user, Investor $investor): bool
    {
        return $user->id === $investor->user_id;
    }

    /**
     * Determine whether the user can activate an investor.
     */
    public function activate(User $user, Investor $investor): bool
    {
        // Only allow the owner to activate their investor record
        // You might want to restrict this to admins only
        return $user->id === $investor->user_id;
    }

    /**
     * Determine whether the user can set investor status to pending.
     */
    public function setPending(User $user, Investor $investor): bool
    {
        // Only allow the owner to change status to pending
        // You might want to restrict this to admins only
        return $user->id === $investor->user_id;
    }
}