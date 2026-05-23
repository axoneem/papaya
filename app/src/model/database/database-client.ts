'use client';

import { POUCH_DB_DESIGN_DOC_ID, POUCH_DB_NAME } from '@/constants/orm-constants';
import { DatabaseView, databaseViews, PapayaDatabaseView } from '@/model/database/database-views';
import { OrmDocument } from '@/model/types/orm-types';
import PouchDB from 'pouchdb';
import PouchDBFind from 'pouchdb-find';

PouchDB.plugin(PouchDBFind)

let db: PouchDB.Database | null = null


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
  db = new PouchDB(POUCH_DB_NAME)

  // Load the design doc from the database
  let existingDesignDoc: OrmDocument<PapayaDesignDoc> | undefined;

  await db.get(POUCH_DB_DESIGN_DOC_ID).then((doc) => {
    console.log('found: ', doc);
    if (doc && '_id' in doc) {
      existingDesignDoc = doc as unknown as OrmDocument<PapayaDesignDoc>;
      console.log('existing design doc: ', existingDesignDoc);
    }
  }).catch((err) => {
    console.error('error getting design doc: ', err);
  });

  if (existingDesignDoc) {
    if ('@version' in existingDesignDoc) {
      if (existingDesignDoc['@version'] < designDoc['@version']) {
        console.log('design doc needs to be updated');
        await db.put({
          ...existingDesignDoc,
          ...designDoc,
        }).then(() => {
          console.log('design doc updated');
        }).catch((err) => {
          console.error('error putting design doc: ', err);
        });
      }
    } else {
      console.log('design doc has no version');
      await db.remove(existingDesignDoc).catch((err) => {
        console.error('error removing design doc: ', err);
      });
    }
  }
  if (!existingDesignDoc) {
    await db.put(designDoc).then((doc) => {
      console.log('design doc updated');
    }).catch((err) => {
      console.error('error putting design doc: ', err);
    });
  }

  return db;
}

export const getDatabaseClient = async () => {
  if (!db) {
    return initializeDatabaseClient();
  }
  return db
}
