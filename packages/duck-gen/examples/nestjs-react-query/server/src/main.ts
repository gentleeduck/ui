import 'reflect-metadata'
import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)
  app.setGlobalPrefix('api')
  app.enableCors({ origin: true })
  await app.listen(3000)
}

bootstrap().catch((error) => {
  console.error(error)
  process.exit(1)
})
