export interface Course {
  id: string
  name: string
  duration: string
  price: number
  description: string
  classroom: string
  Lab?: string
  Clinic?: string
  WhoShouldAttend: string[]
  ProgramHighlights: string[]
  startingDates?: string
  status: "DRAFT" | "ACTIVE"
  Note?: string
  createdAt: Date
  updatedAt: Date
}