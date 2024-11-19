import { neon } from "@neondatabse/serverless"
import {drizzle} from 'drizzle-orm/neon-http'
import * as schema from './schema' //Imports everything from ./schema

const sql = neon(
    process.env.NEXT_PUBLIC_DATABASE_URL
) // neon takes DB url as param

export const db = drizzle(sql, { schema });