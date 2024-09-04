import { expect, describe, it, beforeEach, vi, afterEach } from 'vitest'
import { CheckInUseCase } from './check-in'
import { InMemoryCheckInsRepository } from '@/repositories/in-memory/in-memory-check-ins-repository'
import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gyms-repository'
import { Decimal } from '@prisma/client/runtime/library'
import { MaxDistanceError } from './errors/max-distance-error'
import { MaxNumberOfCheckInsError } from './errors/max-number-of-check-ins-error'

let sut:CheckInUseCase
let checkInsRepository: InMemoryCheckInsRepository
let gymsRepository: InMemoryGymsRepository

describe('Check-In Use case', () => {
  beforeEach(async () => {
    checkInsRepository = new InMemoryCheckInsRepository();
    gymsRepository = new InMemoryGymsRepository();
    sut = new CheckInUseCase(checkInsRepository, gymsRepository)

    await gymsRepository.create({
      id: 'gym_id',
      title: 'Gym Name',
      description: 'Gym Description',
      phone: null,
      latitude: -16.5034042,
      longitude: -49.2638714,
    })

    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('should be to check in', async () => {
    const {checkIn} = await sut.execute({
      userId: 'user_id',
      gymId: 'gym_id',
      userLatitude: -16.5034042,
      userLongitude: -49.2638714,
    })

    expect(checkIn.id).toEqual(expect.any(String))
  })

  it('should be to check in twice but in diferent days', async () => {
    vi.setSystemTime(new Date('2022-01-01 10:00:00'))

    await sut.execute({
      userId: 'user_id',
      gymId: 'gym_id',
      userLatitude: -16.5034042,
      userLongitude: -49.2638714,
    })

    vi.setSystemTime(new Date('2022-01-02 10:00:00'))

    const {checkIn} = await sut.execute ({
      userId: 'user_id',
      gymId: 'gym_id',
      userLatitude: -16.5034042,
      userLongitude: -49.2638714,
    })

    expect(checkIn.id).toEqual(expect.any(String))
  })

  it('should not be to check in twice in the same day', async () => {
    vi.setSystemTime(new Date('2022-01-01 10:00:00'))

    checkInsRepository.create({
      gym_id: 'gym_id',
      user_id: 'user_id'
    }) 

    await expect(() =>
      sut.execute({
        userId: 'user_id',
        gymId: 'gym_id',
        userLatitude: -16.5034042,
        userLongitude: -49.2638714,
      })
    ).rejects.toBeInstanceOf(MaxNumberOfCheckInsError)
  })

  it('should not be to check in on distant gym', async () => {
    await gymsRepository.create({
      id: 'gym_id2',
      title: 'Gym Name2',
      description: 'Gym Description2',
      phone: null,
      latitude: -27.5034042,
      longitude: -49.2638714,
    })

    expect(async () =>
      await sut.execute({
        userId: 'user_id',
        gymId: 'gym_id2',
        userLatitude: -16.5034042,
        userLongitude: -49.2638714,
      })
    ).rejects.toBeInstanceOf(MaxDistanceError)
  })
})