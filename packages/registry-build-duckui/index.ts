import { main } from './main'
main()

// NOTE: Uncomment this if you want to use this script in another place
// NOTE: this is not gonna work somewhere else rather than this `cwd`
// hence we use the `process.cwd()` so it's fixed to this project with this
// spicifications if you want to make it work somewhere else modify the routes
// in `.env` file and the rest of the lib files
export * from './main'
