/* =========================================
   CS — 3D ARTIST PORTFOLIO V2
========================================= */

document.addEventListener("DOMContentLoaded", () => {

    /* =========================================
       MOBILE MENU
    ========================================= */

    const menuToggle = document.getElementById("menuToggle");
    const navMenu = document.getElementById("navMenu");

    if (menuToggle && navMenu) {

        menuToggle.addEventListener("click", () => {

            const isOpen =
                navMenu.classList.toggle("active");

            menuToggle.setAttribute(
                "aria-expanded",
                String(isOpen)
            );

        });


        navMenu.querySelectorAll("a").forEach(link => {

            link.addEventListener("click", () => {

                navMenu.classList.remove("active");

                menuToggle.setAttribute(
                    "aria-expanded",
                    "false"
                );

            });

        });

    }


    /* =========================================
       CURRENT YEAR
    ========================================= */

    const year = document.getElementById("year");

    if (year) {

        year.textContent =
            new Date().getFullYear();

    }


    /* =========================================
       IMAGE FALLBACK
       Keeps the layout clean until the user
       adds the project images.
    ========================================= */

    document
        .querySelectorAll(".project-media img")
        .forEach(img => {

            const fallback =
                img.parentElement.querySelector(
                    ".media-fallback"
                );


            const hideFallback = () => {

                if (fallback) {
                    fallback.style.opacity = "0";
                }

            };


            const showFallback = () => {

                if (fallback) {
                    fallback.style.opacity = "1";
                }

                img.style.display = "none";

            };


            img.addEventListener(
                "load",
                hideFallback
            );


            img.addEventListener(
                "error",
                showFallback
            );


            if (
                img.complete &&
                img.naturalWidth > 0
            ) {

                hideFallback();

            }

        });


    /* =========================================
       SCROLL REVEAL
    ========================================= */

    const revealElements =
        document.querySelectorAll(".reveal");


    if ("IntersectionObserver" in window) {

        const observer =
            new IntersectionObserver(

                entries => {

                    entries.forEach(entry => {

                        if (
                            entry.isIntersecting
                        ) {

                            entry.target.classList.add(
                                "show"
                            );

                            observer.unobserve(
                                entry.target
                            );

                        }

                    });

                },

                {
                    threshold: 0.08
                }

            );


        revealElements.forEach(element => {

            observer.observe(element);

        });


    } else {

        revealElements.forEach(element => {

            element.classList.add("show");

        });

    }


    /* =========================================
       SCROLL PROGRESS
    ========================================= */

    const progress =
        document.getElementById(
            "scrollProgress"
        );


    const updateProgress = () => {

        const scrollTop =
            window.scrollY;


        const documentHeight =
            document.documentElement.scrollHeight -
            window.innerHeight;


        const percentage =
            documentHeight > 0
                ? (scrollTop / documentHeight) * 100
                : 0;


        if (progress) {

            progress.style.width =
                `${percentage}%`;

        }

    };


    window.addEventListener(
        "scroll",
        updateProgress,
        {
            passive: true
        }
    );


    updateProgress();


    /* =========================================
       PROJECT FILTER
    ========================================= */

    const filters =
        document.querySelectorAll(".filter");


    const projects =
        document.querySelectorAll(".small-card");


    filters.forEach(filter => {

        filter.addEventListener(
            "click",
            () => {

                filters.forEach(button => {

                    button.classList.remove(
                        "active"
                    );

                });


                filter.classList.add(
                    "active"
                );


                const selectedFilter =
                    filter.dataset.filter;


                projects.forEach(project => {

                    const category =
                        project.dataset.category;


                    if (
                        selectedFilter === "all" ||
                        category === selectedFilter
                    ) {

                        project.classList.remove(
                            "is-hidden"
                        );

                    } else {

                        project.classList.add(
                            "is-hidden"
                        );

                    }

                });

            }
        );

    });


    /* =========================================
       PROJECT MODAL
    ========================================= */

    const modal =
        document.getElementById(
            "projectModal"
        );


    const modalClose =
        document.getElementById(
            "modalClose"
        );


    const modalTitle =
        document.getElementById(
            "modalTitle"
        );


    const modalRole =
        document.getElementById(
            "modalRole"
        );


    const modalDescription =
        document.getElementById(
            "modalDescription"
        );


    const modalMetaRole =
        document.getElementById(
            "modalMetaRole"
        );


    const modalTools =
        document.getElementById(
            "modalTools"
        );


    const modalSketchfab =
        document.getElementById(
            "modalSketchfab"
        );


    const projectCards =
        document.querySelectorAll(
            ".project-card"
        );


    const openModal = card => {

        if (!modal) return;


        if (modalTitle) {

            modalTitle.textContent =
                card.dataset.title ||
                "Project";

        }


        if (modalRole) {

            modalRole.textContent =
                card.dataset.category
                    ? card.dataset.category
                        .replace("-", " ")
                        .toUpperCase()
                    : "PROJECT";

        }


        if (modalDescription) {

            modalDescription.textContent =
                card.dataset.description ||
                "Descripción pendiente.";

        }


        if (modalMetaRole) {

            modalMetaRole.textContent =
                card.dataset.role ||
                "3D Artist";

        }


        if (modalTools) {

            modalTools.textContent =
                card.dataset.tools ||
                "Blender";

        }


        const sketchfabURL =
            card.dataset.sketchfab;


        if (modalSketchfab) {

            if (sketchfabURL) {

                modalSketchfab.href =
                    sketchfabURL;


                modalSketchfab.removeAttribute(
                    "aria-disabled"
                );


                modalSketchfab.textContent =
                    "Ver proyecto en Sketchfab ↗";


            } else {

                modalSketchfab.href = "#";


                modalSketchfab.setAttribute(
                    "aria-disabled",
                    "true"
                );


                modalSketchfab.textContent =
                    "Sketchfab — enlace pendiente";

            }

        }


        modal.classList.add("active");


        modal.setAttribute(
            "aria-hidden",
            "false"
        );


        document.body.classList.add(
            "modal-open"
        );

    };


    const closeModal = () => {

        if (!modal) return;


        modal.classList.remove(
            "active"
        );


        modal.setAttribute(
            "aria-hidden",
            "true"
        );


        document.body.classList.remove(
            "modal-open"
        );

    };


    projectCards.forEach(card => {

        card.addEventListener(
            "click",
            event => {

                /*
                 * Prevent the modal from triggering twice if
                 * a future external link is added inside a card.
                 */

                if (
                    event.target.closest("a")
                ) {

                    return;

                }


                openModal(card);

            }
        );

    });


    if (modalClose) {

        modalClose.addEventListener(
            "click",
            closeModal
        );

    }


    document
        .querySelectorAll("[data-close-modal]")
        .forEach(element => {

            element.addEventListener(
                "click",
                closeModal
            );

        });


    document.addEventListener(
        "keydown",
        event => {

            if (event.key === "Escape") {

                closeModal();

            }

        }
    );

});