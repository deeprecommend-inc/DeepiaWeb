import { asyncApiClient } from "../../../core/api.client";
import { Content } from "../../domain/content";
import { ContentRepo } from "../../domain/content.repository";
import { ContentDto } from "../../session/dto/content.dto";
import { ContentMapper } from "../../session/mapper/content.mapper";
import { ContentModel } from "../datasource/content.model";

export const contentRepo: ContentRepo = {
  findAll: async (): Promise<ContentDto[]> => {
    const apiClient = await asyncApiClient.create();
    const res = await apiClient.get<ContentModel[]>("/content/");
    const dto = res.data.map((o) => ContentMapper.toDto(o));
    return dto;
  },
  findOne: async (id: number): Promise<ContentDto> => {
    const apiClient = await asyncApiClient.create();
    const res = await apiClient.get<ContentModel>(`/content/${id}/`);
    const dto = ContentMapper.toDto(res.data);
    return dto;
  },
  create: async (domain: Content): Promise<void> => {
    const apiClient = await asyncApiClient.create();
    const model = await ContentMapper.toPersistence(domain);
    console.log({ model });
    await apiClient.post<void>("/content/", model);
  },
  update: async (id: number, domain: Content): Promise<void> => {
    const apiClient = await asyncApiClient.create();
    const model = await ContentMapper.toPersistence(domain);
    await apiClient.put<void>(`/content/${id}/`, model);
  },
  delete: async (domain: Content): Promise<void> => {
    const apiClient = await asyncApiClient.create();
    const model = await ContentMapper.toPersistence(domain);
    await apiClient.post<void>(`/content/delete/`, model);
  },
};
