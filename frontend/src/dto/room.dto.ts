import { z } from 'zod'

export const mediaSchema = z.object({
  id: z.number(),
  original_url: z.string(),
  thumbnail_url: z.string().optional(),
})

export const roomSchema = z.object({
  id: z.number(),
  name: z.string(),
  address: z.string(),
  description: z.string().nullable(),
  bedrooms: z.number(),
  bathrooms: z.number(),
  price: z.number(),
  area: z.number(),
  type: z.enum(['rent', 'sale']),
  is_available: z.boolean(),
  media: z.array(mediaSchema).optional(),
})

export const roomFormSchema = z.object({
  name: z.string().min(1, 'Name is required').max(255),
  address: z.string().min(1, 'Address is required').max(255),
  description: z.string().optional(),
  bedrooms: z.coerce.number().min(0),
  bathrooms: z.coerce.number().min(0),
  price: z.coerce.number().min(0),
  area: z.coerce.number().min(0),
  type: z.enum(['rent', 'sale']),
  is_available: z.boolean().default(true),
})

export const roomFiltersSchema = z.object({
  type: z.enum(['rent', 'sale', '']).optional(),
  min_price: z.coerce.number().optional(),
  max_price: z.coerce.number().optional(),
  bedrooms: z.coerce.number().optional(),
  search: z.string().optional(),
})

export type Media = z.infer<typeof mediaSchema>
export type Room = z.infer<typeof roomSchema>
export type RoomForm = z.infer<typeof roomFormSchema>
export type RoomFilters = z.infer<typeof roomFiltersSchema>
