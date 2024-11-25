import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { useForm } from "@inertiajs/react";
import InputLabel from "@/Components/InputLabel";
import TextInput from "@/Components/TextInput";
import InputError from "@/Components/InputError";

export default function Create() {
    const { data, setData, post, processing, errors } = useForm({
        name: "",
        description: "",
        code: "",
        status: "active",
        effective_date: "",
        end_date: "",
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route("expense-types.store"));
    };

    return (
        <AuthenticatedLayout
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Crear Tipo de Gasto</h2>}
        >
            <div className="py-12">
                <div className="max-w-4xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white shadow-sm sm:rounded-lg p-6">
                        <form onSubmit={handleSubmit} className="space-y-4">
                            {/* Nombre */}
                            <div>
                                <InputLabel htmlFor="name" value="Nombre del Tipo de Gasto" />
                                <TextInput
                                    id="name"
                                    type="text"
                                    name="name"
                                    value={data.name}
                                    onChange={(e) => setData("name", e.target.value)}
                                    className="mt-1 block w-full"
                                />
                                <InputError message={errors.name} className="mt-2" />
                            </div>

                            {/* Descripción */}
                            <div>
                                <InputLabel htmlFor="description" value="Descripción" />
                                <textarea
                                    id="description"
                                    name="description"
                                    value={data.description}
                                    onChange={(e) => setData("description", e.target.value)}
                                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring focus:ring-blue-200"
                                ></textarea>
                                <InputError message={errors.description} className="mt-2" />
                            </div>

                            {/* Código */}
                            <div>
                                <InputLabel htmlFor="code" value="Código" />
                                <TextInput
                                    id="code"
                                    type="text"
                                    name="code"
                                    value={data.code}
                                    onChange={(e) => setData("code", e.target.value)}
                                    className="mt-1 block w-full"
                                />
                                <InputError message={errors.code} className="mt-2" />
                            </div>

                            {/* Estado */}
                            <div>
                                <InputLabel htmlFor="status" value="Estado" />
                                <select
                                    id="status"
                                    name="status"
                                    value={data.status}
                                    onChange={(e) => setData("status", e.target.value)}
                                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                                >
                                    <option value="active">Activo</option>
                                    <option value="inactive">Inactivo</option>
                                </select>
                                <InputError message={errors.status} className="mt-2" />
                            </div>

                            {/* Fecha de Inicio */}
                            <div>
                                <InputLabel htmlFor="effective_date" value="Fecha de Inicio" />
                                <TextInput
                                    id="effective_date"
                                    type="date"
                                    name="effective_date"
                                    value={data.effective_date}
                                    onChange={(e) => setData("effective_date", e.target.value)}
                                    className="mt-1 block w-full"
                                />
                                <InputError message={errors.effective_date} className="mt-2" />
                            </div>

                            {/* Fecha de Fin */}
                            <div>
                                <InputLabel htmlFor="end_date" value="Fecha de Fin (Opcional)" />
                                <TextInput
                                    id="end_date"
                                    type="date"
                                    name="end_date"
                                    value={data.end_date}
                                    onChange={(e) => setData("end_date", e.target.value)}
                                    className="mt-1 block w-full"
                                />
                                <InputError message={errors.end_date} className="mt-2" />
                            </div>

                            <div className="flex justify-end space-x-4">
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="bg-blue-600 text-white px-4 py-2 rounded-md"
                                >
                                    Crear
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}