import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { useForm, router } from "@inertiajs/react";
import InputLabel from "@/Components/InputLabel";
import TextInput from "@/Components/TextInput";
import InputError from "@/Components/InputError";

export default function CreateExpense({ expenseTypes }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        concept: "",
        responsible: "",
        date: "",
        amount: "",
        type_id: "",
        receipt: null,
        status: "pending",
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route("expenses.store"), {
            onSuccess: () => reset(),
        });
    };

    const handleCancel = () => {
        reset();
        router.visit(route("expenses.index"));
    };

    return (
        <AuthenticatedLayout
            header={
                <div>
                    <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                        Crear Gasto
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
                                    htmlFor="concept"
                                    value="Concepto *"
                                />
                                <TextInput
                                    id="concept"
                                    type="text"
                                    name="concept"
                                    value={data.concept}
                                    onChange={(e) => {
                                        const regex = /^[a-zA-Z\s]*$/;
                                        if (regex.test(e.target.value)) {
                                            setData("concept", e.target.value);
                                        }
                                    }}
                                    className="mt-1 block w-full"
                                />
                                <InputError
                                    message={errors.concept}
                                    className="mt-2"
                                />
                            </div>

                            <div>
                                <InputLabel
                                    htmlFor="responsible"
                                    value="Responsable *"
                                />
                                <TextInput
                                    id="responsible"
                                    type="text"
                                    name="responsible"
                                    value={data.responsible}
                                    onChange={(e) =>
                                        setData("responsible", e.target.value)
                                    }
                                    className="mt-1 block w-full"
                                />
                                <InputError
                                    message={errors.responsible}
                                    className="mt-2"
                                />
                            </div>

                            <div>
                                <InputLabel htmlFor="date" value="Fecha *" />
                                <TextInput
                                    id="date"
                                    type="date"
                                    name="date"
                                    value={data.date}
                                    onChange={(e) =>
                                        setData("date", e.target.value)
                                    }
                                    className="mt-1 block w-full"
                                />
                                <InputError
                                    message={errors.date}
                                    className="mt-2"
                                />
                            </div>

                            <div>
                                <InputLabel htmlFor="amount" value="Monto *" />
                                <TextInput
                                    id="amount"
                                    type="text"
                                    name="amount"
                                    value={data.amount}
                                    onChange={(e) => {
                                        const regex = /^[0-9]*\.?[0-9]*$/;
                                        if (regex.test(e.target.value)) {
                                            setData("amount", e.target.value);
                                        }
                                    }}
                                    className="mt-1 block w-full"
                                />
                                <InputError
                                    message={errors.amount}
                                    className="mt-2"
                                />
                            </div>

                            <div>
                                <InputLabel
                                    htmlFor="type_id"
                                    value="Tipo de Gasto *"
                                />
                                <select
                                    id="type_id"
                                    name="type_id"
                                    value={data.type_id}
                                    onChange={(e) =>
                                        setData("type_id", e.target.value)
                                    }
                                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                                >
                                    <option value="">Seleccione un tipo</option>
                                    {expenseTypes.map((type) => (
                                        <option key={type.id} value={type.id}>
                                            {type.name}
                                        </option>
                                    ))}
                                </select>
                                <InputError
                                    message={errors.type_id}
                                    className="mt-2"
                                />
                            </div>

                            <div>
                                <InputLabel htmlFor="status" value="Estado *" />
                                <select
                                    id="status"
                                    name="status"
                                    value={data.status}
                                    onChange={(e) =>
                                        setData("status", e.target.value)
                                    }
                                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                                >
                                    <option value="">
                                        Seleccione un estado
                                    </option>
                                    <option value="pending">Pendiente</option>
                                    <option value="approved">Aprobado</option>
                                    <option value="rejected">Rechazado</option>
                                </select>
                                <InputError
                                    message={errors.status}
                                    className="mt-2"
                                />
                            </div>

                            <div>
                                <InputLabel
                                    htmlFor="receipt"
                                    value="Recibo (opcional)"
                                />
                                <input
                                    id="receipt"
                                    type="file"
                                    name="receipt"
                                    onChange={(e) =>
                                        setData("receipt", e.target.files[0])
                                    }
                                    className="mt-1 block w-full"
                                />
                                <InputError
                                    message={errors.receipt}
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
                                    Crear Gasto
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
