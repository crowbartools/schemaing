export interface SchemaBase {
    type: string;
}

export const validateSchema = <T extends SchemaBase>(schema: any, type: string) : schema is T => (
    schema != null &&
    schema.type === type
);