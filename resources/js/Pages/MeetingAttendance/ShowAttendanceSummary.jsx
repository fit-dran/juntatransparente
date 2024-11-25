import React from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, usePage } from "@inertiajs/react";

export default function ShowAttendanceSummary({ meetingId }) {
    const { attendances } = usePage().props;

    return (
        <AuthenticatedLayout
            header={
                <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                    Resumen de Asistencias
                </h2>
            }
        >
            <Head title="Resumen de Asistencias" />

            <div className="py-12">
                <div className="max-w-4xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white shadow sm:rounded-lg p-6 space-y-4">
                        <h3 className="text-lg font-semibold">Reunión ID: {meetingId}</h3>
                        <table className="min-w-full table-auto border-collapse border border-gray-200">
                            <thead>
                                <tr>
                                    <th className="border border-gray-300 px-4 py-2">Vecino</th>
                                    <th className="border border-gray-300 px-4 py-2">Asistencia</th>
                                    <th className="border border-gray-300 px-4 py-2">Motivo de Ausencia</th>
                                </tr>
                            </thead>
                            <tbody>
                                {attendances.map((attendance) => (
                                    <tr key={attendance.id}>
                                        <td className="border border-gray-300 px-4 py-2">
                                            {attendance.neighbor.user?.name || "Sin Nombre"}
                                        </td>
                                        <td className="border border-gray-300 px-4 py-2 text-center">
                                            {attendance.attended ? "Asistió" : "No Asistió"}
                                        </td>
                                        <td className="border border-gray-300 px-4 py-2">
                                            {!attendance.attended ? attendance.absence_reason || "Sin Motivo" : "-"}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        <div className="mt-4 space-x-2">
                            <a
                                href={route('meetings.show', meetingId)}
                                className="inline-block px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                            >
                                Volver a Detalles de la Reunión
                            </a>
                            <a
                                href={`/meetings/${meetingId}/attendance-summary`}
                                className="inline-block px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                            >
                                Ver Resumen de Asistencias
                            </a>
                            <a
                                href={`/meetings/${meetingId}/attendance`}
                                className="inline-block px-4 py-2 bg-yellow-600 text-white rounded hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2"
                            >
                                Volver al Registro de Asistencias
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}