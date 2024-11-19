import { connection } from "next/server";

export default {
    dialect: 'postgresql',
    schema: "./utils/schema.jsx",
    out: "./drizle",
    dbCredentials:{
        url: "postgresql://AuraDB_owner:lGXdRv7qIu5n@ep-cold-union-a7mrsr0w.ap-southeast-2.aws.neon.tech/AuraDB?sslmode=require",
        connectionStrings: process.env.NEXT_PUBLIC_DATABASE_URL

    }
};