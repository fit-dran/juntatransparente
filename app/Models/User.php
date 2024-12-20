<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class User extends Authenticatable
{
    use HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
        'role',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array<int, string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    /**
     * Check if the user has an admin role.
     */
    public function isAdmin(): bool
    {
        return $this->role === 'admin';
    }

    

    /**
     * Check if the user has a board member role.
     */
    public function isBoardMember(): bool
    {
        return $this->role === 'board_member';
    }

    /**
     * Check if the user has a resident role.
     */
    public function isResident(): bool
    {
        return $this->role === 'resident';

    }

    public function association()
    {
        return $this->belongsTo(NeighborhoodAssociation::class, 'association_id');
    }
    public function neighbor()
    {
        return $this->hasOne(Neighbor::class, 'user_id');
    }
    public function boardMember()
    {
        return $this->belongsTo(NeighborhoodAssociation::class, 'neighborhood_association_id');
    }
    public function neighborhoodAssociation()
    {
        return $this->belongsTo(NeighborhoodAssociation::class, 'neighborhood_association_id');
    }
    








}
