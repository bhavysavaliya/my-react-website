import React, { useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import { pages } from "./pages";
import AdminPage from "./AdminPage";
import DynamicProducts from "./DynamicProducts";

const routeNames = {
  "/": "Home",
  "/about": "About Us",
  "/products": "Products",
  "/services": "Services",
  "/gallery": "Gallery",
  "/contact": "Contact",
  "/admin": "Admin",
};

function normalizePath(pathname) {
  const p = pathname.replace(/\/+$/, "") || "/";
  const aliases = {
    "/About": "/about",
    "/Products": "/products",
    "/Services": "/services",
    "/Gallery": "/gallery",
    "/Contact": "/contact",
    "/Admin": "/admin",
    "/index.html": "/",
  };
  return aliases[p] || p;
}

export default function App() {
  const [path, setPath] = useState(() => normalizePath(window.location.pathname));

  useEffect(() => {
    const onPop = () => setPath(normalizePath(window.location.pathname));
    window.addEventListener("popstate", onPop);

    const onClick = (event) => {
      const anchor = event.target.closest?.("a");
      if (!anchor) return;
      const href = anchor.getAttribute("href");
      if (!href || href.startsWith("#") || href.startsWith("mailto:") || href.startsWith("tel:")) return;

      let url;
      try { url = new URL(href, window.location.origin); } catch { return; }
      if (url.origin !== window.location.origin) return;

      const next = normalizePath(url.pathname);
      if (!routeNames[next]) return;

      event.preventDefault();
      window.history.pushState({}, "", next);
      setPath(next);
      window.scrollTo({ top: 0, behavior: "smooth" });
    };

    document.addEventListener("click", onClick);

    // The original site used main.js/gallery.js. This lightweight React
    // delegation keeps the existing HTML/CSS while restoring mobile menu,
    // gallery lightbox, and smooth internal navigation.
    const mobileMenu = document.getElementById("mobileMenu");
    const openBtn = document.getElementById("mobileMenuBtn");
    const closeBtn = document.getElementById("closeMobileMenu");

    const openMenu = () => mobileMenu?.classList.add("active");
    const closeMenu = () => mobileMenu?.classList.remove("active");
    openBtn?.addEventListener("click", openMenu);
    closeBtn?.addEventListener("click", closeMenu);

    // The gallery modal markup (#galleryModal) is shown via `display`, not a
    // CSS class, so drive it directly here to match the original site behavior.
    const getModal = () => document.getElementById("galleryModal");

    const closeGalleryModal = () => {
      const modal = getModal();
      if (!modal) return;
      modal.style.display = "none";
      document.body.style.overflow = "";
    };

    const galleryHandler = (e) => {
      // Close when clicking the close button or the modal backdrop.
      const modal = getModal();
      if (modal && modal.style.display === "flex") {
        if (e.target.closest?.("#closeGalleryModal") || e.target === modal) {
          closeGalleryModal();
          return;
        }
      }

      const item = e.target.closest?.(".gallery-item, .gallery-image, [data-gallery]");
      if (!item) return;
      const img = item.querySelector?.("img") || (item.tagName === "IMG" ? item : null);
      if (!img || !modal) return;

      const modalImg = modal.querySelector("#modalImage") || modal.querySelector("img");
      if (modalImg) {
        modalImg.src = img.currentSrc || img.src;
        modalImg.alt = img.alt || "";
      }

      const caption = modal.querySelector("#modalCaption");
      if (caption) {
        const title = img.getAttribute("data-caption-title");
        const desc = img.getAttribute("data-caption-desc");
        caption.innerHTML = title && desc ? `<h3>${title}</h3><p>${desc}</p>` : img.alt || "";
      }

      modal.style.display = "flex";
      document.body.style.overflow = "hidden";
    };
    document.addEventListener("click", galleryHandler);

    const onKeyDown = (event) => {
      if (event.key === "Escape") closeGalleryModal();
    };
    document.addEventListener("keydown", onKeyDown);

    return () => {
      window.removeEventListener("popstate", onPop);
      document.removeEventListener("click", onClick);
      document.removeEventListener("click", galleryHandler);
      document.removeEventListener("keydown", onKeyDown);
      openBtn?.removeEventListener("click", openMenu);
      closeBtn?.removeEventListener("click", closeMenu);
    };
  }, [path]);

  // Mount the dynamic product grid into the Products page markup, which is
  // injected as static HTML via dangerouslySetInnerHTML.
  useEffect(() => {
    if (path !== "/products") return;
    const mount = document.getElementById("dynamic-products-root");
    if (!mount) return;
    const root = createRoot(mount);
    root.render(<DynamicProducts />);
    return () => {
      // Defer unmount so it doesn't run during React's render/commit phase.
      queueMicrotask(() => root.unmount());
    };
  }, [path]);

  const title = routeNames[path] || "Jamka Agrofed";

  useEffect(() => {
    document.title = `${title} | Jamka Agrofed Producer Company Limited`;
  }, [title]);

  if (path === "/admin") {
    return <AdminPage />;
  }

  const html = pages[path] || pages["/"];

  return (
    <div className="react-migration-root" dangerouslySetInnerHTML={{ __html: html }} />
  );
}
