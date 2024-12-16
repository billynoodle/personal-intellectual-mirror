import { StateCheckIn, Pattern } from '../types'

export interface Insight {
  type: 'pattern' | 'trend' | 'suggestion'
  title: string
  description: string
  confidence: number
  relatedCheckIns?: StateCheckIn[]
}

export const generateInsights = (checkIns: StateCheckIn[]): Insight[] => {
  if (checkIns.length < 3) return []
  const insights: Insight[] = []

  // Analyze energy level trends
  const recentEnergyLevels = checkIns.slice(0, 5).map(c => c.energyLevel)
  const avgEnergy = recentEnergyLevels.reduce((a, b) => a + b, 0) / recentEnergyLevels.length
  const energyTrend = recentEnergyLevels[0] - recentEnergyLevels[recentEnergyLevels.length - 1]

  if (Math.abs(energyTrend) >= 2) {
    insights.push({
      type: 'trend',
      title: `Significant ${energyTrend > 0 ? 'increase' : 'decrease'} in energy levels`,
      description: `Your energy levels have ${energyTrend > 0 ? 'improved' : 'declined'} significantly over your last few check-ins. ${energyTrend > 0 ? 'Keep up the momentum!' : 'Consider what might be draining your energy.'}`,
      confidence: 0.8,
      relatedCheckIns: checkIns.slice(0, 5)
    })
  }

  // Analyze mental state patterns
  const mentalStates = checkIns.slice(0, 10).map(c => c.mentalState)
  const stateFrequency = mentalStates.reduce((acc, state) => {
    acc[state] = (acc[state] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  const dominantState = Object.entries(stateFrequency)
    .sort(([,a], [,b]) => b - a)[0]

  if (dominantState[1] >= 7) {
    insights.push({
      type: 'pattern',
      title: `Persistent ${dominantState[0]} state`,
      description: `You've been predominantly in a ${dominantState[0]} state recently. ${dominantState[0] === 'focused' ? 'Great job maintaining focus!' : `Consider what might help shift towards a more focused state.`}`,
      confidence: 0.85
    })
  }

  // Analyze trigger patterns
  const recentTriggers = checkIns
    .slice(0, 10)
    .flatMap(c => c.triggers || [])
    .reduce((acc, trigger) => {
      acc[trigger] = (acc[trigger] || 0) + 1
      return acc
    }, {} as Record<string, number>)

  const significantTriggers = Object.entries(recentTriggers)
    .filter(([,count]) => count >= 3)
    .sort(([,a], [,b]) => b - a)

  if (significantTriggers.length > 0) {
    insights.push({
      type: 'pattern',
      title: 'Recurring triggers identified',
      description: `${significantTriggers[0][0]} appears frequently in your check-ins. Consider developing specific strategies to manage this trigger.`,
      confidence: 0.75
    })
  }

  return insights
}

export const generateFeedback = (checkIn: StateCheckIn): string => {
  const feedback: string[] = []

  // Energy level feedback
  if (checkIn.energyLevel <= 2) {
    feedback.push('Your energy is quite low. Consider taking a short break or some deep breaths.')
  } else if (checkIn.energyLevel >= 4) {
    feedback.push('Your energy is high - this might be a good time for tackling challenging tasks.')
  }

  // Mental state feedback
  switch (checkIn.mentalState) {
    case 'scattered':
      feedback.push('You seem scattered. Try breaking your current task into smaller, manageable chunks.')
      break
    case 'foggy':
      feedback.push('Mental fog can be frustrating. A quick walk or change of environment might help clear your head.')
      break
    case 'focused':
      feedback.push('You\'re in a good flow state. Protect this focus by minimizing distractions.')
      break
    case 'clear':
      feedback.push('Your mind is clear - this is an optimal state for decision-making and planning.')
      break
  }

  // Combine feedback with a constructive tone
  return feedback.join(' ')
}
