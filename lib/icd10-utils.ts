import icd10Data from "../data/icd10-codes.json"

export interface ICD10Code {
  code: string
  desc: string
  desc_full?: string
  children: ICD10Code[]
}

// Flatten the hierarchical structure for easy searching
export function flattenICD10Codes(codes: ICD10Code[]): Array<{ code: string; description: string; fullPath: string }> {
  const flattened: Array<{ code: string; description: string; fullPath: string }> = []

  function traverse(codes: ICD10Code[], parentPath = "") {
    codes.forEach((item) => {
      const currentPath = parentPath ? `${parentPath} > ${item.desc}` : item.desc
      const description = item.desc_full || item.desc

      // Only add codes that don't have children (leaf nodes) or are specific codes
      if (item.children.length === 0 || item.code.match(/^[A-Z]\d{2}(\.\d+)?$/)) {
        flattened.push({
          code: item.code,
          description,
          fullPath: currentPath,
        })
      }

      if (item.children.length > 0) {
        traverse(item.children, currentPath)
      }
    })
  }

  traverse(codes)
  return flattened
}

// Search ICD-10 codes
export function searchICD10Codes(
  query: string,
  limit = 50,
): Array<{ code: string; description: string; fullPath: string }> {
  const allCodes = flattenICD10Codes(icd10Data as ICD10Code[])

  if (!query.trim()) {
    return allCodes.slice(0, limit)
  }

  const searchTerm = query.toLowerCase()
  const results = allCodes.filter(
    (item) =>
      item.code.toLowerCase().includes(searchTerm) ||
      item.description.toLowerCase().includes(searchTerm) ||
      item.fullPath.toLowerCase().includes(searchTerm),
  )

  return results.slice(0, limit)
}

// Get common orthopedic ICD-10 codes for quick access
export function getCommonOrthopaedicCodes(): Array<{ code: string; description: string }> {
  return [
    { code: "S72.0", description: "Fracture of neck of femur" },
    { code: "S78.1", description: "Traumatic amputation at level between knee and ankle" },
    { code: "S88.1", description: "Traumatic amputation at level between knee and ankle" },
    { code: "S58.1", description: "Traumatic amputation at level between elbow and wrist" },
    { code: "S68.1", description: "Traumatic amputation of other single finger" },
    { code: "M79.3", description: "Panniculitis, unspecified" },
    { code: "Z89.5", description: "Acquired absence of leg at or below knee" },
    { code: "Z89.6", description: "Acquired absence of leg above knee" },
    { code: "Z89.2", description: "Acquired absence of upper limb above elbow" },
    { code: "Z97.1", description: "Presence of artificial limb (complete) (partial)" },
  ]
}
