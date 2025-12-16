import rateLimit from "express-rate-limit"

// Rate limiting for integration APIs
export const integrationAPILimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 1000, // Limit each IP to 1000 requests per windowMs
  message: {
    error: "Too many requests from this IP, please try again later.",
    retryAfter: "15 minutes",
  },
  standardHeaders: true,
  legacyHeaders: false,
})

// Stricter rate limiting for bulk operations
export const bulkOperationLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 10, // Limit each IP to 10 bulk operations per hour
  message: {
    error: "Too many bulk operations from this IP, please try again later.",
    retryAfter: "1 hour",
  },
  standardHeaders: true,
  legacyHeaders: false,
})

// Rate limiting for webhook endpoints
export const webhookLimiter = rateLimit({
  windowMs: 5 * 60 * 1000, // 5 minutes
  max: 100, // Limit each IP to 100 webhook calls per 5 minutes
  message: {
    error: "Too many webhook calls from this IP, please try again later.",
    retryAfter: "5 minutes",
  },
  standardHeaders: true,
  legacyHeaders: false,
})
