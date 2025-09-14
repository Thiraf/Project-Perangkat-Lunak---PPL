<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Share extends Model
{
    protected $table = 'shares';

    protected $fillable = [
        'user_id',
        'item_id',
        'permission',
    ];

    /**
     * Get the user that owns the share.
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get the item that is shared.
     */
    public function item()
    {
        return $this->belongsTo(Item::class);
    }
}
