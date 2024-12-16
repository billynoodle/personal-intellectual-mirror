import { create } from 'zustand'
import { StateCheckIn } from '../types'
import { supabase } from '@/lib/supabase'

interface StateTrackingStore {
  checkIns: StateCheckIn[]
  loading: boolean
  addCheckIn: (checkIn: Omit<StateCheckIn, 'id' | 'userId'>) => Promise<void>
  fetchCheckIns: () => Promise<void>
}

export const useStateTracking = create<StateTrackingStore>((set) => ({
  checkIns: [],
  loading: false,
  addCheckIn: async (checkIn) => {
    set({ loading: true })
    const { error } = await supabase
      .from('state_check_ins')
      .insert([checkIn])
    if (error) throw error
    set({ loading: false })
  },
  fetchCheckIns: async () => {
    set({ loading: true })
    const { data, error } = await supabase
      .from('state_check_ins')
      .select('*')
      .order('timestamp', { ascending: false })
    if (error) throw error
    set({ checkIns: data as StateCheckIn[], loading: false })
  },
}))
