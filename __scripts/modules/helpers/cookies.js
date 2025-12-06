/**
 * Sets a cookie with the given name and value, expiring in the given number of days.
 * @param {string} name - The name of the cookie to set.
 * @param {string} value - The value of the cookie to set.
 * @param {number} [days=365] - The number of days until the cookie expires.
 * @example
 * setCookie('myCookie', 'myValue', 30);
 */
export const setCookie = (name, value, days = 365) => {
    const expires = new Date(Date.now() + days * 86400000).toUTCString();
    document.cookie = `${name}=${value}; expires=${expires}; path=/; SameSite=Lax; Secure`;
};
/**
 * Delete a cookie by setting its expiration date to a past date.
 * @param {string} name - The name of the cookie to delete.
 */
export const deleteCookie = (name) => {
    document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/; SameSite=Lax; Secure`;
};
//# sourceMappingURL=cookies.js.map