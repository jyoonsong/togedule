import create from 'zustand';
import { createBrowserHistory } from "history";

const history = createBrowserHistory();

export const useStore = create((set, get) => ({
    currentUser: undefined,
    setCurrentUser: (newUser) => set({ currentUser: newUser }),
    signOut: () => set({ currentUser: undefined }),

    // i18n: i18n,
    history: history,
    getHistory: () => get().history
}));