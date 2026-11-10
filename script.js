/* =========================================
   CS — 3D ARTIST PORTFOLIO
   VERSIÓN OPTIMIZADA
========================================= */

document.addEventListener("DOMContentLoaded", () => {

    /* =========================================
       MOBILE MENU
    ========================================= */

    const menuToggle = document.getElementById("menuToggle");
    const navMenu = document.getElementById("navMenu");

    if (menuToggle && navMenu) {

        menuToggle.addEventListener("click", () => {
            const isOpen = navMenu.classList.toggle("active");
            menuToggle.setAttribute("aria-expanded", String(isOpen));
        });

        navMenu.querySelectorAll("a").forEach(link => {
            link.addEventListener("click", () => {
                navMenu.classList.remove("active");
                menuToggle.setAttribute("aria-expanded", "false");
            });
        });
    }


    /* =========================================
       CURRENT YEAR
    ========================================= */

    const year = document.getElementById("year");

    if (year) {
        year.textContent = new Date().getFullYear();
    }


    /* =========================================
       IMAGE FALLBACK
    ========================================= */

    document.querySelectorAll(".project-media img").forEach(img => {

        const fallback = img.parentElement.querySelector(".media-fallback");

        const hideFallback = () => {
            if (fallback) fallback.style.opacity = "0";
        };

        const showFallback = () => {
            if (fallback) fallback.style.opacity = "1";
            img.style.display = "none";
        };

        img.addEventListener("load", hideFallback);
        img.addEventListener("error", showFallback);

        if (img.complete && img.naturalWidth > 0) {
            hideFallback();
        }
    });


    /* =========================================
       SCROLL REVEAL
    ========================================= */

    const revealElements = document.querySelectorAll(".reveal");

    if ("IntersectionObserver" in window) {

        const observer = new IntersectionObserver(
            entries => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add("show");
                        observer.unobserve(entry.target);
                    }
                });
            },
            { threshold: 0.08 }
        );

        revealElements.forEach(element => observer.observe(element));

    } else {
        revealElements.forEach(element => element.classList.add("show"));
    }


    /* =========================================
       SCROLL PROGRESS
       - Usa transform (no provoca reflow)
       - Limitado a 1 actualización por frame
    ========================================= */

    const progress = document.getElementById("scrollProgress");

    if (progress) {

        let ticking = false;

        const updateProgress = () => {

            const scrollable =
                document.documentElement.scrollHeight - window.innerHeight;

            const ratio =
                scrollable > 0
                    ? Math.min(Math.max(window.scrollY / scrollable, 0), 1)
                    : 0;

            progress.style.transform = `scaleX(${ratio})`;

            ticking = false;
        };

        const requestUpdate = () => {
            if (!ticking) {
                ticking = true;
                requestAnimationFrame(updateProgress);
            }
        };

        window.addEventListener("scroll", requestUpdate, { passive: true });
        window.addEventListener("resize", requestUpdate, { passive: true });

        updateProgress();
    }


    /* =========================================
       PROJECT FILTER
    ========================================= */

    const filters = document.querySelectorAll(".filter");
    const projects = document.querySelectorAll(".small-card");

    filters.forEach(filter => {

        filter.addEventListener("click", () => {

            filters.forEach(button => button.classList.remove("active"));
            filter.classList.add("active");

            const selectedFilter = filter.dataset.filter;

            projects.forEach(project => {

                const visible =
                    selectedFilter === "all" ||
                    project.dataset.category === selectedFilter;

                project.classList.toggle("is-hidden", !visible);
            });
        });
    });


    const projectCards = document.querySelectorAll(".project-card");

    /* =========================================
       3D VIEWER EN LAS TARJETAS (Sketchfab)
       - Se carga solo al presionar "Girar en 3D"
       - Solo un modelo activo a la vez
    ========================================= */

    // El ID de Sketchfab son los últimos 32 caracteres hexadecimales de la URL
    const getSketchfabId = url => {
        const match = (url || "").match(/([0-9a-f]{32})\/?(?:[?#].*)?$/i);
        return match ? match[1] : null;
    };

    let activeViewerCard = null;

    const closeCardViewer = card => {

        const viewer = card.querySelector(".card-viewer");

        // Quitar el iframe libera la memoria del modelo
        if (viewer) viewer.remove();

        card.classList.remove("is-viewing");

        if (activeViewerCard === card) activeViewerCard = null;
    };

    const openCardViewer = (card, modelId) => {

        const media = card.querySelector(".project-media");

        if (!media) return;

        if (activeViewerCard && activeViewerCard !== card) {
            closeCardViewer(activeViewerCard);
        }

        const wrapper = document.createElement("div");
        wrapper.className = "card-viewer";

        const iframe = document.createElement("iframe");
        iframe.title = `Modelo 3D: ${card.dataset.title || "proyecto"}`;
        iframe.allow = "autoplay; fullscreen; xr-spatial-tracking";
        iframe.allowFullscreen = true;
        iframe.src =
            `https://sketchfab.com/models/${modelId}/embed` +
            "?autostart=1&ui_theme=dark&ui_infos=0&dnt=1";

        const closeButton = document.createElement("button");
        closeButton.type = "button";
        closeButton.className = "card-viewer-close";
        closeButton.textContent = "✕ Cerrar 3D";

        closeButton.addEventListener("click", event => {
            event.stopPropagation();
            closeCardViewer(card);
        });

        wrapper.append(iframe, closeButton);
        media.appendChild(wrapper);

        card.classList.add("is-viewing");
        activeViewerCard = card;
    };

    projectCards.forEach(card => {

        const modelId = getSketchfabId(card.dataset.sketchfab);
        const media = card.querySelector(".project-media");

        if (!modelId || !media) return;

        const button = document.createElement("button");
        button.type = "button";
        button.className = "card-3d-button";
        button.textContent = "Girar en 3D";

        button.addEventListener("click", event => {
            // Evita que el click llegue a la tarjeta
            event.stopPropagation();
            openCardViewer(card, modelId);
        });

        media.appendChild(button);
    });

});
