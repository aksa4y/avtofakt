export interface Calculation {
  battery: number
  from: number
  to: number
  tariff: number
  loss: number
  consumption: number
  petrolConsumption: number
  petrolPrice: number
}
export function calculate(v: Calculation) {
  if (
    Object.values(v).some((n) => !Number.isFinite(n)) ||
    v.battery <= 0 ||
    v.from < 0 ||
    v.to > 100 ||
    v.to <= v.from ||
    v.loss < 0 ||
    v.loss >= 100 ||
    v.tariff < 0 ||
    v.consumption <= 0 ||
    v.petrolConsumption <= 0 ||
    v.petrolPrice < 0
  )
    return null
  const energy = (v.battery * (v.to - v.from)) / 100 / (1 - v.loss / 100)
  const electric100 = (v.consumption / (1 - v.loss / 100)) * v.tariff
  const petrol100 = v.petrolConsumption * v.petrolPrice
  return {
    energy,
    cost: energy * v.tariff,
    electric100,
    petrol100,
    savings: petrol100 - electric100,
  }
}
