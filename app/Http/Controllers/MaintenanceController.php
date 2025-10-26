<?php

namespace App\Http\Controllers;

use App\Models\MaintenanceGuide;
use App\Models\MaintenanceSchedule;
use App\Models\FluidGuide;
use App\Models\WarningLight;
use App\Models\SeasonalChecklist;
use Illuminate\Http\Request;
use Inertia\Inertia;

class MaintenanceController extends Controller
{
    /**
     * Display the maintenance resources hub
     */
    public function index()
    {
        return Inertia::render('Resources/Maintenance/Index', [
            'stats' => [
                'total_guides' => MaintenanceGuide::published()->count(),
                'total_schedules' => MaintenanceSchedule::published()->count(),
                'total_fluids' => FluidGuide::published()->count(),
                'total_warning_lights' => WarningLight::published()->count(),
                'total_seasonal_checklists' => SeasonalChecklist::published()->count(),
            ],
            'popularGuides' => MaintenanceGuide::published()
                ->popular()
                ->orderBy('view_count', 'desc')
                ->take(4)
                ->get(),
            'criticalFluids' => FluidGuide::published()
                ->critical()
                ->orderBy('is_critical', 'desc')
                ->take(4)
                ->get(),
            'commonWarningLights' => WarningLight::published()
                ->common()
                ->orderBy('view_count', 'desc')
                ->take(6)
                ->get(),
        ]);
    }
}
