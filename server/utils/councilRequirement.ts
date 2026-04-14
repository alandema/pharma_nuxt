const OPTIONAL_COUNCILS = new Set(['TERAPEUTA INTEGRATIVO'])

export async function isCouncilNumberAndStateRequired(_event: unknown, council: unknown) {
  const normalizedCouncil = typeof council === 'string' ? council.trim().toUpperCase() : ''
  if (!normalizedCouncil) return true

  return !OPTIONAL_COUNCILS.has(normalizedCouncil)
}