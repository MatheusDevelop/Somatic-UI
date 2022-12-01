import create from "zustand";
const useUserStore = create((set) => ({
  id: null,
  auth: false,
  role: null,
  login(id, role) {
    set(() => ({ id, auth: true, role }));
  },
  logout() {
    set(() => ({ id: null, auth: false, role: null }));
  },
}));
export default useUserStore;
