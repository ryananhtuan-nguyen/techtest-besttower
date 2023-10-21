type SingleFarm = {
  farmId: string
  towerId: string
  rssi: number
}
type AllFarm = SingleFarm[]

type BestTower = {
  towerId: string
  averageRSSI: number
}
