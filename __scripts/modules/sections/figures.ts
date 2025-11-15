export const alternateFigures = (): void => {
    const figures = document.querySelectorAll<HTMLElement>("section figure");
    figures.forEach((fig, i) => {
        fig.style.setProperty("--fig-index", String(i % 2));
    });
};