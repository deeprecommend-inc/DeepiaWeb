import { ContentDto } from "../../session/dto/content.dto";
import { contentRepo } from "../repository/content.repository";

export const contentQuery = {
  findAll: async (): Promise<ContentDto[]> => {
    return await contentRepo.findAll();
  },
  findOne: async (id: number): Promise<ContentDto> => {
    return await contentRepo.findOne(id);
  },
};
