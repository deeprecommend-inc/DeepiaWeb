export class CreateLogDto {
    title!: string;
    link!: string;
    memo?: string;
    categoryIds!: number[];
}
