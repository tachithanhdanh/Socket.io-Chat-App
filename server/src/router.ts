import express, { response } from 'express';
const router = express.Router();

router.get('/', (request, response) => {
  response.send('Server is up and running');
});

export default router;