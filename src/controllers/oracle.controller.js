const {
  askExaWithFallback,
  askPerplexityWithFallback,
  askGptWithFallback,
  askGrokWithFallback,
  askGemini,
  extractWithGPT,
  formatQuestion,
  askExa,
  askPerplexity,
  askGpt,
  askGrok,
} = require("../services/services");

const { weightedConsensus } = require("../services/mapping");
const Analytics = require("../models/analytics.model");
const Question = require("../models/question.model");
const ScheduledRequest = require("../models/scheduledRequest.model");
const CSVHelper = require("../utils/csv.helper");
const agendaManager = require("../jobs/agenda");
const {
  validateScheduleOracleResolve,
  validateGetScheduledRequests,
  validateRequestId,
} = require("../validators/scheduledRequest.validator");

class OracleController {
  async resolve(req, res) {
    try {
      const { poolId, question, options, questionFileName, scheduledAt } =
        req.body;

      const userId = req.user?.id || null; // Extract userId from authenticated user

      // Handle scheduled requests
      if (scheduledAt) {
        return await this.handleScheduledRequest(req, res);
      }

      // Generate question file name if not provided - ADD RAIN for internal analysis
      let finalQuestionFileName = questionFileName;
      if (!finalQuestionFileName) {
        const User = require("../models/user.model");
        let userName = "Unknown";

        if (userId) {
          try {
            const user = await User.findById(userId);
            if (user && user.name) {
              userName = user.name;
            }
          } catch (error) {
            console.error("Error fetching user for question file name:", error);
          }
        }

        // Generate a random number and create the file name with RAIN
        const randomNumber = Math.floor(Math.random() * 10000);
        finalQuestionFileName = `RAIN_${userName}_${randomNumber}`;
      } else {
        // If filename is provided, still add RAIN prefix for internal analysis
        finalQuestionFileName = `RAIN_${finalQuestionFileName}`;
      }

      // Make parallel API calls
      let formatResult = await formatQuestion(question, userId);
      let formattedQuestion = formatResult.formattedQuestion;
      let totalOperationsCost = formatResult.operationsCost;

      const [
        exaResponse,
        perplexityResponse,
        gptResponse,
        grokResponse,
        geminiResponse,
      ] = await Promise.all([
        askExaWithFallback(formattedQuestion, userId),
        askPerplexityWithFallback(formattedQuestion, options, userId),
        askGptWithFallback(formattedQuestion, options, userId),
        askGrokWithFallback(formattedQuestion, options, userId),
        askGemini(formattedQuestion, options, userId),
      ]);

      // Process responses using GPT
      const [eMapResult, pMapResult, gMapResult, grMapResult, geminiMapResult] =
        await Promise.all([
          extractWithGPT(
            options,
            exaResponse.answer.length > 0
              ? exaResponse.answer
              : exaResponse.answer.answer,
            userId
          ),
          extractWithGPT(options, perplexityResponse.answer, userId),
          extractWithGPT(options, gptResponse.answer, userId),
          extractWithGPT(
            options,
            grokResponse.answer.length > 0
              ? grokResponse.answer
              : grokResponse.answer.answer,
            userId
          ),
          extractWithGPT(options, geminiResponse.answer, userId),
        ]);

      // Extract indices and add operations costs
      const eMap = eMapResult.index;
      const pMap = pMapResult.index;
      const gMap = gMapResult.index;
      const grMap = grMapResult.index;
      const geminiMap = geminiMapResult.index;

      // Add operations costs from extraction
      totalOperationsCost +=
        eMapResult.operationsCost +
        pMapResult.operationsCost +
        gMapResult.operationsCost +
        grMapResult.operationsCost +
        geminiMapResult.operationsCost;

      console.log(`Total Operations Cost: $${totalOperationsCost.toFixed(6)}`);

      // Helper function to safely get answer with fallback
      const getSafeAnswer = (mapIndex, options, fallback = "No answer") => {
        if (
          mapIndex === undefined ||
          mapIndex === null ||
          mapIndex < 0 ||
          mapIndex >= options.length
        ) {
          return fallback;
        }
        return options[mapIndex] || fallback;
      };

      // Calculate consensus
      const final = weightedConsensus(options, {
        exa: eMap,
        perplexity: pMap,
        gpt: gMap,
        grok: grMap,
        gemini: geminiMap,
      });

      // Check if consensus is "No Answer" and implement retry mechanism
      if (final === "No Answer" || final === "No answer") {
        console.log("No Answer received, scheduling retry in 10 minutes...");

        // Schedule a retry in 10 minutes
        const retryDate = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes from now

        const retryRequest = new ScheduledRequest({
          action: "oracle-resolve-retry",
          data: {
            poolId,
            question,
            options,
            questionFileName: finalQuestionFileName,
            retryCount: 1, // Track retry attempts
            originalRequestId: req.body.requestId || null,
          },
          scheduledAt: retryDate,
          userId,
          status: "pending",
        });

        await retryRequest.save();
        await agendaManager.scheduleOracleResolve(retryRequest._id, retryDate);

        // Return immediate response indicating retry is scheduled
        return res.json({
          exa: eMap,
          perplexity: pMap,
          gpt: gMap,
          grok: grMap,
          gemini: geminiMap,
          final: "No Answer",
          exa_raw: JSON.stringify(exaResponse.answer),
          perplexity_raw: JSON.stringify(perplexityResponse.answer),
          gpt_raw: JSON.stringify(gptResponse.answer),
          grok_raw: JSON.stringify(grokResponse.answer),
          gemini_raw: JSON.stringify(geminiResponse.answer),
          original_question: question,
          formatted_question: formattedQuestion,
          question_file_name: finalQuestionFileName,
          retry_scheduled: true,
          retry_at: retryDate.toISOString(),
          message: "No consensus reached. Retry scheduled in 10 minutes.",
        });
      }

      // Save question data for tracking and CSV export (without grounded_truth)
      try {
        const getSafeRawResponse = (response) => {
          try {
            if (!response || !response.answer) {
              return "No response";
            }
            return JSON.stringify(response.answer);
          } catch (error) {
            return "Invalid response format";
          }
        };

        const questionData = {
          question,
          formattedQuestion,
          options,
          questionFileName: finalQuestionFileName,
          modelAnswers: {
            exa: {
              answer: getSafeAnswer(eMap, options),
              rawResponse: getSafeRawResponse(exaResponse),
              cost: exaResponse?.totalCost || 0,
            },
            perplexity: {
              answer: getSafeAnswer(pMap, options),
              rawResponse: getSafeRawResponse(perplexityResponse),
              cost: perplexityResponse?.totalCost || 0,
            },
            gpt: {
              answer: getSafeAnswer(gMap, options),
              rawResponse: getSafeRawResponse(gptResponse),
              cost: gptResponse?.totalCost || 0,
            },
            grok: {
              answer: getSafeAnswer(grMap, options),
              rawResponse: getSafeRawResponse(grokResponse),
              cost: grokResponse?.totalCost || 0,
            },
            gemini: {
              answer: getSafeAnswer(geminiMap, options),
              rawResponse: getSafeRawResponse(geminiResponse),
              cost: geminiResponse?.totalCost || 0,
            },
          },
          consensusAnswer: final || "No consensus",
          operationsCost: totalOperationsCost,
          userId,
          poolId,
          date: new Date(),
        };

        await Question.create(questionData);
        console.log("Question data saved successfully");
      } catch (saveError) {
        console.error("Error saving question data:", saveError);
        // Don't fail the request if question saving fails
      }

      res.json({
        exa: eMap,
        perplexity: pMap,
        gpt: gMap,
        grok: grMap,
        gemini: geminiMap,
        final,
        exa_raw: JSON.stringify(exaResponse.answer),
        perplexity_raw: JSON.stringify(perplexityResponse.answer),
        gpt_raw: JSON.stringify(gptResponse.answer),
        grok_raw: JSON.stringify(grokResponse.answer),
        gemini_raw: JSON.stringify(geminiResponse.answer),
        original_question: question,
        formatted_question: formattedQuestion,
        question_file_name: finalQuestionFileName,
      });
    } catch (error) {
      console.error("Error in resolve:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }

  // Retry mechanism for "No Answer" responses
  async retryResolve(req, res) {
    try {
      const {
        poolId,
        question,
        options,
        questionFileName,
        retryCount = 1,
        originalRequestId,
      } = req.body;

      console.log(`Retry attempt ${retryCount} for question: ${question}`);

      // Make the same API calls as the original resolve
      let formatResult = await formatQuestion(question, req.user?.id || null);
      let formattedQuestion = formatResult.formattedQuestion;
      let totalOperationsCost = formatResult.operationsCost;

      const [
        exaResponse,
        perplexityResponse,
        gptResponse,
        grokResponse,
        geminiResponse,
      ] = await Promise.all([
        askExaWithFallback(formattedQuestion, req.user?.id || null),
        askPerplexityWithFallback(
          formattedQuestion,
          options,
          req.user?.id || null
        ),
        askGptWithFallback(formattedQuestion, options, req.user?.id || null),
        askGrokWithFallback(formattedQuestion, options, req.user?.id || null),
        askGemini(formattedQuestion, options, req.user?.id || null),
      ]);

      // Process responses using GPT
      const [eMapResult, pMapResult, gMapResult, grMapResult, geminiMapResult] =
        await Promise.all([
          extractWithGPT(
            options,
            exaResponse.answer.length > 0
              ? exaResponse.answer
              : exaResponse.answer.answer,
            req.user?.id || null
          ),
          extractWithGPT(
            options,
            perplexityResponse.answer,
            req.user?.id || null
          ),
          extractWithGPT(options, gptResponse.answer, req.user?.id || null),
          extractWithGPT(
            options,
            grokResponse.answer.length > 0
              ? grokResponse.answer
              : grokResponse.answer.answer,
            req.user?.id || null
          ),
          extractWithGPT(options, geminiResponse.answer, req.user?.id || null),
        ]);

      const eMap = eMapResult.index;
      const pMap = pMapResult.index;
      const gMap = gMapResult.index;
      const grMap = grMapResult.index;
      const geminiMap = geminiMapResult.index;

      totalOperationsCost +=
        eMapResult.operationsCost +
        pMapResult.operationsCost +
        gMapResult.operationsCost +
        grMapResult.operationsCost +
        geminiMapResult.operationsCost;

      const final = weightedConsensus(options, {
        exa: eMap,
        perplexity: pMap,
        gpt: gMap,
        grok: grMap,
        gemini: geminiMap,
      });

      // If still "No Answer" and retry count is less than 5, schedule another retry
      if ((final === "No Answer" || final === "No answer") && retryCount < 5) {
        console.log(
          `Still no answer after retry ${retryCount}, scheduling another retry...`
        );

        const retryDate = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes from now

        const retryRequest = new ScheduledRequest({
          action: "oracle-resolve-retry",
          data: {
            poolId,
            question,
            options,
            questionFileName,
            retryCount: retryCount + 1,
            originalRequestId,
          },
          scheduledAt: retryDate,
          userId: req.user?.id || null,
          status: "pending",
        });

        await retryRequest.save();
        await agendaManager.scheduleOracleResolve(retryRequest._id, retryDate);

        return res.json({
          exa: eMap,
          perplexity: pMap,
          gpt: gMap,
          grok: grMap,
          gemini: geminiMap,
          final: "No Answer",
          exa_raw: JSON.stringify(exaResponse.answer),
          perplexity_raw: JSON.stringify(perplexityResponse.answer),
          gpt_raw: JSON.stringify(gptResponse.answer),
          grok_raw: JSON.stringify(grokResponse.answer),
          gemini_raw: JSON.stringify(geminiResponse.answer),
          original_question: question,
          formatted_question: formattedQuestion,
          question_file_name: questionFileName,
          retry_scheduled: true,
          retry_count: retryCount + 1,
          retry_at: retryDate.toISOString(),
          message: `No consensus reached after ${retryCount} retries. Another retry scheduled in 10 minutes.`,
        });
      }

      // If we have an answer or max retries reached, return the result
      res.json({
        exa: eMap,
        perplexity: pMap,
        gpt: gMap,
        grok: grMap,
        gemini: geminiMap,
        final,
        exa_raw: JSON.stringify(exaResponse.answer),
        perplexity_raw: JSON.stringify(perplexityResponse.answer),
        gpt_raw: JSON.stringify(gptResponse.answer),
        grok_raw: JSON.stringify(grokResponse.answer),
        gemini_raw: JSON.stringify(geminiResponse.answer),
        original_question: question,
        formatted_question: formattedQuestion,
        question_file_name: questionFileName,
        retry_count: retryCount,
        message:
          retryCount >= 5 ? "Max retries reached" : "Answer found after retry",
      });
    } catch (error) {
      console.error("Error in retry resolve:", error);
      res.status(500).json({ error: "Internal server error during retry" });
    }
  }

  async handleScheduledRequest(req, res) {
    try {
      const userId = req.user?.id || null;

      // Validate request data (removed grounded_truth from validation)
      const { error, value } = validateScheduleOracleResolve(req.body);
      if (error) {
        return res.status(400).json({
          error: "Validation failed",
          details: error.details.map((detail) => detail.message),
        });
      }

      const { poolId, question, options, questionFileName, scheduledAt } =
        value;

      const scheduledDate = new Date(scheduledAt);

      // Create the scheduled request in MongoDB
      const scheduledRequest = new ScheduledRequest({
        action: "oracle-resolve",
        data: {
          poolId,
          question,
          options,
          questionFileName,
        },
        scheduledAt: scheduledDate,
        userId,
        status: "pending",
      });

      await scheduledRequest.save();

      // Schedule the job using Agenda
      await agendaManager.scheduleOracleResolve(
        scheduledRequest._id,
        scheduledDate
      );

      console.log(
        `Scheduled oracle resolve request for ${scheduledDate.toISOString()}, ID: ${
          scheduledRequest._id
        }`
      );

      // Return response indicating the request was scheduled
      res.json({
        success: true,
        message: "Request scheduled successfully",
        scheduledRequestId: scheduledRequest._id,
        scheduledAt: scheduledDate.toISOString(),
        status: "pending",
        estimatedExecution: scheduledDate.toISOString(),
      });
    } catch (error) {
      console.error("Error in handleScheduledRequest:", error);
      res
        .status(500)
        .json({ error: "Internal server error while scheduling request" });
    }
  }

  // ... rest of the methods remain the same
  async getLogs(req, res) {
    try {
      res.status(501).json({ message: "Not implemented yet" });
    } catch (error) {
      console.error("Error fetching logs:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }

  async getQuestions(req, res) {
    try {
      const {
        startDate,
        endDate,
        userId,
        poolId,
        questionFileName,
        format = "json",
      } = req.query;

      // Build query
      const query = {};

      if (startDate && endDate) {
        query.date = {
          $gte: new Date(startDate),
          $lte: new Date(endDate),
        };
      }

      if (userId) {
        query.userId = userId;
      }

      if (poolId) {
        query.poolId = poolId;
      }

      if (questionFileName) {
        query.questionFileName = questionFileName;
      }

      const questions = await Question.find(query)
        .sort({ date: -1 })
        .populate("userId", "email username");

      if (format === "csv") {
        // Convert to CSV format
        const csvData = this.convertToCSV(questions);

        const filename = CSVHelper.generateFilename("questions");
        CSVHelper.setDownloadHeaders(res, filename);
        res.send(csvData);
      } else if (format === "html") {
        // Convert to HTML format with colors
        const htmlData = CSVHelper.generateColoredHTMLTable(
          questions,
          startDate,
          endDate
        );

        const filename = CSVHelper.generateFilename("questions", "html");
        CSVHelper.setHTMLDownloadHeaders(res, filename);
        res.send(htmlData);
      } else {
        res.json({
          success: true,
          count: questions.length,
          data: questions,
        });
      }
    } catch (error) {
      console.error("Error fetching questions:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }

  async getQuestionAnalytics(req, res) {
    try {
      const { startDate, endDate, userId, questionFileName } = req.query;

      const start = startDate
        ? new Date(startDate)
        : new Date(Date.now() - 30 * 24 * 60 * 60 * 1000); // Default to last 30 days
      const end = endDate ? new Date(endDate) : new Date();

      const query = {
        date: {
          $gte: start,
          $lte: end,
        },
      };

      if (userId) {
        query.userId = userId;
      }

      const additionalMatch = {};
      if (questionFileName) {
        additionalMatch.questionFileName = questionFileName;
      }

      const analytics = await Question.getModelAccuracy(
        start,
        end,
        additionalMatch
      );

      res.json({
        success: true,
        data: analytics[0] || {
          totalQuestions: 0,
          totalCost: 0,
          exaAccuracy: 0,
          perplexityAccuracy: 0,
          gptAccuracy: 0,
          grokAccuracy: 0,
          geminiAccuracy: 0,
          consensusAccuracy: 0,
        },
      });
    } catch (error) {
      console.error("Error fetching question analytics:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }

  async getQuestionFileNames(req, res) {
    try {
      const { startDate, endDate, userId } = req.query;

      const query = {};

      // Only add date filter if both dates are provided and valid
      if (startDate && endDate && startDate.trim() && endDate.trim()) {
        try {
          const start = new Date(startDate);
          const end = new Date(endDate);

          // Check if dates are valid
          if (!isNaN(start.getTime()) && !isNaN(end.getTime())) {
            query.date = {
              $gte: start,
              $lte: end,
            };
          }
        } catch (dateError) {
          console.error("Invalid date format:", dateError);
          // Continue without date filter if dates are invalid
        }
      }

      if (userId) {
        query.userId = userId;
      }

      // Get unique question file names
      let fileNames = await Question.distinct("questionFileName", query);

      console.log("File names query:", query);
      console.log("Found file names:", fileNames);

      // Also try to get a sample of questions to debug
      const sampleQuestions = await Question.find(query)
        .limit(5)
        .select("questionFileName date");
      console.log("Sample questions:", sampleQuestions);

      // If no file names found with date filter, try without date filter
      if (fileNames.length === 0 && Object.keys(query).length > 0) {
        console.log(
          "No file names found with filter, trying without date filter..."
        );
        const allFileNames = await Question.distinct("questionFileName", {});
        console.log("All file names (no filter):", allFileNames);

        // If we found file names without filter, use those
        if (allFileNames.length > 0) {
          fileNames = allFileNames;
        }
      }

      res.json({
        success: true,
        data: fileNames.sort(),
      });
    } catch (error) {
      console.error("Error fetching question file names:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }

  async getScheduledRequests(req, res) {
    try {
      // Validate query parameters
      const { error, value } = validateGetScheduledRequests(req.query);
      if (error) {
        return res.status(400).json({
          error: "Validation failed",
          details: error.details.map((detail) => detail.message),
        });
      }

      const { status, startDate, endDate } = value;
      const userId = req.user?.id || null;

      // Build query
      const query = {};

      if (userId) {
        query.userId = userId;
      }

      if (status) {
        query.status = status;
      }

      if (startDate && endDate) {
        query.scheduledAt = {
          $gte: new Date(startDate),
          $lte: new Date(endDate),
        };
      }

      const scheduledRequests = await ScheduledRequest.find(query)
        .sort({ scheduledAt: -1 })
        .populate("userId", "email username");

      res.json({
        success: true,
        count: scheduledRequests.length,
        data: scheduledRequests,
      });
    } catch (error) {
      console.error("Error fetching scheduled requests:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }

  async getScheduledRequestStatus(req, res) {
    try {
      // Validate request ID
      const { error, value } = validateRequestId(req.params);
      if (error) {
        return res.status(400).json({
          error: "Validation failed",
          details: error.details.map((detail) => detail.message),
        });
      }

      const { requestId } = value;
      const userId = req.user?.id || null;

      const query = { _id: requestId };
      if (userId) {
        query.userId = userId;
      }

      const scheduledRequest = await ScheduledRequest.findOne(query).populate(
        "userId",
        "email username"
      );

      if (!scheduledRequest) {
        return res.status(404).json({ error: "Scheduled request not found" });
      }

      res.json({
        success: true,
        data: scheduledRequest,
      });
    } catch (error) {
      console.error("Error fetching scheduled request status:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }

  async cancelScheduledRequest(req, res) {
    try {
      // Validate request ID
      const { error, value } = validateRequestId(req.params);
      if (error) {
        return res.status(400).json({
          error: "Validation failed",
          details: error.details.map((detail) => detail.message),
        });
      }

      const { requestId } = value;
      const userId = req.user?.id || null;

      const query = { _id: requestId, status: "pending" };
      if (userId) {
        query.userId = userId;
      }

      const scheduledRequest = await ScheduledRequest.findOne(query);

      if (!scheduledRequest) {
        return res.status(404).json({
          error: "Scheduled request not found or cannot be cancelled",
        });
      }

      // Update status to failed (cancelled)
      scheduledRequest.status = "failed";
      scheduledRequest.error = {
        message: "Request cancelled by user",
        timestamp: new Date(),
      };
      await scheduledRequest.save();

      // Try to cancel the agenda job (this might not always work depending on timing)
      try {
        const agenda = agendaManager.getAgenda();
        if (agenda) {
          await agenda.cancel({
            name: "execute-oracle-resolve",
            "data.scheduledRequestId": requestId,
          });
        }
      } catch (agendaError) {
        console.warn("Could not cancel agenda job:", agendaError);
        // Don't fail the request if we can't cancel the job
      }

      res.json({
        success: true,
        message: "Scheduled request cancelled successfully",
        requestId: scheduledRequest._id,
      });
    } catch (error) {
      console.error("Error cancelling scheduled request:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }

  convertToCSV(questions) {
    // Use the new Excel-compatible CSV format with color hints
    return CSVHelper.convertQuestionsToExcelCSV(questions);
  }
}

module.exports = new OracleController();
