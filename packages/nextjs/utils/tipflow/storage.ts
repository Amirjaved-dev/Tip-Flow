/**
 * Detects if the code is running in a browser environment.
 */
export const isBrowser = typeof window !== "undefined";

/**
 * A safe localStorage wrapper that provides mocks when running on the server.
 */
export const safeLocalStorage = {
    getItem: (key: string): string | null => {
        if (!isBrowser) return null;
        try {
            return window.localStorage.getItem(key);
        } catch (e) {
            console.error("Error accessing localStorage:", e);
            return null;
        }
    },
    setItem: (key: string, value: string): void => {
        if (!isBrowser) return;
        try {
            window.localStorage.setItem(key, value);
        } catch (e) {
            console.error("Error setting item in localStorage:", e);
        }
    },
    removeItem: (key: string): void => {
        if (!isBrowser) return;
        try {
            window.localStorage.removeItem(key);
        } catch (e) {
            console.error("Error removing item from localStorage:", e);
        }
    },
    clear: (): void => {
        if (!isBrowser) return;
        try {
            window.localStorage.clear();
        } catch (e) {
            console.error("Error clearing localStorage:", e);
        }
    },
};
