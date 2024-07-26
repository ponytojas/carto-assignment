import { create } from 'zustand'

const useStore = create((set) => ({
  storeData: [],
  setStoreData: (newData) => set({ data: newData })
}))

export default useStore
