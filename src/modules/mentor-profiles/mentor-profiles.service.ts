import { Injectable, NotFoundException } from '@nestjs/common';
import { Update_Mentor_ProfileDto } from './interfaces/update-mentor';
import { PrismaService } from 'src/core/prisma/prisma.service';

@Injectable()
export class MentorProfilesService {

    constructor(private prismaService: PrismaService) { }

    async update(id: number, payload: Partial<Update_Mentor_ProfileDto>) {
        let updated = await this.prismaService.mentorProfile.update(
            {
                where: { user_id: id }, data: {...payload, user_id: id}
            }
        )
        if (!updated) {
          throw new NotFoundException(`This ${id} is Not Found!`)
        }
        
        return {success: true, message: 'Successfully Updated Mentor Profile', data: updated}
    }

    async get_all() {
        let all = await this.prismaService.mentorProfile.findMany()
        return {success: true, message: 'SuccessFully Geted All Mentor Profiles', data: all}
    }

    async get_one_by_id(id: number) {
        let one = await this.prismaService.mentorProfile.findFirst(
            {
                where: {id: id}
            }
        )
        if (!one) throw new NotFoundException(`This ${id} Is Not Found!`)
        
        return  {success: true, message: 'SuccessFully Get One Mentor Profiles', data: one }
    }

    async get_one_by_job(job: string) {
        let one_job = await this.prismaService.mentorProfile.findMany(
            {
                where: {job: job}
            }
        )
        if (!one_job) throw new NotFoundException(`This ${job} Is Not Found!`)
        
        return  {success: true, message: 'SuccessFully Get One Mentor Profiles', data: one_job }
    }

    async get_one_by_experience(experience: number) {
        let one_experience = await this.prismaService.mentorProfile.findMany(
            {
                where: {experience: experience}
            }
        )
        if (!one_experience) throw new NotFoundException(`This ${experience} Is Not Found!`)
        
        return  {success: true, message: 'SuccessFully Get One Mentor Profiles', data: one_experience }
    }

    

}
