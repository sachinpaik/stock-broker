import {create} from "zustand";

export const  useWatchlistsDataStore = create((set) => ({
    watchlists: [],
    updateWatchlists: (newwatchlists) => set({watchlists: newwatchlists}),

}));
