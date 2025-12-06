/**
 * Retrieves a preference from localStorage with the given name.
 *
 * @param {string} name The name of the preference to retrieve.
 * @returns {string|null} The value of the preference, or null if it could not be read.
 */
export const getPreference = (name) => {
    try {
        return localStorage.getItem(name);
    }
    catch (e) {
        console.warn(`Could not read preference '${name}' from localStorage`, e);
        return null;
    }
};
//# sourceMappingURL=getPreference.js.map