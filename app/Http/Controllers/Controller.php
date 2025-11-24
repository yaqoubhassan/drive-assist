<?php

namespace App\Http\Controllers;

/**
 * @OA\Info(
 *     version="1.0.0",
 *     title="Drive Assist API",
 *     description="API documentation for Drive Assist - AI-powered car diagnostic and expert matching platform",
 *     @OA\Contact(
 *         email="support@driveassist.com"
 *     ),
 *     @OA\License(
 *         name="Proprietary",
 *         url="https://driveassist.com/license"
 *     )
 * )
 *
 * @OA\Server(
 *     url="/api/v1",
 *     description="API v1"
 * )
 *
 * @OA\SecurityScheme(
 *     securityScheme="bearerAuth",
 *     type="http",
 *     scheme="bearer",
 *     bearerFormat="JWT",
 *     description="Enter your Bearer token in the format: Bearer {token}"
 * )
 *
 * @OA\Tag(
 *     name="Authentication",
 *     description="User authentication and token management"
 * )
 *
 * @OA\Tag(
 *     name="Diagnosis",
 *     description="AI-powered car diagnosis endpoints"
 * )
 *
 * @OA\Tag(
 *     name="Driver",
 *     description="Driver-specific endpoints"
 * )
 *
 * @OA\Tag(
 *     name="Expert",
 *     description="Expert-specific endpoints"
 * )
 *
 * @OA\Tag(
 *     name="Resources",
 *     description="Educational resources (car issues, road signs)"
 * )
 */
abstract class Controller
{
    //
}
