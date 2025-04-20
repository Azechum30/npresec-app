import { IContent } from "json-as-xlsx";

export type TransformerFn<T> = (data: T) => IContent;

export const createDataTransformer = <T>(transformer: TransformerFn<T>) => {
  return (data: T[]): IContent[] => data.map(transformer);
};
