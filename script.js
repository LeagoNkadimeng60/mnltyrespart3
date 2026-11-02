"use strict";

(() => {
    const reducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
    );

    // -----------------------------------------
    // 1. Reusable entrance animation
    // -----------------------------------------

    function animateEntrance(element) {
        if (
            !element ||
            reducedMotion.matches ||
            typeof element.animate !== "function"
        ) {
            return;
        }

        element.animate(
            [
                {
                    opacity: 0,
                    transform: "translateY(12px)"
                },
                {
                    opacity: 1,
                    transform: "translateY(0)"
                }
            ],
            {
                duration: 280,
                easing: "ease-out"
            }
        );
    }

    // -----------------------------------------
    // 2. Service accordion
    // -----------------------------------------

    const serviceButtons = document.querySelectorAll(
        ".service-toggle"
    );

    serviceButtons.forEach((button) => {
        const panel = document.getElementById(
            button.getAttribute("aria-controls")
        );

        if (!panel) return;

        panel.hidden = true;
        button.setAttribute("aria-expanded", "false");

        button.addEventListener("click", () => {
            const wasOpen =
                button.getAttribute("aria-expanded") === "true";

            // Close all service panels.
            serviceButtons.forEach((otherButton) => {
                const otherPanel = document.getElementById(
                    otherButton.getAttribute("aria-controls")
                );

                otherButton.setAttribute(
                    "aria-expanded",
                    "false"
                );

                if (otherPanel) {
                    otherPanel.hidden = true;
                }
            });

            // Open the selected panel unless it was already open.
            if (!wasOpen) {
                button.setAttribute("aria-expanded", "true");
                panel.hidden = false;
                animateEntrance(panel);
            }
        });
    });

    // -----------------------------------------
    // 3. Gallery images
    // -----------------------------------------

    const galleryItems = [
        {
            src: "tyrefitted.jpg",
            alt: "A tyre fitted to a vehicle wheel",
            caption: "Tyre fitted to a vehicle wheel",
            category: "tyres"
        },
        {
            src:  "MNL logo.jpeg",
            alt: "MNL Tyres logo",
            caption: "MNL Tyres branding",
            category: "brand"
        }
    ];

    const gallery = document.getElementById("mnl-gallery");
    const filter = document.getElementById("gallery-filter");
    const galleryStatus = document.getElementById(
        "gallery-status"
    );

    const lightbox = document.getElementById(
        "gallery-lightbox"
    );
    const lightboxImage = document.getElementById(
        "lightbox-image"
    );
    const lightboxCaption = document.getElementById(
        "lightbox-caption"
    );
    const closeButton = document.getElementById(
        "lightbox-close"
    );
    const previousButton = document.getElementById(
        "lightbox-previous"
    );
    const nextButton = document.getElementById(
        "lightbox-next"
    );

    let visibleItems = [...galleryItems];
    let currentIndex = 0;
    let openingButton = null;

    if (
        gallery &&
        filter &&
        galleryStatus &&
        lightbox &&
        lightboxImage &&
        lightboxCaption &&
        closeButton &&
        previousButton &&
        nextButton
    ) {
        function renderGallery(category) {
            visibleItems = galleryItems.filter((item) => {
                return (
                    category === "all" ||
                    item.category === category
                );
            });

            const fragment = document.createDocumentFragment();

            visibleItems.forEach((item, index) => {
                const button = document.createElement("button");

                button.type = "button";
                button.className = "gallery-card";
                button.dataset.index = String(index);

                button.setAttribute("aria-haspopup", "dialog");
                button.setAttribute(
                    "aria-label",
                    `Enlarge: ${item.caption}`
                );

                const image = document.createElement("img");

                image.src = item.src;
                image.alt = item.alt;
                image.loading = "lazy";

                const title = document.createElement("span");
                title.textContent = item.caption;

                button.append(image, title);
                fragment.append(button);
            });

            gallery.replaceChildren(fragment);

            const count = visibleItems.length;

            galleryStatus.textContent =
                `${count} image${count === 1 ? "" : "s"} displayed.`;

            animateEntrance(gallery);
        }

        // -----------------------------------------
        // 4. Lightbox
        // -----------------------------------------

        function displayImage(index) {
            if (visibleItems.length === 0) return;

            currentIndex =
                (index + visibleItems.length) %
                visibleItems.length;

            const item = visibleItems[currentIndex];

            lightboxImage.src = item.src;
            lightboxImage.alt = item.alt;

            lightboxCaption.textContent =
                `${item.caption} ` +
                `(${currentIndex + 1} of ${visibleItems.length})`;

            previousButton.disabled = visibleItems.length < 2;
            nextButton.disabled = visibleItems.length < 2;
        }

        gallery.addEventListener("click", (event) => {
            const button = event.target.closest(".gallery-card");

            if (!button || !gallery.contains(button)) return;

            openingButton = button;

            displayImage(Number(button.dataset.index));

            lightbox.showModal();
            animateEntrance(lightboxImage);
        });

        filter.addEventListener("change", () => {
            renderGallery(filter.value);
        });

        closeButton.addEventListener("click", () => {
            lightbox.close();
        });

        previousButton.addEventListener("click", () => {
            displayImage(currentIndex - 1);
        });

        nextButton.addEventListener("click", () => {
            displayImage(currentIndex + 1);
        });

        lightbox.addEventListener("keydown", (event) => {
            if (event.key === "ArrowLeft") {
                event.preventDefault();
                displayImage(currentIndex - 1);
            }

            if (event.key === "ArrowRight") {
                event.preventDefault();
                displayImage(currentIndex + 1);
            }
        });

        lightbox.addEventListener("close", () => {
            if (openingButton && openingButton.isConnected) {
                openingButton.focus();
            }
        });

        renderGallery("all");
    }

    // -----------------------------------------
    // 5. Welcome image animation
    // -----------------------------------------

    animateEntrance(document.querySelector(".hero-image"));

    // -----------------------------------------
    // 6. Interactive map
    // -----------------------------------------

   const mapContainer = document.getElementById("mnl-map");
const mapStatus = document.getElementById("map-status");

if (mapContainer) {
    if (typeof window.L === "undefined") {
        if (mapStatus) {
            mapStatus.textContent =
                "The map could not load. " +
                "Check your internet connection.";
        }
    } else {
        // MNL Tyres location: Lebowakgomo, Limpopo.
        const mnlLocation = [-24.305, 29.565];

        const map = L.map("mnl-map").setView(
            mnlLocation,
            14
        );

        const tiles = L.tileLayer(
            "https://tile.openstreetmap.org/{z}/{x}/{y}.png",
            {
                maxZoom: 19,
                attribution:
                    '&copy; <a href="' +
                    'https://www.openstreetmap.org/copyright">' +
                    "OpenStreetMap</a> contributors"
            }
        );

        tiles.addTo(map);

        L.marker(mnlLocation)
            .addTo(map)
            .bindPopup("MNL Tyres — Lebowakgomo")
            .openPopup();

        tiles.on("tileerror", () => {
            if (mapStatus) {
                mapStatus.textContent =
                    "Some map tiles could not load. " +
                    "Check your internet connection.";
            }
        });
    }
}