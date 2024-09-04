import { expect, describe, it, beforeEach } from 'vitest'
import { RegisterUseCase } from './register'
import { compare } from 'bcryptjs'
import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository'
import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gyms-repository'
import { CreateGymUseCase } from './create-gym'

let sut: CreateGymUseCase
let gymsRepository: InMemoryGymsRepository

describe('Create Gym Use case', () => {
  beforeEach(() => {
    gymsRepository = new InMemoryGymsRepository()
    sut = new CreateGymUseCase(gymsRepository)
  })

  it('should be able to create gym', async () => {
    const {gym} = await sut.execute({
      title: 'Gym Name',
      description: 'Gym Description',
      phone: null,
      latitude: -16.5034042,
      longitude: -49.2638714,
    })

    expect(gym.id).toEqual(expect.any(String))
  })
})