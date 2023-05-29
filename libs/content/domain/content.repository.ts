import { ContentDto } from '../session/dto/content.dto';
import { ContentQueryDto } from '../session/dto/content.query.dto';
import { Content } from './content';

export type ContentRepo = {
    find(query: ContentQueryDto): Promise<ContentDto[]>;
    findAll(): Promise<ContentDto[]>;
    findByUser(): Promise<ContentDto[]>;
    findOne(id: number): Promise<ContentDto>;
    create(domain: Content): Promise<void>;
    update(id: number, domain: Content): Promise<void>;
    delete(id: number): Promise<void>;
};
