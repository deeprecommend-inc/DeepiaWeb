import { ContentDto } from "../session/dto/content.dto";
import { Content } from "./content";

export type ContentRepo = {
  findAll(): Promise<ContentDto[]>;
  findOne(id: number): Promise<ContentDto>;
  create(domain: Content): Promise<void>;
  update(id: number, domain: Content): Promise<void>;
  delete(domain: Content): Promise<void>;
};
