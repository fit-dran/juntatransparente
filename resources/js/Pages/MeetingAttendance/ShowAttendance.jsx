import React, { useState, useEffect } from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { useForm, Head, usePage } from "@inertiajs/react";

export default function ShowAttendance({ meetingId }) {
    const { neighbors } = usePage().props;

    const { data, setData, post, processing } = useForm({
        attendance: {}, // Estado inicial del formulario
        absenceReasons: {}, // Agregar razones de ausencia
    });

    useEffect(() => {
        // Inicializar las asistencias con valores predeterminados
        const initialAttendance = {};
        const initialAbsenceReasons = {};
        neighbors.forEach((neighbor) => {
            initialAttendance[neighbor.id] = false; // Default: No asistió
            initialAbsenceReasons[neighbor.id] = ""; // Default: Sin razón
        });
        setData((prevData) => ({
            ...prevData,
            attendance: initialAttendance,
            absenceReasons: initialAbsenceReasons,
        }));
    }, [neighbors]);

    const handleCheckboxChange = (neighborId) => {
        const updatedAttendance = {
            ...data.attendance,
            [neighborId]: !data.attendance[neighborId],
        };
        setData((prevData) => ({
            ...prevData,
            attendance: updatedAttendance,
        }));
        // Limpiar el motivo de ausencia si se marca como presente
        if (updatedAttendance[neighborId]) {
            setData((prevData) => ({
                ...prevData,
                absenceReasons: {
                    ...prevData.absenceReasons,
                    [neighborId]: "",
                },
            }));
        }
    };

    const handleAbsenceReasonChange = (neighborId, reason) => {
        setData((prevData) => ({
            ...prevData,
            absenceReasons: {
                ...prevData.absenceReasons,
                [neighborId]: reason,
            },
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        console.log("Enviando datos de asistencia:", data);

        // Asegurarse de que los datos sean correctos antes de enviarlos
        const formattedData = {
            attendance: Object.keys(data.attendance).reduce((acc, key) => {
                acc[key] = data.attendance[key] ? true : false;
                return acc;
            }, {}),
            absenceReasons: data.absenceReasons,
        };

        post(`/meetings/${meetingId}/attendance`, {
            data: formattedData,
            onSuccess: () => alert("Asistencias guardadas correctamente."),
            onError: (errors) => {
                console.error("Errores al guardar:", errors);
                alert("Hubo un error al intentar guardar las asistencias.");
            },
        });
    };

    return (
        <AuthenticatedLayout
            header={
                <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                    Registro de Asistencias
                </h2>
            }
        >
            <Head title="Registro de Asistencias" />

            <div className="py-12">
                <div className="max-w-4xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white shadow sm:rounded-lg p-6 space-y-4">
                        <h3 className="text-lg font-semibold">Reunión ID: {meetingId}</h3>
                        <form onSubmit={handleSubmit}>
                            <table className="min-w-full table-auto border-collapse border border-gray-200">
                                <thead>
                                    <tr>
                                        <th className="border border-gray-300 px-4 py-2">Vecino</th>
                                        <th className="border border-gray-300 px-4 py-2">Asistencia</th>
                                        <th className="border border-gray-300 px-4 py-2">Razón de Ausencia</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {neighbors.map((neighbor) => (
                                        <tr key={neighbor.id}>
                                            <td className="border border-gray-300 px-4 py-2">
                                                {neighbor.user?.name || "Sin Nombre"}
                                            </td>
                                            <td className="border border-gray-300 px-4 py-2 text-center">
                                                <input
                                                    type="checkbox"
                                                    checked={data.attendance[neighbor.id] || false}
                                                    onChange={() => handleCheckboxChange(neighbor.id)}
                                                />
                                            </td>
                                            <td className="border border-gray-300 px-4 py-2">
                                                {!data.attendance[neighbor.id] && (
                                                    <input
                                                        type="text"
                                                        value={data.absenceReasons[neighbor.id] || ""}
                                                        onChange={(e) =>
                                                            handleAbsenceReasonChange(
                                                                neighbor.id,
                                                                e.target.value
                                                            )
                                                        }
                                                        placeholder="Motivo de ausencia"
                                                        className="w-full border border-gray-300 rounded p-2"
                                                    />
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            <div className="mt-4">
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                                    disabled={processing}
                                >
                                    {processing ? "Guardando..." : "Guardar Asistencias"}
                                </button>
                            </div>
                            <div className="mt-4 space-x-2">
                                <a
                                    href={`/meetings/${meetingId}`}
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
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}