import express from 'express';
const router = express.Router();


router.get('/', (req, res) => {
  res.json({ message: 'Hello from server!', success: true });
});

export default router;
