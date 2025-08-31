/// backend
type User = {
  id: string
  name?: string
  age: number
}

type Handler = (req: any, res: any, next: any) => any
type App = Record<string, Handler>

export const app: App = {
  '/users': (req, res) => {
    return res.json({ users: [{ id: '1', name: 'John', age: 30 }] })
  },
}

export type APPRoutes = {
  '/users': Promise<string>
  '/posts': Promise<string>
}

////

const hi = function req(): APPRoutes['/users'] {}

function foo(): string {
  return ''
}

type fn = ReturnType<typeof foo>
