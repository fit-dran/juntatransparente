import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { useForm, router } from "@inertiajs/react";
import InputLabel from "@/Components/InputLabel";
import TextInput from "@/Components/TextInput";
import InputError from "@/Components/InputError";

export default function CreateMeeting() {
    const { data, setData, post, processing, errors, reset } = useForm({
        meeting_date: "",
        main_topic: "",
        description: "",
        location: "",
        organized_by: "",
        result: "",
        status: "scheduled", // Valor predeterminado explícito
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route("meetings.store"), {
            onError: (error) =>
                console.error("Error al crear la reunión:", error),
            onFinish: () => {
                if (Object.keys(errors).length === 0) reset();
            },
        });
    };

    const handleCancel = () => {
        reset(); // Limpia el formulario
        router.visit(route("meetings.index")); // Redirige al índice de reuniones
    };

    return (
        <AuthenticatedLayout
            header={
                <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                    Crear Reunión
                </h2>
            }
        >
            <div className="py-12">
                <div className="max-w-4xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg p-6">
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <InputLabel
                                    htmlFor="meeting_date"
                                    value="Fecha de la Reunión"
                                />
                                <TextInput
                                    id="meeting_date"
                                    type="datetime-local"
                                    name="meeting_date"
                                    value={data.meeting_date}
                                    onChange={(e) =>
                                        setData("meeting_date", e.target.value)
                                    }
                                    className="mt-1 block w-full"
                                />
                                <InputError
                                    message={errors.meeting_date}
                                    className="mt-2"
                                />
                            </div>

                            <div>
                                <InputLabel
                                    htmlFor="main_topic"
                                    value="Tema Principal"
                                />
                                <TextInput
                                    id="main_topic"
                                    type="text"
                                    name="main_topic"
                                    value={data.main_topic}
                                    onChange={(e) =>
                                        setData("main_topic", e.target.value)
                                    }
                                    className="mt-1 block w-full"
                                />
                                <InputError
                                    message={errors.main_topic}
                                    className="mt-2"
                                />
                            </div>

                            <div>
                                <InputLabel
                                    htmlFor="description"
                                    value="Descripción"
                                />
                                <TextInput
                                    id="description"
                                    type="text"
                                    name="description"
                                    value={data.description}
                                    onChange={(e) =>
                                        setData("description", e.target.value)
                                    }
                                    className="mt-1 block w-full"
                                />
                                <InputError
                                    message={errors.description}
                                    className="mt-2"
                                />
                            </div>

                            <div>
                                <InputLabel htmlFor="location" value="Lugar" />
                                <TextInput
                                    id="location"
                                    type="text"
                                    name="location"
                                    value={data.location}
                                    onChange={(e) =>
                                        setData("location", e.target.value)
                                    }
                                    className="mt-1 block w-full"
                                />
                                <InputError
                                    message={errors.location}
                                    className="mt-2"
                                />
                            </div>

                            <div>
                                <InputLabel
                                    htmlFor="organized_by"
                                    value="Convocada Por"
                                />
                                <TextInput
                                    id="organized_by"
                                    type="text"
                                    name="organized_by"
                                    value={data.organized_by}
                                    onChange={(e) =>
                                        setData("organized_by", e.target.value)
                                    }
                                    className="mt-1 block w-full"
                                />
                                <InputError
                                    message={errors.organized_by}
                                    className="mt-2"
                                />
                            </div>

                            <div>
                                <InputLabel htmlFor="result" value="Resultado" />
                                <TextInput
                                    id="result"
                                    type="text"
                                    name="result"
                                    value={data.result}
                                    onChange={(e) =>
                                        setData("result", e.target.value)
                                    }
                                    className="mt-1 block w-full"
                                />
                                <InputError
                                    message={errors.result}
                                    className="mt-2"
                                />
                            </div>

                            <div>
                                <InputLabel htmlFor="status" value="Estado" />
                                <select
                                    id="status"
                                    name="status"
                                    value={data.status}
                                    onChange={(e) =>
                                        setData("status", e.target.value)
                                    }
                                    className="mt-1 block w-full"
                                >
                                    <option value="scheduled">Programada</option>
                                    <option value="completed">Completada</option>
                                    <option value="canceled">Cancelada</option>
                                </select>
                                <InputError
                                    message={errors.status}
                                    className="mt-2"
                                />
                            </div>

                            <div className="flex justify-end space-x-4 mt-4">
                                <button
                                    type="button"
                                    className="bg-gray-500 text-white px-4 py-2 rounded-md"
                                    onClick={handleCancel}
                                >
                                    Cancelar
                                </button>
                                <button
                                    type="submit"
                                    className="bg-blue-600 text-white px-4 py-2 rounded-md"
                                    disabled={processing}
                                >
                                    Crear Reunión
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
