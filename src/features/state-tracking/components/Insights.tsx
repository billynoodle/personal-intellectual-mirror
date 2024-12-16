import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert'
import { useStateTracking } from '../hooks/useStateTracking'
import { generateInsights, generateFeedback } from '../utils/insights'
import { Brain, TrendingUp, Lightbulb } from 'lucide-react'

const InsightIcon = {
  pattern: Brain,
  trend: TrendingUp,
  suggestion: Lightbulb,
}

export const Insights = () => {
  const { checkIns } = useStateTracking()
  const [insights, setInsights] = useState<ReturnType<typeof generateInsights>>([])

  useEffect(() => {
    if (checkIns.length > 0) {
      setInsights(generateInsights(checkIns))
    }
  }, [checkIns])

  if (checkIns.length === 0) return null

  const latestCheckIn = checkIns[0]
  const feedback = generateFeedback(latestCheckIn)

  return (
    <Card className="w-full max-w-2xl mx-auto mt-8">
      <CardHeader>
        <CardTitle>Insights & Feedback</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {feedback && (
          <Alert>
            <AlertTitle>Current State Feedback</AlertTitle>
            <AlertDescription>{feedback}</AlertDescription>
          </Alert>
        )}

        <div className="space-y-4">
          {insights.map((insight, index) => {
            const Icon = InsightIcon[insight.type]
            return (
              <Alert key={index} variant={insight.type === 'suggestion' ? 'default' : 'secondary'}>
                <Icon className="h-4 w-4" />
                <AlertTitle className="font-semibold">{insight.title}</AlertTitle>
                <AlertDescription>{insight.description}</AlertDescription>
              </Alert>
            )
          })}
        </div>

        {insights.length === 0 && checkIns.length < 3 && (
          <Alert>
            <AlertDescription>
              Add more check-ins to receive personalized insights and pattern recognition.
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  )
}
