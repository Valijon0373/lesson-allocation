/** @type {Record<string, string>} */
export const PERMISSION_LABELS_UZ = {
"USER_VIEW": "Foydalanuvchilarni ko'rish",
"DEPARTMENT_EDIT": "Kafedrani tahrirlash",
"DEPARTMENT_CREATE": "Kafedra qo'shish",
"POSITION_DELETE": "Lavozimni o'chirish",
"CATEGORY_EDIT": "Kategoriyani tahrirlash",
"PERMISSION_DELETE": "Ruxsatni o'chirish",
"USER_CREATE": "Foydalanuvchi qo'shish",
"FACULTY_DELETE": "Fakultetni o'chirish",
"CATEGORY_CREATE": "Kategoriya qo'shish",
"CRITERIA_VIEW": "Mezonlarni ko'rish",
"FACULTY_EDIT": "Fakultetni tahrirlash",
"POSITION_CREATE": "Lavozim qo'shish",
"PERMISSION_EDIT": "Ruxsatni tahrirlash",
"FACULTY_CREATE": "Fakultet qo'shish",
"CATEGORY_DELETE": "Kategoriyani o'chirish",
"PERMISSION_VIEW": "Ruxsatlarni ko'rish",
"USER_DELETE": "Foydalanuvchini o'chirish",
"POSITION_EDIT": "Lavozimni tahrirlash",
"CRITERIA_DELETE": "Mezonni o'chirish",
"CRITERIA_EDIT": "Mezonni tahrirlash",
"USER_EDIT": "Foydalanuvchini tahrirlash",
"DEPARTMENT_VIEW": "Kafedralarni ko'rish",
"CATEGORY_VIEW": "Kategoriyalarni ko'rish",
"POSITION_VIEW": "Lavozimlarni ko'rish",
"DEPARTMENT_DELETE": "Kafedrani o'chirish",
"CRITERIA_CREATE": "Mezon yaratish",
"FACULTY_VIEW": "Fakultetlarni ko'rish",
"PERMISSION_CREATE": "Ruxsat qo'shish"
}

/** @type {{ id: string, label: string }[]} */
export const PERMISSION_OPTIONS_UZ = Object.entries(PERMISSION_LABELS_UZ).map(([id, label]) => ({
  id,
  label,
}))

const ENTITY_UZ = {
  faculty: "Fakultet",
  department: "Kafedra",
  position: "Lavozim",
  user: "Foydalanuvchi",
  teacher: "O'qituvchi",
  criterion: "Mezon",
  criteria: "Mezon",
  criterialar: "Mezon",
}

const ACTION_UZ = {
  view: "ko'rish",
  add: "qo'shish",
  create: "yaratish",
  edit: "tahrirlash",
  delete: "o'chirish",
  password: "parolini o'zgartirish",
  permissions: "ruxsatlarini boshqarish",
}

/** @param {unknown} key */
export function normalizePermissionKey(key) {
  return String(key ?? "")
    .trim()
    .toLowerCase()
    .replace(/[\s.\-–—]+/g, "_")
    .replace(/[^a-z0-9_]/g, "")
    .replace(/_+/g, "_")
    .replace(/^_|_$/g, "")
}

/** @param {unknown} code */
export function getPermissionLabelUz(code) {
  const key = normalizePermissionKey(code)
  if (!key) return ""
  if (PERMISSION_LABELS_UZ[key]) return PERMISSION_LABELS_UZ[key]

  const parts = key.split("_").filter(Boolean)
  if (parts.length >= 2) {
    const action = parts[parts.length - 1]
    const entityKey = parts.slice(0, -1).join("_")
    const entity =
      ENTITY_UZ[entityKey] ??
      ENTITY_UZ[parts[0]] ??
      entityKey.replace(/_/g, " ")
    const actionUz = ACTION_UZ[action] ?? action.replace(/_/g, " ")
    if (entity && actionUz) {
      const entityLower = entity.toLowerCase()
      if (action === "view") {
        const isMezon = entityKey === "criterion" || entityKey === "criteria" || parts[0] === "criterion" || parts[0] === "criteria"
        if (isMezon) return "Mezonlarni ko'rish"
        if (!entityLower.endsWith("lar")) return `${entity}larni ${actionUz}`
      }
      if (action === "add" || action === "create") {
        const isMezon = entityKey === "criterion" || entityKey === "criteria" || parts[0] === "criterion" || parts[0] === "criteria"
        return isMezon ? "Mezon yaratish" : `${entity} yaratish`
      }
      if (action === "edit") return `${entity}ni tahrirlash`
      if (action === "delete") return `${entity}ni o'chirish`
      if (action === "password") return `${entity} ${actionUz}`
      if (action === "permissions") return `${entity} ${actionUz}`
      return `${entity} — ${actionUz}`
    }
  }

  return key.replace(/_/g, " ")
}

/**
 * @param {{ id: string, label?: string }[]} catalog
 * @returns {{ id: string, label: string }[]}
 */
export function mergePermissionOptionsFromCatalog(catalog) {
  if (!catalog?.length) return PERMISSION_OPTIONS_UZ

  /** @type {Map<string, { id: string, label: string }>} */
  const byId = new Map()
  for (const item of catalog) {
    const id = normalizePermissionKey(item.id)
    if (!id) continue
    byId.set(id, { id, label: getPermissionLabelUz(id) })
  }

  for (const opt of PERMISSION_OPTIONS_UZ) {
    if (!byId.has(opt.id)) byId.set(opt.id, opt)
  }

  const ordered = PERMISSION_OPTIONS_UZ.map((opt) => byId.get(opt.id)).filter(Boolean)
  for (const opt of byId.values()) {
    if (!PERMISSION_OPTIONS_UZ.some((o) => o.id === opt.id)) ordered.push(opt)
  }
  return ordered
}
