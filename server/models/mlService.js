// server/services/mlService.js
import { createModel, trainModel, predict } from './mlEngine.js';

class DemandForecastingService {
  async predictCourseDemand(courseId, semester, year) {
    // Collect historical data
    const historicalData = await this.getHistoricalEnrollmentData(courseId);
    const trends = await this.analyzeEnrollmentTrends(courseId);
    const externalFactors = await this.getExternalFactors(semester, year);
    
    // Train ML model
    const model = await this.trainDemandModel(historicalData);
    
    // Make prediction
    const prediction = await model.predict({
      historicalEnrollment: historicalData,
      trends: trends,
      externalFactors: externalFactors
    });
    
    return {
      predictedEnrollment: prediction.enrollment,
      confidence: prediction.confidence,
      factors: prediction.influencingFactors
    };
  }
}