<?php

namespace Database\Seeders;

use App\Models\Review;
use App\Models\Job;
use Illuminate\Database\Seeder;

class ReviewSeeder extends Seeder
{
    public function run(): void
    {
        $completedJobs = Job::where('job_status', 'completed')->get();

        $reviews = [
            [
                'overall_rating' => 5,
                'quality_rating' => 5,
                'professionalism_rating' => 5,
                'pricing_rating' => 4,
                'communication_rating' => 5,
                'review_text' => 'Excellent service! Fixed my car quickly and explained everything clearly.',
                'is_verified_purchase' => true,
            ],
            [
                'overall_rating' => 4,
                'quality_rating' => 4,
                'professionalism_rating' => 5,
                'pricing_rating' => 3,
                'communication_rating' => 4,
                'review_text' => 'Good work, but a bit pricey. Still would recommend.',
                'is_verified_purchase' => true,
            ],
        ];

        // Create some completed jobs for reviews
        $jobs = Job::limit(2)->get();
        foreach ($jobs as $index => $job) {
            $job->update(['job_status' => 'completed', 'actual_end_time' => now()]);

            if (isset($reviews[$index])) {
                Review::create(array_merge($reviews[$index], [
                    'expert_profile_id' => $job->expert_profile_id,
                    'driver_id' => $job->driver_id,
                    'job_id' => $job->id,
                ]));
            }
        }
    }
}
