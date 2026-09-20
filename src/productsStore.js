import { useSyncExternalStore } from "react";

const STORAGE_KEY = "jamka_products";

export const CATEGORIES = [
  "Fertilizers",
  "Seeds",
  "Pesticides",
  "Insecticides",
  "Other",
];

const listeners = new Set();
let cache = null;

function read() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function getSnapshot() {
  if (cache === null) cache = read();
  return cache;
}

function write(products) {
  cache = products;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(products));
  } catch {
    // Ignore write errors (e.g. storage full or unavailable).
  }
  listeners.forEach((l) => l());
}

function subscribe(listener) {
  listeners.add(listener);
  const onStorage = (e) => {
    if (e.key === STORAGE_KEY) {
      cache = read();
      listeners.forEach((l) => l());
    }
  };
  window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", onStorage);
  };
}

function createId() {
  if (typeof crypto !== "undefined" && crypto.randomUUID) return crypto.randomUUID();
  return `p_${Date.now()}_${Math.random().toString(36).slice(2)}`;
}

export function addProduct(product) {
  const next = [
    {
      id: createId(),
      name: "",
      category: "Other",
      description: "",
      packaging: "",
      image: "",
      inStock: true,
      createdAt: Date.now(),
      ...product,
    },
    ...getSnapshot(),
  ];
  write(next);
}

export function deleteProduct(id) {
  write(getSnapshot().filter((p) => p.id !== id));
}

export function toggleStock(id) {
  write(getSnapshot().map((p) => (p.id === id ? { ...p, inStock: !p.inStock } : p)));
}

export function clearProducts() {
  write([]);
}

export function useProducts() {
  return useSyncExternalStore(subscribe, getSnapshot, getSnapshot);
}
