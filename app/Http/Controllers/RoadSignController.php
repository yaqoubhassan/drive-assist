<?php

namespace App\Http\Controllers;

use App\Models\RoadSign;
use App\Models\RoadSignQuizQuestion;
use App\Models\UserQuizAttempt;
use Illuminate\Http\Request;
use Inertia\Inertia;

class RoadSignController extends Controller
{
    public function index(Request $request)
    {
        $category = $request->input('category');
        $search = $request->input('search');

        $query = RoadSign::query();

        if ($category && $category !== 'all') {
            $query->byCategory($category);
        }

        if ($search) {
            $query->search($search);
        }

        $signs = $query->orderBy('is_popular', 'desc')
            ->orderBy('name')
            ->paginate(12)
            ->withQueryString();

        $categories = [
            'all' => 'All Signs',
            'warning' => 'Warning',
            'regulatory' => 'Regulatory',
            'information' => 'Information',
            'guide' => 'Guide',
        ];

        $popularSigns = RoadSign::popular()
            ->limit(6)
            ->get(['id', 'name', 'slug', 'image_url', 'category']);

        return Inertia::render('Resources/RoadSigns/Index', [
            'signs' => $signs,
            'categories' => $categories,
            'currentCategory' => $category ?? 'all',
            'searchQuery' => $search ?? '',
            'popularSigns' => $popularSigns,
        ]);
    }

    public function show($slug)
    {
        $sign = RoadSign::where('slug', $slug)->firstOrFail();

        // Increment view count
        $sign->incrementViewCount();

        // Get related signs (same category)
        $relatedSigns = RoadSign::where('category', $sign->category)
            ->where('id', '!=', $sign->id)
            ->limit(4)
            ->get(['id', 'name', 'slug', 'image_url', 'description']);

        return Inertia::render('Resources/RoadSigns/Show', [
            'sign' => $sign,
            'relatedSigns' => $relatedSigns,
        ]);
    }

    public function quizIndex()
    {
        $totalSigns = RoadSign::count();
        $totalQuestions = RoadSignQuizQuestion::count();

        $categories = RoadSign::select('category')
            ->selectRaw('COUNT(*) as count')
            ->groupBy('category')
            ->get();

        // Get user's recent attempts
        $recentAttempts = null;
        if (auth()->check()) {
            $recentAttempts = UserQuizAttempt::where('user_id', auth()->id())
                ->latest()
                ->limit(5)
                ->get();
        }

        return Inertia::render('Resources/RoadSigns/QuizIndex', [
            'totalSigns' => $totalSigns,
            'totalQuestions' => $totalQuestions,
            'categories' => $categories,
            'recentAttempts' => $recentAttempts,
        ]);
    }

    public function startQuiz(Request $request)
    {
        $request->validate([
            'category' => 'nullable|in:warning,regulatory,information,guide',
            'difficulty' => 'nullable|in:easy,medium,hard',
            'questionCount' => 'required|integer|min:5|max:50',
        ]);

        $query = RoadSignQuizQuestion::query();

        if ($request->category) {
            $query->whereHas('roadSign', function ($q) use ($request) {
                $q->where('category', $request->category);
            });
        }

        if ($request->difficulty) {
            $query->where('difficulty', $request->difficulty);
        }

        $questions = $query->with('roadSign:id,name,image_url')
            ->inRandomOrder()
            ->limit($request->questionCount)
            ->get()
            ->map(function ($question) {
                return [
                    'id' => $question->id,
                    'question' => $question->question,
                    'options' => $question->options,
                    'roadSign' => $question->roadSign,
                    'difficulty' => $question->difficulty,
                ];
            });

        if ($questions->isEmpty()) {
            return back()->with('error', 'No questions available for the selected criteria.');
        }

        return Inertia::render('Resources/RoadSigns/Quiz', [
            'questions' => $questions,
            'category' => $request->category,
            'difficulty' => $request->difficulty,
        ]);
    }

    public function submitQuiz(Request $request)
    {
        $request->validate([
            'answers' => 'required|array',
            'timeTaken' => 'required|integer',
        ]);

        $questionIds = array_keys($request->answers);
        $questions = RoadSignQuizQuestion::whereIn('id', $questionIds)->get()->keyBy('id');

        $correctAnswers = 0;
        $detailedAnswers = [];

        foreach ($request->answers as $questionId => $userAnswer) {
            $question = $questions->get($questionId);
            $isCorrect = $question->isCorrect($userAnswer);

            if ($isCorrect) {
                $correctAnswers++;
            }

            $detailedAnswers[] = [
                'question_id' => $questionId,
                'user_answer' => $userAnswer,
                'correct_answer' => $question->correct_option_index,
                'is_correct' => $isCorrect,
                'explanation' => $question->explanation,
            ];
        }

        $totalQuestions = count($request->answers);
        $scorePercentage = round(($correctAnswers / $totalQuestions) * 100);

        $attempt = UserQuizAttempt::create([
            'user_id' => auth()->id(),
            'session_id' => auth()->guest() ? session()->getId() : null,
            'total_questions' => $totalQuestions,
            'correct_answers' => $correctAnswers,
            'score_percentage' => $scorePercentage,
            'time_taken_seconds' => $request->timeTaken,
            'answers' => $detailedAnswers,
        ]);

        return Inertia::render('Resources/RoadSigns/QuizResults', [
            'attempt' => $attempt->load('user'),
            'detailedAnswers' => $detailedAnswers,
            'questions' => $questions->values(),
        ]);
    }
}
