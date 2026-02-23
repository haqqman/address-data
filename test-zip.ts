import { lookupZipCode } from './app/actions/addressActions';

async function run() {
  const result = await lookupZipCode({
    street: 'Computer Village',
    city: 'Ikeja',
    lga: 'Ikeja',
    state: 'Lagos'
  });
  console.log('Lookup Result:', result);
}

run().catch(console.error);
