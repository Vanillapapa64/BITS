import {z} from 'zod'
export const map=z.object({
    userLat:z.string(),
    userLng:z.string(),
    radius:z.number(),
    keyword:z.string()
})