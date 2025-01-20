export {}

// Create a type for the roles
export type Roles = 'hospital' | 'patient'

declare global {
  interface CustomJwtSessionClaims {
    metadata: {
      role?: Roles
    }
  }
}
