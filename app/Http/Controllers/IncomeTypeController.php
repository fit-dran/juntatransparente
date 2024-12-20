<?php

namespace App\Http\Controllers;

use App\Models\IncomeType;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Http\Requests\IncomeTypeRequest;
use App\Models\Neighbor;
use App\Models\NeighborhoodAssociation;


class IncomeTypeController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();
        $isAdmin = $user->role === 'admin';

        if (!$isAdmin) {
            $neighbor = Neighbor::where('user_id', $user->id)->first();

            if (!$neighbor || !$neighbor->neighborhoodAssociation) {
                abort(403, 'No estás asociado a ninguna junta de vecinos.');
            }

            $associationId = $neighbor->neighborhoodAssociation->id;

            $incomeTypes = IncomeType::where('association_id', $associationId)
                ->latest()
                ->paginate(10);
        } else {
            $incomeTypes = IncomeType::latest()->paginate(10);
        }

        return Inertia::render('Finance/IncomeTypes/Index', [
            'incomeTypes' => $incomeTypes,
        ]);
    }


    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('Finance/IncomeTypes/Create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(IncomeTypeRequest $request)
    {
        $user = $request->user();

        // Determinar si el usuario es admin o pertenece a una asociación
        $associationId = null;

        if ($user->role !== 'admin') {
            $neighbor = Neighbor::where('user_id', $user->id)->first();

            if (!$neighbor || !$neighbor->neighborhoodAssociation) {
                abort(403, 'No estás asociado a ninguna junta de vecinos.');
            }

            $associationId = $neighbor->neighborhoodAssociation->id;
        }

        // Validar los datos
        $validated = $request->validated();

        // Asignar el creador y la asociación
        $validated['created_by'] = auth()->id();
        $validated['association_id'] = $associationId;

        // Crear el tipo de ingreso
        IncomeType::create($validated);

        return redirect()->route('income-types.index')->with('message', 'Tipo de ingreso creado exitosamente.');
    }

    /**
     * Display the specified resource.
     */
    public function show(IncomeType $incomeType)
    {
        return Inertia::render('Finance/IncomeTypes/Show', [
            'incomeType' => $incomeType,
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(IncomeType $incomeType)
    {
        return Inertia::render('Finance/IncomeTypes/Edit', [
            'incomeType' => $incomeType,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, IncomeType $incomeType)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:50',
            'description' => 'nullable|string|max:255',
            'code' => 'required|string|max:20|unique:income_types,code,' . $incomeType->id,
            'status' => 'required|in:active,inactive',
        ]);

        $validated['updated_by'] = auth()->id(); // Usuario autenticado

        $incomeType->update($validated);

        return redirect()->route('income-types.index')->with('message', 'Tipo de ingreso actualizado exitosamente.');
    }
    /**
     * Remove the specified resource from storage.
     */
    public function destroy(IncomeType $incomeType)
    {
        $incomeType->delete();

        return redirect()->route('income-types.index')->with('message', 'Tipo de ingreso eliminado exitosamente.');
    }
}
