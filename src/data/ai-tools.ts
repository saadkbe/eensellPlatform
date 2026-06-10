export interface AITool {
  name: string;
  description: string;
  url: string;
  domain: string;
  category: string;
}

export const aiTools: AITool[] = [
  // Text & Writing
  { name: "ChatGPT", description: "The most popular AI chatbot by OpenAI.", url: "https://chatgpt.com", domain: "chatgpt.com", category: "Text & Writing" },
  { name: "Claude", description: "Advanced AI assistant by Anthropic, great for long context.", url: "https://claude.ai", domain: "claude.ai", category: "Text & Writing" },
  { name: "Jasper", description: "AI copywriter tailored for enterprise marketing.", url: "https://jasper.ai", domain: "jasper.ai", category: "Text & Writing" },
  { name: "Copy.ai", description: "AI generator for emails, blogs, and social media.", url: "https://copy.ai", domain: "copy.ai", category: "Text & Writing" },
  { name: "Notion AI", description: "Integrated AI workspace for notes and docs.", url: "https://notion.so/product/ai", domain: "notion.so", category: "Text & Writing" },
  { name: "Writesonic", description: "SEO-optimized AI writer and chatbot creator.", url: "https://writesonic.com", domain: "writesonic.com", category: "Text & Writing" },
  { name: "Rytr", description: "Fast, affordable AI writing assistant.", url: "https://rytr.me", domain: "rytr.me", category: "Text & Writing" },
  { name: "Anyword", description: "Data-driven AI copywriting for performance marketing.", url: "https://anyword.com", domain: "anyword.com", category: "Text & Writing" },

  // Image Generation
  { name: "Midjourney", description: "High-quality, artistic AI image generation.", url: "https://midjourney.com", domain: "midjourney.com", category: "Image Generation" },
  { name: "DALL-E 3", description: "OpenAI's image generator built into ChatGPT.", url: "https://openai.com/dall-e-3", domain: "openai.com", category: "Image Generation" },
  { name: "Leonardo.ai", description: "Granular control for AI art and game assets.", url: "https://leonardo.ai", domain: "leonardo.ai", category: "Image Generation" },
  { name: "Adobe Firefly", description: "Commercially safe generative AI for creatives.", url: "https://firefly.adobe.com", domain: "adobe.com", category: "Image Generation" },
  { name: "Canva Magic Studio", description: "AI design tools integrated into Canva.", url: "https://canva.com/magic", domain: "canva.com", category: "Image Generation" },
  { name: "RunDiffusion", description: "Cloud-based Stable Diffusion workspace.", url: "https://rundiffusion.com", domain: "rundiffusion.com", category: "Image Generation" },
  { name: "Ideogram", description: "AI image generator with excellent text rendering.", url: "https://ideogram.ai", domain: "ideogram.ai", category: "Image Generation" },
  { name: "Krea", description: "Real-time AI generation and upscaling.", url: "https://krea.ai", domain: "krea.ai", category: "Image Generation" },

  // Video Generation
  { name: "Runway", description: "Advanced AI video editing and generation (Gen-2/Gen-3).", url: "https://runwayml.com", domain: "runwayml.com", category: "Video Generation" },
  { name: "Synthesia", description: "Create videos with AI avatars and voiceovers.", url: "https://synthesia.io", domain: "synthesia.io", category: "Video Generation" },
  { name: "HeyGen", description: "AI spokesperson video creator.", url: "https://heygen.com", domain: "heygen.com", category: "Video Generation" },
  { name: "Pika", description: "Idea-to-video AI generation platform.", url: "https://pika.art", domain: "pika.art", category: "Video Generation" },
  { name: "InVideo AI", description: "Text-to-video generation for YouTube and TikTok.", url: "https://invideo.io", domain: "invideo.io", category: "Video Generation" },
  { name: "Fliki", description: "Turn text into videos with AI voices.", url: "https://fliki.ai", domain: "fliki.ai", category: "Video Generation" },
  { name: "Kaiber", description: "Audio-reactive AI video generation for music.", url: "https://kaiber.ai", domain: "kaiber.ai", category: "Video Generation" },
  { name: "Luma Dream Machine", description: "High-quality, fast AI video model.", url: "https://lumalabs.ai/dream-machine", domain: "lumalabs.ai", category: "Video Generation" },

  // Audio & Music
  { name: "ElevenLabs", description: "The most realistic AI voice generator and text-to-speech.", url: "https://elevenlabs.io", domain: "elevenlabs.io", category: "Audio & Music" },
  { name: "Suno", description: "Create full songs from text prompts.", url: "https://suno.com", domain: "suno.com", category: "Audio & Music" },
  { name: "Udio", description: "High-fidelity AI music generation.", url: "https://udio.com", domain: "udio.com", category: "Audio & Music" },
  { name: "Murf.ai", description: "Versatile AI voice generator for presentations.", url: "https://murf.ai", domain: "murf.ai", category: "Audio & Music" },
  { name: "Descript", description: "Video/audio editor that works like a doc.", url: "https://descript.com", domain: "descript.com", category: "Audio & Music" },
  { name: "Speechify", description: "Text-to-speech app for reading productivity.", url: "https://speechify.com", domain: "speechify.com", category: "Audio & Music" },
  { name: "Resemble AI", description: "AI voice cloning for enterprise.", url: "https://resemble.ai", domain: "resemble.ai", category: "Audio & Music" },

  // Coding & Development
  { name: "GitHub Copilot", description: "AI pair programmer right in your IDE.", url: "https://github.com/features/copilot", domain: "github.com", category: "Coding & Dev" },
  { name: "Cursor", description: "The AI-first code editor.", url: "https://cursor.sh", domain: "cursor.sh", category: "Coding & Dev" },
  { name: "v0 by Vercel", description: "Generative UI system from text prompts.", url: "https://v0.dev", domain: "v0.dev", category: "Coding & Dev" },
  { name: "Codeium", description: "Free AI code acceleration toolkit.", url: "https://codeium.com", domain: "codeium.com", category: "Coding & Dev" },
  { name: "Tabnine", description: "Private AI assistant for developers.", url: "https://tabnine.com", domain: "tabnine.com", category: "Coding & Dev" },
  { name: "Replit AI", description: "AI built directly into the Replit cloud IDE.", url: "https://replit.com/ai", domain: "replit.com", category: "Coding & Dev" },
  { name: "Bolt.new", description: "In-browser AI web development environment.", url: "https://bolt.new", domain: "bolt.new", category: "Coding & Dev" },

  // Productivity & Search
  { name: "Perplexity", description: "AI search engine with real-time citations.", url: "https://perplexity.ai", domain: "perplexity.ai", category: "Productivity & Search" },
  { name: "Gamma", description: "Create beautiful presentations with AI.", url: "https://gamma.app", domain: "gamma.app", category: "Productivity & Search" },
  { name: "Tome", description: "AI-powered storytelling format.", url: "https://tome.app", domain: "tome.app", category: "Productivity & Search" },
  { name: "Otter.ai", description: "AI meeting assistant and transcription.", url: "https://otter.ai", domain: "otter.ai", category: "Productivity & Search" },
  { name: "Fireflies.ai", description: "Automate your meeting notes.", url: "https://fireflies.ai", domain: "fireflies.ai", category: "Productivity & Search" },
  { name: "ChatPDF", description: "Chat with any PDF document.", url: "https://chatpdf.com", domain: "chatpdf.com", category: "Productivity & Search" },
  { name: "Zapier Central", description: "AI bots that automate your workflows.", url: "https://zapier.com/central", domain: "zapier.com", category: "Productivity & Search" },
  { name: "Arc Search", description: "AI browser that browses for you.", url: "https://arc.net", domain: "arc.net", category: "Productivity & Search" },
  { name: "You.com", description: "AI search and productivity engine.", url: "https://you.com", domain: "you.com", category: "Productivity & Search" },
  { name: "Beautiful.ai", description: "Generative AI presentation maker.", url: "https://beautiful.ai", domain: "beautiful.ai", category: "Productivity & Search" },
  { name: "Mem", description: "AI-powered self-organizing workspace.", url: "https://mem.ai", domain: "mem.ai", category: "Productivity & Search" },
  { name: "Taskade", description: "AI agents for teams and productivity.", url: "https://taskade.com", domain: "taskade.com", category: "Productivity & Search" }
];
