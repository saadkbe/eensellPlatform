"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import {
  Search,
  BookOpen,
  AlertTriangle,
  Zap,
  CheckCircle2,
  ExternalLink,
  ChevronRight,
  ShieldAlert,
  Copy,
  Check,
  RotateCcw,
  Sliders,
  Sparkles,
  Layers,
  FileCode,
  Terminal,
  Activity,
  ArrowRight,
  HelpCircle,
  Clock,
  Compass,
  MessageSquare,
  FileSpreadsheet,
  Brain,
  KeyRound,
  Filter,
  Mail,
  Lock,
} from "lucide-react";
import { toast } from "sonner";

interface DocSection {
  id: string;
  module: string;
  title: string;
  description: string;
  icon: any;
  badge?: string;
  makeDocsUrl: string;
  topics: {
    title: string;
    description: string;
    errorCode?: string;
    symptoms: string;
    rootCause: string;
    solution: string[];
    codeSnippet?: string;
    makeLink?: string;
  }[];
}

const DOC_SECTIONS: DocSection[] = [
  {
    id: "app-connections",
    module: "OAuth & App Connections",
    title: "App Connection Blueprints: Gmail (Google Cloud Console) & WhatsApp (Meta System User)",
    description:
      "Definitive guides to resolving the most common connection roadblocks in Make.com: registering a private Google Cloud Console OAuth App for Gmail, and generating permanent Meta System User tokens for WhatsApp.",
    icon: KeyRound,
    badge: "Essential Setup Guide",
    makeDocsUrl: "https://www.make.com/en/help/tutorials/connecting-to-google-services-using-a-custom-oauth-client",
    topics: [
      {
        title: "Gmail & Google Workspace: Creating a Custom Google Cloud Console OAuth App",
        description:
          "Bypass Google's strict verification blocks (Error 403: access_denied / 'This app is blocked' / 'Google hasn't verified this app') by registering your own private OAuth 2.0 Client in Google Cloud Platform.",
        errorCode: "GOOGLE OAUTH 403 &bull; ACCESS_DENIED",
        symptoms:
          "Connecting Gmail in Make fails with 'Access blocked: This app has not been verified by Google' or connections disconnect every 7 days.",
        rootCause:
          "Google classifies Gmail scopes as 'Restricted Sensitive'. Make's default shared client has global quota caps, requiring users to supply their own Client ID & Secret from Google Cloud Console.",
        solution: [
          "Step 1: Go to console.cloud.google.com and click 'New Project' (e.g. 'Make Agency Automation').",
          "Step 2: In the left sidebar, navigate to 'APIs & Services > Library', search for 'Gmail API', and click 'Enable'. (Also enable Google Sheets API & Google Drive API if needed).",
          "Step 3: Go to 'APIs & Services > OAuth consent screen', select User Type 'External' (or 'Internal' if on Google Workspace), fill in App Name & Support Email, and click Save.",
          "Step 4: Under 'Test Users', click 'Add Users' and input your Gmail address.",
          "Step 5 (CRITICAL TO PREVENT 7-DAY EXPIRY): Click 'Publish App' to transition publishing status from 'Testing' to 'In Production'. (For personal automation apps, Google does not force audit verification).",
          "Step 6: Go to 'APIs & Services > Credentials', click '+ Create Credentials > OAuth client ID', select Application Type 'Web application'.",
          "Step 7: Under 'Authorized redirect URIs', click 'Add URI' and add: https://www.integromat.com/oauth/cb/google-custom AND https://www.make.com/oauth/cb/google-custom",
          "Step 8: In Make, add a Gmail module, click 'Create a connection', check 'Show advanced settings', paste your Client ID and Client Secret, and bypass the warning by clicking 'Advanced > Go to App (unsafe)'.",
        ],
        codeSnippet: `// Authorized Redirect URIs for Google Cloud Console:
https://www.integromat.com/oauth/cb/google-custom
https://www.make.com/oauth/cb/google-custom`,
        makeLink: "https://www.make.com/en/help/tutorials/connecting-to-google-services-using-a-custom-oauth-client",
      },
      {
        title: "WhatsApp Cloud API: Creating a Meta System User Permanent Token",
        description:
          "Stop WhatsApp automations from disconnecting every 24 hours by creating a dedicated Meta System User with a never-expiring access token.",
        errorCode: "META OAUTH TOKEN EXPIRED",
        symptoms:
          "WhatsApp messages send successfully on day 1, but fail on day 2 with 'Authentication failure / Session expired / Error 190'.",
        rootCause:
          "Developers copy the 24-hour temporary access token from Meta App Dashboard > WhatsApp > API Setup instead of generating a permanent token via a System User.",
        solution: [
          "Step 1: Open Meta Business Suite Settings at business.facebook.com/settings.",
          "Step 2: Under 'Users', click 'System Users' > 'Add', enter a username (e.g. 'Make-Automation-Admin'), and select Role: 'Admin'.",
          "Step 3: Click 'Add Assets' on your System User. Under 'Apps', select your Meta App and toggle 'Full Control'. Under 'WhatsApp Accounts', select your WABA and grant 'Full Control'.",
          "Step 4: Click 'Generate New Token', select your Meta App, and check permissions: whatsapp_business_messaging, whatsapp_business_management, and business_management.",
          "Step 5: Set Token Expiry to 'Never' and click Generate Token. Immediately copy and store the token safely.",
          "Step 6 (CRITICAL PAYMENT REQUIREMENT): In WhatsApp Business Manager, you MUST add a valid Credit Card under Payment Settings, otherwise Meta will reject outgoing template messages even within the free tier.",
          "Step 7: In Make, add WhatsApp Business Cloud module, click 'Create a connection', and paste your Permanent System User Token along with your Phone Number ID and WABA ID.",
        ],
        codeSnippet: `// Required Meta Permissions for System User:
whatsapp_business_messaging
whatsapp_business_management
business_management`,
        makeLink: "https://www.make.com/en/help/apps/communication/whatsapp-business-cloud",
      },
      {
        title: "WhatsApp Webhook Verification Handshake in Make",
        description:
          "Establish real-time incoming message reception between Meta Webhooks and Make Custom Webhooks.",
        errorCode: "WEBHOOK HANDSHAKE FAILED",
        symptoms:
          "Meta Webhook setup fails with 'The URL couldn't be validated. Response does not match the challenge token.'",
        rootCause:
          "Meta requires a GET request verification handshake (hub.challenge & hub.verify_token) before activating the webhook.",
        solution: [
          "1. In Make, create a scenario with a 'Custom Webhook' module and copy the generated Webhook URL.",
          "2. In Meta Developer Dashboard > WhatsApp > Configuration, click 'Edit' under Callback URL.",
          "3. Paste the Make Webhook URL into 'Callback URL'.",
          "4. In 'Verify Token', enter a secret string (e.g. 'eensell_agency_secret_2026') and verify.",
          "5. Under 'Webhook fields', click 'Manage' and subscribe to the 'messages' event.",
        ],
        makeLink: "https://developers.facebook.com/docs/whatsapp/cloud-api/guides/set-up-webhooks",
      },
    ],
  },
  {
    id: "error-directives",
    module: "Core Reliability",
    title: "The 5 Error Handling Directives in Make.com",
    description:
      "Master Make's built-in error handling directives to prevent scenarios from crashing, recover from temporary API failures, and maintain atomic data integrity.",
    icon: ShieldAlert,
    badge: "Essential Architecture",
    makeDocsUrl: "https://www.make.com/en/help/errors/error-handling-directives",
    topics: [
      {
        title: "1. Ignore (Skip Bundle)",
        description:
          "Tells the scenario to completely disregard the error on this module, discard the failed bundle, and continue processing any subsequent bundles normally. The run concludes with a success status.",
        errorCode: "DIRECTIVE: IGNORE",
        symptoms:
          "An optional enrichment step (like fetching a profile avatar or sending a non-critical notification) fails and stops the entire pipeline.",
        rootCause:
          "By default, any unhandled error triggers a Rollback or scenario halt. Using Ignore prevents optional steps from terminating critical customer operations.",
        solution: [
          "Right-click the failing module in Make and click 'Add error handler'.",
          "Select the 'Ignore' directive from the list.",
          "Best practice: Use only on non-vital modules where missing output data won't crash downstream modules.",
        ],
        codeSnippet: `// Make.com Ignore Directive Pattern
// Module: HTTP Fetch Avatar -> [Error Handler] -> Ignore Directive
// Result: Execution completes with status "Success", bundle skipped.`,
        makeLink: "https://www.make.com/en/help/errors/error-handling-directives#ignore",
      },
      {
        title: "2. Resume (Fallback Value Replacement)",
        description:
          "Catches the error and substitutes the failed module's output with predefined default values so downstream modules receive valid inputs without crashing.",
        errorCode: "DIRECTIVE: RESUME",
        symptoms:
          "A database lookup (e.g., Search Customer) returns an error or 404, causing downstream modules that depend on 'customer.id' or 'customer.email' to fail.",
        rootCause:
          "Downstream modules require specific variable mappings. If the primary module fails, Resume provides dummy/default fields (e.g. status: 'guest', id: 'N/A').",
        solution: [
          "Attach an Error Handler route to the module.",
          "Add the 'Resume' directive.",
          "Fill in the expected output fields with sensible defaults or empty strings so the rest of the scenario executes smoothly.",
        ],
        codeSnippet: `{
  "customerId": "GUEST_DEFAULT",
  "clientTier": "Standard",
  "isFound": false
}`,
        makeLink: "https://www.make.com/en/help/errors/error-handling-directives#resume",
      },
      {
        title: "3. Break (Automatic Retry & Incomplete Queue)",
        description:
          "Halts the current execution of the failed bundle, stores it in Incomplete Executions, and automatically schedules retries using an exponential backoff interval.",
        errorCode: "DIRECTIVE: BREAK",
        symptoms:
          "Scenario fails due to temporary third-party API downtime, network dropouts, or HTTP 429 Too Many Requests rate limits.",
        rootCause:
          "Temporary server glitches or quota exhaustion that will resolve itself after a brief cool-off period.",
        solution: [
          "Attach an Error Handler to the API/HTTP module and select 'Break'.",
          "Set 'Number of attempts' (recommended: 3 to 5 attempts).",
          "Set 'Interval between attempts' (recommended: 5 to 15 minutes).",
          "Enable 'Automatically resolve' so successful retries clear the queue without manual admin intervention.",
        ],
        makeLink: "https://www.make.com/en/help/errors/error-handling-directives#break",
      },
      {
        title: "4. Commit (Transactional Save & Warning)",
        description:
          "Immediately terminates execution, but saves all ACID transactions and database operations processed up to that point. Marks the execution with a 'Warning' status.",
        errorCode: "DIRECTIVE: COMMIT",
        symptoms:
          "Multi-stage scenario fails midway, but you need previously written audit records, logs, or payment tokens to stay saved rather than being reverted.",
        rootCause:
          "Standard error handling defaults to Rollback for transactional databases, which deletes earlier records if a late-stage step fails.",
        solution: [
          "Use Commit when working with Make Data Stores, MySQL, PostgreSQL, or transactional CRMs.",
          "Pair Commit with a notification alert module (Slack/Telegram/Email) so you are notified while earlier records remain safely stored.",
        ],
        makeLink: "https://www.make.com/en/help/errors/error-handling-directives#commit",
      },
      {
        title: "5. Rollback (Transaction Reversion)",
        description:
          "Default behavior when no error handler is present. Immediately halts the execution and attempts to revert all modifications made by transactional modules.",
        errorCode: "DIRECTIVE: ROLLBACK",
        symptoms:
          "A critical invoice generation step fails, leaving an incomplete client contract in the database.",
        rootCause:
          "When strict financial or regulatory consistency is required, partial updates create corrupted business states.",
        solution: [
          "Use Rollback when partial execution is worse than no execution at all (e.g. charging a card without delivering the digital asset).",
          "Pair with automated error alerting so support can investigate the root cause.",
        ],
        makeLink: "https://www.make.com/en/help/errors/error-handling-directives#rollback",
      },
    ],
  },
  {
    id: "error-types",
    module: "Troubleshooting Matrix",
    title: "Common Make.com Error Types & Resolution",
    description:
      "Deep dive into the most common error types encountered in Make scenarios and how to resolve them systematically.",
    icon: AlertTriangle,
    badge: "Error Reference",
    makeDocsUrl: "https://www.make.com/en/help/errors/types-of-errors",
    topics: [
      {
        title: "RateLimitError (HTTP 429 Too Many Requests)",
        description:
          "Triggered when your scenario exceeds the maximum number of requests allowed by an external API within a specific time window.",
        errorCode: "HTTP 429 &bull; RateLimitError",
        symptoms:
          "Scenario works on single test runs, but crashes during batch operations or when processing multiple leads concurrently.",
        rootCause:
          "OpenAI token-per-minute (TPM) limits, Google Sheets 300 requests/min quota, or CRM API thresholds exceeded.",
        solution: [
          "1. Attach a 'Break' directive to retry after 5 minutes.",
          "2. Add a 'Tools > Sleep' module with a 1000-2000ms delay between consecutive loops.",
          "3. In Scenario Settings, set 'Max number of cycles' or reduce scheduling frequency.",
        ],
        makeLink: "https://www.make.com/en/help/errors/types-of-errors#ratelimiterror",
      },
      {
        title: "ConnectionError (DNS, Network, & Server Drops)",
        description:
          "Network-level connectivity failures occurring when Make cannot reach the destination server or the connection drops abruptly.",
        errorCode: "ConnectionError / ETIMEDOUT",
        symptoms:
          "Random scenario crashes with 'Connection closed by remote host' or 'Failed to fetch'.",
        rootCause:
          "Transient cloud infrastructure latency, DNS resolution lag, or external service restarts.",
        solution: [
          "Enable 'Allow storing of incomplete executions' in Scenario Settings.",
          "Make automatically retries ConnectionErrors without requiring custom logic when Incomplete Executions are enabled.",
        ],
        makeLink: "https://www.make.com/en/help/errors/types-of-errors#connectionerror",
      },
      {
        title: "DataError & Validation Failures (HTTP 400)",
        description:
          "Triggered when the data sent by a module fails validation on the receiving service or when internal JSON parsing fails.",
        errorCode: "HTTP 400 &bull; DataError",
        symptoms:
          "'Invalid parameter', 'Malformed JSON', 'Field required', or 'String exceeds max length'.",
        rootCause:
          "Mapping null/undefined variables into required fields, sending strings to numeric inputs, or unescaped quotes in JSON payloads.",
        solution: [
          "Use the 'ifempty()' function: `ifempty(1.email; 'no-reply@domain.com')`.",
          "Validate incoming payloads against a Make Data Structure before sending.",
          "Use Make's built-in 'formatDate()' or 'parseNumber()' converters.",
        ],
        makeLink: "https://www.make.com/en/help/errors/types-of-errors#dataerror",
      },
      {
        title: "RuntimeLimitError & 40s Execution Timeouts",
        description:
          "Occurs when an individual module operation exceeds Make's hard execution timeout of 40 to 60 seconds.",
        errorCode: "RuntimeLimitError / 40s Timeout",
        symptoms:
          "OpenAI modules or slow CRM webhook endpoints terminate mid-run with 'Execution timed out'.",
        rootCause:
          "Large language models generating lengthy outputs with high max_tokens, or slow server databases processing heavy SQL joins.",
        solution: [
          "Reduce `max_tokens` in OpenAI modules or switch to `gpt-4o-mini` for high-speed tasks.",
          "Use an Asynchronous Webhook Architecture: Return an immediate 200 OK, then process background work.",
        ],
        makeLink: "https://www.make.com/en/help/scenarios/scenario-execution--cycles-and-phases#execution-timeout",
      },
    ],
  },
  {
    id: "webhooks-mastery",
    module: "Webhooks & APIs",
    title: "Webhooks, Instant Triggers & Custom Responses",
    description:
      "Configure custom webhooks, enforce strict JSON schemas to block invalid requests, and return custom HTTP 200/400 responses.",
    icon: Zap,
    badge: "Webhooks Architecture",
    makeDocsUrl: "https://www.make.com/en/help/tools/webhooks",
    topics: [
      {
        title: "Custom Webhook Schema Validation (Auto 400 Rejection)",
        description:
          "Protect your scenario execution credits by automatically rejecting malformed payloads before execution starts.",
        errorCode: "DATA STRUCTURE VALIDATION",
        symptoms:
          "Invalid lead submissions, bot spam, or missing phone numbers consuming scenario operations.",
        rootCause:
          "By default, Custom Webhooks accept any payload and return 200 Accepted regardless of data quality.",
        solution: [
          "In the Custom Webhook configuration, click 'Add' under 'Data structure'.",
          "Define required fields: `name (Text, required)`, `phone (Text, required)`, `email (Text)`.",
          "Make will automatically reject non-compliant requests with HTTP 400 Bad Request at zero operation cost.",
        ],
        codeSnippet: `{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "type": "object",
  "properties": {
    "leadName": { "type": "string" },
    "phoneNumber": { "type": "string" },
    "budget": { "type": "number" }
  },
  "required": ["leadName", "phoneNumber"]
}`,
        makeLink: "https://www.make.com/en/help/tools/data-structures",
      },
      {
        title: "Webhook Response Module (Custom Status & Headers)",
        description:
          "Control what the frontend client or calling application receives after Make processes the request.",
        errorCode: "MODULE: WEBHOOK RESPONSE",
        symptoms:
          "External frontend waits indefinitely or times out because it doesn't receive JSON acknowledgment.",
        rootCause:
          "Without a Webhook Response module, Make returns a generic HTML 'Accepted' response upon scenario completion.",
        solution: [
          "Add the 'Webhooks > Webhook Response' module to your scenario branch.",
          "Set Status code: 200 for success, 400 for logic rejection.",
          "Set Body: Custom JSON payload with record IDs and timestamps.",
          "Add Header: `Content-Type: application/json`.",
        ],
        codeSnippet: `{
  "success": true,
  "leadId": "{{1.id}}",
  "message": "Lead qualified and CRM updated successfully"
}`,
        makeLink: "https://www.make.com/en/help/tools/webhooks#webhook-response",
      },
      {
        title: "Preventing Webhook Duplicate Invocations",
        description:
          "Stop client platforms (like Stripe, Typeform, or Shopify) from triggering the same webhook multiple times.",
        errorCode: "IDEMPOTENCY CONFLICT",
        symptoms:
          "A customer submits a form once, but two or three duplicate emails/invoices are dispatched.",
        rootCause:
          "The calling platform expects a 200 response within 5 seconds. If Make takes longer, the platform resends the payload.",
        solution: [
          "Place a 'Webhook Response' module right after the trigger to respond with 200 immediately.",
          "Use a Make Data Store to check if `{{1.event_id}}` has already been processed before executing downstream steps.",
        ],
        makeLink: "https://www.make.com/en/help/tools/webhooks#answering-webhooks",
      },
    ],
  },
  {
    id: "openai-troubleshooting",
    module: "AI Integration",
    title: "OpenAI & GPT-4o Troubleshooting in Make.com",
    description:
      "Solve API key invalidations, rate limits, token quotas, and JSON format parsing issues in Make's OpenAI modules.",
    icon: Brain,
    badge: "AI Engineering",
    makeDocsUrl: "https://www.make.com/en/help/apps/ai/openai--chatgpt--dall-e--whisper-",
    topics: [
      {
        title: "OpenAI 429: You exceeded your current quota",
        description:
          "Occurs when your OpenAI platform credit balance is depleted or your organization payment card has failed.",
        errorCode: "HTTP 429 &bull; Insufficient Quota",
        symptoms:
          "Scenario fails instantly on the 'Create a Completion' or 'Create a Chat' module.",
        rootCause:
          "OpenAI API billing is prepaid and separate from ChatGPT Plus subscriptions. A $0.00 credit balance throws a 429 error.",
        solution: [
          "1. Open platform.openai.com/account/billing and add at least $5-$10 in prepaid credit.",
          "2. Enable 'Auto-recharge' so automations never stall when balance dips below $5.",
          "3. Verify your organization limit tier (Tier 1, Tier 2, etc.) for RPM allowances.",
        ],
        makeLink: "https://platform.openai.com/docs/guides/error-codes",
      },
      {
        title: "Enforcing Strict JSON Mode with GPT-4o",
        description:
          "Ensure AI outputs cleanly parse into Make variables without markdown backticks or syntax errors.",
        errorCode: "JSON PARSING ERROR",
        symptoms:
          "Parse JSON module fails with 'Unexpected token ` in JSON at position 0' because GPT returned ```json ... ```.",
        rootCause:
          "Standard prompts return conversational markdown formatting instead of pure raw JSON.",
        solution: [
          "1. In the OpenAI module settings, set 'Response Format' to `json_object`.",
          "2. In your System prompt, you MUST include the word 'JSON' (e.g. 'You are an agency assistant that outputs JSON only').",
          "3. Pass the response directly into Make's 'Parse JSON' module without regex cleaning.",
        ],
        codeSnippet: `// System Prompt Requirement:
"You are a qualification AI. You must return valid JSON only with keys: isQualified (boolean), estimatedBudget (number), reason (string)."`,
        makeLink: "https://platform.openai.com/docs/guides/text-generation/json-mode",
      },
    ],
  },
  {
    id: "whatsapp-automations",
    module: "Messaging Channels",
    title: "WhatsApp Cloud API & 24h Window Architecture",
    description:
      "Navigate Meta's strict 24-hour customer care window, template approvals, and permanent access token configuration.",
    icon: MessageSquare,
    badge: "WhatsApp Protocol",
    makeDocsUrl: "https://www.make.com/en/help/apps/communication/whatsapp-business-cloud",
    topics: [
      {
        title: "Error 131047: Re-engagement Message Prohibited (24h Window)",
        description:
          "Meta prohibits businesses from sending freeform text messages to users outside the 24-hour customer window.",
        errorCode: "META ERROR 131047",
        symptoms:
          "Automated follow-ups or cold outreach messages fail with 'Message failed to send outside 24 hour conversation window'.",
        rootCause:
          "A business can only send freeform messages within 24 hours of the customer's last incoming message.",
        solution: [
          "Outside the 24h window, you MUST use a pre-approved Meta Template (Utility or Marketing template).",
          "Inside Make, replace 'Send a Message' with 'Send a Template Message'.",
          "Ensure template variable count matches the approved template structure exactly.",
        ],
        makeLink: "https://developers.facebook.com/docs/whatsapp/cloud-api/guides/send-messages#conversation-windows",
      },
    ],
  },
  {
    id: "sheets-database",
    module: "Data Stores",
    title: "Google Sheets Concurrency Locks & Duplicate Prevention",
    description:
      "Eliminate duplicate row insertions and race conditions when multiple leads trigger automations simultaneously.",
    icon: FileSpreadsheet,
    badge: "Database Consistency",
    makeDocsUrl: "https://www.make.com/en/help/apps/productivity/google-sheets",
    topics: [
      {
        title: "Race Conditions: Parallel Bundles Overwriting Rows",
        description:
          "When two webhooks trigger at the exact same millisecond, both read the same 'last row' and overwrite each other.",
        errorCode: "CONCURRENCY OVERWRITE",
        symptoms:
          "Lead #14 and Lead #15 are saved into Row 42, erasing Lead #14 permanently.",
        rootCause:
          "Google Sheets API is non-transactional. Simultaneous queries read the same empty row before the write commit completes.",
        solution: [
          "1. In Make Scenario Settings, set 'Sequential processing' to ON (Max 1 execution at a time).",
          "2. Or use Make Data Store as an atomic mutex lock with unique IDs.",
          "3. For high-volume pipelines (>100 leads/day), migrate from Google Sheets to PostgreSQL (Neon) or Airtable.",
        ],
        makeLink: "https://www.make.com/en/help/scenarios/scenario-settings#sequential-processing",
      },
      {
        title: "Google Sheets Rate Limit (300 requests/minute)",
        description:
          "Google Cloud enforces strict per-user quotas of 300 write requests per minute.",
        errorCode: "HTTP 429 &bull; Google Quota Exceeded",
        symptoms:
          "Mass scraping or bulk imports crash with 'Quota exceeded for quota metric Read/Write requests'.",
        rootCause:
          "Executing 'Search Rows' followed by 'Add Row' inside an unthrottled Iterator loop.",
        solution: [
          "Use the 'Google Sheets > Bulk Add Rows' module instead of iterating row-by-row.",
          "Attach a 'Break' error handler with a 3-minute backoff.",
        ],
        makeLink: "https://developers.google.com/sheets/api/limits",
      },
    ],
  },
];

