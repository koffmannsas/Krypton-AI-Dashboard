import { useState, useEffect } from "react";
import { Customer } from "../../services/api/customers";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: Partial<Customer>) => void;
  customer?: Customer | null;
}

export default function CustomerModal({
  isOpen,
  onClose,
  onSave,
  customer,
}: Props) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [newTag, setNewTag] = useState("");

  useEffect(() => {
    if (customer) {
      setName(customer.name);
      setPhone(customer.phone || "");
      setTags(customer.tags || []);
    } else {
      setName("");
      setPhone("");
      setTags([]);
    }
  }, [customer]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center">
      <div className="bg-[#111] p-6 rounded-2xl w-[400px]">
        <h2 className="text-lg mb-4 text-white">
          {customer ? "Edit Customer" : "New Customer"}
        </h2>

        <input
          className="w-full mb-3 p-2 bg-[#1a1a1a] text-white rounded"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <input
          className="w-full mb-3 p-2 bg-[#1a1a1a] text-white rounded"
          placeholder="Phone"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />
        <div className="flex gap-2 mb-2">
            <input
                className="flex-1 p-2 bg-[#1a1a1a] text-white rounded"
                placeholder="Tag"
                value={newTag || ""}
                onChange={(e) => setNewTag(e.target.value)}
            />
            <button onClick={() => {
                if (newTag && !tags.includes(newTag)) {
                    setTags([...tags, newTag]);
                    setNewTag("");
                }
            }} className="bg-blue-600 px-3 py-1 rounded text-white">Add</button>
        </div>
        <div className="flex flex-wrap gap-2 mb-4">
            {tags.map(tag => (
                <span key={tag} className="bg-gray-700 text-white px-2 py-1 rounded flex items-center gap-1">
                    {tag}
                    <button onClick={() => setTags(tags.filter(t => t !== tag))} className="text-red-400">x</button>
                </span>
            ))}
        </div>

        <div className="flex justify-end gap-2">
          <button onClick={onClose}>Cancel</button>
          <button
            className="bg-red-500 px-4 py-2 rounded text-white"
            onClick={() => {
              onSave({ name, phone, tags });
              onClose();
            }}
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}