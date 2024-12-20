import type { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';

const backendBaseUrl = process.env.NEXT_PUBLIC_BACKEND_BASE_URL; // Ensure this is defined in your .env.local

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    try {
      const { email, password, firstName, lastName } = req.body;

      // Call Django backend API for login/signup
      const response = await axios.post(
        `${backendBaseUrl}/api/login/`,
        { email, password, first_name: firstName, last_name: lastName },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      // Forward the Django response to the frontend
      console.log('response:', response)
      res.status(response.status).json(response.data);
    } catch (error: unknown) {
      if (axios.isAxiosError(error) && error.response) {
        res.status(error.response.status).json({ error: error.response.data });
      } else {
        res.status(500).json({ error: 'An unexpected error occurred' });
      }
    }
  } else {
    // Handle any other HTTP methods
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}