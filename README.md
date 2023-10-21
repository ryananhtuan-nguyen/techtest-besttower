

## Getting Started

-Clone the repo down to your local machine

-First, install the packages needed:

```bash
npm install
# or
yarn install
# or
bun add all
```

-Then, run the dev server:

```bash
npm run dev
# or
yarn run dev
# or 
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

Your browser should now display as per the Demo.JPG inside public folder.

Enter a valid farm Id and hit Find button, the 'best' tower should be calculating and will be showing up.
The result will include the farm ID entered, the best tower ID as well as its average RSSI.
If any of the links failed during the fetch, it will be display on the page (assuming this is a company-internal app).
The result will still be calculating from the successfully fetched data.

Note that this might take a while since we are making fresh api call to the server everytime we hit the button Find

## Tech-stack: 
  - Nextjs, nextjs server functions (experimental)
  - Typescript for safe type check
  - csvtojson - converting data with .csv extension to json format


## Errors handled:
  - GET all links: throw error if cannot get links from the api call, catch it from Front-End and display server error.
  - GET file for each link: since some of the links might have problem retrieving data and some will work properly, instead of throwing an error I saved the failed links to return.
  - A loading state was added in the Front-End to make sure the function is running and the app is not freezed.
