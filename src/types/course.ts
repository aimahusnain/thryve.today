export interface Course {
    id: string
    name: string
    duration: string
    price: number
    description: string
    classroom: string
    Lab?: string | null
    Clinic?: string | null
    WhoShouldAttend: string[]
    ProgramHighlights: string[]
    status: "DRAFT" | "ACTIVE"
    Note?: string | null
    createdAt?: Date
    updatedAt?: Date
  }
  