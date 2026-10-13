
document.addEventListener("DOMContentLoaded", () => {

    // 1. DARK MODE
    const themeToggle = document.getElementById("theme-toggle");

    try {
        const savedTheme = localStorage.getItem("portfolio-theme");

        document.body.classList.toggle(
            "dark-mode",
            savedTheme === "dark"
        );
    } catch (error) {
        console.warn("Could not restore saved theme.", error);
    }

    function updateThemeIcon() {
        if (!themeToggle) return;

        themeToggle.textContent =
            document.body.classList.contains("dark-mode") ? "☾" : "☀";
    }

    updateThemeIcon();

    if (themeToggle) {
        themeToggle.addEventListener("click", () => {
            document.body.classList.toggle("dark-mode");

            const isDark =
                document.body.classList.contains("dark-mode");

            updateThemeIcon();

            try {
                localStorage.setItem(
                    "portfolio-theme",
                    isDark ? "dark" : "light"
                );
            } catch (error) {
                console.warn("Could not save theme.", error);
            }
        });
    }


    // 2. SLIDER AND NAVIGATION
    const slider = document.querySelector(".page-slider");

    if (!slider) return;

    const sections = Array.from(
        slider.querySelectorAll(":scope > section")
    );

    const navLinks = document.querySelectorAll(".nav-links a");
    const heroButton = document.querySelector(".hero-btn");
    const menuToggle = document.querySelector(".menu-toggle");
    const mobileNav = document.querySelector(".nav-links");

    const mobileQuery = window.matchMedia("(max-width: 768px)");

    let currentSectionIndex = 0;
    let wasMobile = mobileQuery.matches;
    let resizeTimer;

    function isMobile() {
        return mobileQuery.matches;
    }

    function closeMobileMenu() {
        if (mobileNav) {
            mobileNav.classList.remove("active");
        }

        if (menuToggle) {
            menuToggle.classList.remove("is-open");
            menuToggle.setAttribute("aria-expanded", "false");
        }
    }

    function getSectionIndex(section) {
        return sections.indexOf(section);
    }

    function getVisibleMobileSection() {
        const viewportCenter = window.innerHeight / 2;
        let bestIndex = 0;
        let smallestDistance = Infinity;

        sections.forEach((section, index) => {
            const rect = section.getBoundingClientRect();

            // Find the section closest to the center of the viewport.
            const sectionCenter = rect.top + rect.height / 2;
            const distance = Math.abs(sectionCenter - viewportCenter);

            if (distance < smallestDistance) {
                smallestDistance = distance;
                bestIndex = index;
            }
        });

        return bestIndex;
    }

    function goToSection(index, behavior = "smooth") {
        if (index < 0 || index >= sections.length) return;

        currentSectionIndex = index;

        if (isMobile()) {
            slider.style.setProperty("transform", "none", "important");

            sections[index].scrollIntoView({
                behavior,
                block: "start"
            });
        } else {
            // Keep the slider in normal desktop layout.
            slider.style.removeProperty("transform");

            slider.style.transform =
                `translateX(-${index * 100}vw)`;
        }

        closeMobileMenu();
    }


    // 3. NAVIGATION LINKS
    navLinks.forEach(link => {
        link.addEventListener("click", event => {
            const targetId = link.getAttribute("href");

            if (!targetId || !targetId.startsWith("#")) return;

            const targetSection = document.querySelector(targetId);
            const targetIndex = getSectionIndex(targetSection);

            if (targetIndex === -1) return;

            event.preventDefault();
            goToSection(targetIndex);
        });
    });


    // 4. HERO BUTTON
    if (heroButton) {
        heroButton.addEventListener("click", event => {
            const projectsSection = document.querySelector("#projects");
            const targetIndex = getSectionIndex(projectsSection);

            if (targetIndex === -1) return;

            event.preventDefault();
            goToSection(targetIndex);
        });
    }


   
    
    // 5. MOBILE MENU
    if (menuToggle && mobileNav) {
        menuToggle.textContent = "☰";
        menuToggle.setAttribute("aria-expanded", "false");

        menuToggle.addEventListener("click", () => {
            const isOpen = mobileNav.classList.toggle("active");

            menuToggle.classList.toggle("is-open", isOpen);
            menuToggle.textContent = isOpen ? "×" : "☰";
            menuToggle.setAttribute("aria-expanded", String(isOpen));
        });
    }


    // 6. SWITCH BETWEEN MOBILE AND DESKTOP
    
       function resetSliderForViewport() { if (isMobile()) { slider.style.setProperty("transform", "none", "important"); } else { slider.style.removeProperty("transform");
    slider.style.transform =
        `translateX(-${currentSectionIndex * 100}vw)`;

    // Reset vertical scroll when returning to desktop
    document.documentElement.style.scrollBehavior = "auto";
    window.scrollTo(0, 0);
    document.documentElement.style.scrollBehavior = "smooth";
}

closeMobileMenu();
}
function closeMobileMenu() {
    if (mobileNav) {
        mobileNav.classList.remove("active");
    }

    if (menuToggle) {
        menuToggle.classList.remove("is-open");
        menuToggle.textContent = "☰";
        menuToggle.setAttribute("aria-expanded", "false");
    }
}

    // Initial layout
    if (isMobile()) {
        slider.style.setProperty("transform", "none", "important");
        currentSectionIndex = getVisibleMobileSection();
    } else {
        resetSliderForViewport();
    }

    window.addEventListener("resize", () => {
        clearTimeout(resizeTimer);

        resizeTimer = setTimeout(() => {
            const mobileNow = isMobile();

            if (mobileNow === wasMobile) return;

            // Before leaving mobile, remember the section in view.
            if (wasMobile && !mobileNow) {
                currentSectionIndex = getVisibleMobileSection();
            }

            resetSliderForViewport();
            wasMobile = mobileNow;
        }, 200);
    });

});