import React from "react";
import { CATEGORIES, useProducts } from "./productsStore";

function ProductCard({ product }) {
  return (
    <div className="product-item">
      <div className={`product-image${product.image ? "" : " no-image"}`}>
        {product.image ? (
          <img src={product.image || "/placeholder.svg"} alt={product.name} />
        ) : (
          <span className="product-image-placeholder" aria-hidden="true">
            {(product.name || "?").charAt(0).toUpperCase()}
          </span>
        )}
        <span className={`stock-badge ${product.inStock ? "in-stock" : "out-of-stock"}`}>
          {product.inStock ? "In Stock" : "Out of Stock"}
        </span>
      </div>
      <div className="product-details">
        <h3>{product.name}</h3>
        {product.description ? <p>{product.description}</p> : null}
        {product.packaging ? (
          <div className="product-specs">
            <p>
              <strong>Packaging:</strong> {product.packaging}
            </p>
          </div>
        ) : null}
      </div>
    </div>
  );
}

export default function DynamicProducts() {
  const products = useProducts();

  if (products.length === 0) {
    return (
      <div className="products-empty">
        <h2>No products available yet</h2>
        <p>
          Products added from the admin panel will appear here. Visit{" "}
          <a href="/admin">the admin panel</a> to add your first product.
        </p>
      </div>
    );
  }

  const grouped = CATEGORIES.map((category) => ({
    category,
    items: products.filter((p) => p.category === category),
  })).filter((group) => group.items.length > 0);

  return (
    <>
      {grouped.map((group) => (
        <div key={group.category} className="dynamic-category">
          <div className="section-title">
            <h2>{group.category}</h2>
          </div>
          <div className="products-grid">
            {group.items.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      ))}
    </>
  );
}
