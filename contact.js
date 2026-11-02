(() => {
    // -----------------------------------------
    // 1. Contact form feedback
    // -----------------------------------------

    const contactForm = document.getElementById("contact-form");
    const contactStatus = document.getElementById("contact-status");

    if (contactForm && contactStatus) {
        contactForm.addEventListener("submit", (event) => {
            event.preventDefault();

            contactStatus.textContent =
                "Thank you. Your message has been prepared. " +
                "We will contact you as soon as possible.";

            contactForm.reset();
        });
    }

    // -----------------------------------------
    // 2. Lebowakgomo location map
    // -----------------------------------------

    const mapContainer = document.getElementById("mnl-map");
    const mapStatus = document.getElementById("map-status");

    if (mapContainer) {
        if (typeof window.L === "undefined") {
            if (mapStatus) {
                mapStatus.textContent =
                    "The map could not load. " +
                    "Please check your internet connection.";
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
                .bindPopup(
                    "<strong>MNL Tyres</strong><br>" +
                    "Lebowakgomo, Limpopo"
                )
                .openPopup();

            tiles.on("tileerror", () => {
                if (mapStatus) {
                    mapStatus.textContent =
                        "Some map tiles could not load. " +
                        "Please check your internet connection.";
                }
            });
        }
    }
})();