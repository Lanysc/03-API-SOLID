import { expect, describe, it, beforeEach } from 'vitest'
import { RegisterUseCase } from './register'
import { compare } from 'bcryptjs'
import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository'
import { UserAlreadyExists } from './errors/user-already-exists'

let sut: RegisterUseCase
let usersRepository: InMemoryUsersRepository

describe('register Use case', () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository()
    sut = new RegisterUseCase(usersRepository)
  })

  it('should be able to register', async () => {
    const {user} = await sut.execute({
      name: 'any_name',
      email: 'any_email',
      password: 'any_password'
    })

    expect(user.id).toEqual(expect.any(String))
  })

  it('should hash user password upon registration', async () => {
    const {user} = await sut.execute({
      name: 'any_name',
      email: 'any_email',
      password: 'any_password'
    })

    const isPasswordCorrectlyHashed = await compare('any_password', user.password_hash)

    expect(isPasswordCorrectlyHashed).toBe(true)
  })

  it('should not be able to register with same email twice', async () => {
    const email = 'any_email'
    
    await sut.execute({
      name: 'any_name',
      email,
      password: 'any_password'
    })

    await expect(() => 
      sut.execute({
        name: 'any_name',
        email,
        password: 'any_password'
      })
    ).rejects.toBeInstanceOf(UserAlreadyExists)
  })
})