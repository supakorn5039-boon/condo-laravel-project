<?php
namespace App\Models;

use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;
use Spatie\MediaLibrary\HasMedia;
use Spatie\MediaLibrary\InteractsWithMedia;
use Spatie\MediaLibrary\MediaCollections\Models\Media;

/**
 * @method static LengthAwarePaginator paginate(int $perPage = 15, array $columns = ['*'], string $pageName = 'page', int|null $page = null)
 * @property int $id
 * @property int|null $owner_id refers to user_id in users table
 * @property string $address
 * @property string $name
 * @property string $description
 * @property int $bedrooms
 * @property int $bathrooms
 * @property string $price
 * @property string $area
 * @property string $type
 * @property bool $is_available
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property \Illuminate\Support\Carbon|null $deleted_at
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\User> $user
 * @property-read int|null $user_count
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Room newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Room newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Room onlyTrashed()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Room query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Room whereAddress($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Room whereArea($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Room whereBathrooms($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Room whereBedrooms($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Room whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Room whereDeletedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Room whereDescription($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Room whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Room whereIsAvailable($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Room whereName($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Room whereOwnerId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Room wherePrice($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Room whereType($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Room whereUpdatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Room withTrashed(bool $withTrashed = true)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Room withoutTrashed()
 * @property-read \Spatie\MediaLibrary\MediaCollections\Models\Collections\MediaCollection<int, Media> $media
 * @property-read int|null $media_count
 * @method static \Database\Factories\RoomFactory factory($count = null, $state = [])
 * @property-read array $images
 * @mixin \Eloquent
 */
class Room extends Model implements HasMedia
{
    use HasFactory, InteractsWithMedia, SoftDeletes;

    protected $fillable = [
        'name',
        'address',
        'description',
        'bedrooms',
        'bathrooms',
        'price',
        'area',
        'type',
        'is_available',
        'owner_id',
    ];

    protected $appends = ['images'];

    public function getImagesAttribute(): array
    {
        $baseUrl = config('app.url') . '/storage/app/public';

        return $this->getMedia('images')->map(fn($media) => [
            'id'      => $media->id,
            'url'     => $baseUrl . '/' . $media->id . '/' . $media->file_name,
            'thumb'   => $baseUrl . '/' . $media->id . '/conversions/' . pathinfo($media->file_name, PATHINFO_FILENAME) . '-thumb.jpg',
            'preview' => $baseUrl . '/' . $media->id . '/conversions/' . pathinfo($media->file_name, PATHINFO_FILENAME) . '-preview.jpg',
        ])->toArray();
    }

    public function registerMediaCollections(): void
    {
        $this->addMediaCollection('images');

        $this->addMediaCollection('thumbnail')
            ->singleFile();
    }

    public function registerMediaConversions(?Media $media = null): void
    {
        $this->addMediaConversion('thumb')
            ->width(300)
            ->height(300)
            ->sharpen(10)
            ->nonQueued();

        $this->addMediaConversion('preview')
            ->width(800)
            ->height(600)
            ->nonQueued();
    }

    // Relationships
    public function owner(): BelongsTo
    {
        return $this->belongsTo(User::class, 'owner_id');
    }
}
