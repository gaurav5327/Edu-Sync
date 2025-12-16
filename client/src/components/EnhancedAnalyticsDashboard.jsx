// client/src/components/EnhancedAnalyticsDashboard.jsx
function EnhancedAnalyticsDashboard() {
  const [analytics, setAnalytics] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  const [timeframe, setTimeframe] = useState('6months');

  useEffect(() => {
    fetchAnalytics();
  }, [timeframe]);

  const fetchAnalytics = async () => {
    try {
      const response = await axios.get(`/api/analytics/advanced?timeframe=${timeframe}`);
      setAnalytics(response.data);
      
      const recResponse = await axios.get('/api/analytics/recommendations');
      setRecommendations(recResponse.data);
    } catch (error) {
      console.error('Error fetching analytics:', error);
    }
  };

  return (
    <div className="space-y-6">
      {/* Trend Analysis Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <TrendChart 
          title="Enrollment Trends" 
          data={analytics?.enrollmentTrends} 
          type="line" 
        />
        <TrendChart 
          title="Faculty Workload Distribution" 
          data={analytics?.facultyWorkloadTrends} 
          type="bar" 
        />
      </div>

      {/* Optimization Recommendations */}
      <RecommendationsPanel recommendations={recommendations} />
      
      {/* Predictive Insights */}
      <PredictiveInsightsPanel analytics={analytics} />
    </div>
  );
}