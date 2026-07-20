import { useEffect, useState } from "react";
import api from "../../api/axios";

export default function AdminCategories() {
  const [categories, setCategories] = useState([]);
  const [name, setName] = useState("");

  const loadCategories = async () => {
    try {
      const res = await api.get("/api/category/getCategories");
      setCategories(res.data.categories || []);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    loadCategories();
  }, []);

  const handleSubmit = async (e) => {
  e.preventDefault();

  console.log("1");

  try {
    console.log("2");

    await api.post("/api/category/createCategory", {
      name,
    });

    console.log("3");

    setName("");
    loadCategories();

    alert("Category Created");
  } catch (err) {
  console.error(err);
  console.log("message:", err.message);
  console.log("response:", err.response);
  console.log("request:", err.request);
  console.log("config:", err.config);
}
};  const handleDelete = async (id) => {
    if (!window.confirm("Delete this category?")) return;

    try {
      await api.delete(`/api/category/delete/${id}`);
      loadCategories();
    } catch (err) {
      console.log(err);
      alert(err.response?.data?.message || "Delete Failed");
    }
  };

  return (
    <div className="p-6">

      <h1 className="text-3xl font-bold mb-6">
        Admin Categories
      </h1>

      <form
        onSubmit={handleSubmit}
        className="flex gap-4 mb-8"
      >

        <input
          type="text"
          placeholder="Category Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="border p-2 rounded flex-1"
          required
        />

        <button
          type="submit"
          className="bg-blue-600 text-white px-5 rounded hover:bg-blue-700"
        >
          Create
        </button>

      </form>

      <table className="w-full border border-gray-300">

        <thead className="bg-gray-100">

          <tr>
            <th className="border p-2">Category Name</th>
            <th className="border p-2">Actions</th>
          </tr>

        </thead>

        <tbody>

          {categories.length === 0 ? (

            <tr>
              <td
                colSpan="2"
                className="border p-4 text-center"
              >
                No Categories Found
              </td>
            </tr>

          ) : (

            categories.map((category) => (

              <tr key={category.id}>

                <td className="border p-2">
                  {category.name}
                </td>

                <td className="border p-2">

                  <button
                    onClick={() => handleDelete(category.id)}
                    className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                  >
                    Delete
                  </button>

                </td>

              </tr>

            ))

          )}

        </tbody>

      </table>    </div>
  );
}