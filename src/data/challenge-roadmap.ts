export type ChallengeDayData = {
  dayNumber: number; // 1-60
  title: string;
  description: string;
  phase: string; // one of the 6 phases
  missionTitle: string;
  missionDescription: string;
  courseCode: string | null; // 'M1' through 'M9' or null for action-only days
  lessonOrder: number | null; // order of lesson within its module, null for action-only days
  moduleOrder: number | null; // module order in DB, null for action-only days  
};

export const CHALLENGE_DAYS: ChallengeDayData[] = [
  // Phase 1: learn_ai (Days 1-14)
  {
    dayNumber: 1,
    title: "The AI Opportunity",
    description: "Understand the shifting landscape of work and how AI creates new opportunities.",
    phase: "learn_ai",
    missionTitle: "Identify Your 'Why'",
    missionDescription: "Write down your primary goal for the next 60 days and what you hope to achieve with AI.",
    courseCode: "M1",
    lessonOrder: 0,
    moduleOrder: 0
  },
  {
    dayNumber: 2,
    title: "AI Foundations",
    description: "Learn the core concepts behind Large Language Models and Generative AI.",
    phase: "learn_ai",
    missionTitle: "Deconstruct an AI Model",
    missionDescription: "Explain how an LLM works in simple terms to a friend or on social media.",
    courseCode: "M1",
    lessonOrder: 1,
    moduleOrder: 0
  },
  {
    dayNumber: 3,
    title: "The AI Mindset",
    description: "Shift your perspective from being replaced by AI to being empowered by it.",
    phase: "learn_ai",
    missionTitle: "Adopt the Explorer Mindset",
    missionDescription: "Identify one daily task you can approach differently using AI.",
    courseCode: "M1",
    lessonOrder: 2,
    moduleOrder: 0
  },
  {
    dayNumber: 4,
    title: "Mastering AI Tools",
    description: "An overview of the essential AI tools you need in your arsenal.",
    phase: "learn_ai",
    missionTitle: "Set up Your AI Workspace",
    missionDescription: "Create accounts for ChatGPT, Claude, and one image generation tool.",
    courseCode: "M2",
    lessonOrder: 0,
    moduleOrder: 1
  },
  {
    dayNumber: 5,
    title: "The Art of Prompting",
    description: "Learn the anatomy of a perfect prompt and how to communicate with AI.",
    phase: "learn_ai",
    missionTitle: "Craft Your First Mega-Prompt",
    missionDescription: "Write a detailed, multi-step prompt to generate a piece of content.",
    courseCode: "M2",
    lessonOrder: 1,
    moduleOrder: 1
  },
  {
    dayNumber: 6,
    title: "Advanced Prompt Engineering",
    description: "Techniques for getting exactly what you want out of AI models.",
    phase: "learn_ai",
    missionTitle: "Chain of Thought Practice",
    missionDescription: "Use prompting techniques to solve a complex, multi-step problem.",
    courseCode: "M2",
    lessonOrder: 2,
    moduleOrder: 1
  },
  {
    dayNumber: 7,
    title: "Practice Prompting",
    description: "Put your prompt engineering skills to the test in a real-world scenario.",
    phase: "learn_ai",
    missionTitle: "Refine a Weak Prompt",
    missionDescription: "Take a generic prompt and apply the frameworks learned to improve the output.",
    courseCode: null,
    lessonOrder: null,
    moduleOrder: null
  },
  {
    dayNumber: 8,
    title: "Explore Visual AI",
    description: "Dive into the world of AI image generation and prompting for visuals.",
    phase: "learn_ai",
    missionTitle: "Generate a Brand Concept",
    missionDescription: "Use an image generator to create a logo or brand aesthetic concept.",
    courseCode: null,
    lessonOrder: null,
    moduleOrder: null
  },
  {
    dayNumber: 9,
    title: "Discover AI Audio & Video",
    description: "Explore tools for generating voiceovers, music, and video content.",
    phase: "learn_ai",
    missionTitle: "Create a Voice Clone",
    missionDescription: "Experiment with an AI voice generation tool and clone your own voice.",
    courseCode: null,
    lessonOrder: null,
    moduleOrder: null
  },
  {
    dayNumber: 10,
    title: "AI Research Deep Dive",
    description: "Use AI to accelerate your learning and research capabilities.",
    phase: "learn_ai",
    missionTitle: "Summarize a Complex Topic",
    missionDescription: "Use AI to summarize a long document or video into actionable takeaways.",
    courseCode: null,
    lessonOrder: null,
    moduleOrder: null
  },
  {
    dayNumber: 11,
    title: "Intro to AI Automation",
    description: "Learn how to connect AI tools to automate repetitive tasks.",
    phase: "learn_ai",
    missionTitle: "Map Your First Workflow",
    missionDescription: "Identify a repetitive task and map out how AI could automate it.",
    courseCode: "M3",
    lessonOrder: 0,
    moduleOrder: 2
  },
  {
    dayNumber: 12,
    title: "Zapier & Make Fundamentals",
    description: "Get familiar with the leading automation platforms.",
    phase: "learn_ai",
    missionTitle: "Create a Free Account",
    missionDescription: "Sign up for an automation platform and explore the interface.",
    courseCode: null,
    lessonOrder: null,
    moduleOrder: null
  },
  {
    dayNumber: 13,
    title: "Your First Simple Automation",
    description: "Build a basic automation to save time on a daily task.",
    phase: "learn_ai",
    missionTitle: "Build a Trigger-Action Workflow",
    missionDescription: "Connect two apps together to automate a simple action.",
    courseCode: null,
    lessonOrder: null,
    moduleOrder: null
  },
  {
    dayNumber: 14,
    title: "Integrating AI into Automations",
    description: "Add AI steps to your automations for intelligent processing.",
    phase: "learn_ai",
    missionTitle: "Add an OpenAI Step",
    missionDescription: "Integrate ChatGPT into your workflow to analyze or generate text.",
    courseCode: null,
    lessonOrder: null,
    moduleOrder: null
  },

  // Phase 2: build_skills (Days 15-25)
  {
    dayNumber: 15,
    title: "Advanced Workflow Design",
    description: "Design more complex, multi-step automations with conditions.",
    phase: "build_skills",
    missionTitle: "Draft a Multi-Step Automation",
    missionDescription: "Design a workflow with at least three apps and one conditional path.",
    courseCode: null,
    lessonOrder: null,
    moduleOrder: null
  },
  {
    dayNumber: 16,
    title: "Automating Social Media",
    description: "Use AI to streamline your content scheduling and posting.",
    phase: "build_skills",
    missionTitle: "Automate Content Repurposing",
    missionDescription: "Set up a workflow that turns a blog post into social media snippets.",
    courseCode: null,
    lessonOrder: null,
    moduleOrder: null
  },
  {
    dayNumber: 17,
    title: "Automating Lead Generation",
    description: "Build systems to capture and qualify leads automatically using AI.",
    phase: "build_skills",
    missionTitle: "Create an AI Lead Magnet",
    missionDescription: "Design an automated system that delivers a personalized AI-generated report.",
    courseCode: null,
    lessonOrder: null,
    moduleOrder: null
  },
  {
    dayNumber: 18,
    title: "AI Website & Landing Page Creation",
    description: "Learn how to build high-converting websites and landing pages using AI.",
    phase: "build_skills",
    missionTitle: "Build a Landing Page Fast",
    missionDescription: "Use an AI website builder to generate a landing page for your offer.",
    courseCode: "M4",
    lessonOrder: 0,
    moduleOrder: 3
  },
  {
    dayNumber: 19,
    title: "Copywriting with AI",
    description: "Generate compelling sales copy and website text.",
    phase: "build_skills",
    missionTitle: "Write a Sales Sequence",
    missionDescription: "Use AI to write a 3-part email sequence for a product or service.",
    courseCode: null,
    lessonOrder: null,
    moduleOrder: null
  },
  {
    dayNumber: 20,
    title: "AI Video Creation",
    description: "Create engaging videos using AI avatars and generation tools.",
    phase: "build_skills",
    missionTitle: "Generate a Short-Form Video",
    missionDescription: "Create a 30-second TikTok/Reel using purely AI-generated assets.",
    courseCode: null,
    lessonOrder: null,
    moduleOrder: null
  },
  {
    dayNumber: 21,
    title: "Building Custom GPTs",
    description: "Create specialized AI assistants tailored to specific tasks.",
    phase: "build_skills",
    missionTitle: "Create Your First Custom GPT",
    missionDescription: "Build a custom GPT with specific instructions and knowledge files.",
    courseCode: null,
    lessonOrder: null,
    moduleOrder: null
  },
  {
    dayNumber: 22,
    title: "AI for SEO",
    description: "Optimize content and find keywords using AI.",
    phase: "build_skills",
    missionTitle: "Perform Keyword Research",
    missionDescription: "Use AI to generate a list of low-competition keywords for a niche.",
    courseCode: null,
    lessonOrder: null,
    moduleOrder: null
  },
  {
    dayNumber: 23,
    title: "Data Analysis with AI",
    description: "Turn raw data into actionable insights.",
    phase: "build_skills",
    missionTitle: "Analyze a Dataset",
    missionDescription: "Upload a CSV file to an AI tool and ask it to find three key trends.",
    courseCode: null,
    lessonOrder: null,
    moduleOrder: null
  },
  {
    dayNumber: 24,
    title: "AI App Building (No-Code)",
    description: "Use AI to build simple applications without writing code.",
    phase: "build_skills",
    missionTitle: "Draft an App Concept",
    missionDescription: "Use an AI platform to scaffold a simple internal tool or app.",
    courseCode: null,
    lessonOrder: null,
    moduleOrder: null
  },
  {
    dayNumber: 25,
    title: "Skill Integration Challenge",
    description: "Combine text, image, and automation skills into one project.",
    phase: "build_skills",
    missionTitle: "Build a Complete Content Engine",
    missionDescription: "Create a system that researches, writes, and generates images for a blog.",
    courseCode: null,
    lessonOrder: null,
    moduleOrder: null
  },

  // Phase 3: build_offer (Days 26-32)
  {
    dayNumber: 26,
    title: "Finding Your Niche",
    description: "Identify a profitable target market for your AI services.",
    phase: "build_offer",
    missionTitle: "Select Your Target Audience",
    missionDescription: "Define the specific industry or role you will serve with your AI skills.",
    courseCode: null,
    lessonOrder: null,
    moduleOrder: null
  },
  {
    dayNumber: 27,
    title: "Designing the Offer",
    description: "Structure a high-value service that solves a real problem.",
    phase: "build_offer",
    missionTitle: "Outline Your Core Service",
    missionDescription: "Write down the exact transformation you provide and how you deliver it.",
    courseCode: null,
    lessonOrder: null,
    moduleOrder: null
  },
  {
    dayNumber: 28,
    title: "Pricing Strategy",
    description: "Learn how to price your AI services for profitability.",
    phase: "build_offer",
    missionTitle: "Set Your Initial Price",
    missionDescription: "Determine a fair, value-based price for your core offer.",
    courseCode: null,
    lessonOrder: null,
    moduleOrder: null
  },
  {
    dayNumber: 29,
    title: "Crafting Your Guarantee",
    description: "Make your offer irresistible with a strong guarantee.",
    phase: "build_offer",
    missionTitle: "Write Your Risk-Reversal",
    missionDescription: "Create a compelling guarantee that removes hesitation for buyers.",
    courseCode: null,
    lessonOrder: null,
    moduleOrder: null
  },
  {
    dayNumber: 30,
    title: "Building the Pitch",
    description: "Create a persuasive pitch to present your offer to clients.",
    phase: "build_offer",
    missionTitle: "Write Your Elevator Pitch",
    missionDescription: "Condense your offer into a powerful 30-second summary.",
    courseCode: null,
    lessonOrder: null,
    moduleOrder: null
  },
  {
    dayNumber: 31,
    title: "Offer Feedback Loop",
    description: "Test your offer concept with peers or AI to refine it.",
    phase: "build_offer",
    missionTitle: "Stress-Test Your Offer",
    missionDescription: "Ask an AI persona to critique your offer as a skeptical buyer.",
    courseCode: null,
    lessonOrder: null,
    moduleOrder: null
  },
  {
    dayNumber: 32,
    title: "Finalizing the Offer Document",
    description: "Create a professional one-pager detailing your services.",
    phase: "build_offer",
    missionTitle: "Design Your Service One-Pager",
    missionDescription: "Use AI to format and design a PDF summarizing your offer.",
    courseCode: null,
    lessonOrder: null,
    moduleOrder: null
  },

  // Phase 4: build_portfolio (Days 33-40)
  {
    dayNumber: 33,
    title: "The Power of Proof",
    description: "Understand why a portfolio is your strongest sales tool.",
    phase: "build_portfolio",
    missionTitle: "Plan Your Portfolio Assets",
    missionDescription: "Identify three distinct projects to showcase your AI skills.",
    courseCode: null,
    lessonOrder: null,
    moduleOrder: null
  },
  {
    dayNumber: 34,
    title: "Project 1: Content System",
    description: "Build a demonstrable AI content generation system.",
    phase: "build_portfolio",
    missionTitle: "Document the Content System",
    missionDescription: "Create a walkthrough video or document showing your system in action.",
    courseCode: null,
    lessonOrder: null,
    moduleOrder: null
  },
  {
    dayNumber: 35,
    title: "Project 2: Chatbot or Assistant",
    description: "Showcase an interactive AI solution.",
    phase: "build_portfolio",
    missionTitle: "Deploy a Demo Bot",
    missionDescription: "Build a specialized customer service bot and share the link.",
    courseCode: null,
    lessonOrder: null,
    moduleOrder: null
  },
  {
    dayNumber: 36,
    title: "Project 3: Workflow Automation",
    description: "Highlight your ability to save time with automation.",
    phase: "build_portfolio",
    missionTitle: "Visualize an Automation",
    missionDescription: "Create a clear diagram of an automation workflow you built.",
    courseCode: null,
    lessonOrder: null,
    moduleOrder: null
  },
  {
    dayNumber: 37,
    title: "Writing Case Studies",
    description: "Turn your projects into compelling stories of transformation.",
    phase: "build_portfolio",
    missionTitle: "Write One Case Study",
    missionDescription: "Use AI to format a problem-solution-result case study for one project.",
    courseCode: null,
    lessonOrder: null,
    moduleOrder: null
  },
  {
    dayNumber: 38,
    title: "Building the Portfolio Site",
    description: "Host your projects on a simple, professional website.",
    phase: "build_portfolio",
    missionTitle: "Launch a One-Page Portfolio",
    missionDescription: "Assemble your case studies onto a live web page.",
    courseCode: null,
    lessonOrder: null,
    moduleOrder: null
  },
  {
    dayNumber: 39,
    title: "Social Proof & Testimonials",
    description: "Gathering and showcasing proof of your abilities.",
    phase: "build_portfolio",
    missionTitle: "Draft a Testimonial Request",
    missionDescription: "Write a template for asking early beta users for feedback.",
    courseCode: null,
    lessonOrder: null,
    moduleOrder: null
  },
  {
    dayNumber: 40,
    title: "Portfolio Polish",
    description: "Review and refine your portfolio for maximum impact.",
    phase: "build_portfolio",
    missionTitle: "Audit Your Portfolio",
    missionDescription: "Have an AI review your portfolio copy for clarity and persuasiveness.",
    courseCode: null,
    lessonOrder: null,
    moduleOrder: null
  },

  // Phase 5: first_client (Days 41-50)
  {
    dayNumber: 41,
    title: "Client Acquisition Strategy",
    description: "Overview of the channels to find your first paying client.",
    phase: "first_client",
    missionTitle: "Choose Your Primary Channel",
    missionDescription: "Select one outreach method (e.g., Cold Email, LinkedIn, Upwork).",
    courseCode: null,
    lessonOrder: null,
    moduleOrder: null
  },
  {
    dayNumber: 42,
    title: "Optimizing Your Profile",
    description: "Set up your social profiles to attract inbound interest.",
    phase: "first_client",
    missionTitle: "Update Your LinkedIn",
    missionDescription: "Rewrite your headline and summary to highlight your AI services.",
    courseCode: null,
    lessonOrder: null,
    moduleOrder: null
  },
  {
    dayNumber: 43,
    title: "Building a Lead List",
    description: "Find and organize potential prospects for your services.",
    phase: "first_client",
    missionTitle: "Find 20 Prospects",
    missionDescription: "Create a spreadsheet with 20 qualified leads in your niche.",
    courseCode: null,
    lessonOrder: null,
    moduleOrder: null
  },
  {
    dayNumber: 44,
    title: "Cold Outreach with AI",
    description: "Write highly personalized outreach messages at scale.",
    phase: "first_client",
    missionTitle: "Draft an Outreach Template",
    missionDescription: "Create a cold email or DM template and use AI to personalize it.",
    courseCode: null,
    lessonOrder: null,
    moduleOrder: null
  },
  {
    dayNumber: 45,
    title: "Sending the First Batch",
    description: "Overcoming fear and initiating contact.",
    phase: "first_client",
    missionTitle: "Send 10 Messages",
    missionDescription: "Reach out to the first 10 prospects on your list.",
    courseCode: null,
    lessonOrder: null,
    moduleOrder: null
  },
  {
    dayNumber: 46,
    title: "Handling Responses",
    description: "Navigating replies, objections, and booking calls.",
    phase: "first_client",
    missionTitle: "Prepare Objection Responses",
    missionDescription: "Use AI to script answers to the top 3 objections you expect.",
    courseCode: null,
    lessonOrder: null,
    moduleOrder: null
  },
  {
    dayNumber: 47,
    title: "The Sales Call",
    description: "How to structure and lead a discovery call.",
    phase: "first_client",
    missionTitle: "Script Your Discovery Call",
    missionDescription: "Outline the key questions you will ask on a sales call.",
    courseCode: null,
    lessonOrder: null,
    moduleOrder: null
  },
  {
    dayNumber: 48,
    title: "Writing Proposals",
    description: "Creating professional proposals that close deals.",
    phase: "first_client",
    missionTitle: "Draft a Proposal Template",
    missionDescription: "Set up a reusable template for pitching your services after a call.",
    courseCode: null,
    lessonOrder: null,
    moduleOrder: null
  },
  {
    dayNumber: 49,
    title: "Follow-Up Systems",
    description: "The fortune is in the follow-up.",
    phase: "first_client",
    missionTitle: "Schedule Follow-Ups",
    missionDescription: "Design a 3-step follow-up sequence for non-responsive prospects.",
    courseCode: null,
    lessonOrder: null,
    moduleOrder: null
  },
  {
    dayNumber: 50,
    title: "Closing the Deal",
    description: "Finalizing agreements and collecting payment.",
    phase: "first_client",
    missionTitle: "Set Up Invoicing",
    missionDescription: "Create an account on Stripe or a similar platform to accept payments.",
    courseCode: null,
    lessonOrder: null,
    moduleOrder: null
  },

  // Phase 6: scale_business (Days 51-60)
  {
    dayNumber: 51,
    title: "Onboarding the Client",
    description: "Deliver a world-class experience from day one.",
    phase: "scale_business",
    missionTitle: "Create an Onboarding Form",
    missionDescription: "Design a questionnaire to gather requirements from new clients.",
    courseCode: null,
    lessonOrder: null,
    moduleOrder: null
  },
  {
    dayNumber: 52,
    title: "Fulfilling the Service",
    description: "Managing timelines and exceeding expectations.",
    phase: "scale_business",
    missionTitle: "Map Your Fulfillment Process",
    missionDescription: "Document the step-by-step process of delivering your service.",
    courseCode: null,
    lessonOrder: null,
    moduleOrder: null
  },
  {
    dayNumber: 53,
    title: "Collecting Testimonials",
    description: "Turning a happy client into a marketing asset.",
    phase: "scale_business",
    missionTitle: "Draft a Testimonial Request",
    missionDescription: "Create a template for asking clients for a review or case study.",
    courseCode: null,
    lessonOrder: null,
    moduleOrder: null
  },
  {
    dayNumber: 54,
    title: "Productizing Your Service",
    description: "Creating standard packages to scale easier.",
    phase: "scale_business",
    missionTitle: "Define a Productized Offer",
    missionDescription: "Turn a custom service into a fixed-scope, fixed-price package.",
    courseCode: null,
    lessonOrder: null,
    moduleOrder: null
  },
  {
    dayNumber: 55,
    title: "Building Standard Operating Procedures",
    description: "Documenting systems so you can eventually outsource.",
    phase: "scale_business",
    missionTitle: "Write Your First SOP",
    missionDescription: "Document a routine task with step-by-step instructions.",
    courseCode: null,
    lessonOrder: null,
    moduleOrder: null
  },
  {
    dayNumber: 56,
    title: "Scaling with AI Agents",
    description: "Using advanced AI to handle internal operations.",
    phase: "scale_business",
    missionTitle: "Deploy an Internal Agent",
    missionDescription: "Set up an AI assistant to help manage your inbox or schedule.",
    courseCode: null,
    lessonOrder: null,
    moduleOrder: null
  },
  {
    dayNumber: 57,
    title: "Recurring Revenue Models",
    description: "Adding retainers to your business model.",
    phase: "scale_business",
    missionTitle: "Design a Retainer Offer",
    missionDescription: "Plan a monthly recurring service you can upsell to clients.",
    courseCode: null,
    lessonOrder: null,
    moduleOrder: null
  },
  {
    dayNumber: 58,
    title: "Scaling Outreach",
    description: "Automating your lead generation machine.",
    phase: "scale_business",
    missionTitle: "Automate Prospecting",
    missionDescription: "Set up a tool to automatically gather leads and enrich data.",
    courseCode: null,
    lessonOrder: null,
    moduleOrder: null
  },
  {
    dayNumber: 59,
    title: "The Future of AI",
    description: "Staying ahead of trends and adapting.",
    phase: "scale_business",
    missionTitle: "Set Up an Information Diet",
    missionDescription: "Subscribe to 3 high-quality AI newsletters or creators.",
    courseCode: null,
    lessonOrder: null,
    moduleOrder: null
  },
  {
    dayNumber: 60,
    title: "Graduation & Next Steps",
    description: "Review your progress and plan the next 90 days.",
    phase: "scale_business",
    missionTitle: "Write Your 90-Day Vision",
    missionDescription: "Document your revenue and growth goals for the next quarter.",
    courseCode: null,
    lessonOrder: null,
    moduleOrder: null
  }
];
