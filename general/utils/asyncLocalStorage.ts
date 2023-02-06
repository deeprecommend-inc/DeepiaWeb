export const asyncLocalStorage = {
    setItem: async (key: string, value: string) => {
        await null;
        localStorage.setItem(key, value);
    },
    getItem: async (key: string) => {
        await null;
        return localStorage.getItem(key);
    },
    removeItem: async (key: string) => {
        await null;
        return localStorage.removeItem(key);
    },
};
