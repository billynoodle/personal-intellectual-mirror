import { StateCheckInForm } from '@/features/state-tracking/components/StateCheckInForm'
import { PatternAnalysis } from '@/features/state-tracking/components/PatternAnalysis'
import { Insights } from '@/features/state-tracking/components/Insights'

export const Dashboard = () => {
  return (
    <div className="space-y-8">
      <StateCheckInForm />
      <PatternAnalysis />
      <Insights />
    </div>
  )
}
