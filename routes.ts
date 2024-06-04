/**
 * An array of routes that are accesible to the public
 * these routes do not require authentication
 * @type {string[]}
 */
export const publicRoutes = ["/", '/auth/login', '/auth/register'];
/**
 * An array of routes that are used for authentication
 * These routes will redirect logged in users to /settings
 * @type {string[]}
 */
export const authRoutes = ['/settings'];
/**
 * The prefix fır API authentication routes
 * Routes that start with this prefix are use for apı
 * authentication purposes
 * @type {string}
 */
export const apiAuthPrefix = "/api/auth";

/**
 * The default redirect path after logging in
 * @type {string}
 */
export const DEFAULT_LOGIN_REDIRECT = '/settings';

