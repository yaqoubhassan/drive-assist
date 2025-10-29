<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\LoginRequest;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Inertia\Response;

class AuthenticatedSessionController extends Controller
{
    /**
     * Display the login view.
     */
    public function create(): Response
    {
        return Inertia::render('Auth/Login', [
            'canResetPassword' => Route::has('password.request'),
            'status' => session('status'),
        ]);
    }

    /**
     * Handle an incoming authentication request.
     */
    public function store(LoginRequest $request): RedirectResponse
    {
        $request->authenticate();

        $request->session()->regenerate();

        // Redirect based on user type
        return $this->redirectBasedOnUserType();
    }

    /**
     * Destroy an authenticated session.
     */
    public function destroy(Request $request): RedirectResponse
    {
        Auth::guard('web')->logout();

        $request->session()->invalidate();

        $request->session()->regenerateToken();

        return redirect()->route('home');
    }

    /**
     * Redirect user to appropriate dashboard based on their user type
     */
    protected function redirectBasedOnUserType(): RedirectResponse
    {
        $user = Auth::user();

        return match ($user->user_type) {
            'driver' => redirect()->intended(route('driver.dashboard')),
            'expert' => redirect()->intended(route('expert.dashboard')),
            'admin' => redirect()->intended(route('admin.dashboard')),
            default => redirect()->intended(route('home')),
        };
    }
}
