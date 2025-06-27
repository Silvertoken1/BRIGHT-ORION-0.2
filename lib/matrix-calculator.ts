// Matrix Commission Calculator for Bright Orion MLM System

export interface MatrixLevel {
  level: number
  requiredDownlines: number
  commissionPerPerson: number
  totalCommission: number
  currentDownlines: number
  status: "completed" | "in-progress" | "not-started"
  progress: number
}

export interface MatrixProgress {
  levels: MatrixLevel[]
  totalEarned: number
  totalPending: number
  totalPossible: number
}

// Commission structure as specified
const MATRIX_STRUCTURE = [
  { level: 1, required: 5, commission: 4000 },
  { level: 2, required: 25, commission: 2000 },
  { level: 3, required: 125, commission: 2000 },
  { level: 4, required: 625, commission: 1500 },
  { level: 5, required: 3125, commission: 1500 },
  { level: 6, required: 15625, commission: 1500 },
]

export function calculateMatrixProgress(userDownlines: number[]): MatrixProgress {
  const levels: MatrixLevel[] = []
  let totalEarned = 0
  let totalPending = 0
  let totalPossible = 0

  MATRIX_STRUCTURE.forEach((structure, index) => {
    const currentDownlines = userDownlines[index] || 0
    const progress = Math.min((currentDownlines / structure.required) * 100, 100)
    const totalCommission = structure.commission * structure.required

    let status: "completed" | "in-progress" | "not-started" = "not-started"
    let earned = 0

    if (currentDownlines >= structure.required) {
      status = "completed"
      earned = totalCommission
      totalEarned += earned
    } else if (currentDownlines > 0) {
      status = "in-progress"
      // Pending earnings for incomplete level
      totalPending += currentDownlines * structure.commission
    }

    totalPossible += totalCommission

    levels.push({
      level: structure.level,
      requiredDownlines: structure.required,
      commissionPerPerson: structure.commission,
      totalCommission,
      currentDownlines,
      status,
      progress,
    })
  })

  return {
    levels,
    totalEarned,
    totalPending,
    totalPossible,
  }
}

export function getMatrixLevelRequirements(level: number): number {
  const structure = MATRIX_STRUCTURE.find((s) => s.level === level)
  return structure ? structure.required : 0
}

export function getCommissionForLevel(level: number): number {
  const structure = MATRIX_STRUCTURE.find((s) => s.level === level)
  return structure ? structure.commission : 0
}

export function calculateTotalPossibleEarnings(): number {
  return MATRIX_STRUCTURE.reduce((total, structure) => {
    return total + structure.commission * structure.required
  }, 0)
}

// Calculate spillover logic for matrix placement
export function calculateMatrixPlacement(sponsorId: string, existingDownlines: any[]): string {
  // Simple spillover logic - place under sponsor with least downlines
  // In production, this would be more sophisticated
  return sponsorId
}
