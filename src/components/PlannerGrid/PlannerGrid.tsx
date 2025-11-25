import React from 'react'
import Card from '../../ui/Card'
import { usePlansStore } from '../../state/usePlansStore'
import { formatDate, formatTime } from '../../shared/utils/date'

const PlannerGrid: React.FC = () => {
  const { plans } = usePlansStore()

  // Get current month
  const now = new Date()
  const currentMonth = now.getMonth()
  const currentYear = now.getFullYear()

  // Get days in current month
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate()
  const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay()

  // Generate calendar days
  const calendarDays = []
  
  // Add empty cells for days before the first day of the month
  for (let i = 0; i < firstDayOfMonth; i++) {
    calendarDays.push(null)
  }
  
  // Add days of the month
  for (let day = 1; day <= daysInMonth; day++) {
    calendarDays.push(day)
  }

  // Get plans for current month
  const monthPlans = plans.filter(plan => {
    const planDate = new Date(plan.start_ts)
    return planDate.getMonth() === currentMonth && planDate.getFullYear() === currentYear
  })

  const getPlansForDay = (day: number) => {
    return monthPlans.filter(plan => {
      const planDate = new Date(plan.start_ts)
      return planDate.getDate() === day
    })
  }

  const isToday = (day: number) => {
    return day === now.getDate()
  }

  return (
    <Card className="p-6">
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-text">
          {now.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
        </h3>
      </div>

      <div className="grid grid-cols-7 gap-1">
        {/* Day headers */}
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
          <div key={day} className="p-2 text-center text-sm font-medium text-textMuted">
            {day}
          </div>
        ))}

        {/* Calendar days */}
        {calendarDays.map((day, index) => (
          <div
            key={index}
            className={`min-h-[80px] p-2 border border-gray-100 ${
              day ? 'bg-white' : 'bg-gray-50'
            } ${isToday(day) ? 'bg-primary/10 border-primary' : ''}`}
          >
            {day && (
              <>
                <div className={`text-sm font-medium mb-1 ${
                  isToday(day) ? 'text-primary' : 'text-text'
                }`}>
                  {day}
                </div>
                
                {/* Plans for this day */}
                <div className="space-y-1">
                  {getPlansForDay(day).slice(0, 2).map(plan => (
                    <div
                      key={plan.id}
                      className="text-xs p-1 bg-primary/10 text-primary rounded truncate"
                      title={plan.title}
                    >
                      {plan.title}
                    </div>
                  ))}
                  {getPlansForDay(day).length > 2 && (
                    <div className="text-xs text-textMuted">
                      +{getPlansForDay(day).length - 2} more
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        ))}
      </div>
    </Card>
  )
}

export default PlannerGrid
