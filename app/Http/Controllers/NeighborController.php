<?php

namespace App\Http\Controllers;

use App\Models\Neighbor;
use App\Models\NeighborhoodAssociation;
use App\Http\Requests\NeighborRequest;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Http\Request;
use App\Models\User;
use Inertia\Inertia;
use Illuminate\Support\Facades\Validator;


class NeighborController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $query = Neighbor::with(['user', 'neighborhoodAssociation']);

        if ($request->has("name")) {
            $query->whereHas('user', function ($query) use ($request) {
                $query->where('name', 'like', '%' . $request->input('name') . '%');
            });
        }

        $neighbors = $query->paginate(10)->withQueryString();

        // Obtener todas las juntas de vecinos
        $juntasDeVecinos = NeighborhoodAssociation::all();

        // Añadir información sobre si el vecino es miembro de la directiva
        return Inertia::render("Neighbor/Index", [
            'neighbors' => $neighbors->through(function ($neighbor) {
                $isBoardMember = \App\Models\CommitteeMember::where('user_id', $neighbor->user_id)
                    ->where('status', 'active')
                    ->exists();

                return [
                    'id' => $neighbor->id,
                    'address' => $neighbor->address,
                    'identification_number' => $neighbor->identification_number,
                    'registration_date' => $neighbor->registration_date,
                    'birth_date' => $neighbor->birth_date,
                    'status' => $neighbor->status,
                    'last_participation_date' => $neighbor->last_participation_date,
                    'neighborhood_association' => $neighbor->neighborhoodAssociation ? [
                        'id' => $neighbor->neighborhoodAssociation->id,
                        'name' => $neighbor->neighborhoodAssociation->name,
                    ] : null,
                    'user' => $neighbor->user ? [
                        'id' => $neighbor->user->id,
                        'name' => $neighbor->user->name,
                        'email' => $neighbor->user->email,
                    ] : null,
                    'is_board_member' => $isBoardMember,
                ];
            }),
            'filters' => $request->only('name', 'junta_de_vecino_id', 'is_board_member'),
            'juntasDeVecinos' => $juntasDeVecinos,
        ]);
    }





    public function store(NeighborRequest $request)
    {
        $validatedData = $request->validated();

        DB::transaction(function () use ($validatedData) {
            // Crear el usuario
            $user = User::create([
                'name' => $validatedData['name'],
                'email' => $validatedData['email'],
                'password' => Hash::make($validatedData['password']),
                'role' => $validatedData['role'] ?? 'resident',
            ]);

            // Crear el vecino
            $neighbor = Neighbor::create([
                'user_id' => $user->id,
                'address' => $validatedData['address'],
                'identification_number' => $validatedData['identification_number'],
                'registration_date' => $validatedData['registration_date'],
                'birth_date' => $validatedData['birth_date'],
                'status' => $validatedData['status'],
                'neighborhood_association_id' => $validatedData['neighborhood_association_id'],
            ]);

            // Actualizar el número de miembros de la asociación
            $neighbor->neighborhoodAssociation->updateNumberOfMembers();
        });

        return redirect()->route('neighbors.index')->with('success', 'Vecino y usuario creados exitosamente.');
    }









    public function create()
    {
        $associations = NeighborhoodAssociation::all(['id', 'name']);
        $users = User::all(['id', 'name', 'email']); // Obtenemos todos los usuarios con su ID, nombre y correo electrónico

        return Inertia::render('Neighbor/Create', [
            'associations' => $associations,
            'users' => $users, // Enviamos los usuarios para el dropdown
        ]);
    }




    public function show($id)
    {
        $neighbor = Neighbor::with('user', 'neighborhoodAssociation')->findOrFail($id);

        return Inertia::render('Neighbor/Show', [
            'neighbor' => [
                'id' => $neighbor->id,
                'user_name' => $neighbor->user ? $neighbor->user->name : 'N/A',
                'user_email' => $neighbor->user ? $neighbor->user->email : 'N/A',
                'user_role' => $neighbor->user ? $neighbor->user->role : 'N/A',
                'address' => $neighbor->address,
                'identification_number' => $neighbor->identification_number,
                'registration_date' => $neighbor->registration_date,
                'birth_date' => $neighbor->birth_date,
                'status' => $neighbor->status,
                'last_participation_date' => $neighbor->last_participation_date,
                'neighborhood_association_name' => $neighbor->neighborhoodAssociation ? $neighbor->neighborhoodAssociation->name : 'N/A',
            ],
        ]);
    }





    public function edit($id)
    {
        $neighbor = Neighbor::with('user', 'neighborhoodAssociation')->findOrFail($id);

        // Verificar que el usuario autenticado no pueda editar su propio registro
        if (Auth::id() === $neighbor->user_id) {
            return redirect()->route('neighbors.index')->with('error', 'No puedes editar tu propio registro. Inicia Sesión con la cuenta Debug');
        }

        $associations = NeighborhoodAssociation::all(['id', 'name']);
        $users = User::all(['id', 'name', 'email']); // Obtenemos todos los usuarios con su ID, nombre y correo electrónico

        return Inertia::render('Neighbor/Edit', [
            'neighbor' => [
                'id' => $neighbor->id,
                'address' => $neighbor->address,
                'identification_number' => $neighbor->identification_number,
                'registration_date' => $neighbor->registration_date,
                'birth_date' => $neighbor->birth_date,
                'status' => $neighbor->status,
                'last_participation_date' => $neighbor->last_participation_date,
                'neighborhood_association_id' => $neighbor->neighborhood_association_id,
                'user' => $neighbor->user ? [
                    'name' => $neighbor->user->name,
                    'email' => $neighbor->user->email,
                    'id' => $neighbor->user->id,
                    'role' => $neighbor->user->role, // Agregar rol del usuario
                ] : null,
            ],
            'associations' => $associations,
            'users' => $users, // Enviamos los usuarios para el dropdown
        ]);
    }




    public function update(NeighborRequest $request, Neighbor $neighbor)
    {
        $validatedData = $request->validated();

        DB::transaction(function () use ($validatedData, $neighbor) {
            // Actualizar el usuario relacionado
            $neighbor->user->update([
                'name' => $validatedData['name'],
                'email' => $validatedData['email'],
                'role' => $validatedData['role'],
            ]);

            // Verificar si cambió de asociación
            $oldAssociation = $neighbor->neighborhoodAssociation;

            // Actualizar el vecino
            $neighbor->update([
                'address' => $validatedData['address'],
                'identification_number' => $validatedData['identification_number'],
                'registration_date' => $validatedData['registration_date'],
                'birth_date' => $validatedData['birth_date'],
                'status' => $validatedData['status'],
                'neighborhood_association_id' => $validatedData['neighborhood_association_id'],
            ]);

            // Si cambió de asociación, actualizar ambas
            if ($oldAssociation->id !== $neighbor->neighborhood_association_id) {
                $oldAssociation->updateNumberOfMembers();
                $neighbor->neighborhoodAssociation->updateNumberOfMembers();
            }
        });

        return redirect()->route('neighbors.index')->with('success', 'Vecino y usuario actualizados exitosamente.');
    }








    public function destroy(Neighbor $neighbor)
    {
        // Verificar que el usuario autenticado no pueda eliminar su propio registro
        if (Auth::id() === $neighbor->user_id) {
            return redirect()->route('neighbors.index')->with('error', 'No puedes eliminar tu propio registro. Inicia Sesión con la cuenta Debug');
        }

        // Obtener la asociación antes de eliminar el vecino
        $association = $neighbor->neighborhoodAssociation;

        DB::transaction(function () use ($neighbor, $association) {
            // Eliminar el usuario asociado
            if ($neighbor->user) {
                $neighbor->user->delete();
            }

            // Eliminar el vecino
            $neighbor->delete();

            // Actualizar el número de miembros de la asociación
            $association->updateNumberOfMembers();
        });

        return redirect()->route('neighbors.index')->with('success', 'Vecino y usuario asociado eliminados exitosamente.');
    }


    private function isValidRUT($rut)
    {
        // Lógica para validar el formato del RUT chileno
        $rut = preg_replace('/[^k0-9]/i', '', $rut);
        $dv = substr($rut, -1);
        $numero = substr($rut, 0, strlen($rut) - 1);
        $i = 2;
        $suma = 0;
        foreach (array_reverse(str_split($numero)) as $v) {
            if ($i == 8) {
                $i = 2;
            }
            $suma += $v * $i;
            ++$i;
        }
        $dvr = 11 - ($suma % 11);
        if ($dvr == 11) {
            $dvr = 0;
        }
        if ($dvr == 10) {
            $dvr = 'K';
        }
        if ((string) $dvr === strtoupper($dv)) {
            return true;
        } else {
            return false;
        }
    }





}