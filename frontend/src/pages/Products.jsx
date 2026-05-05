import React, { useCallback, useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import ProductCard from "../components/ProductCard";
import { productApi } from "../api/productApi";
import cherrysetImg from "../images/bluecherry.webp";
import blacknailImg from "../images/black.jpg";
import bridalImg from "../images/ivorybridali.jpeg";
import customNailsImg from "../images/custom1.jpg";

const FALLBACK_PRODUCTS = [
  {
    _id: null,
    name: "Blue Cherry Blossom Set",
    category: "Short",
    price: 549,
    originalPrice: 699,
    image: cherrysetImg,
  },
  {
    _id: null,
    name: "Midnight Noir Set",
    category: "Long",
    price: 599,
    originalPrice: 799,
    image: blacknailImg,
  },
  {
    _id: null,
    name: "Ivory Bridal Set",
    category: "Bridal",
    price: 699,
    originalPrice: 899,
    image: bridalImg,
  },
  {
    _id: null,
    name: "Custom Moodboard Set",
    category: "Custom",
    price: 749,
    originalPrice: null,
    image: customNailsImg,
  },
];

const Products = () => {
  const [searchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [displayProducts, setDisplayProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [query, setQuery] = useState("");
  const [sortBy, setSortBy] = useState("relevance");
  const [priceBand, setPriceBand] = useState("all");
  const [usingFallback, setUsingFallback] = useState(false);

  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      setError("");
      const category = searchParams.get("category") || "";
      const data = await productApi.getProducts({ page: 1, limit: 24, category });
      setProducts(data.products || []);
      setUsingFallback(false);
    } catch (err) {
      setProducts(FALLBACK_PRODUCTS);
      setUsingFallback(true);
      setError("Live products are temporarily unavailable. Showing curated sets.");
    } finally {
      setLoading(false);
    }
  }, [searchParams]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  useEffect(() => {
    let filtered = [...products];

    if (query.trim()) {
      const q = query.trim().toLowerCase();
      filtered = filtered.filter(
        (item) =>
          item?.name?.toLowerCase().includes(q) ||
          item?.title?.toLowerCase().includes(q)
      );
    }

    if (priceBand === "under500") {
      filtered = filtered.filter((item) => Number(item.price) < 500);
    } else if (priceBand === "500to700") {
      filtered = filtered.filter(
        (item) => Number(item.price) >= 500 && Number(item.price) <= 700
      );
    } else if (priceBand === "above700") {
      filtered = filtered.filter((item) => Number(item.price) > 700);
    }

    if (sortBy === "priceLowHigh") {
      filtered.sort((a, b) => Number(a.price) - Number(b.price));
    } else if (sortBy === "priceHighLow") {
      filtered.sort((a, b) => Number(b.price) - Number(a.price));
    } else if (sortBy === "nameAsc") {
      filtered.sort((a, b) => (a.name || "").localeCompare(b.name || ""));
    }

    setDisplayProducts(filtered);
  }, [products, query, sortBy, priceBand]);

  const clearFilters = () => {
    setQuery("");
    setSortBy("relevance");
    setPriceBand("all");
  };

  return (
    <div className="stack-md page-shell">
      <h2>Our Products</h2>
      <p className="muted">
        Discover handcrafted press-on nails across daily wear, bridal, and custom
        collections.
      </p>
      <section className="panel stack-sm">
        <div className="toolbar">
          <label>
            Search
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by product name"
            />
          </label>
          <label>
            Sort
            <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
              <option value="relevance">Relevance</option>
              <option value="priceLowHigh">Price: Low to High</option>
              <option value="priceHighLow">Price: High to Low</option>
              <option value="nameAsc">Name: A to Z</option>
            </select>
          </label>
          <label>
            Price
            <select value={priceBand} onChange={(e) => setPriceBand(e.target.value)}>
              <option value="all">All ranges</option>
              <option value="under500">Under ₹500</option>
              <option value="500to700">₹500 - ₹700</option>
              <option value="above700">Above ₹700</option>
            </select>
          </label>
          <div className="toolbar-actions">
            <button className="btn-ghost" onClick={clearFilters} type="button">
              Reset
            </button>
          </div>
        </div>
        <p className="muted">
          Showing {displayProducts.length} of {products.length} products
        </p>
      </section>
      {loading && <p>Loading products...</p>}
      {error ? (
        <section className="panel stack-sm">
          <p className="text-danger">{error}</p>
          {usingFallback ? (
            <button type="button" className="btn-secondary" onClick={fetchProducts}>
              Try live products again
            </button>
          ) : null}
        </section>
      ) : null}
      <div className="product-grid">
        {displayProducts.map((product) => (
          <ProductCard key={product._id || product.name} product={product} />
        ))}
      </div>
      {!loading && !error && !displayProducts.length ? (
        <section className="panel">
          <h4>No products match your filters</h4>
          <p className="muted">Try changing search, sort, or price range.</p>
        </section>
      ) : null}
    </div>
  );
};

export default Products;