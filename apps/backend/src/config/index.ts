import dotenv from "dotenv";

dotenv.config();

export const config = {
  port: parseInt(process.env.PORT || "4000"),
  nodeEnv: process.env.NODE_ENV || "development",
  
  database: {
    url: process.env.DATABASE_URL || "",
  },
  
  redis: {
    host: process.env.REDIS_HOST || "localhost",
    port: parseInt(process.env.REDIS_PORT || "6379"),
    password: process.env.REDIS_PASSWORD,
  },
  
  polymarket: {
    clobApi: "https://clob.polymarket.com",
    gammaApi: "https://gamma-api.polymarket.com",
    dataApi: "https://data-api.polymarket.com",
    apiKey: process.env.POLYMARKET_API_KEY,
    builderKey: process.env.POLYMARKET_BUILDER_KEY,
  },
  
  jwt: {
    secret: process.env.JWT_SECRET || "change-this-secret",
  },
  
  cors: {
    origin: process.env.CORS_ORIGIN || "http://localhost:3000",
  },
};
