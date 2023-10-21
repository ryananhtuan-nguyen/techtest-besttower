import csvtojson from 'csvtojson'

//convert csv file to json format from API call
const convertCsvToJson = async (apiURL: string) => {
  'use server'
  try {
    const response = await fetch(apiURL)
    const csvData = await response.text()
    const jsonData = await csvtojson().fromString(csvData)
    return jsonData
  } catch (error) {
    console.error(`Something went wrong with ${apiURL}`)
  }
}

//Fetching data from the links got from GET links
export async function fetchData(): Promise<{
  allData: AllFarm
  failedLink: string[]
}> {
  'use server'

  //get all links to all files
  try {
    const response = await fetch('https://api.onizmx.com/lambda/tower_stream', {
      cache: 'no-store',
    })
    //setup failed links to handle error
    const failedLink: string[] = []

    //checking response status
    if (!response.ok) throw new Error()

    //reformat links
    const links = await response.json()

    //Preparing data to return
    let allData: AllFarm = []

    //Fetching data from all links received
    for (let i = 0; i < links.length; i++) {
      const data = await convertCsvToJson(links[i] as string)
      //successfully fetched
      if (data !== undefined && data !== null) {
        allData = [...allData, ...data]
      } else {
        //push failed links to return
        failedLink.push(`${links[i]}`)
      }
    }
    return { allData, failedLink }
  } catch (err) {
    console.error('Problem loading api links')
    throw new Error('Something went wrong while fetching api links')
  }
}

export async function findBestTowerByFarmId(
  farmId: string
): Promise<{ bestTower: BestTower | null; failedLink: string[] }> {
  'use server'

  //Call the fetchData function to get all Data
  const response = await fetchData()
  const allData = response.allData
  const failedLink = response.failedLink
  let bestTower: any = {}
  //Find all towers of provided farm ID
  const allTowersOfFarm = allData.filter((item) => item.farmId == farmId)
  //exit the function if can not find farm ID or the response from fetchData is empty
  if (allTowersOfFarm.length == 0) {
    bestTower = null
    return { bestTower: null, failedLink }
  }

  const towers: any = {}
  //Reformating all towers of current farm
  //New format: {<towerId>: <allRSSI[]?  as string[]}
  allTowersOfFarm.forEach((item) => {
    if (!towers[item.towerId]) towers[item.towerId] = [item.rssi]
    else towers[item.towerId].push(item.rssi)
  })

  //Calculating each tower's average RSSI

  for (const towerId in towers) {
    const count = towers[towerId].length
    towers[towerId] =
      towers[towerId].reduce((a: string, b: string) => +a + +b, 0) / count
  }

  //finding the highest average rssi
  const maxRssi = Math.max(...(Object.values(towers) as number[]))

  //save tower with highest average rssi to return
  for (const towerId in towers) {
    if (towers[towerId] === maxRssi) {
      bestTower['towerId'] = towerId
      bestTower['averageRSSI'] = towers[towerId]
    }
  }

  //returning data
  return { bestTower, failedLink }
}
