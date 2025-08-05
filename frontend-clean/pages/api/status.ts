import { NextApiRequest, NextApiResponse } from "next";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  res.status(200).json({
    status: "ok",
    message: "Smart Cooking AI Frontend is running",
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || "development",
    features: {
      nextAuth: true,
      icons: true,
      manifest: true,
    },
  });
}
