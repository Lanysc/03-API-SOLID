import { expect, describe, it, beforeEach } from 'vitest'
import { SearchGymsUseCase } from './search-gyms'
import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gyms-repository'

let sut:SearchGymsUseCase
let gymsRepository: InMemoryGymsRepository

describe('Fetch Check-in History Use case', () => {
  beforeEach(async () => {
    gymsRepository = new InMemoryGymsRepository();
    sut = new SearchGymsUseCase(gymsRepository)

    // await gymsRepository.create({
    //   id: 'gym_id',
    //   title: 'Gym Name',
    //   description: 'Gym Description',
    //   phone: null,
    //   latitude: -16.5034042,
    //   longitude: -49.2638714,
    // })
  })

  it('should be able to search for gyms', async () => {
    await gymsRepository.create({
      id: 'gym_id',
      title: 'Gym Name',
      description: 'Gym Description',
      phone: null,
      latitude: -16.5034042,
      longitude: -49.2638714,
    })

    await gymsRepository.create({
      id: 'gym_id',
      title: '2 Gym Name',
      description: 'Gym Description',
      phone: null,
      latitude: -16.5034042,
      longitude: -49.2638714,
    })

    const { gyms } = await sut.execute({
      query: '2',
      page: 1,
    })

    expect(gyms).toHaveLength(1)
    expect(gyms).toEqual([
      expect.objectContaining({
        title: '2 Gym Name',
      }),
    ])
  })

  it('should be able to fetch paginated gyms search', async () => {
    for (let i = 0; i < 22; i++) {
      await gymsRepository.create({
        id: `gym_id_${i}`,
        title: `Gym Name ${i}`,
        description: 'Gym Description',
        phone: null,
        latitude: -16.5034042,
        longitude: -49.2638714,
      })
    }

    const { gyms } = await sut.execute({
      query: 'Gym',
      page: 2,
    })

    expect(gyms).toHaveLength(2)
    expect(gyms).toEqual([
      expect.objectContaining({
        title: 'Gym Name 20',
      }),
      expect.objectContaining({
        title: 'Gym Name 21',
      }),
    ])
  })

})