import { EventEntity } from "@/types";

/**
 * 値が EventEntity かどうかをチェックする
 *
 * @param {EventEntity} item EventEntity かどうかをチェックする値
 * @returns {boolean} 値が EventEntity かどうか
 */
export const isEventEntity = (item: unknown) =>
    !!(item as EventEntity).summary &&
    !!(item as EventEntity).location &&
    !!(item as EventEntity).description &&
    !!(item as EventEntity).start &&
    !!(item as EventEntity).end;

/**
 * 値が存在するかどうかをチェックする
 *
 * @param {unknown} value 存在チェックを行う値
 * @returns {boolean} 値が存在しているかどうか
 */
export function isset(value: unknown): boolean {
    return !isUndefined(value) && !isNull(value);
}

/**
 *  値が空かどうかをチェックする
 *
 * @param {unknown} value 空チェックを行う値
 * @returns {boolean} 値が空かどうか
 */
export function empty(value: unknown): boolean {
    if (isUndefined(value)) return true;

    if (isNull(value)) return true;

    if (typeof value === "string") return value === "";

    if (Array.isArray(value)) return value.length === 0;

    if (typeof value === "object") return Object.keys(value ?? {}).length === 0;

    return false;
}

/**
 * 値が undefined かどうかをチェックする
 *
 * @param {unknown} value undefined かどうかをチェックする値
 * @returns {boolean} 値が undefined かどうか
 */
export function isUndefined(value: unknown): boolean {
    return typeof value === "undefined";
}

/**
 * 値が null かどうかをチェックする
 *
 * @param {unknown} value null かどうかをチェックする値
 * @returns {boolean} 値が null かどうか
 */
export function isNull(value: unknown): boolean {
    return value === null;
}
