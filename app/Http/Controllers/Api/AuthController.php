<?php

namespace App\Http\Controllers\Api;

use App\Http\Resources\UserResource;
use App\Models\User;
use App\Models\ExpertProfile;
use Illuminate\Auth\Events\Registered;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules;
use Illuminate\Validation\ValidationException;

class AuthController extends ApiController
{
    /**
     * Register a new user.
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function register(Request $request)
    {
        try {
            $validated = $request->validate([
                'name' => 'required|string|max:255',
                'email' => 'required|string|lowercase|email|max:255|unique:users',
                'password' => ['required', 'confirmed', Rules\Password::defaults()],
                'user_type' => 'required|in:driver,expert',
                'phone' => 'nullable|string|max:20',
            ]);

            DB::beginTransaction();
            try {
                $user = User::create([
                    'name' => $validated['name'],
                    'email' => $validated['email'],
                    'password' => Hash::make($validated['password']),
                    'user_type' => $validated['user_type'],
                    'phone' => $validated['phone'] ?? null,
                ]);

                // If user is an expert, create empty expert profile
                if ($user->user_type === 'expert') {
                    $user->expertProfile()->create([
                        'business_name' => '',
                        'business_type' => 'mechanic',
                        'profile_completed' => false,
                        'verification_status' => 'pending',
                    ]);
                }

                DB::commit();

                // Fire the Registered event to send verification email
                event(new Registered($user));

                // Create token for the user
                $token = $user->createToken('auth_token')->plainTextToken;

                return $this->createdResponse([
                    'user' => new UserResource($user->load('expertProfile')),
                    'token' => $token,
                    'token_type' => 'Bearer',
                ], 'Registration successful! Please verify your email.');
            } catch (\Exception $e) {
                DB::rollBack();
                throw $e;
            }
        } catch (ValidationException $e) {
            return $this->validationErrorResponse($e->errors());
        } catch (\Exception $e) {
            return $this->errorResponse('An error occurred during registration. Please try again.', 500);
        }
    }

    /**
     * Login user and return token.
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function login(Request $request)
    {
        try {
            $validated = $request->validate([
                'email' => 'required|email',
                'password' => 'required',
            ]);

            if (!Auth::attempt($validated)) {
                return $this->unauthorizedResponse('Invalid credentials');
            }

            $user = Auth::user();
            $user->updateLastLogin();

            // Create token
            $token = $user->createToken('auth_token')->plainTextToken;

            return $this->successResponse([
                'user' => new UserResource($user->load('expertProfile')),
                'token' => $token,
                'token_type' => 'Bearer',
            ], 'Login successful');
        } catch (ValidationException $e) {
            return $this->validationErrorResponse($e->errors());
        } catch (\Exception $e) {
            return $this->errorResponse('An error occurred during login. Please try again.', 500);
        }
    }

    /**
     * Logout user (revoke token).
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function logout(Request $request)
    {
        try {
            $request->user()->currentAccessToken()->delete();

            return $this->successResponse(null, 'Logged out successfully');
        } catch (\Exception $e) {
            return $this->errorResponse('An error occurred during logout. Please try again.', 500);
        }
    }

    /**
     * Get authenticated user.
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function user(Request $request)
    {
        try {
            $user = $request->user()->load('expertProfile');

            return $this->successResponse(
                new UserResource($user),
                'User retrieved successfully'
            );
        } catch (\Exception $e) {
            return $this->errorResponse('An error occurred. Please try again.', 500);
        }
    }

    /**
     * Refresh authentication token.
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function refreshToken(Request $request)
    {
        try {
            $user = $request->user();

            // Delete current token
            $request->user()->currentAccessToken()->delete();

            // Create new token
            $token = $user->createToken('auth_token')->plainTextToken;

            return $this->successResponse([
                'token' => $token,
                'token_type' => 'Bearer',
            ], 'Token refreshed successfully');
        } catch (\Exception $e) {
            return $this->errorResponse('An error occurred. Please try again.', 500);
        }
    }
}
