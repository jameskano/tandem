export const formatDuration = (minutes: number): string => {
  if (minutes < 60) {
    return `${minutes}m`
  }
  
  const hours = Math.floor(minutes / 60)
  const remainingMinutes = minutes % 60
  
  if (remainingMinutes === 0) {
    return `${hours}h`
  }
  
  return `${hours}h ${remainingMinutes}m`
}

export const formatProgress = (current: number, target: number): string => {
  const percentage = Math.round((current / target) * 100)
  return `${current}/${target} (${percentage}%)`
}

export const formatStreak = (days: number): string => {
  if (days === 0) return 'No streak'
  if (days === 1) return '1 day streak'
  return `${days} day streak`
}

export const formatCost = (cost: string): string => {
  switch (cost) {
    case 'free':
      return 'Free'
    case 'low':
      return '$'
    case 'medium':
      return '$$'
    case 'high':
      return '$$$'
    default:
      return cost
  }
}

export const formatDifficulty = (difficulty: string): string => {
  switch (difficulty) {
    case 'easy':
      return 'Easy'
    case 'medium':
      return 'Medium'
    case 'hard':
      return 'Hard'
    default:
      return difficulty
  }
}

export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text
  return text.slice(0, maxLength) + '...'
}

export const capitalizeFirst = (text: string): string => {
  return text.charAt(0).toUpperCase() + text.slice(1)
}

export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes'
  
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

export const generateId = (): string => {
  return Math.random().toString(36).substr(2, 9)
}

export const generateInviteCode = (): string => {
  return Math.random().toString(36).substr(2, 8).toUpperCase()
}

export const cn = (...classes: (string | undefined | null | false)[]): string => {
  return classes.filter(Boolean).join(' ')
}
