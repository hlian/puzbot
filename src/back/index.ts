import * as Koa from 'koa'
import * as KoaStatic from 'koa-static'
import * as KoaMount from 'koa-mount'
import * as KoaBody from 'koa-body'

const app = new Koa()

let id = 0
const db = []

const signUp = (username: string) => {
  const user = {type: 'user', id: id++, username}
  db.push(user)
  return user
}

app.use(KoaStatic('dist'))
app.use(KoaBody())

app.use(async ctx => {
  const body = ctx.request.body
  if (ctx.url == '/api/sign-up') {
    console.debug(body, body.username)
    ctx.body = signUp(body.username)
  }
})

app.listen(3000)
