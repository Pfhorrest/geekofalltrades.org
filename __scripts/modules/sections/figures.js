export const alternateFigures = () => {
    const figures = document.querySelectorAll("section figure");
    figures.forEach((fig, i) => {
        fig.style.setProperty("--fig-index", String(i % 2));
    });
};
//# sourceMappingURL=figures.js.map