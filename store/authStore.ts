import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { UserProfile } from "@/types";

interface AuthState {
    user: UserProfile | null;
    isLoggedIn: boolean;
    isHydrated: boolean; // ← tambah: tahu kapan hydration selesai

    setUser: (user: UserProfile) => void;
    clearUser: () => void;
    setHydrated: (val: boolean) => void; // ← tambah
}

export const useAuthStore = create<AuthState>()(
    persist(
        (set) => ({
            user: null,
            isLoggedIn: false,
            isHydrated: false, // default false, di-set true setelah getMe() selesai

            setUser: (user) => set({ user, isLoggedIn: true }),
            clearUser: () => set({ user: null, isLoggedIn: false }),
            setHydrated: (val) => set({ isHydrated: val }),
        }),
        {
            name: "temukan-auth",
            partialize: (state) => ({
                user: state.user,
                isLoggedIn: state.isLoggedIn,
                // isHydrated TIDAK di-persist — selalu mulai false
            }),
        }
    )
);