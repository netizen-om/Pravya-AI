export function getErrorMessage(errorCode: string) {
  switch (errorCode) {
    case "No user found":
      return "Invalid email or password. Please try again.";

    case "OAuthAccountNotLinked":
      return "This email is already linked with a different provider.";
    
    case "Invalid Password" :
      return "Invalid Credential";

    case "AccessDenied":
      return "You don't have permission to access this.";

    case "Configuration":
      return "Server error. Please contact support.";

    case "Verification":
      return "The sign-in link is no longer valid.";

    case "Missing fields":
      return "Please fill in all required fields.";

    case "Email already in use":
      return "This email is already registered. Please use a different email or try signing in.";

    case "Invalid email":
      return "Please enter a valid email address.";

    case "Password too short":
      return "Password must be at least 8 characters long.";

    case "Account creation failed":
      return "Failed to create account. Please try again.";

    case "Default":
    default:
      return "Something went wrong. Please try again later.";
  }
}