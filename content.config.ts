import { defineContentConfig, defineCollection, z } from '@nuxt/content'

export default defineContentConfig({
  collections: {
    cids: defineCollection({
      type: 'data',
      source: 'cids.yml',
      schema: z.object({
        codes: z.array(z.object({ id: z.number(), code: z.string(), name: z.string() }))
      })
    }),
    genders: defineCollection({
      type: 'data',
      source: 'genders.yml',
      schema: z.object({
        genders: z.array(z.object({ id: z.number(), code: z.string(), name: z.string() }))
      })
    })
  }
})
