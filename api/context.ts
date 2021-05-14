import * as Koa from 'koa'
import { db } from "./db"
import { PrismaClient, users } from "@prisma/client"
import { AuthToken } from './middleware/get-authenticated-user'

export interface Context {
  db: PrismaClient,
  koa: Koa.Context,
  currentUser: users | null,
  authTokenData: AuthToken | null
}

export const context = (ctx: any) => {
  return {
    koa: ctx.ctx,
    db
  }
}


