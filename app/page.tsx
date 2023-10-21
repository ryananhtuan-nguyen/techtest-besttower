import { findBestTowerByFarmId } from '@/Utils/functions'
import Input from './components/Input'
export default async function Home() {
  return (
    <div className="flex flex-col items-center gap-12 mt-12">
      <h1 className="font-bold">Find &#34;best&#34; tower by Farm Id</h1>
      <Input findTower={findBestTowerByFarmId} />
    </div>
  )
}
