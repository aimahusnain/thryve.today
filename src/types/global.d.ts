declare global {
    const passwordResets:
      | {
          [email: string]: {
            otp: string
            resetToken: string
            expiresAt: Date
          }
        }
      | undefined
  }
  
  export {}
  
  