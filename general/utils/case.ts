import camelCase from 'camelcase-keys';
import snakeCase from 'snakecase-keys';

export class Case {
    static toCamel(obj: any): any {
        return camelCase(obj);
    }

    static toSnake(obj: any): any {
        return snakeCase(obj);
    }
}