export function DocumentationHubClient() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedModule, setSelectedModule] = useState<string>("ALL");
  const [copiedSnippet, setCopiedSnippet] = useState<string | null>(null);

  const modulesList = useMemo(() => {
    const list = Array.from(new Set(DOC_SECTIONS.map((s) => s.module)));
    return ["ALL", ...list];
  }, []);

  const filteredSections = useMemo(() => {
    return DOC_SECTIONS.filter((section) => {
      const matchesModule =
        selectedModule === "ALL" || section.module === selectedModule;

      if (!searchQuery.trim()) return matchesModule;

      const q = searchQuery.toLowerCase();
      const inTitle = section.title.toLowerCase().includes(q);
      const inDesc = section.description.toLowerCase().includes(q);
      const inTopics = section.topics.some(
        (t) =>
          t.title.toLowerCase().includes(q) ||
          t.description.toLowerCase().includes(q) ||
          t.symptoms.toLowerCase().includes(q) ||
          t.solution.some((s) => s.toLowerCase().includes(q)) ||
          (t.errorCode && t.errorCode.toLowerCase().includes(q))
      );

      return matchesModule && (inTitle || inDesc || inTopics);
    });
  }, [searchQuery, selectedModule]);

  const handleCopyCode = (code: string, id: string) => {
    navigator.clipboard.writeText(code);
    setCopiedSnippet(id);
    toast.success("Code snippet copié !");
    setTimeout(() => setCopiedSnippet(null), 2000);
  };

  return (
    <div className="w-full max-w-[1600px] mx-auto space-y-8 pb-20 select-text">
      {/* ── Top Hero & Search Header ── */}
      <div className="relative rounded-3xl p-6 sm:p-10 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white border border-slate-800 shadow-2xl overflow-hidden">
        {/* Subtle background glow */}
        <div className="absolute top-0 right-0 -mt-12 -mr-12 w-96 h-96 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 -mb-12 w-80 h-80 rounded-full bg-blue-500/10 blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Eensell Automation Engineering &bull; Make.com Official Protocols</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white leading-tight">
            Automation Documentation & Troubleshooting Hub
          </h1>

          <p className="text-sm sm:text-base text-slate-300 leading-relaxed font-normal">
            Comprehensive production guides, error handling blueprints, app connection setups (Google Cloud Console OAuth & Meta System Users), and database synchronization.
          </p>

          {/* Search Bar */}
          <div className="pt-2">
            <div className="relative max-w-2xl">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search error codes, e.g. 'Gmail Google Cloud', 'WhatsApp Meta Token', 'RateLimitError', 'Break'..."
                className="w-full h-12 pl-12 pr-4 rounded-2xl bg-white/10 hover:bg-white/15 focus:bg-white/20 border border-white/20 text-white placeholder-slate-400 text-sm outline-none transition-all focus:border-emerald-400 shadow-inner"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-white px-2 py-1 bg-white/10 rounded-md"
                >
                  Clear
                </button>
              )}
            </div>
          </div>

          {/* Quick Jump Badges */}
          <div className="flex flex-wrap items-center gap-2 pt-2 text-xs">
            <span className="text-slate-400 font-medium">Quick Topics:</span>
            {[
              { label: "🔑 Gmail Google Cloud OAuth", query: "Gmail Google Cloud" },
              { label: "💬 WhatsApp Meta System User", query: "WhatsApp Meta" },
              { label: "🚨 5 Error Directives", query: "Directive" },
              { label: "⚡ Webhooks 400/200", query: "Webhook" },
              { label: "🤖 OpenAI Quota 429", query: "OpenAI" },
              { label: "📊 Sheets Concurrency Lock", query: "Sheets" },
            ].map((btn) => (
              <button
                key={btn.label}
                onClick={() => setSearchQuery(btn.query)}
                className="px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-slate-200 transition-all cursor-pointer font-medium text-[11px]"
              >
                {btn.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── Category Filters ── */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-[#EDEDEB] dark:border-[#2E2E2E]">
        <span className="text-xs font-semibold text-[#787774] dark:text-[#9B9A97] flex items-center gap-1 shrink-0 mr-1">
          <Filter className="w-3.5 h-3.5" />
          Filter:
        </span>
        {modulesList.map((mod) => (
          <button
            key={mod}
            onClick={() => setSelectedModule(mod)}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all shrink-0 cursor-pointer ${
              selectedModule === mod
                ? "bg-[#111111] dark:bg-white text-white dark:text-[#111111] shadow-xs"
                : "bg-[#F7F6F3] dark:bg-[#202020] text-[#787774] dark:text-[#9B9A97] hover:text-[#111111] dark:hover:text-white"
            }`}
          >
            {mod === "ALL" ? `All Modules (${DOC_SECTIONS.length})` : mod}
          </button>
        ))}
      </div>

      {/* ── Main Documentation Stream ── */}
      <div className="space-y-12">
        {filteredSections.length === 0 ? (
          <div className="p-12 text-center rounded-3xl bg-[#FFFFFF] dark:bg-[#202020] border border-[#EDEDEB] dark:border-[#2E2E2E] space-y-3">
            <HelpCircle className="w-10 h-10 text-slate-400 mx-auto" />
            <h3 className="text-base font-bold text-[#111111] dark:text-[#E6E6E5]">
              Aucun résultat pour &quot;{searchQuery}&quot;
            </h3>
            <p className="text-xs text-[#787774] dark:text-[#9B9A97] max-w-md mx-auto">
              Essayez des mots-clés comme &quot;Gmail&quot;, &quot;Google Cloud&quot;, &quot;WhatsApp&quot;, &quot;System User&quot;, &quot;Break&quot;, ou réinitialisez le filtre.
            </p>
            <button
              onClick={() => {
                setSearchQuery("");
                setSelectedModule("ALL");
              }}
              className="px-4 py-2 text-xs font-semibold bg-[#111111] text-white dark:bg-white dark:text-[#111111] rounded-xl cursor-pointer"
            >
              Réinitialiser la recherche
            </button>
          </div>
        ) : (
          filteredSections.map((section) => {
            const SectionIcon = section.icon;
            return (
              <section
                key={section.id}
                id={section.id}
                className="rounded-3xl bg-[#FFFFFF] dark:bg-[#202020] border border-[#EDEDEB] dark:border-[#2E2E2E] p-6 sm:p-8 shadow-xs space-y-6"
              >
                {/* Section Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#EDEDEB] dark:border-[#2E2E2E]">
                  <div className="flex items-start gap-3.5">
                    <div className="w-10 h-10 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-[#111111] dark:text-white shrink-0 shadow-2xs">
                      <SectionIcon className="w-5 h-5 stroke-[1.8]" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                          {section.module}
                        </span>
                        {section.badge && (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                            {section.badge}
                          </span>
                        )}
                      </div>
                      <h2 className="text-xl sm:text-2xl font-bold text-[#111111] dark:text-[#E6E6E5] tracking-tight">
                        {section.title}
                      </h2>
                      <p className="text-xs sm:text-sm text-[#787774] dark:text-[#9B9A97] mt-0.5 max-w-3xl">
                        {section.description}
                      </p>
                    </div>
                  </div>

                  {/* Official Make Link Button */}
                  <a
                    href={section.makeDocsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 h-8 px-3 rounded-xl text-xs font-semibold bg-[#F7F6F3] dark:bg-[#2A2A2A] hover:bg-[#EDEDEB] dark:hover:bg-[#333333] text-[#37352F] dark:text-[#E6E6E5] border border-[#EDEDEB] dark:border-[#2E2E2E] transition-all shrink-0 w-fit"
                  >
                    <span>Official Make.com Guide</span>
                    <ExternalLink className="w-3.5 h-3.5 opacity-60" />
                  </a>
                </div>

                {/* Sub-Topics / Problems Grid */}
                <div className="grid grid-cols-1 gap-6">
                  {section.topics.map((topic, idx) => (
                    <div
                      key={idx}
                      className="rounded-2xl border border-[#EDEDEB] dark:border-[#2E2E2E] bg-[#FAF9F7] dark:bg-[#1A1A1A] p-5 sm:p-6 space-y-4 shadow-2xs hover:border-[#D1D1CE] dark:hover:border-[#3E3E3E] transition-colors"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <h3 className="text-base font-bold text-[#111111] dark:text-[#E6E6E5] flex items-center gap-2">
                          <span>{topic.title}</span>
                        </h3>
                        {topic.errorCode && (
                          <span className="px-2.5 py-0.5 rounded-md font-mono text-[11px] font-bold bg-rose-50 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300 border border-rose-200 dark:border-rose-900/40 w-fit">
                            {topic.errorCode}
                          </span>
                        )}
                      </div>

                      <p className="text-xs text-[#55534E] dark:text-[#C5C5C4] leading-relaxed">
                        {topic.description}
                      </p>

                      {/* 3-Column Diagnostic Layout */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                        {/* Symptoms */}
                        <div className="p-3.5 rounded-xl bg-white dark:bg-[#222222] border border-[#EDEDEB] dark:border-[#2E2E2E] space-y-1">
                          <span className="font-bold text-amber-600 dark:text-amber-400 flex items-center gap-1 text-[11px] uppercase tracking-wider">
                            <AlertTriangle className="w-3 h-3" />
                            Symptoms
                          </span>
                          <p className="text-[#55534E] dark:text-[#C5C5C4] leading-relaxed">
                            {topic.symptoms}
                          </p>
                        </div>

                        {/* Root Cause */}
                        <div className="p-3.5 rounded-xl bg-white dark:bg-[#222222] border border-[#EDEDEB] dark:border-[#2E2E2E] space-y-1">
                          <span className="font-bold text-blue-600 dark:text-blue-400 flex items-center gap-1 text-[11px] uppercase tracking-wider">
                            <Compass className="w-3 h-3" />
                            Root Cause
                          </span>
                          <p className="text-[#55534E] dark:text-[#C5C5C4] leading-relaxed">
                            {topic.rootCause}
                          </p>
                        </div>

                        {/* Prescribed Solution */}
                        <div className="p-3.5 rounded-xl bg-emerald-50/60 dark:bg-emerald-950/20 border border-emerald-200/80 dark:border-emerald-800/40 space-y-1.5">
                          <span className="font-bold text-emerald-700 dark:text-emerald-300 flex items-center gap-1 text-[11px] uppercase tracking-wider">
                            <CheckCircle2 className="w-3 h-3" />
                            Prescribed Solution
                          </span>
                          <ul className="space-y-1 text-[#37352F] dark:text-[#E6E6E5] text-[11px] list-disc list-inside leading-relaxed">
                            {topic.solution.map((sol, sIdx) => (
                              <li key={sIdx}>{sol}</li>
                            ))}
                          </ul>
                        </div>
                      </div>

                      {/* Optional Code Snippet */}
                      {topic.codeSnippet && (
                        <div className="relative rounded-xl bg-slate-950 p-4 font-mono text-xs text-slate-200 border border-slate-800 overflow-x-auto shadow-inner">
                          <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-800 text-[10px] text-slate-400">
                            <span>Configuration / Parameters Reference</span>
                            <button
                              onClick={() =>
                                handleCopyCode(
                                  topic.codeSnippet!,
                                  `${section.id}-${idx}`
                                )
                              }
                              className="flex items-center gap-1 hover:text-white transition-colors cursor-pointer"
                            >
                              {copiedSnippet === `${section.id}-${idx}` ? (
                                <Check className="w-3 h-3 text-emerald-400" />
                              ) : (
                                <Copy className="w-3 h-3" />
                              )}
                              <span>
                                {copiedSnippet === `${section.id}-${idx}`
                                  ? "Copié !"
                                  : "Copier"}
                              </span>
                            </button>
                          </div>
                          <pre className="text-[11px] leading-relaxed whitespace-pre-wrap">
                            {topic.codeSnippet}
                          </pre>
                        </div>
                      )}

                      {/* Topic Direct Link */}
                      {topic.makeLink && (
                        <div className="pt-1 flex justify-end">
                          <a
                            href={topic.makeLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-[11px] font-semibold text-blue-600 dark:text-blue-400 hover:underline"
                          >
                            <span>Read detailed documentation on Make.com</span>
                            <ChevronRight className="w-3 h-3" />
                          </a>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </section>
            );
          })
        )}
      </div>

      {/* ── Community & Support CTA Banner ── */}
      <div className="rounded-3xl p-6 sm:p-8 bg-[#FAF9F7] dark:bg-[#1E1E1E] border border-[#EDEDEB] dark:border-[#2E2E2E] flex flex-col sm:flex-row sm:items-center justify-between gap-6 shadow-xs">
        <div className="space-y-1.5 max-w-xl">
          <h3 className="text-lg font-bold text-[#111111] dark:text-[#E6E6E5]">
            Still facing an unhandled automation bug?
          </h3>
          <p className="text-xs sm:text-sm text-[#787774] dark:text-[#9B9A97] leading-relaxed">
            Post your Make scenario blueprint JSON in the Eensell University community or bring it to the weekly live sessions for direct engineer review.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 shrink-0">
          <Link
            href="/dashboard/community"
            className="inline-flex items-center gap-1.5 h-9 px-4 rounded-xl text-xs font-bold bg-[#111111] hover:bg-[#2A2A2A] dark:bg-white dark:hover:bg-slate-200 text-white dark:text-[#111111] shadow-xs transition-all cursor-pointer"
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>Post in Community</span>
          </Link>
          <Link
            href="/dashboard/live-calls"
            className="inline-flex items-center gap-1.5 h-9 px-4 rounded-xl text-xs font-semibold bg-white dark:bg-[#2A2A2A] hover:bg-[#F2F1EE] dark:hover:bg-[#333333] border border-[#EDEDEB] dark:border-[#2E2E2E] text-[#37352F] dark:text-[#E6E6E5] shadow-2xs transition-all cursor-pointer"
          >
            <Clock className="w-3.5 h-3.5" />
            <span>Join Live Review</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
