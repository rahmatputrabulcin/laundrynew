import { Link } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head } from "@inertiajs/react";

export default function Index({ expenses, auth, flash }) {
    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                    {" "}
                    Expenses{" "}
                </h2>
            }
        >
            {" "}
            <Head title="Expenses" />
            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="flex justify-end mb-4">
                        <Link
                            href={route("expenses.create")}
                            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                        >
                            Add Expense{" "}
                        </Link>{" "}
                    </div>{" "}
                    <div className="bg-white shadow-sm sm:rounded-lg p-6">
                        <table className="min-w-full">
                            <thead>
                                <tr>
                                    <th> Title </th> <th> Amount </th>{" "}
                                    <th> Category </th> <th> Date </th>{" "}
                                    <th> Description </th> <th> Actions </th>{" "}
                                </tr>{" "}
                            </thead>{" "}
                            <tbody>
                                {" "}
                                {expenses.map((expense) => (
                                    <tr key={expense.id}>
                                        <td> {expense.title} </td>{" "}
                                        <td>
                                            {" "}
                                            Rp{" "}
                                            {parseFloat(
                                                expense.amount
                                            ).toLocaleString()}{" "}
                                        </td>{" "}
                                        <td> {expense.category} </td>{" "}
                                        <td>
                                            {" "}
                                            {expense.expense_date
                                                ? new Date(
                                                      expense.expense_date
                                                  ).toLocaleDateString("id-ID")
                                                : "-"}{" "}
                                        </td>{" "}
                                        <td> {expense.description} </td>{" "}
                                        <td>
                                            <Link
                                                href={route(
                                                    "expenses.edit",
                                                    expense.id
                                                )}
                                                className="text-yellow-600 hover:underline mr-2"
                                            >
                                                {" "}
                                                Edit{" "}
                                            </Link>{" "}
                                            <Link
                                                href={route(
                                                    "expenses.destroy",
                                                    expense.id
                                                )}
                                                method="delete"
                                                as="button"
                                                className="text-red-600 hover:underline"
                                            >
                                                {" "}
                                                Delete{" "}
                                            </Link>{" "}
                                        </td>{" "}
                                    </tr>
                                ))}{" "}
                            </tbody>{" "}
                        </table>{" "}
                    </div>{" "}
                </div>{" "}
            </div>{" "}
        </AuthenticatedLayout>
    );
}
