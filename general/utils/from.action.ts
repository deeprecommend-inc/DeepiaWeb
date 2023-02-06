export const fromAction = {
    create: 'create',
    update: 'update',
    delete: 'delete',
} as const;

export type FromAction = typeof fromAction[keyof typeof fromAction];
