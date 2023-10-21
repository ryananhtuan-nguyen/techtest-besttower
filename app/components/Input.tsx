'use client'
import { useEffect, useState } from 'react'
interface InputProps {
  findTower: (
    farmId: string
  ) => Promise<{ bestTower: BestTower | null; failedLink: string[] }>
}

const Input = ({ findTower }: InputProps) => {
  const [input, setInput] = useState('')
  const [tower, setTower] = useState<BestTower | null>()
  const [clientError, setClientError] = useState(false)
  const [serverError, setServerError] = useState(false)
  const [farmId, setfarmId] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [loadingSec, setLoadingSec] = useState(0)
  const [failedLinks, setFailedLinks] = useState<string[]>([])
  useEffect(() => {
    if (isLoading) {
      const token = setInterval(() => {
        setLoadingSec((prev) => (prev < 6 ? prev + 1 : 0))
        clearInterval(token)
      }, 1000)
    }
  }, [isLoading, loadingSec])
  async function handleSubmit(farmId: string) {
    //display id of the farm
    setfarmId(farmId)
    //reset error state
    setClientError(false)
    setServerError(false)
    //start loading state
    setIsLoading(true)
    //reset previous tower
    setTower(null)
    try {
      const data = await findTower(farmId)

      //Display all links failed from fetching(if applicable)
      setFailedLinks(data.failedLink)

      if (data.bestTower) {
        //Stop loading
        setIsLoading(false)
        //Display data
        setTower(data.bestTower)
      } else {
        //Stop loading
        setIsLoading(false)
        //Error displaying
        setClientError(true)
      }
    } catch (error) {
      setIsLoading(false)
      setServerError(true)
    }
  }

  return (
    <>
      <div className="flex flex-col gap-8 w-full items-center">
        <label htmlFor="id" className="text-center">
          Please enter Farm Id
        </label>
        <input
          type="text"
          id="id"
          className="border-2 border-black w-[50%] text-center"
          onChange={(e) => setInput(e.target.value)}
        />
        <button
          type="button"
          className="border-2 rounded border-black w-20"
          onClick={() => handleSubmit(input)}
        >
          {!tower ? 'Find' : 'Try again'}
        </button>
      </div>
      {isLoading && (
        <>
          <div role="status">
            <svg
              aria-hidden="true"
              className="inline w-8 h-8 mr-2 text-gray-200 animate-spin dark:text-gray-600 fill-purple-600"
              viewBox="0 0 100 101"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                fill="currentColor"
              />
              <path
                d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                fill="currentFill"
              />
            </svg>
            <span className="sr-only">Loading...</span>
          </div>
          <h2 className="text-center text-gray-600">
            Loading, please wait {'.'.repeat(loadingSec)}
          </h2>
        </>
      )}
      {clientError && (
        <h1 className="text-center text-red">
          Cannot find towers of farm with id {farmId}. Please try again with a
          valid Farm Id
        </h1>
      )}
      {serverError && (
        <h1 className="text-center text-red">
          We are having some technical issues with our server. Please try again
          later.
        </h1>
      )}
      {failedLinks.length > 0 && (
        <ul>
          {' '}
          <span className="text-center font-bold">
            Server had problem fetching:
          </span>
          {failedLinks.map((link, idx) => (
            <li key={idx} className="text-center list-disc">
              {link}
            </li>
          ))}
        </ul>
      )}
      {tower && (
        <div className="flex flex-col item-center gap-2">
          <h2>
            {' '}
            <span className="font-bold">Farm&#39;s Id:</span> {farmId}
          </h2>
          <h2>
            {' '}
            <span className="font-bold">Tower&#39;s Id:</span> {tower.towerId}
          </h2>
          <h2>
            <span className="font-bold">Tower&#39;s Average RSSI :</span>{' '}
            {tower.averageRSSI}
          </h2>
        </div>
      )}
    </>
  )
}

export default Input
