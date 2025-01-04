import SignIn from "@/components/sign-in";
import { SignedIn, SignedOut } from "@clerk/nextjs";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <SignedOut>
        <SignIn />
      </SignedOut>
      <SignedIn>{children}</SignedIn>
    </>
  );
}
