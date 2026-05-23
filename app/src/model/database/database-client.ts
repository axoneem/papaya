'use client';

import { POUCH_DB_DESIGN_DOC_ID, POUCH_DB_NAME } from '@/constants/orm-constants';
import { DatabaseView, databaseViews, PapayaDatabaseView } from '@/model/database/database-views';
import { OrmDocument } from '@/model/types/orm-types';
import PouchDB from 'pouchdb';
import PouchDBFind from 'pouchdb-find';

PouchDB.plugin(PouchDBFind)

let dbClient: PouchDB.Database | null = null

type PapayaDesignDoc = {
  '_id': typeof POUCH_DB_DESIGN_DOC_ID;
  version: number;
  views: Record<PapayaDatabaseView, {
    map: string;
    reduce?: string;
  }>;
}

const designDoc: PapayaDesignDoc = {
  '_id': POUCH_DB_DESIGN_DOC_ID,
  version: 20260427,
  views: Object.fromEntries(
    Object
      .entries(databaseViews)
      .map(([name, view]: [PapayaDatabaseView, DatabaseView]) => {
        return [
          name,
          {
            map: view.map.toString(),
            reduce: view.reduce?.toString(),
          },
        ];
      })
  ) as Record<PapayaDatabaseView, {
    map: string;
    reduce?: string;
  }>,
} as const;

const initializeDatabaseClient = async () => {
  console.log('initializing database client');
  const db = new PouchDB(POUCH_DB_NAME)

  // Load the design doc from the database
  let existingDesignDoc: OrmDocument<PapayaDesignDoc> | undefined = undefined;

  await db.get(POUCH_DB_DESIGN_DOC_ID).then((doc) => {
    if (doc && '_id' in doc) {
      existingDesignDoc = doc as unknown as OrmDocument<PapayaDesignDoc>;
    }
  }).catch((err: PouchDB.Core.Error) => {
    if (err.status !== 404) {
      console.error('error getting design doc: ', err);
    }
  });

  if (!existingDesignDoc) {
    await db.put(designDoc).catch((err) => {
      console.error('error creating design doc: ', err);
    });
  } else if (!('version' in existingDesignDoc) || existingDesignDoc.version < designDoc.version) {
    await db.put({
      ...existingDesignDoc,
      ...designDoc,
    }).catch((err) => {
      console.error('error updating design doc: ', err);
    });
  }

  dbClient = db;
  return dbClient;
}

export const getDatabaseClient = async () => {
  if (!dbClient) {
    return initializeDatabaseClient();
  }
  return dbClient;
}
