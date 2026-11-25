import { MongoClient, type Db, type Collection } from "mongodb";

export type PassageDoc = {
  _id: string;
  version: number;
  sourceId: string;
  sourceType: string;
  title: string;
  section: string;
  text: string;
  embedding: number[];
  citationUrl?: string;
  contentHash: string;
  visibility: "public";
  chunkIndex: number;
  createdAt: Date;
};

export type SourceDoc = {
  _id: string;
  sourceId: string;
  type: string;
  title: string;
  url?: string;
  lastSyncedAt: Date;
  version: number;
};

export type MetaDoc = {
  _id: "active";
  activeVersion: number;
  embeddingModel: string;
  embeddingDim: number;
  lastIngestAt: Date;
};

export type AnswerCacheDoc = {
  _id: string;
  key: string;
  answer: string;
  citationIds: string[];
  ttl: Date;
  cacheVersion: string;
};

const globalForMongo = globalThis as typeof globalThis & {
  __mongoClientPromise?: Promise<MongoClient>;
};

function getMongoUri(): string {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    throw new Error("MONGODB_URI environment variable is not set.");
  }
  return uri;
}

export async function getMongoClient(): Promise<MongoClient> {
  if (!globalForMongo.__mongoClientPromise) {
    const client = new MongoClient(getMongoUri(), {
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
    });
    globalForMongo.__mongoClientPromise = client.connect().catch((err) => {
      globalForMongo.__mongoClientPromise = undefined;
      throw err;
    });
  }
  return globalForMongo.__mongoClientPromise;
}

export async function getDb(): Promise<Db> {
  const client = await getMongoClient();
  const dbName = process.env.MONGODB_DB || "portfolio_chat";
  return client.db(dbName);
}

export async function getCollections(): Promise<{
  passages: Collection<PassageDoc>;
  sources: Collection<SourceDoc>;
  meta: Collection<MetaDoc>;
  answerCache: Collection<AnswerCacheDoc>;
}> {
  const db = await getDb();
  return {
    passages: db.collection<PassageDoc>("passages"),
    sources: db.collection<SourceDoc>("sources"),
    meta: db.collection<MetaDoc>("meta"),
    answerCache: db.collection<AnswerCacheDoc>("answer_cache"),
  };
}
