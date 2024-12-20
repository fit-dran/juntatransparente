import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { useForm, router } from "@inertiajs/react";
import InputLabel from "@/Components/InputLabel";
import TextInput from "@/Components/TextInput";
import InputError from "@/Components/InputError";

export default function CreateMeeting({ userRole, associations }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        meeting_date: "",
        main_topic: "",
        description: "",
        location: "",

        result: "",
        status: "scheduled", // Valor predeterminado
        neighborhood_association_id:
            userRole === "board_member" ? associations[0]?.id : "",
    });

    const handleChange = (field, value) => {
        setData(field, value);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route("meetings.store"), {
            onFinish: () => {
                if (Object.keys(errors).length === 0) reset();
            },
        });
    };

    const handleCancel = () => {
        reset();
        router.visit(route("meetings.index"));
    };

    return (
        <AuthenticatedLayout
            header={
                <div>
                    <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                        Crear Reunión
                    </h2>
                    <p className="text-sm text-gray-600">
                        Los campos marcados con{" "}
                        <span className="text-red-500">*</span> son
                        obligatorios.
                    </p>
                </div>
            }
        >
            <div className="py-12">
                <div className="max-w-4xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg p-6">
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <InputLabel
                                    htmlFor="meeting_date"
                                    value="Fecha de la Reunión *"
                                />
                                <TextInput
                                    id="meeting_date"
                                    type="datetime-local"
                                    name="meeting_date"
                                    value={data.meeting_date}
                                    onChange={(e) =>
                                        handleChange(
                                            "meeting_date",
                                            e.target.value
                                        )
                                    }
                                    className="mt-1 block w-full"
                                    required
                                />
                                <InputError
                                    message={errors.meeting_date}
                                    className="mt-2"
                                />
                            </div>

                            <div>
                                <InputLabel
                                    htmlFor="main_topic"
                                    value="Tema Principal *"
                                />
                                <TextInput
                                    id="main_topic"
                                    type="text"
                                    name="main_topic"
                                    value={data.main_topic}
                                    onChange={(e) =>
                                        handleChange(
                                            "main_topic",
                                            e.target.value
                                        )
                                    }
                                    className="mt-1 block w-full"
                                    required
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
                                        handleChange(
                                            "description",
                                            e.target.value
                                        )
                                    }
                                    className="mt-1 block w-full"
                                />
                                <InputError
                                    message={errors.description}
                                    className="mt-2"
                                />
                            </div>

                            <div>
                                <InputLabel
                                    htmlFor="location"
                                    value="Lugar *"
                                />
                                <TextInput
                                    id="location"
                                    type="text"
                                    name="location"
                                    value={data.location}
                                    onChange={(e) =>
                                        handleChange("location", e.target.value)
                                    }
                                    className="mt-1 block w-full"
                                    required
                                />
                                <InputError
                                    message={errors.location}
                                    className="mt-2"
                                />
                            </div>

                            <div>
                                <InputLabel
                                    htmlFor="result"
                                    value="Resultado"
                                />
                                <TextInput
                                    id="result"
                                    type="text"
                                    name="result"
                                    value={data.result}
                                    onChange={(e) =>
                                        handleChange("result", e.target.value)
                                    }
                                    className="mt-1 block w-full"
                                />
                                <InputError
                                    message={errors.result}
                                    className="mt-2"
                                />
                            </div>

                            <div>
                                <InputLabel htmlFor="status" value="Estado *" />
                                <TextInput
                                    id="status"
                                    name="status"
                                    value="Programada"
                                    className="mt-1 block w-full bg-gray-100 cursor-not-allowed"
                                    readOnly
                                />
                                <input type="hidden" name="status" value="scheduled" />
                            </div>


                            <div>
                                <InputLabel
                                    htmlFor="neighborhood_association_id"
                                    value="Junta de Vecinos"
                                />
                                <select
                                    id="neighborhood_association_id"
                                    name="neighborhood_association_id"
                                    value={data.neighborhood_association_id}
                                    onChange={(e) =>
                                        handleChange(
                                            "neighborhood_association_id",
                                            e.target.value
                                        )
                                    }
                                    className={`mt-1 block w-full ${
                                        userRole === "board_member"
                                            ? "bg-gray-100 cursor-not-allowed"
                                            : ""
                                    }`}
                                    disabled={userRole === "board_member"}
                                    required
                                >
                                    <option value="">
                                        Seleccione una asociación
                                    </option>
                                    {associations.map((association) => (
                                        <option
                                            key={association.id}
                                            value={association.id}
                                        >
                                            {association.name}
                                        </option>
                                    ))}
                                </select>
                                <InputError
                                    message={errors.neighborhood_association_id}
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
