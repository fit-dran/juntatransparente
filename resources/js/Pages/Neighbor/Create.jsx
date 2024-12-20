import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { useForm, router } from "@inertiajs/react";
import InputLabel from "@/Components/InputLabel";
import TextInput from "@/Components/TextInput";
import InputError from "@/Components/InputError";
import PrimaryButton from "@/Components/PrimaryButton";
import { formatRUT } from "@/Components/format";

export default function CreateNeighborWithUser({
    associations,
    userAssociationId,
    userAssociationName,
}) {
    // Obtener la fecha actual en formato YYYY-MM-DD
    const today = new Date().toISOString().split("T")[0];

    const { data, setData, post, processing, errors, reset } = useForm({
        // Neighbor fields
        address: "",
        identification_number: "",
        registration_date: today, // Fecha de registro predefinida
        birth_date: "",
        status: "inactive", // Estado por defecto
        neighborhood_association_id: userAssociationId || "", // Preseleccionada si es board_member

        // User fields
        name: "",
        email: "",
        password: "",
        password_confirmation: "",
        role: "resident", // Rol por defecto
    });

    const isBoardMember = !!userAssociationId; // Determinar si el usuario es board_member

    const submit = (e) => {
        e.preventDefault();
        post(route("neighbors.store"));
    };

    const handleCancel = () => {
        reset();
        router.visit(route("neighbors.index"));
    };

    return (
        <AuthenticatedLayout
            header={
                <div>
                    <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                        Crear Vecino y Usuario
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
                <div className="max-w-full mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg p-6">
                        <form onSubmit={submit} className="space-y-4">
                            {/* Nombre */}
                            <div>
                                <InputLabel htmlFor="name" value="Nombre *" />
                                <TextInput
                                    id="name"
                                    type="text"
                                    name="name"
                                    value={data.name}
                                    onChange={(e) =>
                                        setData("name", e.target.value)
                                    }
                                    className="mt-1 block w-full"
                                    required
                                />
                                <InputError
                                    message={errors.name}
                                    className="mt-2"
                                />
                            </div>

                            {/* Correo Electrónico */}
                            <div>
                                <InputLabel
                                    htmlFor="email"
                                    value="Correo Electrónico *"
                                />
                                <TextInput
                                    id="email"
                                    type="email"
                                    name="email"
                                    value={data.email}
                                    onChange={(e) =>
                                        setData("email", e.target.value)
                                    }
                                    className="mt-1 block w-full"
                                    required
                                />
                                <InputError
                                    message={errors.email}
                                    className="mt-2"
                                />
                            </div>

                            {/* Contraseña */}
                            <div>
                                <InputLabel
                                    htmlFor="password"
                                    value="Contraseña *"
                                />
                                <TextInput
                                    id="password"
                                    type="password"
                                    name="password"
                                    value={data.password}
                                    onChange={(e) =>
                                        setData("password", e.target.value)
                                    }
                                    className="mt-1 block w-full"
                                    required
                                />
                                <InputError
                                    message={errors.password}
                                    className="mt-2"
                                />
                            </div>

                            {/* Confirmar Contraseña */}
                            <div>
                                <InputLabel
                                    htmlFor="password_confirmation"
                                    value="Confirmar Contraseña *"
                                />
                                <TextInput
                                    id="password_confirmation"
                                    type="password"
                                    name="password_confirmation"
                                    value={data.password_confirmation}
                                    onChange={(e) =>
                                        setData(
                                            "password_confirmation",
                                            e.target.value
                                        )
                                    }
                                    className="mt-1 block w-full"
                                    required
                                />
                                <InputError
                                    message={errors.password_confirmation}
                                    className="mt-2"
                                />
                            </div>

                            {/* Dirección */}
                            <div>
                                <InputLabel
                                    htmlFor="address"
                                    value="Dirección *"
                                />
                                <TextInput
                                    id="address"
                                    type="text"
                                    name="address"
                                    value={data.address}
                                    onChange={(e) =>
                                        setData("address", e.target.value)
                                    }
                                    className="mt-1 block w-full"
                                    required
                                />
                                <InputError
                                    message={errors.address}
                                    className="mt-2"
                                />
                            </div>

                            {/* Número de Identificación */}
                            <div>
                                <InputLabel
                                    htmlFor="identification_number"
                                    value="Número de Identificación (RUT) *"
                                />
                                <TextInput
                                    id="identification_number"
                                    type="text"
                                    name="identification_number"
                                    value={data.identification_number}
                                    onChange={(e) =>
                                        setData(
                                            "identification_number",
                                            formatRUT(e.target.value)
                                        )
                                    }
                                    placeholder="Ej: 12.345.678-9"
                                    className="mt-1 block w-full"
                                    required
                                />
                                <InputError
                                    message={errors.identification_number}
                                    className="mt-2"
                                />
                            </div>

                            {/* Fecha de Registro */}
                            {/* Fecha de Registro */}
                            <div>
                                <InputLabel
                                    htmlFor="registration_date"
                                    value="Fecha de Registro *"
                                />
                                <TextInput
                                    id="registration_date"
                                    type="date"
                                    name="registration_date"
                                    value={data.registration_date}
                                    onChange={(e) =>
                                        setData(
                                            "registration_date",
                                            e.target.value
                                        )
                                    }
                                    className="mt-1 block w-full"
                                    max={today} // Bloquea días posteriores a hoy
                                    required
                                />
                                <InputError
                                    message={errors.registration_date}
                                    className="mt-2"
                                />
                            </div>

                            {/* Fecha de Nacimiento */}
                            <div>
                                <InputLabel
                                    htmlFor="birth_date"
                                    value="Fecha de Nacimiento *"
                                />
                                <TextInput
                                    id="birth_date"
                                    type="date"
                                    name="birth_date"
                                    value={data.birth_date}
                                    onChange={(e) =>
                                        setData("birth_date", e.target.value)
                                    }
                                    className="mt-1 block w-full"
                                    max={new Date().toISOString().split("T")[0]} // Restringe hasta el día actual
                                    required
                                />
                                <InputError
                                    message={errors.birth_date}
                                    className="mt-2"
                                />
                            </div>

                            {/* Estado */}
                            <div>
                                <InputLabel htmlFor="status" value="Estado *" />
                                <button
                                    type="button"
                                    onClick={() =>
                                        setData(
                                            "status",
                                            data.status === "active"
                                                ? "inactive"
                                                : "active"
                                        )
                                    }
                                    className={`w-full md:w-auto px-4 py-2 rounded ${
                                        data.status === "active"
                                            ? "bg-green-500"
                                            : "bg-red-500"
                                    } text-white hover:opacity-80`}
                                >
                                    {data.status === "active"
                                        ? "Activo"
                                        : "Inactivo"}
                                </button>
                                <InputError
                                    message={errors.status}
                                    className="mt-2"
                                />
                            </div>

                            {/* Asociación Vecinal */}
                            <div>
                                <InputLabel
                                    htmlFor="neighborhood_association_id"
                                    value="Junta de Vecinos"
                                />
                                {isBoardMember ? (
                                    <div className="mt-1">
                                        <TextInput
                                            id="neighborhood_association_id"
                                            name="neighborhood_association_id"
                                            value={userAssociationName}
                                            readOnly
                                            className="bg-gray-100 cursor-not-allowed w-full"
                                        />
                                        <p className="text-sm text-gray-500">
                                            Solo puedes asignar vecinos a la
                                            asociación a la que perteneces.
                                        </p>
                                    </div>
                                ) : (
                                    <select
                                        id="neighborhood_association_id"
                                        name="neighborhood_association_id"
                                        value={data.neighborhood_association_id}
                                        onChange={(e) =>
                                            setData(
                                                "neighborhood_association_id",
                                                e.target.value
                                            )
                                        }
                                        className="mt-1 block w-full"
                                        required
                                    >
                                        <option value="">
                                            Seleccione una Asociación
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
                                )}
                                <InputError
                                    message={errors.neighborhood_association_id}
                                    className="mt-2"
                                />
                            </div>

                            {/* Botones */}
                            <div className="flex flex-col md:flex-row justify-end space-y-4 md:space-y-0 md:space-x-4 mt-4">
                                <button
                                    type="button"
                                    className="w-full md:w-auto bg-gray-500 text-white px-4 py-2 rounded-md"
                                    onClick={handleCancel}
                                >
                                    Cancelar
                                </button>
                                <PrimaryButton
                                    className="bg-blue-600 text-white px-4 py-2 rounded-md"
                                    disabled={processing}
                                >
                                    Agregar Vecino y Usuario
                                </PrimaryButton>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
