import { SignInButton } from "@clerk/nextjs";

export default function SignIn() {
  return (
    <div>
      <h1>Please Sign In first</h1>
      <SignInButton />
    </div>
  );
}
