/**
 * Deletes a preference from localStorage with the given name.
 *
 * @param {string} name The name of the preference to delete.
 */
export const deletePreference = (name) => {
    try {
        localStorage.removeItem(name);
    }
    catch (e) {
        console.warn(`Could not delete preference '${name}' from localStorage`, e);
    }
};
//# sourceMappingURL=deletePreference.js.map