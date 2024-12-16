export interface StateCheckIn {
  id: string
  userId: string
  timestamp: string
  mentalState: 'clear' | 'foggy' | 'scattered' | 'focused'
  energyLevel: 1 | 2 | 3 | 4 | 5
  currentFocus: string
  triggers?: string[]
  notes: string
}

export interface Pattern {
  id: string
  userId: string
  name: string
  description: string
  triggers: string[]
  countermeasures: string[]
}

export interface UserPreferences {
  id: string
  userId: string
  checkInFrequency: number
  notificationSettings: {
    enabled: boolean
    frequency: 'hourly' | 'daily' | 'weekly'
    quietHours: {
      start: string
      end: string
    }
  }
  personalTriggers: string[]
}
