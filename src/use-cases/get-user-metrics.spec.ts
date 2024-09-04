import { expect, describe, it, beforeEach } from 'vitest'
import { InMemoryCheckInsRepository } from '@/repositories/in-memory/in-memory-check-ins-repository'
import { GetUserMetricsUseCase } from './get-user-metrics'

let sut:GetUserMetricsUseCase
let checkInsRepository: InMemoryCheckInsRepository

describe('Get User Metrics Use case', () => {
  beforeEach(async () => {
    checkInsRepository = new InMemoryCheckInsRepository();
    sut = new GetUserMetricsUseCase(checkInsRepository)

    // await gymsRepository.create({
    //   id: 'gym_id',
    //   title: 'Gym Name',
    //   description: 'Gym Description',
    //   phone: null,
    //   latitude: -16.5034042,
    //   longitude: -49.2638714,
    // })
  })

  it('should be able to get check-ins count from metrics', async () => {
    await checkInsRepository.create({
      user_id: 'user_id',
      gym_id: 'gym_id',
      validated_at: new Date(),
    })

    await checkInsRepository.create({
      user_id: 'user_id',
      gym_id: 'gym_id2',
      validated_at: new Date(),
    })

    const { checkInsCount } = await sut.execute({
      userId: 'user_id',
    })

    expect(checkInsCount).toEqual(2)
  })
})