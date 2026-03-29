declare global {
  // eslint-disable-next-line no-var
  var passwordResets:
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