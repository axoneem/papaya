import z from "zod";


export const PapayaGenericResourceIdentifierSchema = z.templateLiteral(['papaya:', z.string()]);