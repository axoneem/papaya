
import z from "zod";
import {
  kindSchemaFromNamespace,
  PapayaResourceKind,
  PapayaResourceRid,
  ridSchemaFromNamespace,
  type PapayaResourceNamespace,
} from "./namespace-schemas";

export type ResourceBaseShape<N extends PapayaResourceNamespace> = {
  rid: z.ZodTemplateLiteral<PapayaResourceRid<N>>;
  kind: z.ZodLiteral<PapayaResourceKind<N>>;
  createdAt: z.ZodNullable<z.ZodString>;
  updatedAt: z.ZodNullable<z.ZodString>;
  '@version': z.ZodNumber;
};

export type ResourceSchema<
  N extends PapayaResourceNamespace,
  S extends z.ZodRawShape = z.ZodRawShape
> = z.ZodObject<ResourceBaseShape<N> & S>;

export const createResourceSchema = <
  N extends PapayaResourceNamespace,
  S extends z.ZodRawShape
>(
  namespace: N,
  shape: S
) => {
  return z.object({
    rid: ridSchemaFromNamespace(namespace),
    kind: kindSchemaFromNamespace(namespace),
    createdAt: z.string().nullable(),
    updatedAt: z.string().nullable(),
    '@version': z.number(),
  }).extend(shape) satisfies ResourceSchema<N, S>;
};

export const createResourceFormSchema = <
  S extends z.ZodRawShape,
  F extends z.ZodRawShape
>(
  sourceSchema: z.ZodObject<S>,
  form: F,
) => {
  return z.object({
    ...form,
    '@source': sourceSchema.loose(),
  });
}

export const _createOptionalOrmDocumentSchema = <S extends z.ZodRawShape>(schema: z.ZodObject<S>) => {
  return schema.or(z.object({
    ...schema.shape,
    _id: 'rid' in schema.shape ? schema.shape.rid : z.string(),
    _rev: z.string().optional(),
  }))
}
