<?php

namespace App\Http\Controllers;

use App\Models\Meeting;
use Carbon\Carbon;
use Illuminate\Http\Request;
use App\Http\Requests\MeetingRequest;
use App\Models\MeetingAttendance;
use Illuminate\Support\Facades\Validator;
use Inertia\Inertia;
use App\Models\NeighborhoodAssociation;
use App\Models\Neighbor;

class MeetingController extends Controller
{
    public function index(Request $request) 
{
    $user = $request->user();
    $filters = $request->only('main_topic', 'status', 'neighborhood_association_id');

    $meetingsQuery = Meeting::query()
        ->when($filters['main_topic'] ?? null, function ($query, $main_topic) {
            $query->where('main_topic', 'like', "%$main_topic%");
        })
        ->when($filters['status'] ?? null, function ($query, $status) {
            $query->where('status', $status);
        });

    if ($user->role === 'board_member') {
        // Acceder al vecino asociado al usuario
        $neighbor = $user->neighbor()->with('neighborhoodAssociation')->first();

        if ($neighbor && $neighbor->neighborhoodAssociation) {
            $associationId = $neighbor->neighborhoodAssociation->id;

            // Filtrar reuniones de la junta del vecino y reuniones generales
            $meetingsQuery->where(function ($query) use ($associationId) {
                $query->where('neighborhood_association_id', $associationId)
                    ->orWhereNull('neighborhood_association_id');
            });
        } else {
            // Si no tiene una junta asignada, mostrar solo reuniones generales
            $meetingsQuery->whereNull('neighborhood_association_id');
        }

        $allAssociations = collect(); // No mostrar el dropdown para board_members
    } else {
        // Filtrar por neighborhood_association_id si está presente
        if ($filters['neighborhood_association_id'] ?? null) {
            $meetingsQuery->where('neighborhood_association_id', $filters['neighborhood_association_id']);
        }
        $allAssociations = NeighborhoodAssociation::select('id', 'name')->get();
    }

    $meetings = $meetingsQuery->paginate(10);

    // Obtener el neighbor_id asociado al usuario
    $neighbor = $user->neighbor()->first();
    if ($neighbor) {
        // Calcular asistencias del usuario conectado
        $validAttendances = MeetingAttendance::where('neighbor_id', $neighbor->id)->get();
        $totalMeetings = $validAttendances->count();
        $attendedMeetings = $validAttendances->where('attended', 1)->count();

        $attendancePercentage = $totalMeetings > 0 ? round(($attendedMeetings / $totalMeetings) * 100, 2) : 0;

        $attendanceData = [
            'total' => $totalMeetings,
            'attended' => $attendedMeetings,
            'percentage' => $attendancePercentage,
        ];
    } else {
        $attendanceData = [
            'total' => 0,
            'attended' => 0,
            'percentage' => 0,
        ];
    }

    return inertia('Meetings/Index', [
        'meetings' => $meetings,
        'filters' => $filters,
        'allAssociations' => $allAssociations,
        'userRole' => $user->role,
        'userAttendance' => $attendanceData,
    ]);
}





    /**
     * Show the form for creating a new resource.
     */
    public function create(Request $request)
    {
        $user = $request->user();

        // Obtener el vecino asociado al usuario (si aplica)
        $neighbor = Neighbor::where('user_id', $user->id)->first();

        if ($user->role === 'board_member') {
            // Solo cargar la asociación asignada al vecino
            if (!$neighbor || !$neighbor->neighborhood_association_id) {
                abort(403, 'No tienes una asociación asignada.');
            }

            $association = NeighborhoodAssociation::find($neighbor->neighborhood_association_id, ['id', 'name']);
            if (!$association) {
                abort(403, 'No tienes una asociación válida.');
            }

            $associations = collect([$association]); // Convertir a colección

        } elseif ($user->role === 'admin') {
            // Los administradores pueden ver todas las asociaciones
            $associations = NeighborhoodAssociation::all(['id', 'name']);
        } else {
            abort(403, 'No tienes permiso para crear reuniones.');
        }

        return Inertia::render('Meetings/Create', [
            'userRole' => $user->role, // Pasar el rol del usuario
            'associations' => $associations,
        ]);
    }




