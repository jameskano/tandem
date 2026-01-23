import { useEffect } from 'react'
import { CalendarDays } from 'lucide-react'
import { COLORS } from '../shared/colors'
import { usePlansStore } from '../hooks/usePlansStore'
import { seedData } from '../shared/seed'
import Button from '../shared/ui/Button'
import Card from '../shared/ui/Card'
import Chip from '../shared/ui/Chip'
import GradientButton from '../shared/ui/GradientButton'

const Dashboard = () => {
  const { plans, addPlan } = usePlansStore()

  // Load seed data on first visit
  useEffect(() => {
    if (plans.length === 0) {
      seedData.plans.forEach(addPlan)
    }
    // if (activities.length === 0) {
    //   seedData.activities.forEach(addActivity)
    // }
  }, [plans.length, addPlan])

  const upcomingPlans = plans
    .filter(
      plan =>
        new Date(plan.start_date_ts) > new Date() && plan.status === 'planned'
    )
    .sort(
      (a, b) =>
        new Date(a.start_date_ts).getTime() -
        new Date(b.start_date_ts).getTime()
    )
    .slice(0, 3)

  const completedPlans = plans.filter(plan => plan.status === 'completed')

  return (
    <div className="space-y-4 px-4 py-6" style={{ backgroundColor: COLORS.bg }}>
      <div className="flex flex-col gap-y-3">
        <Card className="space-y-3">
          <div className="flex items-center justify-between">
            <h3
              className="text-base font-semibold"
              style={{ color: COLORS.text }}
            >
              Next up
            </h3>
            <Chip>Sat 18:00</Chip>
          </div>
          <div className="flex items-center gap-3">
            <div
              className="flex h-12 w-12 items-center justify-center rounded-2xl"
              style={{ backgroundColor: COLORS.secondary }}
            >
              <CalendarDays className="opacity-80" />
            </div>
            <div>
              <div className="font-semibold" style={{ color: COLORS.text }}>
                Homemade sushi night 🍣
              </div>
              <div className="text-xs" style={{ color: COLORS.muted }}>
                Shopping list done, with jazz music playlist
              </div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <GradientButton className="w-full py-3 text-sm">
              Completed
            </GradientButton>
            <Button variant="primaryOutline" className="w-full py-3 text-sm">
              Reschedule
            </Button>
          </div>
        </Card>

        <Card>
          <div className="text-center">
            <p className="mb-1 text-2xl font-bold text-accent">
              {upcomingPlans.length}
            </p>
            <p className="text-textMuted text-sm">Upcoming Plans</p>
          </div>
        </Card>

        <Card>
          <div className="text-center">
            <p className="mb-1 text-2xl font-bold text-secondary">
              {completedPlans.length}
            </p>
            <p className="text-textMuted text-sm">Completed</p>
          </div>
        </Card>
      </div>

      <Card>
        <h2
          className="mb-4 text-xl font-semibold"
          style={{ color: COLORS.text }}
        >
          Quick Actions
        </h2>
        <div className="grid gap-3 sm:grid-cols-2">
          <Button variant="outlineSoft" className="justify-start">
            📅 Check Activities
          </Button>
          <Button variant="outlineSoft" className="justify-start">
            📸 Add Photo
          </Button>
          <Button variant="outlineSoft" className="justify-start">
            🔍 Discover
          </Button>
        </div>
      </Card>
    </div>
  )
}

export default Dashboard
