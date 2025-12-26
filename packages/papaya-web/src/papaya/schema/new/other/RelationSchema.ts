import z from "zod";

export const RelatesToSchema = z.literal('RELATES_TO');

export const SplitRelationTypeSchema = z.enum([
  'SPLIT_FROM',
  'SPLIT_TO',
]);

export const GoalOrientedRelationTypeSchema = z.enum([
  'WORKS_TOWARDS',
  'WORKS_AGAINST',
]);

export const AdjustmentRelationTypeSchema = z.enum([
  'ADJUSTS',
  'IS_ADJUSTED_BY',
]);

export const DelayRelationTypeSchema = z.enum([
  'DELAYS',
  'IS_DELAYED_BY',
]);

export const IncurranceRelationTypeSchema = z.enum([
  'INCURS',
  'INCURRED_BY',
]);

export const CorrectionRelationTypeSchema = z.enum([
  'CORRECTS',
  'CORRECTED_BY',
]);

export const ConsolidationRelationTypeSchema = z.enum([
  'CONSOLIDATES',
  'CONSOLIDATED_INTO',
]);

export const RelationTypeSchema = z.union([
  RelatesToSchema,
  SplitRelationTypeSchema,
  GoalOrientedRelationTypeSchema,
  AdjustmentRelationTypeSchema,
  DelayRelationTypeSchema,
  IncurranceRelationTypeSchema,
  CorrectionRelationTypeSchema,
  ConsolidationRelationTypeSchema,
]);