    public function store(Request $request)
    {
        $user = $request->user();

        // Obtener el vecino asociado al usuario
        $neighbor = Neighbor::where('user_id', $user->id)->first();

        if (!$neighbor) {
            abort(403, 'No estás asociado a ninguna junta de vecinos.');
        }

        $rules = [
            'meeting_date' => 'required|date|after:now',
            'main_topic' => 'required|string|max:255',
            'description' => 'nullable|string|max:1000',
            'location' => 'required|string|max:255',
            'result' => 'nullable|string|max:1000',
            'status' => 'required|in:scheduled,completed,canceled',
            'neighborhood_association_id' => 'required|exists:neighborhood_associations,id',
        ];

        // Ajustar validación para los board_members
        if ($user->role === 'board_member') {
            $rules['neighborhood_association_id'] .= '|in:' . $neighbor->neighborhood_association_id;
        }

        $validator = Validator::make($request->all(), $rules);

        if ($validator->fails()) {
            return redirect()->back()->withErrors($validator)->withInput();
        }

        // Crear reunión
        $meeting = new Meeting();
        $meeting->meeting_date = Carbon::parse($request->input('meeting_date'))->toDateTimeString();
        $meeting->main_topic = $request->input('main_topic');
        $meeting->description = $request->input('description');
        $meeting->location = $request->input('location');
        $meeting->result = $request->input('result');
        $meeting->status = $request->input('status');
        $meeting->neighborhood_association_id = $request->input('neighborhood_association_id');
        $meeting->save();

        return redirect()->route('meetings.index')->with('success', 'Reunión creada exitosamente.');
    }

    /**
     * Display the specified resource.
     */
    public function show(Meeting $meeting)
    {
        $meeting->load('neighborhoodAssociation'); // Cargar la relación con la junta vecinal

        return Inertia::render('Meetings/ShowMeeting', [
            'meeting' => [
                'id' => $meeting->id,
                'main_topic' => $meeting->main_topic,
                'meeting_date' => $meeting->meeting_date,
                'location' => $meeting->location,
                'description' => $meeting->description,
                'status' => $meeting->status,
                'result' => $meeting->result,
                'neighborhood_association' => $meeting->neighborhoodAssociation ? $meeting->neighborhoodAssociation->name : null,
            ],
            'userRole' => auth()->user()->role, // Pasar directamente el rol del usuario
        ]);
    }


    /**
     * Show the form for editing the specified resource.
     */
    public function edit($id)
    {
        $meeting = Meeting::findOrFail($id);
        $associations = NeighborhoodAssociation::all(['id', 'name']);
        $userRole = auth()->user()->role;

        return Inertia::render('Meetings/Edit', [
            'meeting' => $meeting,
            'associations' => $associations,
            'userRole' => $userRole, // Enviar el rol del usuario
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $id)
    {
        $meeting = Meeting::findOrFail($id);
        $user = auth()->user();
    
        // Definir reglas de validación
        $rules = [
            'meeting_date' => 'required|date|after:now',
            'main_topic' => 'required|string|max:255',
            'description' => 'nullable|string|max:1000',
            'location' => 'required|string|max:255',
            'result' => 'nullable|string|max:1000',
            'status' => 'required|in:scheduled,completed,canceled',
            'neighborhood_association_id' => 'required|exists:neighborhood_associations,id',
        ];
    
        // Si el usuario es un `board_member`, limitar la edición de la asociación
        if ($user->role === 'board_member') {
            $rules['neighborhood_association_id'] .= '|in:' . $meeting->neighborhood_association_id;
        }
    
        // Mensajes personalizados
        $messages = [
            'meeting_date.required' => 'La fecha de la reunión es obligatoria.',
            'meeting_date.date' => 'La fecha de la reunión debe ser una fecha válida.',
            'meeting_date.after' => 'La fecha de la reunión debe ser posterior a la fecha actual.',
            'main_topic.required' => 'El tema principal es obligatorio.',
            'main_topic.max' => 'El tema principal no debe exceder los 255 caracteres.',
            'description.max' => 'La descripción no debe exceder los 1000 caracteres.',
            'location.required' => 'La ubicación es obligatoria.',
            'location.max' => 'La ubicación no debe exceder los 255 caracteres.',
            'status.required' => 'El estado es obligatorio.',
            'status.in' => 'El estado debe ser "scheduled", "completed" o "canceled".',
            'neighborhood_association_id.required' => 'La asociación vecinal es obligatoria.',
            'neighborhood_association_id.exists' => 'La asociación vecinal seleccionada no existe.',
            'neighborhood_association_id.in' => 'No tienes permiso para cambiar la asociación vecinal.',
        ];
    
        // Validar los datos
        $validator = Validator::make($request->all(), $rules, $messages);
    
        if ($validator->fails()) {
            return redirect()
                ->back()
                ->withErrors($validator)
                ->withInput();
                // ->with('error', value: 'Hubo errores en los datos proporcionados. Por favor, corrígelos e inténtalo nuevamente.');
        }
    
        // Asegurar que solo el `admin` pueda cambiar la asociación
        if ($user->role === 'admin') {
            $meeting->neighborhood_association_id = $request->input('neighborhood_association_id');
        }
    
        // Actualizar el resto de los campos
        $meeting->update($request->except('neighborhood_association_id'));
    
        // Guardar los cambios
        $meeting->save();
    
        return redirect()
            ->route('meetings.index')
            ->with('success', 'Reunión actualizada exitosamente.');
    }
    








    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        $meeting = Meeting::findOrFail($id);

        // Eliminar las asistencias relacionadas
        $meeting->attendances()->delete();

        // Eliminar la reunión
        $meeting->delete();

        return back()->with('success', 'La reunión fue eliminada correctamente.');
    }

}
