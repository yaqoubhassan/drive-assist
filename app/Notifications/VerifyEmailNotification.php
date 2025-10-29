<?php

namespace App\Notifications;

use Illuminate\Auth\Notifications\VerifyEmail as BaseVerifyEmail;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\URL;

class VerifyEmailNotification extends BaseVerifyEmail
{
    /**
     * Get the verification URL for the given notifiable.
     *
     * @param  mixed  $notifiable
     * @return string
     */
    protected function verificationUrl($notifiable)
    {
        $url = URL::temporarySignedRoute(
            'verification.verify',
            now()->addMinutes(60),
            [
                'id' => $notifiable->getKey(),
                'hash' => sha1($notifiable->getEmailForVerification()),
            ]
        );

        // Log the verification URL for development
        if (config('app.env') === 'local') {
            Log::info('==================== EMAIL VERIFICATION URL ====================');
            Log::info("User: {$notifiable->name} ({$notifiable->email})");
            Log::info("Verification URL: {$url}");
            Log::info('================================================================');
        }

        return $url;
    }
}
