import { contentService } from "../application/content.service";
import { CreateContentDto } from "../session/dto/create.content.dto";
import { DeleteContentDto } from "../session/dto/delete.content.dto";
import { ContentDto } from "../session/dto/content.dto";
import { UpdateContentDto } from "../session/dto/update.content.dto";

export const contentUiController = {
  findAll: async (): Promise<ContentDto[]> => {
    return await contentService.findAll();
  },
  findOne: async (id: number): Promise<ContentDto> => {
    return await contentService.findOne(id);
  },
  create: async (dto: CreateContentDto): Promise<void> => {
    return await contentService.create(dto);
  },
  update: async (id: number, dto: UpdateContentDto): Promise<void> => {
    return await contentService.update(id, dto);
  },
  delete: async (dto: DeleteContentDto): Promise<void> => {
    return await contentService.delete(dto);
  },
};