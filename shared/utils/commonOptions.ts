export const GENDER_OPTIONS = ['Masculino', 'Feminino'] as const

export type GenderOption = (typeof GENDER_OPTIONS)[number]