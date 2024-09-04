import { expect, describe, it, beforeEach } from 'vitest'
import { hash } from 'bcryptjs'
import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository'
import { GetUserProfileUseCase } from './get-user-profile'
import { ResourceNotFoundError } from './errors/resource-not-found-erro'

let sut: GetUserProfileUseCase
let usersRepository: InMemoryUsersRepository

describe('Get User Profile Use case', () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository();
    sut = new GetUserProfileUseCase(usersRepository)
  })

  it('should be able to get user profile', async () => {
    const createdUser = await usersRepository.create({
      name: 'any_name',
      email: 'any_email',
      password_hash: await hash('any_password', 8)
    })
    
    const {user} = await sut.execute({
      userId: createdUser.id
    })

    expect(user.name).toEqual('any_name')
  })

  it('should not be able to get user profile with wrong id', async () => {
    expect(() =>
      sut.execute({
        userId: 'wrong_id'
      })
    ).rejects.toBeInstanceOf(ResourceNotFoundError)
  })
})