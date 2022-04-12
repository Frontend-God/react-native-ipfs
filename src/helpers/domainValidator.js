export function searchValidator(search) {
  if (!search) return "Domain can't be empty."
  return ''
}

export function domainValidator(domain) {
  if (domain[0] == ' ' || domain[domain.length - 1] == ' ')
    return "You can't use Space for first"
  for (let i = 0; i < domain.length - 2; i++) {
    if (domain[i] == ' ' && domain[i + 1] == ' ')
      return "You can't use more than two letters for Domain"
  }
}
