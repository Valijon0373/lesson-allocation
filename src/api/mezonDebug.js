/** Mezon (Category API) debug — Console: [Mezon] */

export const MEZON_LOG_PREFIX = "[Mezon]"

const debugEnabled = import.meta.env.DEV

/**
 * @param {string} label
 * @param {unknown} [data]
 */
export function mezonLog(label, data) {
  if (!debugEnabled) return
  if (data === undefined) {
    console.log(MEZON_LOG_PREFIX, label)
    return
  }
  console.log(MEZON_LOG_PREFIX, label, data)
}

/**
 * @param {string} label
 * @param {unknown} [data]
 */
export function mezonWarn(label, data) {
  if (!debugEnabled) return
  if (data === undefined) {
    console.warn(MEZON_LOG_PREFIX, label)
    return
  }
  console.warn(MEZON_LOG_PREFIX, label, data)
}

/**
 * @param {string} label
 * @param {unknown} err
 * @param {Record<string, unknown>} [extra]
 */
export function mezonError(label, err, extra) {
  console.error(MEZON_LOG_PREFIX, label, {
    xato: err instanceof Error ? err.message : String(err),
    stack: err instanceof Error ? err.stack : undefined,
    ...extra,
  })
}
