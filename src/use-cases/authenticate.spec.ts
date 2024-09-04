import { expect, describe, it, beforeEach } from 'vitest'
import { hash } from 'bcryptjs'
import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository'
import { AuthenticateUseCase } from './authenticate'
import { InvalidCredentialError } from './errors/invalid-credentials-error'

let sut: AuthenticateUseCase
let usersRepository: InMemoryUsersRepository

describe('register Use case', () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository();
    sut = new AuthenticateUseCase(usersRepository)
  })

  it('should be able to authenticate', async () => {
    await usersRepository.create({
      name: 'any_name',
      email: 'any_email',
      password_hash: await hash('any_password', 8)
    })
    
    const {user} = await sut.execute({
      email: 'any_email',
      password: 'any_password'
    })

    expect(user.id).toEqual(expect.any(String))
  })

  it('should not be able to authenticate with wrong email', async () => {
    expect(() =>
      sut.execute({
        email: 'any_email',
        password: 'any_password'
      })
    ).rejects.toBeInstanceOf(InvalidCredentialError)
  })

  it('should not be able to authenticate with wrong password', async () => {
    await usersRepository.create({
      name: 'any_name',
      email: 'any_email',
      password_hash: await hash('any_password', 8)
    })

    expect(() =>
      sut.execute({
        email: 'any_email',
        password: '123456'
      })
    ).rejects.toBeInstanceOf(InvalidCredentialError)
  })

})