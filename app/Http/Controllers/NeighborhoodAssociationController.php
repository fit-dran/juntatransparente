<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\NeighborhoodAssociation;
use App\Models\Neighbor;
use App\Http\Requests\NeighborhoodAssociationRequest;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Illuminate\Support\Facades\DB;
use App\Models\Committee;
use Carbon\Carbon;
use Maatwebsite\Excel\Facades\Excel;
use App\Exports\NeighborhoodAssociationsExport;

class NeighborhoodAssociationController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $user = Auth::user();
        $query = NeighborhoodAssociation::query();

        // Aplicar filtro de nombre si se proporciona
        if ($request->has('name')) {
            $query->where('name', 'like', '%' . $request->input('name') . '%');
        }

        // Verificar rol y ajustar query
        if ($user->role === 'board_member' || $user->role === 'resident') {
            $query->where('id', $user->neighborhood_association_id);
        }

        // Paginación con 10 registros por página
        $associations = $query->paginate(10)->withQueryString();

        return Inertia::render('NeighborhoodAssociations/Index', [
            'associations' => $associations,
            'filters' => $request->only('name'),
            'userRole' => $user->role,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('NeighborhoodAssociations/Create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(NeighborhoodAssociationRequest $request)
    {
        // Validar los datos
        $validated = $request->validated();

        // Agregar automáticamente los campos de auditoría
        $validated['created_by'] = Auth::id();
        $validated['updated_by'] = Auth::id();

        // Inicializar el número de miembros en 0
        $validated['number_of_members'] = 0;

        // Inicializar el estado en activo
        $validated['is_active'] = true;

        // Crear la junta de vecinos
        $association = NeighborhoodAssociation::create($validated);

        return redirect()->route('neighborhood-associations.index')
            ->with('success', 'Asociación creada exitosamente.');
    }






    /**
     * Display the specified resource.
     */
    public function show($id)
    {
        $association = NeighborhoodAssociation::findOrFail($id);

        // Formatear la fecha en español
        Carbon::setLocale('es');
        $association->date_of_funding = Carbon::parse($association->date_of_funding)->translatedFormat('d \d\e F \d\e Y');

        return Inertia::render('NeighborhoodAssociations/Show', [
            'association' => $association,
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        $association = NeighborhoodAssociation::findOrFail($id);

        return Inertia::render('NeighborhoodAssociations/Edit', [
            'association' => $association,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $association = NeighborhoodAssociation::findOrFail($id);

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'address' => 'required|string|max:255',
            'phone' => 'nullable|string|max:15',
            'email' => 'nullable|email|max:255',
            'website_url' => 'nullable|url|max:255',
            'number_of_members' => 'nullable|integer',
            'date_of_funding' => 'nullable|date',
            'is_active' => 'boolean',
        ]);

        $validated['updated_by'] = Auth::id();

        $association->update($validated);

        return redirect()->route('neighborhood-associations.index')->with('success', 'Asociación actualizada exitosamente.');
    }

    /**
     * Remove the specified resource from storage.
     */
    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $association = NeighborhoodAssociation::findOrFail($id);

        // Verificar si la asociación tiene vecinos asociados
        if ($association->neighbors()->count() > 0) {
            return redirect()->route('neighborhood-associations.index')
                ->with('error', 'No se puede eliminar la asociación porque tiene vecinos asociados.');
        }

        // Actualizar las reuniones relacionadas para que tengan neighborhood_association_id en null
        $association->meetings()->update(['neighborhood_association_id' => null]);

        // Cambiar estado de la junta de vecinos a false en vez de eliminar
        $association->is_active = false;
        $association->save();

        return redirect()->route('neighborhood-associations.index')
            ->with('success', 'Asociación eliminada exitosamente.');
    }



    public function export(Request $request)
    {
        $latest = $request->query('latest', null); // Obtener el filtro `latest` si está presente

        return Excel::download(
            new NeighborhoodAssociationsExport(['latest' => $latest]),
            'neighborhood_associations.xlsx'
        );
    }

}
