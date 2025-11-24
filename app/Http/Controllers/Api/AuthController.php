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
     * @OA\Post(
     *     path="/auth/register",
     *     summary="Register a new user",
     *     tags={"Authentication"},
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\JsonContent(
     *             required={"name","email","password","password_confirmation","user_type"},
     *             @OA\Property(property="name", type="string", example="John Doe"),
     *             @OA\Property(property="email", type="string", format="email", example="john@example.com"),
     *             @OA\Property(property="password", type="string", format="password", example="password123"),
     *             @OA\Property(property="password_confirmation", type="string", format="password", example="password123"),
     *             @OA\Property(property="user_type", type="string", enum={"driver", "expert"}, example="driver"),
     *             @OA\Property(property="phone", type="string", example="+1234567890", nullable=true)
     *         )
     *     ),
     *     @OA\Response(
     *         response=201,
     *         description="Registration successful",
     *         @OA\JsonContent(
     *             @OA\Property(property="success", type="boolean", example=true),
     *             @OA\Property(property="message", type="string", example="Registration successful! Please verify your email."),
     *             @OA\Property(
     *                 property="data",
     *                 type="object",
     *                 @OA\Property(property="user", type="object"),
     *                 @OA\Property(property="token", type="string", example="1|abc123..."),
     *                 @OA\Property(property="token_type", type="string", example="Bearer")
     *             )
     *         )
     *     ),
     *     @OA\Response(response=422, description="Validation error"),
     *     @OA\Response(response=500, description="Server error")
     * )
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
     * @OA\Post(
     *     path="/auth/login",
     *     summary="Login user",
     *     tags={"Authentication"},
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\JsonContent(
     *             required={"email","password"},
     *             @OA\Property(property="email", type="string", format="email", example="john@example.com"),
     *             @OA\Property(property="password", type="string", format="password", example="password123")
     *         )
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Login successful",
     *         @OA\JsonContent(
     *             @OA\Property(property="success", type="boolean", example=true),
     *             @OA\Property(property="message", type="string", example="Login successful"),
     *             @OA\Property(
     *                 property="data",
     *                 type="object",
     *                 @OA\Property(property="user", type="object"),
     *                 @OA\Property(property="token", type="string", example="1|abc123..."),
     *                 @OA\Property(property="token_type", type="string", example="Bearer")
     *             )
     *         )
     *     ),
     *     @OA\Response(response=401, description="Invalid credentials"),
     *     @OA\Response(response=422, description="Validation error"),
     *     @OA\Response(response=500, description="Server error")
     * )
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
     * @OA\Post(
     *     path="/auth/logout",
     *     summary="Logout user",
     *     tags={"Authentication"},
     *     security={{"bearerAuth":{}}},
     *     @OA\Response(
     *         response=200,
     *         description="Logout successful",
     *         @OA\JsonContent(
     *             @OA\Property(property="success", type="boolean", example=true),
     *             @OA\Property(property="message", type="string", example="Logged out successfully")
     *         )
     *     ),
     *     @OA\Response(response=401, description="Unauthenticated"),
     *     @OA\Response(response=500, description="Server error")
     * )
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
     * @OA\Get(
     *     path="/auth/user",
     *     summary="Get authenticated user",
     *     tags={"Authentication"},
     *     security={{"bearerAuth":{}}},
     *     @OA\Response(
     *         response=200,
     *         description="User retrieved successfully",
     *         @OA\JsonContent(
     *             @OA\Property(property="success", type="boolean", example=true),
     *             @OA\Property(property="message", type="string", example="User retrieved successfully"),
     *             @OA\Property(property="data", type="object")
     *         )
     *     ),
     *     @OA\Response(response=401, description="Unauthenticated"),
     *     @OA\Response(response=500, description="Server error")
     * )
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
     * @OA\Post(
     *     path="/auth/refresh-token",
     *     summary="Refresh authentication token",
     *     tags={"Authentication"},
     *     security={{"bearerAuth":{}}},
     *     @OA\Response(
     *         response=200,
     *         description="Token refreshed successfully",
     *         @OA\JsonContent(
     *             @OA\Property(property="success", type="boolean", example=true),
     *             @OA\Property(property="message", type="string", example="Token refreshed successfully"),
     *             @OA\Property(
     *                 property="data",
     *                 type="object",
     *                 @OA\Property(property="token", type="string", example="2|xyz789..."),
     *                 @OA\Property(property="token_type", type="string", example="Bearer")
     *             )
     *         )
     *     ),
     *     @OA\Response(response=401, description="Unauthenticated"),
     *     @OA\Response(response=500, description="Server error")
     * )
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
