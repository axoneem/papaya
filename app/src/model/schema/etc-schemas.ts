import z from "zod";

export const CurrencyIso4217Schema = z.enum(['USD', 'CAD'])

export const PriceConversionSchema = z.object({
  currency: CurrencyIso4217Schema,
  amount: z.number(),
  reference: z.object({
    empiricalConversionRate: z.number(),
    quotedConversionRate: z.number().nullish(),
    convertedAt: z.iso.datetime(),
    memo: z.string(),
  }).nullish(),
  get convertedFrom() {
    return PriceConversionSchema.nullish();
  }
});

export const PriceSchema = z.object({
  currency: CurrencyIso4217Schema.optional(),
  amount: z.number(),
  convertedFrom: PriceConversionSchema.nullish(),
});

export const PictogramVariantSchema = z.enum(['TEXT', 'PICTORIAL', 'IMAGE'])

export const PictogramSchema = z.object({
  content: z.string(),
  variant: PictogramVariantSchema,
  primaryColor: z.string(),
  secondaryColor: z.string().optional().nullable(),
});

export const AdornedResourceSchema = z.object({
  icon: PictogramSchema.optional(),
  label: z.string(),
})


export const TopicSlugSchema = z.templateLiteral(['papaya:topic:', z.string()]);

export const PersonSlugSchema = z.templateLiteral(['papaya:person:', z.string()]);

export const AccountSlugSchema = z.templateLiteral(['papaya:account:', z.string()]);

export const StampVariantSchema = z.enum([
  'flagged',
  'important',
  'needsreview',
  'reviewed',
  'starred',
  'pinned',
  'archived',
]);

export const StampSlugSchema = z.templateLiteral(['papaya:stamp:', StampVariantSchema]);

export type TopicSlug = z.infer<typeof TopicSlugSchema>;
export type PersonSlug = z.infer<typeof PersonSlugSchema>;
export type AccountSlug = z.infer<typeof AccountSlugSchema>;
export type StampSlug = z.infer<typeof StampSlugSchema>;
export type Price = z.infer<typeof PriceSchema>;
export type PriceConversion = z.infer<typeof PriceConversionSchema>;
export type PictogramVariant = z.output<typeof PictogramVariantSchema>
export type Pictogram = z.infer<typeof PictogramSchema>
export type CurrencyIso4217 = z.output<typeof CurrencyIso4217Schema>;
export type AdornedResource = z.output<typeof AdornedResourceSchema>
export type StampVariant = z.output<typeof StampVariantSchema>
