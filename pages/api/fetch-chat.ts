import type { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";

const backendBaseUrl = process.env.NEXT_PUBLIC_BACKEND_BASE_URL; // Ensure this is defined in your .env.local
console.log("backendBaseUrl:", backendBaseUrl);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "GET") {
    try {
      // Extract userId from query parameters (e.g., /api/chat-history?userId=123)
      const { chat_id } = req.query;
      console.log("\n chat-history - chat_id------:", chat_id);

      if (!chat_id) {
        return res.status(400).json({ error: "Missing chat_id parameter" });
      }

      // Call Django backend API
      const response = await axios.get(`${backendBaseUrl}/api/chat-messages/${chat_id}`, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      // Forward the Django response to the frontend

      console.log("response chat id:", response.data);
      res.status(response.status).json(response.data);
    } catch (error: unknown) {
      // console.error('Error in chat-history API route:', error);
      if (axios.isAxiosError(error)) {
        res.status(error.response?.status || 500).json({ error: error.message });
      } else {
        res.status(500).json({ error: "An unexpected error occurred" });
      }
    }
  } else {
    // Handle any other HTTP methods
    res.setHeader("Allow", ["GET"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}