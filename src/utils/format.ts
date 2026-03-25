export function formatearRut(rut: string | undefined | null): string {
  if (!rut) return '—'
  const clean = rut.replace(/\./g, '').replace(/\s/g, '').toUpperCase()
  const [body, dv] = clean.split('-')
  if (!body || !dv) return rut
  const formatted = body.replace(/\B(?=(\d{3})+(?!\d))/g, '.')
  return `${formatted}-${dv}`
}
