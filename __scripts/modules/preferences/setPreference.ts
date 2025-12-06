/**
 * Stores a preference in localStorage with the given name and value.
 *
 * @param {string} name The name of the preference to store.
 * @param {string} value The value of the preference to store.
 */
export const setPreference = (name: string, value: string) => {
  try {
    localStorage.setItem(name, value);
  } catch (e) {
    console.warn(`Could not store preference '${name}' in localStorage`, e);
  }
};
