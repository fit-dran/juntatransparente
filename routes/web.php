<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\ProjectController;
use App\Http\Controllers\ReunionController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\AdminDashboardController;
use App\Http\Controllers\BoardMemberController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

// Rutas públicas
Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
})->name('welcome');

Route::get('/finanzas', function () {
    return Inertia::render('Finances/ReadFinances');
})->name('finanzas');

// Rutas autenticadas
Route::middleware('auth')->group(function () {

    // Dashboard general
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');

    // Rutas de proyectos
    Route::prefix('projects')->name('project.')->group(function () {
        Route::get('/', [ProjectController::class, 'index'])->name('index');
        Route::get('/create', [ProjectController::class, 'create'])->name('create');
        Route::post('/', [ProjectController::class, 'store'])->name('store');
        Route::get('/{id}/edit', [ProjectController::class, 'edit'])->name('edit');
        Route::put('/{id}', [ProjectController::class, 'update'])->name('update');
        Route::delete('/{id}', [ProjectController::class, 'destroy'])->name('destroy');
    });

    // Rutas de reuniones
    Route::prefix('meetings')->name('meeting.')->group(function () {
        Route::get('/', [ReunionController::class, 'index'])->name('index');
        Route::get('/create', function () {
            return Inertia::render('Meeting/CreateMeeting');
        })->name('create');
        Route::post('/', [ReunionController::class, 'store'])->name('store');
        Route::get('/{id}/edit', [ReunionController::class, 'edit'])->name('edit');
        Route::put('/{id}', [ReunionController::class, 'update'])->name('update');
        Route::delete('/{id}', [ReunionController::class, 'destroy'])->name('destroy');
    });

    // Ruta para la página de vecinos
    Route::get('/vecinos', function () {
        return Inertia::render('Vecinos');
    })->name('vecinos');

    // Rutas de perfil
    Route::prefix('profile')->name('profile.')->group(function () {
        Route::get('/', [ProfileController::class, 'edit'])->name('edit');
        Route::patch('/', [ProfileController::class, 'update'])->name('update');
        Route::delete('/', [ProfileController::class, 'destroy'])->name('destroy');
    });
});


// Autenticación
require __DIR__ . '/auth.php';

// Rutas específicas para roles
Route::middleware(['auth', 'role:admin'])->group(function () {
    Route::get('admin/dashboard', [AdminDashboardController::class, 'index'])->name('admin.dashboard');
    Route::get('admin/juntas/create', [AdminDashboardController::class, 'createJuntaDeVecino'])->name('juntas.create');
    Route::post('admin/juntas/store', [AdminDashboardController::class, 'storeJuntaDeVecino'])->name('juntas.store');
});

Route::middleware(['auth', 'role:board_member'])->group(function () {
    Route::get('board-member/dashboard', [BoardMemberController::class, 'index'])->name('board_member.dashboard');
});