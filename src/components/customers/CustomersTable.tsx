import { Customer } from "../../services/api/customers";

interface Props {
  customers: Customer[];
  onEdit: (customer: Customer) => void;
  onDelete: (id: string) => void;
}

export default function CustomersTable({ customers, onEdit, onDelete }: Props) {
  return (
    <div className="bg-[#111] rounded-2xl p-4 border border-[#1f1f1f]">
      <table className="w-full text-left">
        <thead>
          <tr className="text-gray-400 text-sm">
            <th>Name</th>
            <th>Phone</th>
            <th>Total</th>
            <th>Status</th>
            <th></th>
          </tr>
        </thead>

        <tbody>
          {customers.map((c) => (
            <tr key={c.id} className="border-t border-[#1f1f1f]">
              <td className="py-3">{c.name}</td>
              <td>{c.phone}</td>
              <td>{c.total_spent} FCFA</td>

              <td>
                <span className="text-xs px-2 py-1 rounded bg-red-500/20 text-red-400">
                  {c.lifecycle}
                </span>
              </td>

              <td className="flex gap-2">
                <button onClick={() => onEdit(c)}>✏️</button>
                <button onClick={() => onDelete(c.id!)}>🗑️</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}