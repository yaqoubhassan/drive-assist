<?php

namespace App\Services;

use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;

class FileUploadService
{
  /**
   * Upload KYC document to local storage
   */
  public function uploadKycDocument(UploadedFile $file, int $expertProfileId, string $documentType): string
  {
    // Validate file
    $this->validateKycDocument($file);

    // Generate unique filename
    $extension = $file->getClientOriginalExtension();
    $filename = $documentType . '_' . uniqid() . '_' . time() . '.' . $extension;
    $path = "kyc/{$expertProfileId}/{$filename}";

    // Store file locally
    Storage::disk('public')->put($path, file_get_contents($file->getRealPath()));

    return $path;
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
   * Delete KYC document from local storage
   */
  public function deleteKycDocument(string $path): bool
  {
    if (Storage::disk('public')->exists($path)) {
      return Storage::disk('public')->delete($path);
    }

    return false;
  }

  /**
   * Get document URL from local storage
   */
  public function getDocumentUrl(string $path): string
  {
    return Storage::disk('public')->url($path);
  }
}
