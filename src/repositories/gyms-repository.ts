import { Gym } from "@prisma/client";

export interface GymsRepository {
    // create(data: Prisma.CheckInUncheckedCreateInput): Promise<CheckIn>
    findById(id: string): Promise<Gym | null>
}