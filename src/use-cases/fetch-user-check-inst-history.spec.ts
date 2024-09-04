import { expect, describe, it, beforeEach } from 'vitest'
import { InMemoryCheckInsRepository } from '@/repositories/in-memory/in-memory-check-ins-repository'
import { FetchUserCheckInsHistoryUseCase } from './fetch-user-check-inst-history'

let sut:FetchUserCheckInsHistoryUseCase
let checkInsRepository: InMemoryCheckInsRepository

describe('Fetch Check-in History Use case', () => {
  beforeEach(async () => {
    checkInsRepository = new InMemoryCheckInsRepository();
    sut = new FetchUserCheckInsHistoryUseCase(checkInsRepository)

    // await gymsRepository.create({
    //   id: 'gym_id',
    //   title: 'Gym Name',
    //   description: 'Gym Description',
    //   phone: null,
    //   latitude: -16.5034042,
    //   longitude: -49.2638714,
    // })
  })

  it('should be able to fetch check-in history', async () => {
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

    const { checkIns } = await sut.execute({
      userId: 'user_id',
      page: 1,
    })

    expect(checkIns).toHaveLength(2)
    expect(checkIns).toEqual([
      expect.objectContaining({
        gym_id: 'gym_id',
      }),
      expect.objectContaining({
        gym_id: 'gym_id2',
      }),
    ])
  })

  it('should be able to fetch paginated check-in history', async () => {
    for (let i = 0; i < 22; i++) {
      await checkInsRepository.create({
        user_id: 'user_id',
        gym_id: `gym_id_${i}`,
        validated_at: new Date(),
      })
    }

    const { checkIns } = await sut.execute({
      userId: 'user_id',
      page: 2,
    })

    expect(checkIns).toHaveLength(2)
    expect(checkIns).toEqual([
      expect.objectContaining({
        gym_id: 'gym_id_20',
      }),
      expect.objectContaining({
        gym_id: 'gym_id_21',
      }),
    ])
  })

})