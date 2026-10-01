const themeToggle = document.getElementById("theme-toggle");
themeToggle.addEventListener("click", function() {
    if (themeToggle.textContent === "☀") {
    themeToggle.textContent = "☾";
} else {
    themeToggle.textContent = "☀";
}
document.body.classList.toggle("dark-mode");
});
document.addEventListener("DOMContentLoaded", () => {

    const slider = document.querySelector(".page-slider");
    const navLinks = document.querySelectorAll("nav a");

    if (!slider) return;

    navLinks.forEach(link => {

        link.addEventListener("click", (e) => {

            e.preventDefault();

            const targetId = link.getAttribute("href");
            const targetSection = document.querySelector(targetId);

            if (!targetSection) return;

            const sections = Array.from(
                slider.querySelectorAll(":scope > section")
            );

            const targetIndex = sections.indexOf(targetSection);

            if (targetIndex === -1) return;

            slider.style.transform =
                `translateX(-${targetIndex * 100}vw)`;

        });

    });

});