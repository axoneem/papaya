import { SCHEMA_VERSION } from "@/constants/orm-constants";
import { getDatabaseClient } from "@/model/database/database-client";
import { ResourceSchemaRegistry } from "@/model/orm/ResourceSchemaRegistry";
import { PapayaResourceNamespace, PapayaResourceRid } from "@/model/schema/namespace-schemas";
import { OrmDocument } from "@/model/types/orm-types";
import { timestamp } from "@/utils/date-utils";
import { v6 as uuidv6 } from "uuid";
import z from "zod";

type ResourceBaseShapeKeys = 'rid' | 'kind' | 'createdAt' | 'updatedAt' | '@version'

type Resource<N extends PapayaResourceNamespace> = z.infer<typeof ResourceSchemaRegistry[N]>;

export type PapayaResource = Resource<PapayaResourceNamespace>

export type ResourceIntrinsic<N extends PapayaResourceNamespace> =
  & Omit<Resource<N>, ResourceBaseShapeKeys>
  & Partial<Pick<Resource<N>, ResourceBaseShapeKeys>>;

export abstract class Repository<N extends PapayaResourceNamespace> {
  protected readonly getDb = getDatabaseClient;

  protected readonly schema: (typeof ResourceSchemaRegistry)[N];

  constructor(ns: N) {
    this.schema = ResourceSchemaRegistry[ns];
  }

  /**
   * Abstract factory method that describes how to make a new resource,
   * excluding the resource base.
   */
  protected abstract factory(data: Partial<Resource<N>>): ResourceIntrinsic<N>;

  /**
   * Abstract method that is called before a resource is saved to the database.
   * This allows for additional processing of the resource before it is saved,
   * such as adding timestamps or other metadata.
   */
  protected beforeSave(data: Resource<N> & Partial<OrmDocument>): Promise<Resource<N> & Partial<OrmDocument>> {
    return Promise.resolve(data);
  }

  public validate(data: Resource<N>) {
    return this.schema.safeParse(data)
  }

  public makeRid() {
    return `${this.schema.shape.kind.value}:${uuidv6()}` as PapayaResourceRid<N>;
  }

  /**
   * Static object that contains the methods for the model.
   */
  Model = {
    /**
     * Returns a new resource without persisting.
     */
    make: (data: Partial<Resource<N>> = {}): Resource<N> => {
      const resource: ResourceIntrinsic<N> = this.factory(data);
      const kind = this.schema.shape.kind.value;
      return {
        rid: this.makeRid(),
        kind,
        createdAt: null,
        updatedAt: null,
        '@version': SCHEMA_VERSION,
        ...resource,
      } as Resource<N>;
    },

    /**
     * Creates a new resource and persists it to the database.
     */
    create: async (data: Partial<Resource<N>> = {}): Promise<OrmDocument<Resource<N>>> => {
      const resource = this.Model.make(data);
      return this.Model.save(resource as Resource<N> & Partial<OrmDocument<Resource<N>>>);
    },

    /**
     * Updates a resource and persists it to the database.
     */
    save: async (data: Resource<N> & Partial<OrmDocument>): Promise<OrmDocument<Resource<N>>> => {

      const doc: OrmDocument<Resource<N>> = {
        ...data,
        _id: data._id ?? data.rid,
        _rev: data._rev ?? undefined,
      };

      const db = await this.getDb();

      const processedDoc = timestamp(await this.beforeSave(doc)) as OrmDocument<Resource<N>>

      const response = await db.put(processedDoc as PouchDB.Core.PutDocument<Resource<N>>) as PouchDB.Core.Response;

      return {
        ...processedDoc,
        _rev: response.rev,
      };
    },
  } as const;

}
