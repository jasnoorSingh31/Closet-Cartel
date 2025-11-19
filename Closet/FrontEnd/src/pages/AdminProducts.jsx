import React, { useEffect, useMemo, useState } from "react";
import Navbar from "../components/Navbar";
import { useProducts } from "../context/ProductContext";
import { useAuth } from "../context/AuthContext";
import { API_BASE_URL } from "../utils/constants";

const initialFormState = {
  name: "",
  category: "",
  description: "",
  image: "",
  price: "",
  offerPrice: "",
  stock: "",
  size: "",
  rating: "",
  isActive: true,
};

const AdminProducts = () => {
  // Product provider gives storefront list + helpers, token gates admin routes.
  const { refreshProducts, fetchAdminProducts } = useProducts();
  const { token } = useAuth();
  const [adminProducts, setAdminProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState(initialFormState);
  const [editingId, setEditingId] = useState(null);
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);

  const descriptionValue = useMemo(() => {
    if (!formData.description) return "";
    if (Array.isArray(formData.description)) {
      return formData.description.join("\n");
    }
    return formData.description;
  }, [formData.description]);

  // Pull the full catalog (including hidden items) so the table is in sync.
  const loadAdminProducts = async () => {
    if (!token) return;
    try {
      setLoading(true);
      const data = await fetchAdminProducts(token);
      setAdminProducts(data);
    } catch (err) {
      setError(err.message || "Unable to load products");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAdminProducts();
  }, [token]);

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const resetForm = () => {
    setFormData(initialFormState);
    setEditingId(null);
  };

  const handleEdit = (product) => {
    setEditingId(product.id);
    setFormData({
      name: product.name || "",
      category: product.category || "",
      description: product.description || [],
      image: product.image || "",
      price: product.price?.toString() || "",
      offerPrice: product.offerPrice?.toString() || "",
      stock: product.stock?.toString() || "",
      size: product.size || "",
      rating: product.rating?.toString() || "",
      isActive: product.isActive ?? true,
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Handles both create and update flows based on the presence of editingId.
  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!token) return;

    setSubmitting(true);
    setMessage(null);
    setError(null);

    const payload = {
      ...formData,
      price: Number(formData.price),
      offerPrice: Number(formData.offerPrice),
      stock: Number(formData.stock || 0),
      rating: Number(formData.rating || 0),
      description: descriptionValue
        .split("\n")
        .map((line) => line.trim())
        .filter(Boolean),
    };

    const method = editingId ? "PUT" : "POST";
    const url = editingId
      ? `${API_BASE_URL}/products/${editingId}`
      : `${API_BASE_URL}/products`;

    try {
      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.message || "Unable to save product");
      }

      setMessage(editingId ? "Product updated." : "Product created.");
      resetForm();
      await loadAdminProducts();
      await refreshProducts();
    } catch (err) {
      setError(err.message || "Unable to save product");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!token) return;
    if (!window.confirm("Delete this product?")) return;

    try {
      await fetch(`${API_BASE_URL}/products/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      await loadAdminProducts();
      await refreshProducts();
      if (editingId === id) {
        resetForm();
      }
    } catch (err) {
      setError(err.message || "Unable to delete product");
    }
  };

  return (
    <div className="min-h-screen bg-neutral-900 text-white">
      <Navbar />
      <div className="pt-32 max-w-6xl mx-auto px-4 pb-20">
        <header className="mb-8">
          <h1 className="text-3xl font-semibold">Admin · Products</h1>
          <p className="text-gray-400 mt-1">
            Create, edit, and remove products shown on the storefront.
          </p>
        </header>

        <section className="bg-white text-gray-900 rounded-2xl shadow mb-10 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">
              {editingId ? "Update product" : "Add new product"}
            </h2>
            {editingId && (
              <button
                onClick={resetForm}
                className="text-sm text-indigo-600 hover:underline"
              >
                Cancel edit
              </button>
            )}
          </div>

          {(message || error) && (
            <div
              className={`mb-4 rounded border px-4 py-2 text-sm ${
                error
                  ? "border-red-200 bg-red-50 text-red-700"
                  : "border-emerald-200 bg-emerald-50 text-emerald-700"
              }`}
            >
              {error || message}
            </div>
          )}

          <form onSubmit={handleSubmit} className="grid gap-4 md:grid-cols-2">
            <label className="text-sm font-medium">
              Name
              <span className="block text-xs text-white font-normal">
                Internal + customer-facing title (e.g., “Jet Black Tee”)
              </span>
              <input
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="mt-1 w-full rounded border border-gray-200 bg-white/10 text-white placeholder-white/60 px-3 py-2 focus:border-white focus:outline-none"
                required
              />
            </label>
            <label className="text-sm font-medium">
              Category
              <span className="block text-xs text-white font-normal">
                Collection or segment (Essentials, Athletics, etc.)
              </span>
              <input
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="mt-1 w-full rounded border border-gray-200 bg-white/10 text-white placeholder-white/60 px-3 py-2 focus:border-white focus:outline-none"
              />
            </label>
            <label className="text-sm font-medium">
              Image URL
              <span className="block text-xs text-white font-normal">
                Public link to the product photo (png/jpg/webp)
              </span>
              <input
                name="image"
                value={formData.image}
                onChange={handleChange}
                className="mt-1 w-full rounded border border-gray-200 bg-white/10 text-white placeholder-white/60 px-3 py-2 focus:border-white focus:outline-none"
                required
              />
            </label>
            <label className="text-sm font-medium">
              Size
              <span className="block text-xs text-white font-normal">
                Default size or size run note (e.g., “M” or “One size”)
              </span>
              <input
                name="size"
                value={formData.size}
                onChange={handleChange}
                className="mt-1 w-full rounded border border-gray-200 bg-white/10 text-white placeholder-white/60 px-3 py-2 focus:border-white focus:outline-none"
              />
            </label>
            <label className="text-sm font-medium">
              Price
              <span className="block text-xs text-white font-normal">
                Original MSRP shown as strikethrough (numbers only)
              </span>
              <input
                type="number"
                step="0.01"
                name="price"
                value={formData.price}
                onChange={handleChange}
                className="mt-1 w-full rounded border border-gray-200 bg-white/10 text-white placeholder-white/60 px-3 py-2 focus:border-white focus:outline-none"
                required
              />
            </label>
            <label className="text-sm font-medium">
              Offer price
              <span className="block text-xs text-white font-normal">
                Discounted price customers pay (must be ≤ Price)
              </span>
              <input
                type="number"
                step="0.01"
                name="offerPrice"
                value={formData.offerPrice}
                onChange={handleChange}
                className="mt-1 w-full rounded border border-gray-200 bg-white/10 text-white placeholder-white/60 px-3 py-2 focus:border-white focus:outline-none"
              />
            </label>
            <label className="text-sm font-medium">
              Stock
              <span className="block text-xs text-white font-normal">
                Available inventory count (used for internal tracking)
              </span>
              <input
                type="number"
                name="stock"
                value={formData.stock}
                onChange={handleChange}
                className="mt-1 w-full rounded border border-gray-200 bg-white/10 text-white placeholder-white/60 px-3 py-2 focus:border-white focus:outline-none"
              />
            </label>
            <label className="text-sm font-medium">
              Rating
              <span className="block text-xs text-white font-normal">
                Average customer rating (0 – 5, supports decimals)
              </span>
              <input
                type="number"
                step="0.1"
                name="rating"
                value={formData.rating}
                onChange={handleChange}
                className="mt-1 w-full rounded border border-gray-200 bg-white/10 text-white placeholder-white/60 px-3 py-2 focus:border-white focus:outline-none"
              />
            </label>
            <label className="text-sm font-medium md:col-span-2">
              Description (one bullet per line)
              <span className="block text-xs text-white font-normal">
                Short selling points; each line becomes a bullet on PDP/cart
              </span>
              <textarea
                name="description"
                value={descriptionValue}
                onChange={handleChange}
                rows={4}
                className="mt-1 w-full rounded border border-gray-200 bg-white/10 text-white placeholder-white/60 px-3 py-2 focus:border-white focus:outline-none"
              />
            </label>
            <label className="flex items-center gap-2 text-sm font-medium">
              <input
                type="checkbox"
                name="isActive"
                checked={formData.isActive}
                onChange={handleChange}
                className="h-4 w-4 rounded border border-gray-300 text-indigo-600 focus:ring-indigo-500"
              />
              Visible on storefront
            </label>
            <div className="md:col-span-1" />
            <div className="md:col-span-2 flex justify-end gap-3">
              <button
                type="button"
                onClick={resetForm}
                className="px-4 py-2 rounded-full border border-gray-300 text-gray-600 hover:bg-gray-100"
                disabled={submitting}
              >
                Reset
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="px-6 py-2 rounded-full bg-black text-white hover:bg-gray-900 disabled:opacity-50"
              >
                {submitting ? "Saving..." : editingId ? "Update" : "Create"}
              </button>
            </div>
          </form>
        </section>

        <section className="bg-white text-gray-900 rounded-2xl shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Inventory</h2>
            <span className="text-sm text-white">
              {adminProducts.length} product(s)
            </span>
          </div>
          {loading ? (
            <p className="text-white">Loading products…</p>
          ) : adminProducts.length === 0 ? (
            <p className="text-white">No products yet. Add one above.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead>
                  <tr className="text-left text-white">
                    <th className="py-2 pr-4 font-medium">Name</th>
                    <th className="py-2 pr-4 font-medium">Category</th>
                    <th className="py-2 pr-4 font-medium">Price</th>
                    <th className="py-2 pr-4 font-medium">Stock</th>
                    <th className="py-2 pr-4 font-medium">Active</th>
                    <th className="py-2 pr-4 font-medium text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {adminProducts.map((product) => (
                    <tr
                      key={product.id}
                      className="border-t border-gray-100 hover:bg-gray-50"
                    >
                      <td className="py-3 pr-4">
                        <p className="font-medium text-gray-900">
                          {product.name}
                        </p>
                        <p className="text-xs text-white truncate max-w-xs">
                          {product.image}
                        </p>
                      </td>
                      <td className="py-3 pr-4">{product.category}</td>
                      <td className="py-3 pr-4">
                        <span className="font-semibold">
                          ${product.offerPrice.toFixed(2)}
                        </span>{" "}
                        <span className="text-xs text-white line-through">
                          ${product.price.toFixed(2)}
                        </span>
                      </td>
                      <td className="py-3 pr-4">{product.stock ?? 0}</td>
                      <td className="py-3 pr-4">
                        <span
                          className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${
                            product.isActive
                              ? "bg-emerald-100 text-emerald-700"
                              : "bg-gray-200 text-gray-600"
                          }`}
                        >
                          {product.isActive ? "Visible" : "Hidden"}
                        </span>
                      </td>
                      <td className="py-3 pr-4 text-right">
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => handleEdit(product)}
                            className="text-indigo-600 hover:underline"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(product.id)}
                            className="text-red-600 hover:underline"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default AdminProducts;

