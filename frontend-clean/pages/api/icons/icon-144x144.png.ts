import { NextApiRequest, NextApiResponse } from 'next';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  // SVG content cho icon 144x144
  const svgContent = `<svg width="144" height="144" viewBox="0 0 144 144" xmlns="http://www.w3.org/2000/svg">
    <rect width="144" height="144" fill="#ff6b35" rx="20"/>
    <path fill="white" d="M72 30c-23.196 0-42 18.804-42 42s18.804 42 42 42 42-18.804 42-42-18.804-42-42-42zm0 8c18.778 0 34 15.222 34 34s-15.222 34-34 34-34-15.222-34-34 15.222-34 34-34zm-12 20v8h-8v8h8v8h8v-8h8v-8h-8v-8h-8z"/>
    <text x="72" y="120" text-anchor="middle" fill="white" font-family="Arial, sans-serif" font-size="14" font-weight="bold">Smart Cook</text>
  </svg>`;

  res.setHeader('Content-Type', 'image/svg+xml');
  res.setHeader('Cache-Control', 'public, max-age=86400'); // Cache for 1 day
  res.status(200).send(svgContent);
}
