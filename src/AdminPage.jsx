import React, { useState } from "react";
import {
  CATEGORIES,
  useProducts,
  addProduct,
  deleteProduct,
  toggleStock,
  clearProducts,
} from "./productsStore";

const emptyForm = {
  name: "",
  category: "Fertilizers",
  description: "",
  packaging: "",
  image: "",
  inStock: true,
};

export default function AdminPage() {
  const products = useProducts();
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState("");

  const update = (field) => (e) => {
    const value = e.target.type === "checkbox" ? e.target.checked : e.target.value;
    setForm((f) => ({ ...f, [field]: value }));
  };

  const onSubmit = (e) => {
    e.preventDefault();
    if (!form.name.trim()) {
      setError("Product name is required.");
      return;
    }
    addProduct({
      name: form.name.trim(),
      category: form.category,
      description: form.description.trim(),
      packaging: form.packaging.trim(),
      image: form.image.trim(),
      inStock: form.inStock,
    });
    setForm(emptyForm);
    setError("");
  };

  return (
    <div className="admin-page">
      <header className="admin-header">
        <div className="admin-header-inner">
          <div>
            <h1>Product Admin</h1>
            <p>Add products and manage availability for the Products page.</p>
          </div>
          <a className="admin-back-link" href="/">
            View Website
          </a>
        </div>
      </header>

      <main className="admin-main">
        <section className="admin-card">
          <h2>Add a Product</h2>
          <form className="admin-form" onSubmit={onSubmit}>
            <div className="admin-field">
              <label htmlFor="name">Product Name *</label>
              <input
                id="name"
                type="text"
                value={form.name}
                onChange={update("name")}
                placeholder="e.g. Urea"
              />
            </div>

            <div className="admin-field">
              <label htmlFor="category">Category</label>
              <select id="category" value={form.category} onChange={update("category")}>
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            <div className="admin-field admin-field-full">
              <label htmlFor="description">Description</label>
              <textarea
                id="description"
                rows={3}
                value={form.description}
                onChange={update("description")}
                placeholder="Short description of the product"
              />
            </div>

            <div className="admin-field">
              <label htmlFor="packaging">Packaging</label>
              <input
                id="packaging"
                type="text"
                value={form.packaging}
                onChange={update("packaging")}
                placeholder="e.g. 50kg bags"
              />
            </div>

            <div className="admin-field">
              <label htmlFor="image">Image URL</label>
              <input
                id="image"
                type="text"
                value={form.image}
                onChange={update("image")}
                placeholder="assets/images/urea.jpg or https://..."
              />
            </div>

            <div className="admin-field admin-field-checkbox">
              <label htmlFor="inStock">
                <input
                  id="inStock"
                  type="checkbox"
                  checked={form.inStock}
                  onChange={update("inStock")}
                />
                Stock available
              </label>
            </div>

            {error ? <p className="admin-error">{error}</p> : null}

            <div className="admin-form-actions">
              <button type="submit" className="admin-btn admin-btn-primary">
                Add Product
              </button>
            </div>
          </form>
        </section>

        <section className="admin-card">
          <div className="admin-list-header">
            <h2>Products ({products.length})</h2>
            {products.length > 0 ? (
              <button
                type="button"
                className="admin-btn admin-btn-danger-outline"
                onClick={() => {
                  if (window.confirm("Remove all products?")) clearProducts();
                }}
              >
                Clear All
              </button>
            ) : null}
          </div>

          {products.length === 0 ? (
            <p className="admin-empty">No products yet. Add one using the form above.</p>
          ) : (
            <ul className="admin-list">
              {products.map((p) => (
                <li key={p.id} className="admin-list-item">
                  <div className="admin-list-thumb">
                    {p.image ? (
                      <img src={p.image || "/placeholder.svg"} alt={p.name} />
                    ) : (
                      <span aria-hidden="true">{(p.name || "?").charAt(0).toUpperCase()}</span>
                    )}
                  </div>
                  <div className="admin-list-info">
                    <strong>{p.name}</strong>
                    <span className="admin-list-meta">{p.category}</span>
                    {p.packaging ? (
                      <span className="admin-list-meta">{p.packaging}</span>
                    ) : null}
                  </div>
                  <span
                    className={`stock-badge ${p.inStock ? "in-stock" : "out-of-stock"}`}
                  >
                    {p.inStock ? "In Stock" : "Out of Stock"}
                  </span>
                  <div className="admin-list-actions">
                    <button
                      type="button"
                      className="admin-btn admin-btn-small"
                      onClick={() => toggleStock(p.id)}
                    >
                      Mark {p.inStock ? "Out of Stock" : "In Stock"}
                    </button>
                    <button
                      type="button"
                      className="admin-btn admin-btn-small admin-btn-danger"
                      onClick={() => deleteProduct(p.id)}
                    >
                      Delete
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>
      </main>
    </div>
  );
}
