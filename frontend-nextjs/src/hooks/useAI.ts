import { useState, useCallback } from "react";
import AIService from "@/services/aiService";
import {
  ChatMessage,
  AIRecipeResponse,
  ImageRecognitionResponse,
  VoiceCommand,
  VoiceResponse,
  AIRecipeRequest,
} from "@/types";

export const useAI = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Chat functionality
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [isTyping, setIsTyping] = useState(false);

  const sendMessage = useCallback(
    async (message: string, language: string = "vi") => {
      if (!message.trim()) return;

      const userMessage: ChatMessage = {
        id: Date.now().toString(),
        type: "user",
        content: message,
        timestamp: new Date().toISOString(),
      };

      setChatMessages((prev) => [...prev, userMessage]);
      setIsTyping(true);
      setLoading(true);
      setError(null);

      try {
        const response = await AIService.sendChatMessage(message, language);
        setChatMessages((prev) => [...prev, response]);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to send message");
      } finally {
        setIsTyping(false);
        setLoading(false);
      }
    },
    []
  );

  const clearChat = useCallback(() => {
    setChatMessages([]);
    setError(null);
  }, []);

  // Recipe generation
  const generateRecipe = useCallback(
    async (request: AIRecipeRequest): Promise<AIRecipeResponse | null> => {
      setLoading(true);
      setError(null);

      try {
        const response = await AIService.generateRecipe(request);
        return response;
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to generate recipe"
        );
        return null;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const generateRecipeFromIngredients = useCallback(
    async (
      ingredients: string[],
      language: string = "vi"
    ): Promise<AIRecipeResponse | null> => {
      return generateRecipe({ ingredients, language });
    },
    [generateRecipe]
  );

  // Image recognition
  const recognizeFood = useCallback(
    async (
      file: File,
      language: string = "vi"
    ): Promise<ImageRecognitionResponse | null> => {
      setLoading(true);
      setError(null);

      try {
        const response = await AIService.recognizeFoodFromFile(file, language);
        return response;
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to recognize food"
        );
        return null;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  // Voice processing
  const processVoiceCommand = useCallback(
    async (
      audioBlob: Blob,
      language: string = "vi"
    ): Promise<VoiceCommand | null> => {
      setLoading(true);
      setError(null);

      try {
        const response = await AIService.processVoiceCommand(
          audioBlob,
          language
        );
        return response;
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to process voice command"
        );
        return null;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const synthesizeSpeech = useCallback(
    async (text: string, language: string = "vi") => {
      setLoading(true);
      setError(null);

      try {
        const response = await AIService.synthesizeSpeech(text, language);
        return response;
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to synthesize speech"
        );
        return null;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const processVoiceInteraction = useCallback(
    async (
      audioBlob: Blob,
      language: string = "vi"
    ): Promise<VoiceResponse | null> => {
      setLoading(true);
      setError(null);

      try {
        const response = await AIService.processVoiceInteraction(
          audioBlob,
          language
        );
        return response;
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Failed to process voice interaction"
        );
        return null;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  return {
    // State
    loading,
    error,
    chatMessages,
    isTyping,

    // Chat methods
    sendMessage,
    clearChat,

    // Recipe generation
    generateRecipe,
    generateRecipeFromIngredients,

    // Image recognition
    recognizeFood,

    // Voice processing
    processVoiceCommand,
    synthesizeSpeech,
    processVoiceInteraction,

    // Utility
    setError,
  };
};
