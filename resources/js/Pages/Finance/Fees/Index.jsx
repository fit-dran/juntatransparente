import React, { useState } from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link, useForm } from "@inertiajs/react";

export default function FeesIndex({ fees, flash, auth }) {
    const { delete: destroy, processing } = useForm();
    const [showAlert, setShowAlert] = useState(!!flash?.success);

    const userRole = auth.user.role;

    const handleDelete = (id) => {
        if (confirm("¿Estás seguro de que deseas eliminar esta cuota?")) {
            destroy(route("fees.destroy", id), {
                onSuccess: () => setShowAlert(true),
                onError: (error) => console.error("Error al eliminar:", error),
            });
        }
    };

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-2xl font-bold text-gray-800">Cuotas</h2>
            }
        >
            <Head title="Cuotas" />

            {showAlert && (
                <div
                    className="p-4 mb-4 text-sm text-green-700 bg-green-100 rounded-lg flex justify-between"
                    role="alert"
                >
                    <span>{flash.success}</span>
                    <button
                        type="button"
                        onClick={() => setShowAlert(false)}
                        className="text-green-700 hover:text-green-900"
                    >
                        ✖
                    </button>
                </div>
            )}

            <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
                {userRole !== "resident" && (
                    <Link
                        href={route("fees.create")}
                        className="w-full md:w-auto px-4 py-2 bg-blue-600 text-white font-semibold rounded hover:bg-blue-700 text-center"
                    >
                        Crear Cuota
                    </Link>
                )}
            </div>

            <div className="overflow-x-auto bg-white shadow-md rounded-lg">
                {fees.data.length > 0 ? (
                    <table className="table-auto w-full text-left text-gray-600">
                        <thead className="bg-gray-200 text-gray-700 uppercase text-sm">
                            <tr>
                                <th className="px-6 py-3">Vecino</th>{" "}
                                {/* New column */}
                                <th className="px-6 py-3">Monto</th>
                                <th className="px-6 py-3">
                                    Fecha de Vencimiento
                                </th>
                                <th className="px-6 py-3">Estado</th>
                                <th className="px-6 py-3">Fecha de Pago</th>
                                <th className="px-6 py-3">Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {fees.data.map((fee, index) => (
                                <tr
                                    key={fee.id}
                                    className={`border-t ${
                                        index % 2 === 0 ? "bg-gray-50" : ""
                                    }`}
                                >
                                    <td className="px-6 py-3">
                                        {fee.neighbor.user.name}
                                    </td>{" "}
                                    {/* Display neighbor's name */}
                                    <td className="px-6 py-3">{fee.amount}</td>
                                    <td className="px-6 py-3">
                                        {fee.due_date}
                                    </td>
                                    <td
                                        className={`px-6 py-3 ${
                                            fee.status === "paid"
                                                ? "text-green-500"
                                                : fee.status === "pending"
                                                ? "text-orange-500"
                                                : "text-red-500"
                                        }`}
                                    >
                                        {fee.status === "paid"
                                            ? "Pagado"
                                            : fee.status === "pending"
                                            ? "Pendiente"
                                            : "Atrasado"}
                                    </td>
                                    <td className="px-6 py-3">
                                        {fee.status === "paid"
                                            ? fee.paid_date
                                            : "-"}
                                    </td>
                                    <td className="px-6 py-3 flex flex-col md:flex-row gap-2">
                                        {userRole !== "resident" && (
                                            <>
                                                <Link
                                                    href={route(
                                                        "fees.edit",
                                                        fee.id
                                                    )}
                                                    className="w-full md:w-auto px-3 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-700 text-center"
                                                >
                                                    Editar
                                                </Link>
                                                <button
                                                    onClick={() =>
                                                        handleDelete(fee.id)
                                                    }
                                                    disabled={processing}
                                                    className="w-full md:w-auto px-3 py-1 bg-red-500 text-white rounded hover:bg-red-700 text-center"
                                                >
                                                    Eliminar
                                                </button>
                                            </>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <p className="text-center text-gray-600 py-6">
                        No hay cuotas registradas.
                    </p>
                )}
            </div>

            <div className="mt-6 flex justify-center gap-2">
                {fees.links.map((link, index) => (
                    <Link
                        key={index}
                        href={link.url || ""}
                        className={`px-4 py-2 border rounded ${
                            link.active
                                ? "bg-blue-600 text-white"
                                : "bg-gray-200 text-gray-600 hover:bg-gray-300"
                        }`}
                        dangerouslySetInnerHTML={{ __html: link.label }} // Render HTML entities correctly for navigation labels
                    ></Link>
                ))}
            </div>
        </AuthenticatedLayout>
    );
}