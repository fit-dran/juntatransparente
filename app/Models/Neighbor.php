<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Neighbor extends Model
{
    use HasFactory;

    protected $fillable = [
        "address",
        "identification_number",
        "registration_date",
        "birth_date",
        "status",
        "last_participation_date",
        "user_id",
        "neighborhood_association_id",
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function neighborhoodAssociation()
    {
        return $this->belongsTo(NeighborhoodAssociation::class);
    }

    public function scopeActive($query)
    {
        return $query->where('status', 'active');
    }
}
