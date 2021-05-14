import { Context } from '../context'
import generateAuthToken from '../generate-auth-token'
import setUserSessionCookie from '../set-user-session-cookie'

export async function middleware (resolve: any, root: any, args: any, ctx: Context, info: any) {
  const result = await resolve(root, args, ctx, info)
  if(ctx.currentUser &&
      ctx.koa.cookies.get('USER_SESSION_TOKEN') &&
      ctx.authTokenData && 
      ctx.authTokenData.exp && 
      // expires in less than 50 minutes
      (ctx.authTokenData.exp < ((new Date().getTime() / 1000) + (50 * 60)))
      ) {
    const token = generateAuthToken(ctx.currentUser)
    //setUserSessionCookie(ctx, token)
  }
  return result
}