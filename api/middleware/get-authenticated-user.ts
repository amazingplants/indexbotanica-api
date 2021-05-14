import { verify } from 'jsonwebtoken'
import { users } from '@prisma/client'
import { Context } from '../context'

export interface AuthToken {
  action: string,
  user_id: string,
  exp: number
}

export async function middleware (resolve: any, root: any, args: any, ctx: Context, info: any) {
  ctx.authTokenData = getAuthTokenData(ctx)
  ctx.currentUser = await getAuthenticatedUserFromTokenData(ctx.authTokenData, ctx)
  return await resolve(root, args, ctx, info)
}

function getAuthTokenData (ctx: Context): AuthToken | null {
  const authTokenWithBearerFromHeader: string | null = ctx.koa.request
     ? ctx.koa.request.headers.authorization
     : ctx.koa.connection.context.Authorization
  const authTokenFromCookie: string | null = ctx.koa.cookies.get('USER_SESSION_TOKEN') || null
  const authToken = authTokenWithBearerFromHeader 
    ? authTokenWithBearerFromHeader.split(" ")[1]
    : authTokenFromCookie
  if(authToken) {
    try {
      return verify(authToken, process.env.JWT_AUTH_SECRET!) as AuthToken
    } catch(e) {
      return null
    }
  } else {
    return null
  }
}

async function getAuthenticatedUserFromTokenData(authTokenData: AuthToken | null, ctx: Context) {
  if(authTokenData && authTokenData.action === 'USER_SESSION') {
    return await ctx.db.users.findUnique({
      where: {
        id: authTokenData.user_id
      }
    })
  } else {
    return null
  }
}