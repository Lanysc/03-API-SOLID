import {Gym, Prisma} from "@prisma/client";
import { FindManyNearbyParams, GymsRepository } from "../gyms-repository";
import { randomUUID } from "crypto";
import { title } from "process";
import { getDistanceBetweenCoordinates } from "@/utils/get-distance-between-coordinates";

export class InMemoryGymsRepository implements GymsRepository {
  public gyms: Gym[] = []

  async create(data: Prisma.GymCreateInput): Promise<Gym> {
    const gym = {
      id: data.id ?? randomUUID(),
      title: data.title,
      description: data.description ?? null,
      phone: data.phone ?? null,
      latitude: new Prisma.Decimal( data.latitude.toString() ),
      longitude: new Prisma.Decimal( data.longitude.toString() ),
      created_at: new Date(),
    }

    this.gyms.push(gym)

    return gym
  }
  async findById(gymId: string): Promise<Gym | null> {
    const gym = this.gyms.find(gym => gym.id === gymId)

    return gym || null
  }

  async searchMany(query: string, page: number): Promise<Gym[]> {
    const itemsPerPage = 20
    const initialIndex = (page - 1) * itemsPerPage
    const finalIndex = initialIndex + itemsPerPage

    return this.gyms.filter(gym => gym.title.includes(query)).slice(initialIndex, finalIndex)
  }

  async findManyNearby(params: FindManyNearbyParams): Promise<Gym[]> {
    return this.gyms.filter(gym => {
      const distance = getDistanceBetweenCoordinates({
        latitude: params.latitude,
        longitude: params.longitude,
      },
      {
        latitude: Number(gym.latitude),
        longitude: Number(gym.longitude),
      })

      return distance < 10 // 10km
      }
    )
  }
}