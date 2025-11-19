/**
 * Generic adaptor interface for transforming data from one format to another
 *
 * @template T - Input data type
 * @template R - Output data type
 */
export interface Adaptor<T = unknown, R = unknown> {
  /**
   * Transforms input data to output format
   * @param data - Input data to transform
   * @returns Transformed output data
   */
  adapt(data: T): R;
}
