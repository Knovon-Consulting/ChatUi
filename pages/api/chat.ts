import type { NextApiRequest, NextApiResponse } from 'next';
import axios, { AxiosError } from 'axios';

const backendBaseUrl = process.env.NEXT_PUBLIC_BACKEND_BASE_URL; // Ensure this is defined in your .env.local
console.log('backendBaseUrl:', backendBaseUrl)

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    try {
      // Call Django backend API
      const response = await axios.post(
        `${backendBaseUrl}/api/chat/`,
        req.body,
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      // Forward the Django response to the frontend
      res.status(response.status).json(response.data);
    } catch (error: AxiosError) {
      // console.error('Error in chat API route:', error);
      res.status(error.response?.status || 500).json({ error: error.message });
    }
  } else {
    // Handle any other HTTP methods
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}