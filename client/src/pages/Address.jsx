import { useEffect, useState } from "react";
import {
  createAddress,
  getAddresses,
  deleteAddress,
} from "../api/address";
import Alert from "../components/Alert";

export default function Address() {
  const [addresses, setAddresses] = useState([]);
  const [message, setMessage] = useState({ type: "", text: "" });

  const [form, setForm] = useState({
    fullName: "",
    phone: "",
    street: "",
    city: "",
    state: "",
    country: "India",
    pincode: "",
  });

  const loadAddresses = async () => {
    try {
      const { data } = await getAddresses();
      setAddresses(data.addresses);
    } catch (err) {
      setMessage({
        type: "error",
        text: err.response?.data?.message || "Failed to load addresses",
      });
    }
  };

  useEffect(() => {
    loadAddresses();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await createAddress(form);

      setMessage({
        type: "success",
        text: "Address added successfully",
      });

      setForm({
        fullName: "",
        phone: "",
        street: "",
        city: "",
        state: "",
        country: "India",
        pincode: "",
      });

      loadAddresses();
    } catch (err) {
      setMessage({
        type: "error",
        text: err.response?.data?.message || "Failed to add address",
      });
    }
  };

  const handleDelete = async (id) => {
    await deleteAddress(id);
    loadAddresses();
  };

  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">My Addresses</h1>

      <Alert
        type={message.type}
        message={message.text}
        onClose={() => setMessage({ type: "", text: "" })}
      />

      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-xl p-6 border space-y-4"
      >
        <input
          placeholder="Full Name"
          value={form.fullName}
          onChange={(e) =>
            setForm({ ...form, fullName: e.target.value })
          }
          className="w-full border rounded p-2"
        />

        <input
          placeholder="Phone"
          value={form.phone}
          onChange={(e) =>
            setForm({ ...form, phone: e.target.value })
          }
          className="w-full border rounded p-2"
        />

        <input
          placeholder="Street"
          value={form.street}
          onChange={(e) =>
            setForm({ ...form, street: e.target.value })
          }
          className="w-full border rounded p-2"
        />

        <input
          placeholder="City"
          value={form.city}
          onChange={(e) =>
            setForm({ ...form, city: e.target.value })
          }
          className="w-full border rounded p-2"
        />

        <input
          placeholder="State"
          value={form.state}
          onChange={(e) =>
            setForm({ ...form, state: e.target.value })
          }
          className="w-full border rounded p-2"
        />

        <input
          placeholder="Country"
          value={form.country}
          onChange={(e) =>
            setForm({ ...form, country: e.target.value })
          }
          className="w-full border rounded p-2"
        />

        <input
          placeholder="Pincode"
          value={form.pincode}
          onChange={(e) =>
            setForm({ ...form, pincode: e.target.value })
          }
          className="w-full border rounded p-2"
        />

        <button className="bg-primary-600 text-white px-5 py-2 rounded">
          Save Address
        </button>
      </form>

      <div className="mt-8 space-y-4">
        {addresses.map((address) => (
          <div
            key={address.id}
            className="border rounded-xl p-4 flex justify-between"
          >
            <div>
              <p className="font-semibold">{address.fullName}</p>
              <p>{address.street}</p>
              <p>
                {address.city}, {address.state}
              </p>
              <p>{address.country}</p>
              <p>{address.pincode}</p>
              <p>{address.phone}</p>
            </div>

            <button
              onClick={() => handleDelete(address.id)}
              className="text-red-600"
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}