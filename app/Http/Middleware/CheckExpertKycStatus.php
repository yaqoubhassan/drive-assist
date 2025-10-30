<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class CheckExpertKycStatus
{
    /**
     * Handle an incoming request.
     *
     * This middleware checks if the expert has completed their KYC verification.
     * It can enforce different levels of restrictions based on KYC status.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next, string $requirement = 'approved'): Response
    {
        $user = $request->user();

        // Only apply to experts
        if (!$user || $user->user_type !== 'expert') {
            return $next($request);
        }

        $expertProfile = $user->expertProfile;

        // If no expert profile, redirect to onboarding
        if (!$expertProfile) {
            return redirect()->route('expert.onboarding.index')
                ->with('error', 'Please complete your profile first.');
        }

        $kyc = $expertProfile->kyc;

        // If no KYC record, redirect to KYC
        if (!$kyc && $requirement !== 'none') {
            return $this->redirectToKyc('Please complete your KYC verification to access this feature.');
        }

        // Check based on requirement level
        return match ($requirement) {
            'approved' => $this->checkApproved($kyc, $request, $next),
            'submitted' => $this->checkSubmitted($kyc, $request, $next),
            'in_progress' => $this->checkInProgress($kyc, $request, $next),
            'none' => $next($request),
            default => $next($request),
        };
    }

    /**
     * Check if KYC is approved
     */
    private function checkApproved($kyc, Request $request, Closure $next): Response
    {
        if (!$kyc || !$kyc->isApproved()) {
            if ($request->expectsJson()) {
                return response()->json([
                    'error' => 'KYC verification required',
                    'message' => 'You must complete and get your KYC approved to access this feature.',
                    'kyc_status' => $kyc?->kyc_status ?? 'not_started',
                    'redirect_url' => route('expert.kyc.index'),
                ], 403);
            }

            return $this->redirectToKyc(
                'You must complete and get your KYC approved to access this feature.'
            );
        }

        return $next($request);
    }

    /**
     * Check if KYC is at least submitted
     */
    private function checkSubmitted($kyc, Request $request, Closure $next): Response
    {
        if (!$kyc || !in_array($kyc->kyc_status, ['submitted', 'under_review', 'approved'])) {
            if ($request->expectsJson()) {
                return response()->json([
                    'error' => 'KYC submission required',
                    'message' => 'You must submit your KYC for review to access this feature.',
                    'kyc_status' => $kyc?->kyc_status ?? 'not_started',
                    'redirect_url' => route('expert.kyc.index'),
                ], 403);
            }

            return $this->redirectToKyc(
                'You must submit your KYC for review to access this feature.'
            );
        }

        return $next($request);
    }

    /**
     * Check if KYC is at least in progress
     */
    private function checkInProgress($kyc, Request $request, Closure $next): Response
    {
        if (!$kyc || $kyc->kyc_status === 'not_started') {
            if ($request->expectsJson()) {
                return response()->json([
                    'error' => 'KYC required',
                    'message' => 'You must start your KYC verification to access this feature.',
                    'kyc_status' => 'not_started',
                    'redirect_url' => route('expert.kyc.index'),
                ], 403);
            }

            return $this->redirectToKyc(
                'You must start your KYC verification to access this feature.'
            );
        }

        return $next($request);
    }

    /**
     * Redirect to KYC page with message
     */
    private function redirectToKyc(string $message): Response
    {
        return redirect()->route('expert.kyc.index')
            ->with('warning', $message);
    }
}
