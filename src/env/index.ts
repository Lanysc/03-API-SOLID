import 'dotenv/config'
import Z from 'zod'

const envSchema = Z.object({
  NODE_ENV: Z.enum(['dev', 'production', 'test']).default('dev'),
  JWT_SECRET: Z.string(),
  PORT: Z.coerce.number().default(3333),
})

const _env = envSchema.safeParse(process.env)

if (!_env.success) {
  console.error('Invalid environment variables', _env.error.format())

  throw new Error('Invalid environment variables')
}

export const env = _env.data
