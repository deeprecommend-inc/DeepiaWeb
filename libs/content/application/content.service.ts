import { contentCommand } from "../infrastructure/command/content.command";
import { contentQuery } from "../infrastructure/query/content.query";
import { UpdateContentDto } from "../session/dto/update.content.dto";
import { ContentMapper } from "../session/mapper/content.mapper";
import { ContentDto } from "../session/dto/content.dto";
import { CreateContentDto } from "../session/dto/create.content.dto";
import { DeleteContentDto } from "../session/dto/delete.content.dto";

export const contentService = {
  findAll: async (): Promise<ContentDto[]> => {
    return await contentQuery.findAll();
  },
  findOne: async (id: number): Promise<ContentDto> => {
    return await contentQuery.findOne(id);
  },
  create: async (dto: CreateContentDto): Promise<void> => {
    const domain = ContentMapper.toDomain(dto);
    return await contentCommand.create(domain);
  },
  update: async (id: number, dto: UpdateContentDto): Promise<void> => {
    const domain = ContentMapper.toDomain(dto);
    return await contentCommand.update(id, domain);
  },
  delete: async (dto: DeleteContentDto): Promise<void> => {
    const domain = ContentMapper.toDomain(dto);
    return await contentCommand.delete(domain);
  },
};
