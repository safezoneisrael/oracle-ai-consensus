import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { CodeBlock } from "./CodeBlock";
import { TableOfContents } from "./TableOfContents";
import {
  Database,
  Zap,
  Shield,
  Clock,
  BarChart3,
  Settings,
  FileText,
  Calendar,
  Trash2,
  Activity,
  RefreshCw,
  Languages,
  Mic,
} from "lucide-react";

export const ApiDocumentation = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-gradient-primary">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center space-x-4">
            <div className="bg-primary-foreground/20 p-2 rounded-lg">
              <Database className="h-8 w-8 text-primary-foreground" />
            </div>
            <div>
              <h1
                id="oracle-api-documentation"
                className="text-3xl font-bold text-primary-foreground">
                Oracle API Documentation
              </h1>
              <p className="text-primary-foreground/80 mt-2">
                Multi-model AI consensus API for question resolution and
                scheduling
              </p>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Table of Contents */}
          <div className="lg:col-span-1">
            <TableOfContents />
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3 space-y-8">
            {/* Overview */}
            <section id="overview">
              <h2 id="overview" className="text-2xl font-bold mb-4">
                Overview
              </h2>
              <Card>
                <CardContent className="p-6">
                  <p className="text-muted-foreground mb-4">
                    The Oracle API provides endpoints for resolving questions
                    using multiple AI models (Exa, Perplexity, GPT, Grok, and
                    Gemini) to achieve consensus results through AI model
                    agreement.
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                    <div className="flex items-center space-x-2 p-3 bg-muted/50 rounded-lg">
                      <Zap className="h-5 w-5 text-primary" />
                      <span className="text-sm font-medium">
                        Multi-model AI
                      </span>
                    </div>
                    <div className="flex items-center space-x-2 p-3 bg-muted/50 rounded-lg">
                      <BarChart3 className="h-5 w-5 text-primary" />
                      <span className="text-sm font-medium">Analytics</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </section>

            {/* Base URL */}
            <section id="base-url">
              <h2 id="base-url" className="text-2xl font-bold mb-4">
                Base URL
              </h2>
              <CodeBlock
                code="https://dev-api.olympus-demo.com"
                language="text"
              />
            </section>

            {/* Endpoints */}
            <section id="endpoints">
              <h2 id="endpoints" className="text-2xl font-bold mb-6">
                Endpoints
              </h2>

              {/* Resolve Question */}
              <div id="resolve-question" className="mb-8">
                <h3
                  id="resolve-question"
                  className="text-xl font-semibold mb-4 flex items-center">
                  <Zap className="h-5 w-5 mr-2 text-primary" />
                  1. Resolve Question
                </h3>
                <div className="flex items-center space-x-2 mb-4">
                  <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
                    POST
                  </Badge>
                  <code className="code-inline">/api/resolve</code>
                </div>

                <Card className="mb-4">
                  <CardContent className="p-6">
                    <p className="text-muted-foreground mb-4">
                      Resolves a question using multiple AI models and returns
                      consensus results.
                    </p>

                    <h4 id="request-body" className="font-semibold mb-3">
                      Request Body
                    </h4>
                    <CodeBlock
                      code={`{
  "poolId": "string (optional)",
  "question": "string (required, max 2000 chars)",
  "options": ["option1", "option2", "option3", ...] (required, 2-10 options),
  "questionFileName": "string (required, RAIN_{{pool_id}} format, max 200 chars)"
}`}
                      title="Request Schema"
                    />

                    <Separator className="my-6" />

                    <h4 id="example-request" className="font-semibold mb-3">
                      Example Request
                    </h4>
                    <CodeBlock
                      code={`{
  "poolId": "pool_123",
  "question": "What is the capital of France?",
  "options": ["London", "Paris", "Berlin", "Madrid"],
  "questionFileName": "RAIN_pool_123"
}`}
                    />

                    <Separator className="my-6" />

                    <h4 id="response" className="font-semibold mb-3">
                      Response
                    </h4>
                    <CodeBlock
                      code={`{
  "exa": 1,
  "perplexity": 1,
  "gpt": 1,
  "grok": 1,
  "gemini": 1,
  "final": "Paris",
  "consensusStatus": "consensus",
  "consensusIndex": 1,
  "exa_raw": "{\\"answer\\": \\"Paris\\"}",
  "perplexity_raw": "{\\"answer\\": \\"Paris\\"}",
  "gpt_raw": "{\\"answer\\": \\"Paris\\"}",
  "grok_raw": "{\\"answer\\": \\"Paris\\"}",
  "gemini_raw": "{\\"answer\\": \\"Paris\\"}",
  "original_question": "What is the capital of France?",
  "formatted_question": "What is the capital of France?",
  "question_file_name": "RAIN_geography_quiz_001"
}`}
                    />

                    <Separator className="my-6" />

                    <h4 id="response-parameters" className="font-semibold mb-3">
                      Response Parameters
                    </h4>
                    <div className="space-y-4">
                      <div className="p-4 bg-muted/30 rounded-lg">
                        <h5 className="font-medium mb-2">consensusStatus</h5>
                        <p className="text-sm text-muted-foreground mb-2">
                          Indicates the consensus status of the AI models:
                        </p>
                        <div className="space-y-1">
                          <div className="flex items-center space-x-2">
                            <Badge
                              variant="outline"
                              className="bg-green-50 text-green-700">
                              consensus
                            </Badge>
                            <span className="text-sm">
                              All models reached agreement
                            </span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Badge
                              variant="outline"
                              className="bg-yellow-50 text-yellow-700">
                              no_consensus
                            </Badge>
                            <span className="text-sm">
                              Models disagreed, no clear consensus
                            </span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Badge
                              variant="outline"
                              className="bg-red-50 text-red-700">
                              no_answer
                            </Badge>
                            <span className="text-sm">
                              Models could not provide valid answers
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="p-4 bg-muted/30 rounded-lg">
                        <h5 className="font-medium mb-2">consensusIndex</h5>
                        <p className="text-sm text-muted-foreground mb-2">
                          The index of the consensus answer in the options
                          array. Use this instead of "final" when
                          consensusStatus is "no_consensus" or "no_answer":
                        </p>
                        <div className="space-y-1">
                          <div className="flex items-center space-x-2">
                            <Badge variant="outline">0-9</Badge>
                            <span className="text-sm">
                              Index of the consensus answer (0-based)
                            </span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Badge
                              variant="outline"
                              className="bg-red-50 text-red-700">
                              -1
                            </Badge>
                            <span className="text-sm">
                              No valid consensus reached
                            </span>
                          </div>
                        </div>
                        <div className="mt-3 p-3 bg-blue-50 border-l-4 border-blue-400 rounded">
                          <p className="text-sm text-blue-700">
                            <strong>Retry Strategy:</strong> First, check{" "}
                            <code>consensusIndex</code>. If it's <code>-1</code>
                            , this indicates no valid consensus was reached and
                            you should retry. Then check{" "}
                            <code>consensusStatus</code>: for "no_answer"
                            status, the system will automatically retry; for
                            "no_consensus" status, you can manually retry the
                            request.
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Retry Mechanism */}
              <div id="retry-mechanism" className="mb-8">
                <h3
                  id="retry-mechanism"
                  className="text-xl font-semibold mb-4 flex items-center">
                  <RefreshCw className="h-5 w-5 mr-2 text-primary" />
                  2. Retry Mechanism
                </h3>
                <Card>
                  <CardContent className="p-6">
                    <p className="text-muted-foreground mb-4">
                      When the consensus result is "No Answer", the system
                      automatically retries the query with increasing intervals
                      until a valid answer is received or maximum retries are
                      reached.
                    </p>

                    <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mb-4">
                      <div className="flex">
                        <div className="flex-shrink-0">
                          <RefreshCw className="h-5 w-5 text-blue-400" />
                        </div>
                        <div className="ml-3">
                          <p className="text-sm text-blue-700">
                            <strong>Progressive Retry Schedule:</strong> First
                            check if <code>consensusIndex</code> is{" "}
                            <code>-1</code>. If it is, then check{" "}
                            <code>consensusStatus</code>: if it's{" "}
                            <code>"no_answer"</code>, the system will
                            automatically schedule retries with increasing
                            delays. For <code>"no_consensus"</code>, you can
                            manually retry the request.
                          </p>
                        </div>
                      </div>
                    </div>

                    <h4 className="font-semibold mb-3">Retry Schedule</h4>
                    <div className="space-y-2 mb-4">
                      <div className="flex justify-between items-center p-3 bg-muted/30 rounded">
                        <span>1st Retry</span>
                        <Badge variant="outline">5 minutes</Badge>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-muted/30 rounded">
                        <span>2nd Retry</span>
                        <Badge variant="outline">30 minutes</Badge>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-muted/30 rounded">
                        <span>3rd Retry</span>
                        <Badge variant="outline">60 minutes</Badge>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-muted/30 rounded">
                        <span>4th Retry</span>
                        <Badge variant="outline">3 hours</Badge>
                      </div>
                    </div>

                    <h4 className="font-semibold mb-3">Response Examples</h4>

                    <h5 className="font-medium mb-2">
                      Automatic Retry (no_answer)
                    </h5>
                    <CodeBlock
                      code={`{
  "exa": -1,
  "perplexity": -1,
  "gpt": -1,
  "grok": -1,
  "gemini": -1,
  "final": "No Answer",
  "consensusStatus": "no_answer",
  "consensusIndex": -1,
  "retry_scheduled": true,
  "retry_count": 1,
  "retry_at": "2024-01-15T10:05:00.000Z",
  "message": "No consensus reached. Retry scheduled in 5 minutes."
}`}
                    />

                    <h5 className="font-medium mb-2 mt-4">
                      Manual Retry (no_consensus)
                    </h5>
                    <CodeBlock
                      code={`{
  "exa": 1,
  "perplexity": 2,
  "gpt": 1,
  "grok": 3,
  "gemini": 1,
  "final": "Paris",
  "consensusStatus": "no_consensus",
  "consensusIndex": 1,
  "retry_scheduled": false,
  "message": "Models disagreed. You can manually retry."
}`}
                    />
                  </CardContent>
                </Card>
              </div>

              {/* File Naming Convention */}
              <div id="file-naming" className="mb-8">
                <h3
                  id="file-naming"
                  className="text-xl font-semibold mb-4 flex items-center">
                  <FileText className="h-5 w-5 mr-2 text-primary" />
                  3. File Naming Convention
                </h3>
                <Card>
                  <CardContent className="p-6">
                    <p className="text-muted-foreground mb-4">
                      Users must provide the <code>questionFileName</code>{" "}
                      parameter in the request body using the RAIN naming
                      convention for internal analysis purposes.
                    </p>

                    <div className="bg-orange-50 border-l-4 border-orange-400 p-4 mb-4">
                      <div className="flex">
                        <div className="flex-shrink-0">
                          <FileText className="h-5 w-5 text-orange-400" />
                        </div>
                        <div className="ml-3">
                          <p className="text-sm text-orange-700">
                            <strong>Required Format:</strong> You must send{" "}
                            <code>questionFileName</code> as{" "}
                            <code>RAIN_&#123;&#123;pool_id&#125;&#125;</code> in
                            your request.
                          </p>
                        </div>
                      </div>
                    </div>

                    <h4 className="font-semibold mb-3">Required Format</h4>
                    <div className="space-y-2 mb-4">
                      <div className="p-3 bg-muted/30 rounded">
                        <code>RAIN_&#123;&#123;pool_id&#125;&#125;</code> -
                        Replace <code>&#123;&#123;pool_id&#125;&#125;</code>{" "}
                        with your actual pool ID
                      </div>
                    </div>

                    <h4 className="font-semibold mb-3">Example Usage</h4>
                    <CodeBlock
                      code={`{
  "poolId": "test-pool-123",
  "question": "What is the capital of France?",
  "options": ["London", "Paris", "Berlin", "Madrid"],
  "questionFileName": "RAIN_test-pool-123"
}`}
                      title="Request with questionFileName"
                    />

                    <h4 className="font-semibold mb-3">File Name Examples</h4>
                    <div className="space-y-2">
                      <div className="p-3 bg-muted/30 rounded">
                        <code>RAIN_pool_123</code> - For pool ID "pool_123"
                      </div>
                      <div className="p-3 bg-muted/30 rounded">
                        <code>RAIN_geography_quiz_001</code> - For pool ID
                        "geography_quiz_001"
                      </div>
                      <div className="p-3 bg-muted/30 rounded">
                        <code>RAIN_user_session_456</code> - For pool ID
                        "user_session_456"
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </section>

            {/* SDK Examples */}
            <section id="sdk-examples">
              <h2 id="sdk-examples" className="text-2xl font-bold mb-4">
                SDK Examples
              </h2>

              <div className="mb-6">
                <h3
                  id="javascript-example"
                  className="text-lg font-semibold mb-3">
                  JavaScript/Node.js
                </h3>
                <CodeBlock
                  code={`const axios = require("axios");

const oracleAPI = axios.create({
  baseURL: "https://dev-api.olympus-demo.com",
  headers: {
    Authorization: \`Bearer \${process.env.API_TOKEN}\`,
    "Content-Type": "application/json",
  },
});

// Resolve a question
async function resolveQuestion(question, options) {
  try {
    const response = await oracleAPI.post("/api/resolve", {
      question,
      options,
    });
    return response.data;
  } catch (error) {
    console.error("Error resolving question:", error.response?.data);
    throw error;
  }
}`}
                  language="javascript"
                />
              </div>

              <div className="mb-6">
                <h3 id="python-example" className="text-lg font-semibold mb-3">
                  Python
                </h3>
                <CodeBlock
                  code={`import requests
import os
from datetime import datetime

class OracleAPI:
    def __init__(self, base_url, api_token):
        self.base_url = base_url
        self.headers = {
            'Authorization': f'Bearer {api_token}',
            'Content-Type': 'application/json'
        }

    def resolve_question(self, question, options):
        """Resolve a question using multiple AI models"""
        url = f"{self.base_url}/api/resolve"
        data = {
            'question': question,
            'options': options
        }

        response = requests.post(url, json=data, headers=self.headers)
        response.raise_for_status()
        return response.json()

# Usage example
api = OracleAPI('https://dev-api.olympus-demo.com', os.getenv('API_TOKEN'))

result = api.resolve_question(
    "What is the capital of France?",
    ["London", "Paris", "Berlin", "Madrid"]
)

# Check consensus status and use appropriate answer
if result['consensusStatus'] == 'consensus':
    print(f"Consensus answer: {result['final']}")
    print(f"Answer index: {result['consensusIndex']}")
elif result['consensusStatus'] == 'no_consensus':
    print(f"No consensus reached. Best answer: {result['final']}")
    print(f"Answer index: {result['consensusIndex']}")
else:  # no_answer
    print("No valid answer from any model")
    print(f"Answer index: {result['consensusIndex']}")`}
                  language="python"
                />
              </div>
            </section>

            {/* Postman Collection */}
            <section id="postman-collection">
              <h2 id="postman-collection" className="text-2xl font-bold mb-4">
                Postman Collection
              </h2>
              <Card>
                <CardContent className="p-6">
                  <p className="text-muted-foreground mb-4">
                    Download our Postman collection to quickly test the Oracle
                    API endpoints with pre-configured requests.
                  </p>

                  <div className="bg-green-50 border-l-4 border-green-400 p-4 mb-6">
                    <div className="flex">
                      <div className="flex-shrink-0">
                        <FileText className="h-5 w-5 text-green-400" />
                      </div>
                      <div className="ml-3">
                        <p className="text-sm text-green-700">
                          <strong>Ready to Use:</strong> Import this collection
                          directly into Postman to start testing the Oracle API
                          immediately.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4 mb-6">
                    <a
                      href="https://limewire.com/d/db6M1#H4Uy4IMgTz"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors">
                      <FileText className="h-4 w-4 mr-2" />
                      Download Postman Collection
                    </a>
                    <span className="text-sm text-muted-foreground">
                      1.15KB • oracle.postman_collection.json
                    </span>
                  </div>

                  <h4 className="font-semibold mb-3">Collection Contents</h4>
                  <div className="space-y-2 mb-6">
                    <div className="flex items-center space-x-2 p-3 bg-muted/30 rounded">
                      <span className="text-sm font-medium">
                        Resolve Question
                      </span>
                      <Badge variant="outline">POST /api/resolve</Badge>
                    </div>
                  </div>

                  <h4 className="font-semibold mb-3">Example Request</h4>
                  <CodeBlock
                    code={`{
  "poolId": "test-pool-123",
  "question": "1+1",
  "options": ["2", "3"]
}`}
                    title="Request Body"
                  />

                  <Separator className="my-6" />

                  <h4 className="font-semibold mb-3">Collection JSON</h4>
                  <CodeBlock
                    code={`{
  "info": {
    "_postman_id": "baaf8480-4674-491c-b198-4cc9c046d103",
    "name": "oracle",
    "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json",
    "_exporter_id": "38061292",
    "_collection_link": "https://solar-flare-802037.postman.co/workspace/My-Workspace~799084a4-dc06-4dc5-8282-030be2993ede/collection/38061292-baaf8480-4674-491c-b198-4cc9c046d103?action=share&source=collection_link&creator=38061292"
  },
  "item": [
    {
      "name": "resolve",
      "request": {
        "auth": {
          "type": "noauth"
        },
        "method": "POST",
        "header": [
          {
            "key": "",
            "value": "",
            "type": "text"
          }
        ],
        "body": {
          "mode": "raw",
          "raw": "{\\"poolId\\":\\"test-pool-123\\",\\"question\\":\\"1+1\\",\\"options\\":[\\"2\\",\\"3\\"]}\\n",
          "options": {
            "raw": {
              "language": "json"
            }
          }
        },
        "url": {
          "raw": "https://dev-api.olympus-demo.com/api/resolve",
          "protocol": "https",
          "host": [
            "dev-api",
            "olympus-demo",
            "com"
          ],
          "path": [
            "api",
            "resolve"
          ]
        }
      },
      "response": []
    }
  ]
}`}
                    title="Postman Collection"
                  />
                </CardContent>
              </Card>
            </section>

            {/* TOMI SuperApp Translation API */}
            <section id="tomi-translation-api">
              <h2 id="tomi-translation-api" className="text-2xl font-bold mb-6">
                🧠 TOMI SuperApp – Translation API
              </h2>

              <Card className="mb-6">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-2 mb-4">
                    <Languages className="h-6 w-6 text-primary" />
                    <h3
                      id="tomi-translation-api"
                      className="text-xl font-semibold">
                      Translation Endpoint
                    </h3>
                  </div>

                  <p className="text-muted-foreground mb-6">
                    Welcome to our simple and powerful translation endpoint.
                    Just POST with a JSON body and get back a clean, translated
                    string — no TTS, no speech input, just pure AI translation.
                  </p>

                  <div className="mb-4">
                    <span className="font-semibold">Base URL:</span>
                    <code className="ml-2 px-2 py-1 bg-muted rounded text-sm">
                      https://api-test.olympus-demo.com
                    </code>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <div className="flex items-center space-x-2 p-3 bg-muted/50 rounded-lg">
                      <Zap className="h-5 w-5 text-primary" />
                      <span className="text-sm font-medium">
                        Powered by GPT
                      </span>
                    </div>
                    <div className="flex items-center space-x-2 p-3 bg-muted/50 rounded-lg">
                      <Settings className="h-5 w-5 text-primary" />
                      <span className="text-sm font-medium">
                        Easy to integrate
                      </span>
                    </div>
                    <div className="flex items-center space-x-2 p-3 bg-muted/50 rounded-lg">
                      <Shield className="h-5 w-5 text-primary" />
                      <span className="text-sm font-medium">
                        Ready for production
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2 mb-4">
                    <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
                      POST
                    </Badge>
                    <code className="code-inline">/tomi-server-translate</code>
                  </div>

                  <h4 id="tomi-request-body" className="font-semibold mb-3">
                    Request Body
                  </h4>
                  <CodeBlock
                    code={`{
  "text": "string (required)",
  "lang": "string (required, language code)"
}`}
                    title="Request Schema"
                  />

                  <Separator className="my-6" />

                  <h4 id="tomi-example-request" className="font-semibold mb-3">
                    Example Request
                  </h4>
                  <CodeBlock
                    code={`{
  "text": "Hello, how are you?",
  "lang": "he"
}`}
                    title="Example Request"
                  />

                  <Separator className="my-6" />

                  <h4 id="tomi-response" className="font-semibold mb-3">
                    Response
                  </h4>
                  <CodeBlock
                    code={`{
  "translatedText": "שלום, איך אתה?"
}`}
                    title="Response"
                  />

                  <Separator className="my-6" />

                  <h4
                    id="tomi-response-parameters"
                    className="font-semibold mb-3">
                    Response Parameters
                  </h4>
                  <div className="space-y-4">
                    <div className="p-4 bg-muted/30 rounded-lg">
                      <h5 className="font-medium mb-2">translatedText</h5>
                      <p className="text-sm text-muted-foreground">
                        The translated text in the requested language. Returns
                        the original text if translation fails.
                      </p>
                    </div>
                  </div>

                  <Separator className="my-6" />

                  <h4 id="error-responses" className="font-semibold mb-3">
                    Error Responses
                  </h4>
                  <div className="space-y-4">
                    <div className="p-4 bg-red-50 border-l-4 border-red-400 rounded">
                      <h5 className="font-medium mb-2 text-red-800">
                        400 Bad Request
                      </h5>
                      <p className="text-sm text-red-700 mb-2">
                        When text or language code is missing:
                      </p>
                      <CodeBlock
                        code={`{
  "message": "Text and language code are required."
}`}
                        language="json"
                      />
                    </div>
                    <div className="p-4 bg-red-50 border-l-4 border-red-400 rounded">
                      <h5 className="font-medium mb-2 text-red-800">
                        500 Internal Server Error
                      </h5>
                      <p className="text-sm text-red-700 mb-2">
                        When translation service fails:
                      </p>
                      <CodeBlock
                        code={`{
  "message": "Server error during translation."
}`}
                        language="json"
                      />
                    </div>
                  </div>

                  <Separator className="my-6" />

                  <h4 id="tomi-sdk-examples" className="font-semibold mb-3">
                    SDK Examples
                  </h4>

                  <div className="mb-6">
                    <h5 className="text-lg font-semibold mb-3">JavaScript</h5>
                    <CodeBlock
                      code={`// Translation API client
const translateAPI = axios.create({
  baseURL: 'https://api-test.olympus-demo.com/tomi-server-translate',
  headers: {
    'Content-Type': 'application/json'
  }
});

// Translate text
async function translateText(text, targetLanguage) {
  try {
    const response = await translateAPI.post("/api/translate", {
      text,
      lang: targetLanguage
    });
    return response.data.translatedText;
  } catch (error) {
    console.error("Translation error:", error.response?.data);
    throw error;
  }
}

// Usage example
const translatedText = await translateText("Hello, how are you?", "he");
console.log(translatedText); // "שלום, איך אתה?"`}
                      language="javascript"
                    />
                  </div>

                  <div className="mb-6">
                    <h5 className="text-lg font-semibold mb-3">Python</h5>
                    <CodeBlock
                      code={`import requests

class TranslationAPI:
    def __init__(self, base_url):
        self.base_url = base_url
        self.headers = {
            'Content-Type': 'application/json'
        }

    def translate_text(self, text, target_language):
        """Translate text to target language"""
        url = f"{self.base_url}/api/translate"
        data = {
            'text': text,
            'lang': target_language
        }

        response = requests.post(url, json=data, headers=self.headers)
        response.raise_for_status()
        return response.json()['translatedText']

# Usage example
api = TranslationAPI('https://api-test.olympus-demo.com/tomi-server-translate')

translated_text = api.translate_text("Hello, how are you?", "he")
print(translated_text)  # "שלום, איך אתה?"`}
                      language="python"
                    />
                  </div>
                </CardContent>
              </Card>
            </section>

            {/* TOMI SuperApp Audio Transcription API */}
            <section id="tomi-transcription-overview">
              <h2
                id="tomi-transcription-overview"
                className="text-2xl font-bold mb-6">
                🎙️ TOMI SuperApp – Audio Transcription API
              </h2>

              <Card className="mb-6">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-2 mb-4">
                    <Mic className="h-6 w-6 text-primary" />
                    <h3
                      id="tomi-transcription-overview"
                      className="text-xl font-semibold">
                      Audio Transcription & Intent Processing
                    </h3>
                  </div>

                  <p className="text-muted-foreground mb-6">
                    Transform audio files into actionable data. This endpoint
                    transcribes audio using OpenAI's Whisper model, classifies
                    intent, and processes financial commands with contact and
                    token information.
                  </p>

                  <div className="mb-4">
                    <span className="font-semibold">Base URL:</span>
                    <code className="ml-2 px-2 py-1 bg-muted rounded text-sm">
                      https://api-test.olympus-demo.com
                    </code>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <div className="flex items-center space-x-2 p-3 bg-muted/50 rounded-lg">
                      <Zap className="h-5 w-5 text-primary" />
                      <span className="text-sm font-medium">
                        Whisper AI Powered
                      </span>
                    </div>
                    <div className="flex items-center space-x-2 p-3 bg-muted/50 rounded-lg">
                      <Activity className="h-5 w-5 text-primary" />
                      <span className="text-sm font-medium">
                        Intent Classification
                      </span>
                    </div>
                    <div className="flex items-center space-x-2 p-3 bg-muted/50 rounded-lg">
                      <Shield className="h-5 w-5 text-primary" />
                      <span className="text-sm font-medium">
                        Financial Processing
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2 mb-4">
                    <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
                      POST
                    </Badge>
                    <code className="code-inline">
                      /tomi-server2/transcribe
                    </code>
                  </div>

                  <div className="bg-amber-50 border-l-4 border-amber-400 p-4 mb-6">
                    <div className="flex">
                      <div className="flex-shrink-0">
                        <FileText className="h-5 w-5 text-amber-400" />
                      </div>
                      <div className="ml-3">
                        <p className="text-sm text-amber-700">
                          <strong>Supported Audio Formats:</strong> The API
                          accepts various audio formats including M4A, MP3, WAV,
                          and other common audio file types. Files are
                          automatically converted to M4A format for processing.
                        </p>
                      </div>
                    </div>
                  </div>

                  <h4
                    id="tomi-transcription-request-body"
                    className="font-semibold mb-3">
                    Request Body
                  </h4>
                  <p className="text-sm text-muted-foreground mb-3">
                    The request supports two upload methods:
                  </p>

                  <div className="mb-4">
                    <h5 className="font-medium mb-2">
                      Method 1: FormData with File Upload
                    </h5>
                    <CodeBlock
                      code={`FormData:
- file: (binary/audio file)
- contacts: (string) JSON array of contact names
- tokens: (string) JSON array of token objects`}
                      title="FormData Request"
                    />
                  </div>

                  <div className="mb-4">
                    <h5 className="font-medium mb-2">
                      Method 2: React Native URI
                    </h5>
                    <CodeBlock
                      code={`{
  "uri": "string (file URI)",
  "type": "string (file type)",
  "name": "string (file name)",
  "contacts": "string (JSON array of contact names)",
  "tokens": "string (JSON array of token objects)"
}`}
                      title="React Native Request"
                    />
                  </div>

                  <Separator className="my-6" />

                  <h4
                    id="tomi-transcription-example-request"
                    className="font-semibold mb-3">
                    Example Request
                  </h4>
                  <CodeBlock
                    code={`// FormData example
const formData = new FormData();
formData.append('file', audioFile);
formData.append('contacts', JSON.stringify([
  "Ilan", "Moshe", "Sarah", "Michael", "Daniel", "Emily", 
  "Jonathan", "Zaia", "Ibrahim", "Feran", "Moshe hogeg", 
  "Moshe nahmani", "osher lugasy"
]));
formData.append('tokens', JSON.stringify([
  {"name": "Tether USD", "symbol": "USDT"},
  {"name": "Ethereum", "symbol": "ETH"},
  {"name": "bitcoin", "symbol": "BTC"},
  {"name": "USD Coin", "symbol": "USDC"}
]));`}
                    title="FormData Example"
                  />

                  <Separator className="my-6" />

                  <h4
                    id="tomi-transcription-response"
                    className="font-semibold mb-3">
                    Response
                  </h4>
                  <CodeBlock
                    code={`{
  "recipient": ["Ilan"],
  "amount": 1,
  "currency": "USDT",
  "network": ["Ethereum"],
  "convertTo": {
    "name": "Ethereum",
    "symbol": "ETH"
  },
  "text": "Send one ethereum to Ilan on ethereum chain."
}`}
                    title="Response Example"
                  />

                  <Separator className="my-6" />

                  <h4
                    id="tomi-transcription-response-parameters"
                    className="font-semibold mb-3">
                    Response Parameters
                  </h4>
                  <div className="space-y-4">
                    <div className="p-4 bg-muted/30 rounded-lg">
                      <h5 className="font-medium mb-2">recipient</h5>
                      <p className="text-sm text-muted-foreground">
                        Array of recipient names extracted from the audio
                        transcript, matched against provided contacts.
                      </p>
                    </div>
                    <div className="p-4 bg-muted/30 rounded-lg">
                      <h5 className="font-medium mb-2">amount</h5>
                      <p className="text-sm text-muted-foreground">
                        Numeric value representing the amount to transfer,
                        extracted from the audio.
                      </p>
                    </div>
                    <div className="p-4 bg-muted/30 rounded-lg">
                      <h5 className="font-medium mb-2">currency</h5>
                      <p className="text-sm text-muted-foreground">
                        Currency symbol (e.g., USDT, ETH, BTC) identified from
                        the audio and matched against provided tokens.
                      </p>
                    </div>
                    <div className="p-4 bg-muted/30 rounded-lg">
                      <h5 className="font-medium mb-2">network</h5>
                      <p className="text-sm text-muted-foreground">
                        Array of blockchain networks mentioned in the audio
                        (e.g., Ethereum, Polygon).
                      </p>
                    </div>
                    <div className="p-4 bg-muted/30 rounded-lg">
                      <h5 className="font-medium mb-2">convertTo</h5>
                      <p className="text-sm text-muted-foreground">
                        Object containing conversion target currency with name
                        and symbol properties.
                      </p>
                    </div>
                    <div className="p-4 bg-muted/30 rounded-lg">
                      <h5 className="font-medium mb-2">text</h5>
                      <p className="text-sm text-muted-foreground">
                        Original transcribed text from the audio file.
                      </p>
                    </div>
                  </div>

                  <Separator className="my-6" />

                  <h4
                    id="tomi-transcription-error-responses"
                    className="font-semibold mb-3">
                    Error Responses
                  </h4>
                  <div className="space-y-4">
                    <div className="p-4 bg-red-50 border-l-4 border-red-400 rounded">
                      <h5 className="font-medium mb-2 text-red-800">
                        400 Bad Request
                      </h5>
                      <p className="text-sm text-red-700 mb-2">
                        When no audio file is provided:
                      </p>
                      <CodeBlock
                        code={`{
  "error": "No audio file provided."
}`}
                        language="json"
                      />
                    </div>
                    <div className="p-4 bg-red-50 border-l-4 border-red-400 rounded">
                      <h5 className="font-medium mb-2 text-red-800">
                        400 Bad Request
                      </h5>
                      <p className="text-sm text-red-700 mb-2">
                        When audio processing fails:
                      </p>
                      <CodeBlock
                        code={`{
  "error": "Failed to process audio"
}`}
                        language="json"
                      />
                    </div>
                  </div>

                  <Separator className="my-6" />

                  <h4
                    id="tomi-transcription-sdk-examples"
                    className="font-semibold mb-3">
                    SDK Examples
                  </h4>

                  <div className="mb-6">
                    <h5 className="text-lg font-semibold mb-3">
                      JavaScript (Browser)
                    </h5>
                    <CodeBlock
                      code={`// Audio transcription with file upload
async function transcribeAudio(audioFile, contacts, tokens) {
  const formData = new FormData();
  formData.append('file', audioFile);
  formData.append('contacts', JSON.stringify(contacts));
  formData.append('tokens', JSON.stringify(tokens));

  try {
    const response = await fetch('https://api-test.olympus-demo.com/tomi-server2/transcribe', {
      method: 'POST',
      body: formData
    });

    if (!response.ok) {
      throw new Error(\`HTTP error! status: \${response.status}\`);
    }

    const result = await response.json();
    return result;
  } catch (error) {
    console.error('Transcription error:', error);
    throw error;
  }
}

// Usage example
const contacts = [
  "Ilan", "Moshe", "Sarah", "Michael", "Daniel", "Emily",
  "Jonathan", "Zaia", "Ibrahim", "Feran", "Moshe hogeg",
  "Moshe nahmani", "osher lugasy"
];

const tokens = [
  {"name": "Tether USD", "symbol": "USDT"},
  {"name": "Ethereum", "symbol": "ETH"},
  {"name": "bitcoin", "symbol": "BTC"},
  {"name": "USD Coin", "symbol": "USDC"}
];

const fileInput = document.getElementById('audioFile');
const audioFile = fileInput.files[0];

transcribeAudio(audioFile, contacts, tokens)
  .then(result => {
    console.log('Transcription result:', result);
    console.log('Recipient:', result.recipient);
    console.log('Amount:', result.amount);
    console.log('Currency:', result.currency);
  })
  .catch(error => {
    console.error('Error:', error);
  });`}
                      language="javascript"
                    />
                  </div>

                  <div className="mb-6">
                    <h5 className="text-lg font-semibold mb-3">React Native</h5>
                    <CodeBlock
                      code={`import { launchImageLibrary } from 'react-native-image-picker';

const transcribeAudio = async (audioUri, contacts, tokens) => {
  const formData = new FormData();
  
  // For React Native, you can also send URI directly
  formData.append('uri', audioUri);
  formData.append('type', 'audio/m4a');
  formData.append('name', 'recording.m4a');
  formData.append('contacts', JSON.stringify(contacts));
  formData.append('tokens', JSON.stringify(tokens));

  try {
    const response = await fetch('https://api-test.olympus-demo.com/tomi-server2/transcribe', {
      method: 'POST',
      body: formData,
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    const result = await response.json();
    return result;
  } catch (error) {
    console.error('Transcription error:', error);
    throw error;
  }
};

// Usage with audio picker
const pickAndTranscribeAudio = () => {
  const options = {
    mediaType: 'mixed',
    includeBase64: false,
    maxHeight: 2000,
    maxWidth: 2000,
  };

  launchImageLibrary(options, (response) => {
    if (response.didCancel) {
      console.log('User cancelled audio picker');
    } else if (response.error) {
      console.log('AudioPicker Error: ', response.error);
    } else {
      const audioUri = response.assets[0].uri;
      
      const contacts = [
        "Ilan", "Moshe", "Sarah", "Michael", "Daniel"
      ];
      
      const tokens = [
        {"name": "Tether USD", "symbol": "USDT"},
        {"name": "Ethereum", "symbol": "ETH"}
      ];
      
      transcribeAudio(audioUri, contacts, tokens)
        .then(result => {
          console.log('Transcription result:', result);
        })
        .catch(error => {
          console.error('Error:', error);
        });
    }
  });
};`}
                      language="javascript"
                    />
                  </div>

                  <div className="mb-6">
                    <h5 className="text-lg font-semibold mb-3">Python</h5>
                    <CodeBlock
                      code={`import requests
import json

class AudioTranscriptionAPI:
    def __init__(self, base_url):
        self.base_url = base_url

    def transcribe_audio(self, audio_file_path, contacts, tokens):
        """Transcribe audio file and extract financial intent"""
        url = f"{self.base_url}/tomi-server2/transcribe"
        
        files = {
            'file': open(audio_file_path, 'rb')
        }
        
        data = {
            'contacts': json.dumps(contacts),
            'tokens': json.dumps(tokens)
        }

        try:
            response = requests.post(url, files=files, data=data)
            response.raise_for_status()
            return response.json()
        except requests.exceptions.RequestException as e:
            print(f"Request error: {e}")
            raise
        finally:
            files['file'].close()

# Usage example
api = AudioTranscriptionAPI('https://api-test.olympus-demo.com')

contacts = [
    "Ilan", "Moshe", "Sarah", "Michael", "Daniel", "Emily",
    "Jonathan", "Zaia", "Ibrahim", "Feran", "Moshe hogeg",
    "Moshe nahmani", "osher lugasy"
]

tokens = [
    {"name": "Tether USD", "symbol": "USDT"},
    {"name": "Ethereum", "symbol": "ETH"},
    {"name": "bitcoin", "symbol": "BTC"},
    {"name": "USD Coin", "symbol": "USDC"}
]

try:
    result = api.transcribe_audio('audio_recording.m4a', contacts, tokens)
    
    print(f"Transcribed text: {result['text']}")
    print(f"Recipient: {result['recipient']}")
    print(f"Amount: {result['amount']}")
    print(f"Currency: {result['currency']}")
    print(f"Network: {result['network']}")
    
    if 'convertTo' in result:
        print(f"Convert to: {result['convertTo']['name']} ({result['convertTo']['symbol']})")
        
except Exception as e:
    print(f"Error: {e}")`}
                      language="python"
                    />
                  </div>
                </CardContent>
              </Card>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};
