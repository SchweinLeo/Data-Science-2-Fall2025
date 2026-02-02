// Sample prediction data - this will be replaced with actual ML model predictions
const getPredictions = async (dogData) => {
  try {
    const response = await fetch('http://localhost:8000/predict', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(dogData),
    });

    if (!response.ok) throw new Error('Network response was not ok');
    
    const result = await response.json();
    console.log("Prediction Result:", result);
    //alert(`Success! Predicted Health Score for ${result.dog_name}: ${result.prediction.health_score}`);
  } catch (error) {
    console.error("Error submitting form:", error);
    alert("Failed to connect to server.");
  }
};

export default getPredictions;
