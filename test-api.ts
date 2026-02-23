import { createApiKey } from './app/actions/apiKeyActions.js';
(async () => {
  try {
    const res = await createApiKey({ userId: 'test-user', keyName: 'test' });
    console.log(res);
  } catch(e) {
    console.error(e);
  }
})();
