import { useEffect, useState } from "react";
import {
  createProduct,
  deleteProduct,
  getProducts,
} from "../../api/products";
import api from "../../api/axios";

export default function AdminProducts() {
  const [editingId, setEditingId] = useState(null);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);

  const [form, setForm] = useState({
    name: "",
    description: "",
    brand: "",
    price: "",
    stock: "",
    discount: "",
    categoryId: "",
  });

  const [images, setImages] = useState([]);

  const loadProducts = async () => {
    try {
      const res = await getProducts();
      setProducts(res.data.products || []);
    } catch (err) {
      console.log(err);
    }
  };

  const loadCategories = async () => {
    try {
      const res = await api.get("/api/category/getCategories");
      setCategories(res.data.categories || []);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    loadProducts();
    loadCategories();
  }, []);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleImages = (e) => {
    setImages([...e.target.files]);
  };  
  const handleEdit = (product) => {
  setEditingId(product.id);

  setForm({
    name: product.name,
    description: product.description,
    brand: product.brand,
    price: product.price,
    stock: product.stock,
    discount: product.discount,
    categoryId: product.categoryId,
  });

  setImages([]);
};
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const data = new FormData();

      data.append("name", form.name);
      data.append("description", form.description);
      data.append("brand", form.brand);
      data.append("price", form.price);
      data.append("stock", form.stock);
      data.append("discount", form.discount);
      data.append("categoryId", form.categoryId);

      images.forEach((img) => {
        data.append("images", img);
      });

     // await createProduct(data);

      alert("Product Created");
      if (editingId) {
    await api.put(
        `/api/product/updateproduct/${editingId}`,
        data,
        {
            headers: {
                "Content-Type": "multipart/form-data"
            }
        }
    );
} else {
    await api.post(
        "/api/product/createProduct",
        data,
        {
            headers: {
                "Content-Type": "multipart/form-data"
            }
        } 
    );  alert("Product Created");
}

      setForm({
        name: "",
        description: "",
        brand: "",
        price: "",
        stock: "",
        discount: "",
        categoryId: "",
      });

      setImages([]);

      loadProducts();
    } catch (err) {
      console.log(err);
      alert(err.response?.data?.message || "Failed to create product");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this product?")) return;

    try {
      await deleteProduct(id);
      loadProducts();
    } catch (err) {
      console.log(err);
      alert("Delete Failed");
    }
  };

  return (
    <div className="p-6">

      <h1 className="text-3xl font-bold mb-6">
        Admin Products
      </h1>

      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-2 gap-4 mb-10"
      ><input
  type="text"
  name="name"
  placeholder="Product Name"
  value={form.name}
  onChange={handleChange}
  className="border p-2 rounded"
  required
/>

<input
  type="text"
  name="brand"
  placeholder="Brand"
  value={form.brand}
  onChange={handleChange}
  className="border p-2 rounded"
  required
/>

<input
  type="number"
  name="price"
  placeholder="Price"
  value={form.price}
  onChange={handleChange}
  className="border p-2 rounded"
  required
/>

<input
  type="number"
  name="stock"
  placeholder="Stock"
  value={form.stock}
  onChange={handleChange}
  className="border p-2 rounded"
  required
/>

<input
  type="number"
  name="discount"
  placeholder="Discount %"
  value={form.discount}
  onChange={handleChange}
  className="border p-2 rounded"
/>

<select
  name="categoryId"
  value={form.categoryId}
  onChange={handleChange}
  className="border p-2 rounded"
  required
>
  <option value="">Select Category</option>

  {categories.map((cat) => (
    <option key={cat.id} value={cat.id}>
      {cat.name}
    </option>
  ))}
</select>

<textarea
  name="description"
  placeholder="Description"
  value={form.description}
  onChange={handleChange}
  className="border p-2 rounded col-span-2"
  rows="4"
  required
/>

<input
  type="file"
  multiple
  accept="image/*"
  onChange={handleImages}
  className="col-span-2 border p-2 rounded"
/>

<button
  type="submit"
  className="col-span-2 bg-blue-600 text-white p-3 rounded hover:bg-blue-700"
>
  {editingId ? "Update Product" : "Create Product"}
</button>

</form>      <h2 className="text-2xl font-semibold mb-4">Products</h2>

      <div className="overflow-x-auto">
        <table className="w-full border border-gray-300">
          <thead className="bg-gray-100">
            <tr>
              <th className="border p-2">Image</th>
              <th className="border p-2">Name</th>
              <th className="border p-2">Brand</th>
              <th className="border p-2">Category</th>
              <th className="border p-2">Price</th>
              <th className="border p-2">Stock</th>
              <th className="border p-2">Discount</th>
              <th className="border p-2">Actions</th>
            </tr>
          </thead>

          <tbody>
            {products.length === 0 ? (
              <tr>
                <td
                  colSpan="8"
                  className="text-center border p-4"
                >
                  No Products Found
                </td>
              </tr>
            ) : (
              products.map((product) => (
                <tr key={product.id}>
                  <td className="border p-2">
                    {product.images?.length > 0 && (
                      <img
                        src={product.images[0]}
                        alt={product.name}
                        className="w-20 h-20 object-cover rounded"
                      />
                    )}
                  </td>

                  <td className="border p-2">
                    {product.name}
                  </td>

                  <td className="border p-2">
                    {product.brand}
                  </td>

                  <td className="border p-2">
                    {product.category?.name}
                  </td>

                  <td className="border p-2">
                    ₹{product.price}
                  </td>

                  <td className="border p-2">
                    {product.stock}
                  </td>

                  <td className="border p-2">
                    {product.discount}%
                  </td>

                  <td className="border p-2">
                   <div className="flex gap-2">
    <button
        onClick={() => handleEdit(product)}
        className="bg-blue-500 text-white px-3 py-1 rounded"
    >
        Edit
    </button>

    <button
        onClick={() => handleDelete(product.id)}
        className="bg-red-500 text-white px-3 py-1 rounded"
    >
        Delete
    </button>
</div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>    </div>
  );
}