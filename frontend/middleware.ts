import { clerkMiddleware ,createRouteMatcher} from "@clerk/nextjs/server";
import { NextResponse } from 'next/server'
const isPublicRoute = createRouteMatcher(['/sign-in(.*)', '/sign-up(.*)','/'])
const isHospitalRoute = createRouteMatcher(['/hospital(.*)'])
export default clerkMiddleware(async (auth, req) => {
  const { userId, redirectToSignIn } = await auth()
  if (isHospitalRoute(req) && !userId) {
  // if (isHospitalRoute(req) && (await auth()).sessionClaims?.metadata?.role !== 'hospital') {
    const url = new URL('/', req.url)
    return NextResponse.redirect(url)
  }

  if (!isPublicRoute(req)) {
    await auth.protect()
  }
})
export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
};