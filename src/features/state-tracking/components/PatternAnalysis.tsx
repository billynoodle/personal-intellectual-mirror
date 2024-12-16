import { useEffect, useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useStateTracking } from '../hooks/useStateTracking'
import { StateCheckIn } from '../types'

export const PatternAnalysis = () => {
  const { checkIns, fetchCheckIns } = useStateTracking()

  useEffect(() => {
    fetchCheckIns()
  }, [])

  const analysis = useMemo(() => {
    if (!checkIns.length) return null

    const triggerFrequency = checkIns.reduce((acc, checkIn) => {
      checkIn.triggers?.forEach((trigger) => {
        acc[trigger] = (acc[trigger] || 0) + 1
      })
      return acc
    }, {} as Record<string, number>)

    const mentalStatePatterns = checkIns.reduce((acc, checkIn) => {
      acc[checkIn.mentalState] = (acc[checkIn.mentalState] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    const averageEnergyLevel = checkIns.reduce((acc, checkIn) => 
      acc + checkIn.energyLevel, 0) / checkIns.length

    // Find common state combinations
    const stateCombinations = checkIns.reduce((acc, checkIn) => {
      const key = `${checkIn.mentalState}-${checkIn.energyLevel}`
      acc[key] = (acc[key] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    return {
      triggerFrequency,
      mentalStatePatterns,
      averageEnergyLevel,
      stateCombinations,
      totalCheckIns: checkIns.length,
    }
  }, [checkIns])

  if (!analysis) return null

  return (
    <Card className="w-full max-w-2xl mx-auto mt-8">
      <CardHeader>
        <CardTitle>Pattern Analysis</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <h3 className="font-semibold mb-2">Most Common Triggers</h3>
          <div className="space-y-1">
            {Object.entries(analysis.triggerFrequency)
              .sort(([, a], [, b]) => b - a)
              .slice(0, 5)
              .map(([trigger, count]) => (
                <div key={trigger} className="flex justify-between">
                  <span>{trigger}</span>
                  <span className="text-muted-foreground">
                    {Math.round((count / analysis.totalCheckIns) * 100)}%
                  </span>
                </div>
              ))}
          </div>
        </div>

        <div>
          <h3 className="font-semibold mb-2">Mental State Distribution</h3>
          <div className="space-y-1">
            {Object.entries(analysis.mentalStatePatterns)
              .sort(([, a], [, b]) => b - a)
              .map(([state, count]) => (
                <div key={state} className="flex justify-between">
                  <span className="capitalize">{state}</span>
                  <span className="text-muted-foreground">
                    {Math.round((count / analysis.totalCheckIns) * 100)}%
                  </span>
                </div>
              ))}
          </div>
        </div>

        <div>
          <h3 className="font-semibold mb-2">Common State Combinations</h3>
          <div className="space-y-1">
            {Object.entries(analysis.stateCombinations)
              .sort(([, a], [, b]) => b - a)
              .slice(0, 5)
              .map(([combo, count]) => {
                const [state, level] = combo.split('-')
                return (
                  <div key={combo} className="flex justify-between">
                    <span>
                      <span className="capitalize">{state}</span> with energy level {level}
                    </span>
                    <span className="text-muted-foreground">
                      {Math.round((count / analysis.totalCheckIns) * 100)}%
                    </span>
                  </div>
                )
              })}
          </div>
        </div>

        <div className="pt-4 border-t">
          <span className="font-semibold">Average Energy Level: </span>
          <span>{analysis.averageEnergyLevel.toFixed(1)}</span>
        </div>
      </CardContent>
    </Card>
  )
}
