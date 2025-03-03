/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useUser } from "@/lib/user-client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select";
import {
  Loader2,
  Upload,
  Copy,
  Twitter,
  Instagram,
  Linkedin,
  Clock,
  Zap,
} from "lucide-react";

import { TwitterMock } from "@/custom-components/twitter-mock";
import { InstagramMock } from "@/custom-components/instagram-mock";
import { LinkedInMock } from "@/custom-components/linkedin-mock";

import { GoogleGenerativeAI, Part } from "@google/generative-ai";
import ReactMarkdown from "react-markdown";
import { useRouter } from "next/navigation";

import Link from "next/link";

const apiKey = process.env.GOOGLE_API_KEY;
const genAI = apiKey ? new GoogleGenerativeAI(apiKey) : null;

const contentTypes = [
  { value: "twitter", label: "Twitter Thread" },
  { value: "instagram", label: "Instagram Caption" },
  { value: "linkedin", label: "LinkedIn Post" },
];

const MAX_TWEET_LENGTH = 280;
const POINTS_PER_GENERATION = 5;

// Create the history interface for saved generations

interface HistoryItem {
  id: string;
  contentType: string;
  prompt: string;
  content: string;
  createdAt: Date;
}

export default function GeneratePage() {
  const user = useUser();
  const router = useRouter();

  const [contentType, setContentType] = useState(contentTypes[0].value);
  const [prompt, setPrompt] = useState("");
  const [generatedContent, setGeneratedContent] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [image, setImage] = useState<File | null>(null);
  const [userPoints, setUserPoints] = useState<number | null>(null);

  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [selectedHistoryItem, setSelectedHistoryItem] =
    useState<HistoryItem | null>(null);

  useEffect(() => {
    if (!apiKey) {
      console.error("No API key found");
    }
  }, []);

  // TODO: Fetch history from database and set it to history state

  return <>{user?.email}</>;
}
