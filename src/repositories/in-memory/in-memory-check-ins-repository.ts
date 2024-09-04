import {User, Prisma, Checkin} from "@prisma/client";
import { CheckInsRepository } from "../check-ins-repository";
import { randomUUID } from "node:crypto";
import dayjs from "dayjs";

export class InMemoryCheckInsRepository implements CheckInsRepository {
  public items: Checkin[] = []

  async create(data: Prisma.CheckinUncheckedCreateInput): Promise<Checkin> {
    const checkIn = {
      id: randomUUID(),
      user_id: data.user_id,
      gym_id: data.gym_id,
      validated_at: data.validated_at ? new Date(data.validated_at) : null,
      created_at: new Date(),
    }

    this.items.push(checkIn)

    return checkIn
  }

  async findById(id: string): Promise<Checkin | null> {
    const checkIn = this.items.find(checkIn => checkIn.id === id)

    return checkIn || null
  }

  async findByUserIdOnDate(userId: string, date: Date): Promise<Checkin | null> {
    const startOfTheDay = dayjs(date).startOf('day').toDate()
    const endOfTheDay = dayjs(date).endOf('day').toDate()

    const checkIn = this.items.find(checkIn => {
      const checkInDate = dayjs(checkIn.created_at)
      const isOnSameDate = checkInDate.isAfter(startOfTheDay) && checkInDate.isBefore(endOfTheDay)
      
      return checkIn.user_id === userId && isOnSameDate
    })

    return checkIn || null
  }

  async findManyByUserId(userId: string, page: number): Promise<Checkin[]> {
    const itemsPerPage = 20
    const initialIndex = (page - 1) * itemsPerPage
    const finalIndex = initialIndex + itemsPerPage

    return this.items.filter(checkIn => checkIn.user_id === userId).slice(initialIndex, finalIndex)
  }

  async countByUserId(userId: string): Promise<number> {
    return this.items.filter(checkIn => checkIn.user_id === userId).length
  }

  async save(checkIn: Checkin): Promise<Checkin> {
    const index = this.items.findIndex(item => item.id === checkIn.id)

    this.items[index] = checkIn

    return checkIn
  }
}