<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Item extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'type',
        'parent_id',
        'owner_id',
        'path',
        'mime_type',
        'size',
    ];

    public function owner()
    {
        return $this->belongsTo(User::class, 'owner_id');
    }

    public function parent()
    {
        return $this->belongsTo(Item::class, 'parent_id');
    }

    public function children()
    {
        return $this->hasMany(Item::class, 'parent_id');
    }

    public function labels()
    {
        return $this->morphToMany(Label::class, 'item', 'item_labels');
    }

    public function sharedWithUsers()
    {
        return $this->belongsToMany(User::class, 'shares')->withPivot('permission')->withTimestamps();
    }
}