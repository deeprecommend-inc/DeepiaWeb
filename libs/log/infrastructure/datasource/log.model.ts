export class LogModel {
    id?: number;
    ids?: number[];
    title!: string;
    memo?: string;
    link!: string;
    index?: number;
    categories?: number[];
    category_ids?: number[];
    source_id?: number;
    target_id?: number;
    category_id?: number;
}
