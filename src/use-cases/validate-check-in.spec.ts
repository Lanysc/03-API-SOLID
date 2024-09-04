import { expect, describe, it, beforeEach, afterEach, vi } from 'vitest'
import { InMemoryCheckInsRepository } from '@/repositories/in-memory/in-memory-check-ins-repository'
import { ValidateCheckInUseCase } from './validate-check-in'
import { ResourceNotFoundError } from './errors/resource-not-found-erro'

let sut:ValidateCheckInUseCase
let checkInsRepository: InMemoryCheckInsRepository

describe('Validate Check-in Use case', () => {
  beforeEach(async () => {
    checkInsRepository = new InMemoryCheckInsRepository();
    sut = new ValidateCheckInUseCase(checkInsRepository)
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('should be to validate the check-in', async () => {
    const createdCheckIn = await checkInsRepository.create({
      user_id: 'user_id',
      gym_id: 'gym_id',
      validated_at: new Date(),
    })

    const { checkIn } = await sut.execute({
      checkInId: createdCheckIn.id,
    })

    expect(checkIn.validated_at).toEqual(expect.any(Date))
    expect(checkInsRepository.items[0].validated_at).toEqual(expect.any(Date))
  })

  it('should not be to validate an inexistent check-in', async () => {
    expect(async () => 
      await sut.execute({
        checkInId: 'inexistent_check_in_id',
      }),
    ).rejects.toBeInstanceOf(ResourceNotFoundError)
  })

  it('should not be able to validate the check-in after 20 minutes of its creation', async () => {
    vi.setSystemTime(new Date('2022-01-01 10:00:00'))

    const createdCheckIn = await checkInsRepository.create({
      user_id: 'user_id',
      gym_id: 'gym_id',
      validated_at: new Date(),
    })

    vi.advanceTimersByTime(1000 * 60 * 21)

    expect(async () => 
      await sut.execute({
        checkInId: createdCheckIn.id,
      }),
    ).rejects.toBeInstanceOf(Error)
  })
})