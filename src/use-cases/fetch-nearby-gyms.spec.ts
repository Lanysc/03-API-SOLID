import { expect, describe, it, beforeEach } from 'vitest'
import { SearchGymsUseCase } from './search-gyms'
import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gyms-repository'
import { FetchNearbyGymsUseCase } from './fetch-nearby-gyms'

let sut:FetchNearbyGymsUseCase
let gymsRepository: InMemoryGymsRepository

describe('Fetch Check-in History Use case', () => {
  beforeEach(async () => {
    gymsRepository = new InMemoryGymsRepository();
    sut = new FetchNearbyGymsUseCase(gymsRepository)
  })

  it('should be able to fetch nearby gyms', async () => {
    await gymsRepository.create({
      id: 'gym_id',
      title: 'Near Name',
      description: 'Gym Description',
      phone: null,
      latitude: -16.5034042,
      longitude: -49.2638714,
    })

    await gymsRepository.create({
      id: 'gym_id',
      title: 'Far Name',
      description: 'Gym Description',
      phone: null,
      latitude: -16.5034042,
      longitude: -47.2638714,
    })

    const { gyms } = await sut.execute({
      userLatitude: -16.5034042,
      userLongitude: -49.2638714,
    })

    expect(gyms).toHaveLength(1)
    expect(gyms).toEqual([
      expect.objectContaining({
        title: 'Near Name',
      }),
    ])
  })
})