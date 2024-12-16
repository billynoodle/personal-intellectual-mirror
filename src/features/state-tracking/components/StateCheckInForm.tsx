import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { useStateTracking } from '../hooks/useStateTracking'

const mentalStates = ['clear', 'foggy', 'scattered', 'focused'] as const
const energyLevels = [1, 2, 3, 4, 5] as const

export const StateCheckInForm = () => {
  const { addCheckIn } = useStateTracking()
  const [mentalState, setMentalState] = useState<typeof mentalStates[number]>('clear')
  const [energyLevel, setEnergyLevel] = useState<typeof energyLevels[number]>(3)
  const [currentFocus, setCurrentFocus] = useState('')
  const [notes, setNotes] = useState('')
  const [triggers, setTriggers] = useState<string[]>([])
  const [newTrigger, setNewTrigger] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    await addCheckIn({
      timestamp: new Date().toISOString(),
      mentalState,
      energyLevel,
      currentFocus,
      notes,
      triggers,
    })
    // Reset form
    setCurrentFocus('')
    setNotes('')
    setTriggers([])
  }

  const addTrigger = () => {
    if (newTrigger.trim() && !triggers.includes(newTrigger.trim())) {
      setTriggers([...triggers, newTrigger.trim()])
      setNewTrigger('')
    }
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Quick State Check-In</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label>Mental State</Label>
            <div className="flex gap-2 flex-wrap">
              {mentalStates.map((state) => (
                <Button
                  key={state}
                  type="button"
                  variant={mentalState === state ? 'default' : 'outline'}
                  onClick={() => setMentalState(state)}
                  className="capitalize"
                >
                  {state}
                </Button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label>Energy Level</Label>
            <div className="flex gap-2">
              {energyLevels.map((level) => (
                <Button
                  key={level}
                  type="button"
                  variant={energyLevel === level ? 'default' : 'outline'}
                  onClick={() => setEnergyLevel(level)}
                >
                  {level}
                </Button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="currentFocus">Current Focus</Label>
            <Input
              id="currentFocus"
              value={currentFocus}
              onChange={(e) => setCurrentFocus(e.target.value)}
              placeholder="What are you working on?"
            />
          </div>

          <div className="space-y-2">
            <Label>Triggers</Label>
            <div className="flex gap-2">
              <Input
                value={newTrigger}
                onChange={(e) => setNewTrigger(e.target.value)}
                placeholder="Add a trigger"
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTrigger())}
              />
              <Button type="button" onClick={addTrigger} variant="secondary">
                Add
              </Button>
            </div>
            {triggers.length > 0 && (
              <div className="flex gap-2 flex-wrap mt-2">
                {triggers.map((trigger) => (
                  <Button
                    key={trigger}
                    variant="outline"
                    size="sm"
                    onClick={() => setTriggers(triggers.filter((t) => t !== trigger))}
                  >
                    {trigger} ×
                  </Button>
                ))}
              </div>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Any additional thoughts or observations?"
            />
          </div>

          <Button type="submit" className="w-full">
            Submit Check-In
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
