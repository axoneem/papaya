import z from "zod";
import { EntryIdentifierSchema } from "./document/EntrySchema";

export const makePapayaResourceNameSchema = <K extends string = string>(name: `papaya:${K}`) => {
  return z.templateLiteral([name, ':', z.uuid()]);
};

export const makeStemSchema = <K extends string = string, S extends z.ZodRawShape = z.ZodRawShape>(resourceName: `papaya:stem:${K}`, schema: S) => {
  return z.object({
    _id: makePapayaResourceNameSchema(resourceName),
    parentId: EntryIdentifierSchema,
    '@version': z.number(),
  } as const).extend(schema);
};

export const makeDocumentSchema = <K extends string = string, S extends z.ZodRawShape = z.ZodRawShape>(resourceName: `papaya:${K}`, schema: S) => {
  return z.object({
    _id: makePapayaResourceNameSchema(resourceName),
    '@version': z.number(),
  } as const).extend(schema);
};

export const makeResourceSchema = <K extends string = string, S extends z.ZodRawShape = z.ZodRawShape>(resourceName: `papaya:${K}`, schema: S) => {
  return z.object({
    id: makePapayaResourceNameSchema(resourceName),
  } as const).extend(schema);
};
