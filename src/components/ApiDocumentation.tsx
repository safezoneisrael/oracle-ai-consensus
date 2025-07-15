import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { CodeBlock } from './CodeBlock';
import { TableOfContents } from './TableOfContents';
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
  Activity
} from 'lucide-react';

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
              <h1 className="text-3xl font-bold text-primary-foreground">Oracle API Documentation</h1>
              <p className="text-primary-foreground/80 mt-2">
                Multi-model AI consensus API for question resolution and scheduling
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
              <h2 className="text-2xl font-bold mb-4">Overview</h2>
              <Card>
                <CardContent className="p-6">
                  <p className="text-muted-foreground mb-4">
                    The Oracle API provides endpoints for resolving questions using multiple AI models 
                    (Exa, Perplexity, GPT, Grok, and Gemini) and managing scheduled requests. 
                    The API supports both immediate resolution and scheduled execution of oracle queries.
                  </p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                    <div className="flex items-center space-x-2 p-3 bg-muted/50 rounded-lg">
                      <Zap className="h-5 w-5 text-primary" />
                      <span className="text-sm font-medium">Multi-model AI</span>
                    </div>
                    <div className="flex items-center space-x-2 p-3 bg-muted/50 rounded-lg">
                      <Clock className="h-5 w-5 text-primary" />
                      <span className="text-sm font-medium">Scheduled Requests</span>
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
              <h2 className="text-2xl font-bold mb-4">Base URL</h2>
              <CodeBlock
                code="https://olympus-user.prodex.com/api/"
                language="text"
              />
            </section>

            {/* Authentication */}
            <section id="authentication">
              <h2 className="text-2xl font-bold mb-4">
                <Shield className="inline h-6 w-6 mr-2" />
                Authentication
              </h2>
              <Card>
                <CardContent className="p-6">
                  <p className="text-muted-foreground mb-4">
                    All endpoints require authentication. Include your authentication token in the request headers:
                  </p>
                  <CodeBlock
                    code="Authorization: Bearer <your-token>"
                    language="text"
                    title="Request Header"
                  />
                </CardContent>
              </Card>
            </section>

            {/* Endpoints */}
            <section id="endpoints">
              <h2 className="text-2xl font-bold mb-6">Endpoints</h2>

              {/* Resolve Question */}
              <div id="resolve-question" className="mb-8">
                <h3 className="text-xl font-semibold mb-4 flex items-center">
                  <Zap className="h-5 w-5 mr-2 text-primary" />
                  1. Resolve Question
                </h3>
                <div className="flex items-center space-x-2 mb-4">
                  <Badge className="bg-green-100 text-green-800 hover:bg-green-100">POST</Badge>
                  <code className="code-inline">/api/resolve</code>
                </div>
                
                <Card className="mb-4">
                  <CardContent className="p-6">
                    <p className="text-muted-foreground mb-4">
                      Resolves a question using multiple AI models and returns consensus results.
                    </p>
                    
                    <h4 className="font-semibold mb-3">Request Body</h4>
                    <CodeBlock
                      code={`{
  "poolId": "string (optional)",
  "question": "string (required, max 2000 chars)",
  "options": ["option1", "option2", "option3", ...] (required, 2-10 options),
  "grounded_truth": "string (optional, max 500 chars)",
  "questionFileName": "string (optional, max 200 chars)",
  "scheduledAt": "ISO date string (optional, for scheduled requests)"
}`}
                      title="Request Schema"
                    />

                    <Separator className="my-6" />

                    <h4 className="font-semibold mb-3">Example Request</h4>
                    <CodeBlock
                      code={`{
  "poolId": "pool_123",
  "question": "What is the capital of France?",
  "options": ["London", "Paris", "Berlin", "Madrid"],
  "grounded_truth": "Paris",
  "questionFileName": "geography_quiz_001"
}`}
                    />

                    <Separator className="my-6" />

                    <h4 className="font-semibold mb-3">Response</h4>
                    <CodeBlock
                      code={`{
  "exa": 1,
  "perplexity": 1,
  "gpt": 1,
  "grok": 1,
  "gemini": 1,
  "final": "Paris",
  "exa_raw": "{\\"answer\\": \\"Paris\\"}",
  "perplexity_raw": "{\\"answer\\": \\"Paris\\"}",
  "gpt_raw": "{\\"answer\\": \\"Paris\\"}",
  "grok_raw": "{\\"answer\\": \\"Paris\\"}",
  "gemini_raw": "{\\"answer\\": \\"Paris\\"}",
  "original_question": "What is the capital of France?",
  "formatted_question": "What is the capital of France?",
  "question_file_name": "geography_quiz_001"
}`}
                    />
                  </CardContent>
                </Card>
              </div>

              {/* Get Questions */}
              <div id="get-questions" className="mb-8">
                <h3 className="text-xl font-semibold mb-4 flex items-center">
                  <FileText className="h-5 w-5 mr-2 text-primary" />
                  2. Get Questions
                </h3>
                <div className="flex items-center space-x-2 mb-4">
                  <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">GET</Badge>
                  <code className="code-inline">/api/questions</code>
                </div>
                
                <Card className="mb-4">
                  <CardContent className="p-6">
                    <p className="text-muted-foreground mb-4">
                      Retrieves questions with optional filtering and multiple output formats.
                    </p>
                    
                    <h4 className="font-semibold mb-3">Query Parameters</h4>
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm border-collapse border border-border rounded-lg">
                        <thead>
                          <tr className="bg-muted">
                            <th className="border border-border p-3 text-left">Parameter</th>
                            <th className="border border-border p-3 text-left">Type</th>
                            <th className="border border-border p-3 text-left">Description</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td className="border border-border p-3"><code className="code-inline">startDate</code></td>
                            <td className="border border-border p-3">string</td>
                            <td className="border border-border p-3">Start date (ISO format)</td>
                          </tr>
                          <tr className="bg-muted/30">
                            <td className="border border-border p-3"><code className="code-inline">endDate</code></td>
                            <td className="border border-border p-3">string</td>
                            <td className="border border-border p-3">End date (ISO format)</td>
                          </tr>
                          <tr>
                            <td className="border border-border p-3"><code className="code-inline">userId</code></td>
                            <td className="border border-border p-3">string</td>
                            <td className="border border-border p-3">Filter by user ID</td>
                          </tr>
                          <tr className="bg-muted/30">
                            <td className="border border-border p-3"><code className="code-inline">poolId</code></td>
                            <td className="border border-border p-3">string</td>
                            <td className="border border-border p-3">Filter by pool ID</td>
                          </tr>
                          <tr>
                            <td className="border border-border p-3"><code className="code-inline">questionFileName</code></td>
                            <td className="border border-border p-3">string</td>
                            <td className="border border-border p-3">Filter by question file name</td>
                          </tr>
                          <tr className="bg-muted/30">
                            <td className="border border-border p-3"><code className="code-inline">format</code></td>
                            <td className="border border-border p-3">string</td>
                            <td className="border border-border p-3">Output format: json (default), csv, html</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>

                    <Separator className="my-6" />

                    <h4 className="font-semibold mb-3">Example Request</h4>
                    <CodeBlock
                      code="GET /api/questions?startDate=2024-01-01&endDate=2024-01-31&format=csv"
                      language="text"
                    />
                  </CardContent>
                </Card>
              </div>

              {/* Analytics */}
              <div id="get-analytics" className="mb-8">
                <h3 className="text-xl font-semibold mb-4 flex items-center">
                  <BarChart3 className="h-5 w-5 mr-2 text-primary" />
                  3. Get Question Analytics
                </h3>
                <div className="flex items-center space-x-2 mb-4">
                  <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">GET</Badge>
                  <code className="code-inline">/api/questions/analytics</code>
                </div>
                
                <Card className="mb-4">
                  <CardContent className="p-6">
                    <p className="text-muted-foreground mb-4">
                      Retrieves analytics data for questions including accuracy rates and costs.
                    </p>
                    
                    <CodeBlock
                      code={`{
  "success": true,
  "data": {
    "totalQuestions": 150,
    "totalCost": 0.75,
    "exaAccuracy": 0.85,
    "perplexityAccuracy": 0.82,
    "gptAccuracy": 0.88,
    "grokAccuracy": 0.8,
    "geminiAccuracy": 0.83,
    "consensusAccuracy": 0.92
  }
}`}
                      title="Response"
                    />
                  </CardContent>
                </Card>
              </div>

              {/* Scheduled Requests */}
              <div id="scheduled-requests" className="mb-8">
                <h3 className="text-xl font-semibold mb-4 flex items-center">
                  <Calendar className="h-5 w-5 mr-2 text-primary" />
                  4. Get Scheduled Requests
                </h3>
                <div className="flex items-center space-x-2 mb-4">
                  <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">GET</Badge>
                  <code className="code-inline">/api/scheduled-requests</code>
                </div>
                
                <Card className="mb-4">
                  <CardContent className="p-6">
                    <p className="text-muted-foreground mb-4">
                      Retrieves scheduled requests with optional filtering.
                    </p>
                    
                    <h4 className="font-semibold mb-3">Status Values</h4>
                    <div className="flex flex-wrap gap-2 mb-4">
                      <Badge variant="outline">pending</Badge>
                      <Badge variant="outline">processing</Badge>
                      <Badge variant="outline">completed</Badge>
                      <Badge variant="outline">failed</Badge>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Cancel Scheduled Request */}
              <div id="cancel-request" className="mb-8">
                <h3 className="text-xl font-semibold mb-4 flex items-center">
                  <Trash2 className="h-5 w-5 mr-2 text-primary" />
                  5. Cancel Scheduled Request
                </h3>
                <div className="flex items-center space-x-2 mb-4">
                  <Badge className="bg-red-100 text-red-800 hover:bg-red-100">DELETE</Badge>
                  <code className="code-inline">/api/scheduled-requests/:requestId</code>
                </div>
                
                <Card className="mb-4">
                  <CardContent className="p-6">
                    <p className="text-muted-foreground mb-4">
                      Cancels a pending scheduled request.
                    </p>
                    
                    <CodeBlock
                      code={`{
  "success": true,
  "message": "Scheduled request cancelled successfully",
  "requestId": "507f1f77bcf86cd799439011"
}`}
                      title="Response"
                    />
                  </CardContent>
                </Card>
              </div>

              {/* Health Check */}
              <div id="health-check" className="mb-8">
                <h3 className="text-xl font-semibold mb-4 flex items-center">
                  <Activity className="h-5 w-5 mr-2 text-primary" />
                  6. Health Check
                </h3>
                <div className="flex items-center space-x-2 mb-4">
                  <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">GET</Badge>
                  <code className="code-inline">/</code>
                </div>
                
                <Card className="mb-4">
                  <CardContent className="p-6">
                    <p className="text-muted-foreground mb-4">
                      Simple health check endpoint.
                    </p>
                    
                    <CodeBlock
                      code={`{
  "message": "Oracle API endpoint"
}`}
                      title="Response"
                    />
                  </CardContent>
                </Card>
              </div>
            </section>

            {/* Cost Tracking */}
            <section id="cost-tracking">
              <h2 className="text-2xl font-bold mb-4">Cost Tracking</h2>
              <Card>
                <CardContent className="p-6">
                  <p className="text-muted-foreground mb-4">
                    The API tracks costs for each AI model used:
                  </p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <div className="flex justify-between items-center p-2 bg-muted/30 rounded">
                        <span>Exa</span>
                        <span className="text-sm text-muted-foreground">~$0.001 per request</span>
                      </div>
                      <div className="flex justify-between items-center p-2 bg-muted/30 rounded">
                        <span>Perplexity</span>
                        <span className="text-sm text-muted-foreground">~$0.002 per request</span>
                      </div>
                      <div className="flex justify-between items-center p-2 bg-muted/30 rounded">
                        <span>GPT</span>
                        <span className="text-sm text-muted-foreground">~$0.003 per request</span>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center p-2 bg-muted/30 rounded">
                        <span>Grok</span>
                        <span className="text-sm text-muted-foreground">~$0.002 per request</span>
                      </div>
                      <div className="flex justify-between items-center p-2 bg-muted/30 rounded">
                        <span>Gemini</span>
                        <span className="text-sm text-muted-foreground">~$0.001 per request</span>
                      </div>
                      <div className="flex justify-between items-center p-2 bg-muted/30 rounded">
                        <span>Operations</span>
                        <span className="text-sm text-muted-foreground">~$0.001 per request</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-4 p-4 bg-primary/10 rounded-lg">
                    <p className="text-sm font-medium">
                      Total cost per resolve request is typically $0.010-0.015
                    </p>
                  </div>
                </CardContent>
              </Card>
            </section>

            {/* Rate Limits */}
            <section id="rate-limits">
              <h2 className="text-2xl font-bold mb-4">Rate Limits</h2>
              <Card>
                <CardContent className="p-6">
                  <div className="space-y-3">
                    <div className="flex justify-between items-center p-3 bg-muted/30 rounded">
                      <span>Standard resolve requests</span>
                      <Badge variant="outline">100 requests/min</Badge>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-muted/30 rounded">
                      <span>Scheduled requests</span>
                      <Badge variant="outline">10 requests/min</Badge>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-muted/30 rounded">
                      <span>Analytics queries</span>
                      <Badge variant="outline">50 requests/min</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </section>

            {/* SDK Examples */}
            <section id="sdk-examples">
              <h2 className="text-2xl font-bold mb-4">SDK Examples</h2>
              
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-3">JavaScript/Node.js</h3>
                <CodeBlock
                  code={`const axios = require("axios");

const oracleAPI = axios.create({
  baseURL: "https://olympus-user.prodex.com/api/",
  headers: {
    Authorization: \`Bearer \${process.env.API_TOKEN}\`,
    "Content-Type": "application/json",
  },
});

// Resolve a question
async function resolveQuestion(question, options, groundedTruth) {
  try {
    const response = await oracleAPI.post("/api/resolve", {
      question,
      options,
      grounded_truth: groundedTruth,
    });
    return response.data;
  } catch (error) {
    console.error("Error resolving question:", error.response?.data);
    throw error;
  }
}

// Get analytics
async function getAnalytics(startDate, endDate) {
  try {
    const response = await oracleAPI.get("/api/questions/analytics", {
      params: { startDate, endDate },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching analytics:", error.response?.data);
    throw error;
  }
}`}
                  language="javascript"
                />
              </div>

              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-3">Python</h3>
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

    def resolve_question(self, question, options, grounded_truth=None):
        """Resolve a question using multiple AI models"""
        url = f"{self.base_url}/api/resolve"
        data = {
            'question': question,
            'options': options
        }
        if grounded_truth:
            data['grounded_truth'] = grounded_truth

        response = requests.post(url, json=data, headers=self.headers)
        response.raise_for_status()
        return response.json()

    def get_analytics(self, start_date=None, end_date=None):
        """Get analytics data"""
        url = f"{self.base_url}/api/questions/analytics"
        params = {}
        if start_date:
            params['startDate'] = start_date.isoformat()
        if end_date:
            params['endDate'] = end_date.isoformat()

        response = requests.get(url, params=params, headers=self.headers)
        response.raise_for_status()
        return response.json()

# Usage example
api = OracleAPI('https://olympus-user.prodex.com/api/', os.getenv('API_TOKEN'))

result = api.resolve_question(
    "What is the capital of France?",
    ["London", "Paris", "Berlin", "Madrid"],
    "Paris"
)
print(f"Consensus answer: {result['final']}")`}
                  language="python"
                />
              </div>
            </section>

            {/* Support */}
            <section id="support">
              <h2 className="text-2xl font-bold mb-4">Support</h2>
              <Card>
                <CardContent className="p-6">
                  <p className="text-muted-foreground mb-4">
                    For API support and questions:
                  </p>
                  
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-medium">Email:</span>
                      <a href="mailto:support@prodex.com" className="text-primary hover:underline">
                        support@prodex.com
                      </a>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-medium">Documentation:</span>
                      <a href="https://docs.prodex.com" className="text-primary hover:underline">
                        https://docs.prodex.com
                      </a>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-medium">Status page:</span>
                      <a href="https://status.prodex.com" className="text-primary hover:underline">
                        https://status.prodex.com
                      </a>
                    </div>
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