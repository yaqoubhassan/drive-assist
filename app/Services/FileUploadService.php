<?php

namespace App\Services;

use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Intervention\Image\Facades\Image;

class FileUploadService
{
  /**
   * Upload KYC document
   */
  public function uploadKycDocument(UploadedFile $file, int $expertProfileId, string $documentType): string
  {
    // Validate file
    $this->validateKycDocument($file);

    // Generate unique filename
    $extension = $file->getClientOriginalExtension();
    $filename = $documentType . '_' . uniqid() . '_' . time() . '.' . $extension;
    $path = "kyc/{$expertProfileId}/{$filename}";

    // If it's an image, optimize it
    if (in_array($extension, ['jpg', 'jpeg', 'png'])) {
      $this->uploadOptimizedImage($file, $path);
    } else {
      // Upload PDF directly
      Storage::disk('s3')->put($path, file_get_contents($file->getRealPath()), 'private');
    }

    return $path;
  }

  /**
   * Upload and optimize image
   */
  private function uploadOptimizedImage(UploadedFile $file, string $path): void
  {
    $image = Image::make($file);

    // Resize if too large (max 2000px width)
    if ($image->width() > 2000) {
      $image->resize(2000, null, function ($constraint) {
        $constraint->aspectRatio();
        $constraint->upsize();
      });
    }

    // Encode with quality 85
    $image->encode($file->getClientOriginalExtension(), 85);

    // Upload to S3
    Storage::disk('s3')->put($path, (string) $image, 'private');
  }

  /**
   * Validate KYC document
   */
  private function validateKycDocument(UploadedFile $file): void
  {
    // Check file size (max 5MB)
    if ($file->getSize() > 5 * 1024 * 1024) {
      throw new \Exception('File size must be less than 5MB');
    }

    // Check mime type
    $allowedMimes = [
      'application/pdf',
      'image/jpeg',
      'image/png',
      'image/jpg',
    ];

    if (!in_array($file->getMimeType(), $allowedMimes)) {
      throw new \Exception('Invalid file type. Only PDF, JPG, and PNG files are allowed.');
    }
  }

  /**
   * Delete KYC document
   */
  public function deleteKycDocument(string $path): bool
  {
    if (Storage::disk('s3')->exists($path)) {
      return Storage::disk('s3')->delete($path);
    }

    return false;
  }

  /**
   * Get document URL with temporary access
   */
  public function getTemporaryUrl(string $path, int $minutes = 60): string
  {
    return Storage::disk('s3')->temporaryUrl($path, now()->addMinutes($minutes));
  }
}
