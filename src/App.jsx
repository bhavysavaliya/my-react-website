import React, { useEffect, useState } from "react";
import { pages } from "./pages";

const routeNames = {
  "/": "Home",
  "/about": "About Us",
  "/products": "Products",
  "/services": "Services",
  "/gallery": "Gallery",
  "/contact": "Contact",
};

function normalizePath(pathname) {
  const p = pathname.replace(/\/+$/, "") || "/";
  const aliases = {
    "/About": "/about",
    "/Products": "/products",
    "/Services": "/services",
    "/Gallery": "/gallery",
    "/Contact": "/contact",
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

    const galleryHandler = (e) => {
      const item = e.target.closest?.(".gallery-item, .gallery-image, [data-gallery]");
      if (!item) return;
      const img = item.querySelector?.("img") || (item.tagName === "IMG" ? item : null);
      if (!img) return;
      // Use existing gallery modal if the original markup provides one.
      const modal = document.querySelector(".gallery-modal, #galleryModal, .lightbox");
      if (modal) {
        const modalImg = modal.querySelector("img");
        if (modalImg) modalImg.src = img.currentSrc || img.src;
        modal.classList.add("active", "show");
      }
    };
    document.addEventListener("click", galleryHandler);

    return () => {
      window.removeEventListener("popstate", onPop);
      document.removeEventListener("click", onClick);
      document.removeEventListener("click", galleryHandler);
      openBtn?.removeEventListener("click", openMenu);
      closeBtn?.removeEventListener("click", closeMenu);
    };
  }, [path]);

  const html = pages[path] || pages["/"];
  const title = routeNames[path] || "Jamka Agrofed";

  useEffect(() => {
    document.title = `${title} | Jamka Agrofed Producer Company Limited`;
  }, [title]);

  return (
    <div className="react-migration-root" dangerouslySetInnerHTML={{ __html: html }} />
  );
}
