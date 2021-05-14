import { Context } from './context'

export default function (ctx: Context, token: string | null) {
  ctx.koa.cookies.set('USER_SESSION_TOKEN', token, { domain: process.env.APP_DOMAIN, sameSite: true, httpOnly: true })    
  return { token }
}
