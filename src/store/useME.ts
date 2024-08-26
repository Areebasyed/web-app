import { Id } from "../../convex/_generated/dataModel"

interface Me {
    _id: Id<"users">
    name: string
    email: string
    profileImage: string
    isOnline: boolean
    Asseller?: boolean | undefined
    _creationTime: number

}

import { create } from 'zustand';

interface MyState {
  me : Me | null 
  setSelectedMe: (me: Me | null) => void;
}
export const useMe = create<MyState>((set) => ({
  me: null,
  setSelectedMe: (me: Me | null) => set({ me }),
}));
