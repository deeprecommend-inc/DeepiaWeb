import { Order } from '../types/Order';
import { descendingComparator } from './descendingComparator';

export function getComparator<Key extends keyof any>(
    order: Order,
    orderBy: Key,
): (
    a: { [key in Key]: number | number[] | string },
    b: { [key in Key]: number | number[] | string },
) => number {
    return order === 'desc'
        ? (a, b) => -descendingComparator(a, b, orderBy)
        : (a, b) => descendingComparator(a, b, orderBy);
}
