<?php

namespace App\Http\Controllers;

use App\Models\MeetingAttendance;
use App\Models\Neighbor;
use App\Models\User;
use Illuminate\Support\Facades\Log;
use Illuminate\Http\Request;
use App\Models\Meeting;

class MeetingAttendanceController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        //
    }

    public function storeAttendance(Request $request, $meetingId)
    {
        // Verificar si la reunión está cancelada
        $meeting = Meeting::findOrFail($meetingId);
        if ($meeting->status === 'canceled') {
            return redirect()->back()->with('error', 'No puedes registrar asistencia para una reunión cancelada.');
        }
    
        // Validar los datos de asistencia
        $validated = $request->validate([
            'attendance' => 'required|array',
            'attendance.*' => 'boolean',
            'absenceReasons' => 'required|array',
            'absenceReasons.*' => 'nullable|string',
        ]);
    
        // Obtener IDs de vecinos activos
        $activeNeighborIds = Neighbor::where('status', 'active')->pluck('id')->toArray();
    
        // Obtener vecinos ya marcados como presentes
        $alreadyPresent = MeetingAttendance::where('meeting_id', $meetingId)
            ->where('attended', true)
            ->pluck('neighbor_id')
            ->toArray();
    
        // Guardar nuevos registros de asistencia, evitando modificaciones en vecinos ya presentes
        foreach ($validated['attendance'] as $neighborId => $attended) {
            if (in_array($neighborId, $activeNeighborIds)) {
                // Bloquear modificaciones si ya están marcados como presentes
                if (in_array($neighborId, $alreadyPresent)) {
                    continue;
                }
    
                MeetingAttendance::updateOrCreate(
                    ['meeting_id' => $meetingId, 'neighbor_id' => $neighborId],
                    [
                        'attended' => $attended ? 1 : 0,
                        'absence_reason' => $attended ? null : ($validated['absenceReasons'][$neighborId] ?? null),
                    ]
                );
            }
        }
    
        // Marcar la reunión como completada
        $meeting->update(['status' => 'completed']);
    
        // Redirigir al show de la reunión con un mensaje de éxito
        return redirect()->route('meetings.show', $meetingId)
            ->with('message', 'Asistencias registradas correctamente y reunión marcada como completada.');
    }
    





    public function showAttendance($meetingId)
    {
        // Verificar si el usuario tiene el rol permitido
        if (!in_array(auth()->user()->role, ['admin', 'board_member'])) {
            abort(403, 'No tienes permiso para acceder a esta página.');
        }

        $meeting = Meeting::findOrFail($meetingId);

        // Obtener vecinos activos de la misma junta de vecinos de la reunión
        $neighbors = Neighbor::where('neighborhood_association_id', $meeting->neighborhood_association_id)
            ->active() // Filtro de vecinos activos
            ->with('user:id,name') // Cargar usuario relacionado
            ->get();

        // Obtener registros de asistencia de la reunión
        $attendanceRecords = MeetingAttendance::where('meeting_id', $meetingId)->get(['neighbor_id', 'attended', 'absence_reason']);

        return inertia('MeetingAttendance/ShowAttendance', [
            'meetingId' => $meetingId,
            'neighbors' => $neighbors,
            'mainTopic' => $meeting->main_topic,
            'meetingStatus' => $meeting->status, // Incluir el estado de la reunión
            'attendanceRecords' => $attendanceRecords, // Incluir registros de asistencia
        ]);
    }




    public function showSummary($meetingId)
    {
        $meeting = Meeting::findOrFail($meetingId);

        // Filtrar asistencias por vecinos de la misma junta de vecinos
        $attendances = MeetingAttendance::where('meeting_id', $meetingId)
            ->whereHas('neighbor', function ($query) use ($meeting) {
                $query->where('neighborhood_association_id', $meeting->neighborhood_association_id);
            })
            ->with('neighbor.user') // Cargar datos del vecino y usuario relacionado
            ->get();

        return inertia('MeetingAttendance/ShowAttendanceSummary', [
        'meetingId' => $meetingId,
        'mainTopic' => $meeting->main_topic, // Corregido para incluir el tema principal
        'attendances' => $attendances,
    ]);
    }




    /**
     * Show the form for editing the specified resource.
     */
    public function edit(MeetingAttendance $meetingAttendance)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, MeetingAttendance $meetingAttendance)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(MeetingAttendance $meetingAttendance)
    {
        //
    }
    
}
