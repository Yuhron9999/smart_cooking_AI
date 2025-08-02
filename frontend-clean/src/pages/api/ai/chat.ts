// API Route - AI Chat endpoint
import { NextApiRequest, NextApiResponse } from "next";

interface ChatRequest {
  message: string;
  language?: string;
  context?: string[];
}

interface ChatResponse {
  success: boolean;
  response?: string;
  recipeData?: {
    title: string;
    ingredients: string[];
    instructions: string[];
    cookTime: number;
    difficulty: string;
  };
  error?: string;
}

const AI_SERVICE_URL = process.env.AI_SERVICE_URL || "http://localhost:8001";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ChatResponse>
) {
  if (req.method !== "POST") {
    return res
      .status(405)
      .json({ success: false, error: "Method not allowed" });
  }

  try {
    const { message, language = "vi", context = [] }: ChatRequest = req.body;

    if (!message || !message.trim()) {
      return res.status(400).json({
        success: false,
        error: "Message is required",
      });
    }

    // Call AI service
    const response = await fetch(`${AI_SERVICE_URL}/api/ai/chat`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        message: message.trim(),
        language,
        context,
      }),
    });

    if (!response.ok) {
      console.error("AI Service error:", response.status, response.statusText);
      return res.status(500).json({
        success: false,
        error: "AI service unavailable",
      });
    }

    const data = await response.json();

    // Extract recipe data if present in response
    let recipeData = undefined;
    if (data.data?.recipe_data) {
      recipeData = {
        title: data.data.recipe_data.title || "",
        ingredients: data.data.recipe_data.ingredients || [],
        instructions: data.data.recipe_data.instructions || [],
        cookTime: data.data.recipe_data.cook_time || 0,
        difficulty: data.data.recipe_data.difficulty || "medium",
      };
    }

    return res.status(200).json({
      success: true,
      response:
        data.data?.response ||
        data.response ||
        "Xin lỗi, tôi không thể trả lời câu hỏi này.",
      recipeData,
    });
  } catch (error) {
    console.error("Chat API error:", error);

    // Fallback response for common cooking questions
    const { message } = req.body;
    const lowerMessage = message?.toLowerCase() || "";

    let fallbackResponse =
      "Xin lỗi, hiện tại dịch vụ AI đang bảo trì. Vui lòng thử lại sau.";

    if (lowerMessage.includes("phở")) {
      fallbackResponse =
        "Phở là món ăn truyền thống Việt Nam rất ngon! Bạn cần có xương bò, bánh phở, hành tây, gừng để làm nước dùng thơm ngon.";
    } else if (lowerMessage.includes("bánh mì")) {
      fallbackResponse =
        "Bánh mì Việt Nam cần có bánh mì giòn, thịt nướng hoặc chả, đồ chua, rau sống và nước mắm pha loãng.";
    } else if (lowerMessage.includes("cơm") || lowerMessage.includes("rice")) {
      fallbackResponse =
        "Cơm là món chính quan trọng. Bạn có thể kết hợp với thịt, cá, rau củ để có bữa ăn đủ dinh dưỡng.";
    }

    return res.status(200).json({
      success: true,
      response: fallbackResponse,
    });
  }
}
