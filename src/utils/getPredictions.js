// Sample prediction data - this will be replaced with actual ML model predictions
const getPredictions = (dogData) => {
  const { breed, size, age, weight } = dogData;

  // Simplified prediction logic based on dog characteristics
  const isLargeBreed = ['Labrador', 'German Shepherd', 'Boxer', 'Husky', 'Dalmatian'].includes(breed) || size === 'large' || size === 'extra-large';
  const isSmallBreed = ['Chihuahua', 'Yorkshire Terrier', 'Schnauzer'].includes(breed) || size === 'small';
  const isOlderDog = age >= 7;
  const isOverweight = weight > 35;

  let healthRisks = [];
  let activities = [];
  let nutrition = {};
  let generalTips = [];

  // Health Risks based on profile
  if (isLargeBreed && isOlderDog) {
    healthRisks.push({
      name: 'Hip Dysplasia',
      level: 'HIGH',
      description: 'Large breed dogs are prone to hip dysplasia, especially as they age.',
      symptoms: ['Limping', 'Difficulty rising', 'Reluctance to jump', 'Reduced activity'],
    });
  }

  if (isOlderDog) {
    healthRisks.push({
      name: 'Arthritis',
      level: 'MEDIUM',
      description: 'Joint stiffness is common in aging dogs, particularly in larger breeds.',
      symptoms: ['Stiffness after rest', 'Difficulty climbing stairs', 'Reduced mobility'],
    });
  }

  if (isSmallBreed) {
    healthRisks.push({
      name: 'Dental Disease',
      level: 'MEDIUM',
      description: 'Small breeds are more susceptible to dental problems.',
      symptoms: ['Bad breath', 'Difficulty eating', 'Tooth loss', 'Drooling'],
    });
  }

  if (isOverweight) {
    healthRisks.push({
      name: 'Obesity-Related Issues',
      level: 'HIGH',
      description: 'Overweight dogs face increased risk of diabetes, heart disease, and joint problems.',
      symptoms: ['Excessive panting', 'Low energy', 'Difficulty exercising', 'Visible weight gain'],
    });
  }

  healthRisks.push({
    name: 'Vision & Hearing Loss',
    level: 'MEDIUM',
    description: 'Senior dogs often experience gradual loss of sight and hearing.',
    symptoms: ['Bumping into objects', 'Not responding to sounds', 'Hesitation in dark areas'],
  });

  // Activities
  if (age < 5) {
    activities.push({
      icon: '🎾',
      name: 'Fetch & Ball Games',
      frequency: '2-3 times daily (30 mins each)',
      description: 'Young dogs have high energy and love interactive play.',
      benefits: 'Builds muscle, improves cardiovascular health',
    });
  }

  if (isLargeBreed) {
    activities.push({
      icon: '🏊',
      name: 'Swimming',
      frequency: '2-3 times per week',
      description: 'Low-impact exercise great for joints.',
      benefits: 'Strengthens muscles, easy on joints, full body workout',
    });
  }

  activities.push({
    icon: '🚶',
    name: 'Daily Walks',
    frequency: `${age < 5 ? '2-3' : age < 10 ? '1-2' : '1'} times daily (20-40 mins)`,
    description: 'Essential for physical and mental health.',
    benefits: 'Maintains weight, mental stimulation, socialization',
  });

  if (age >= 5) {
    activities.push({
      icon: '🧘',
      name: 'Gentle Exercise',
      frequency: 'Daily',
      description: 'Lower impact activities suitable for mature dogs.',
      benefits: 'Maintains mobility, prevents stiffness, reduces anxiety',
    });
  }

  activities.push({
    icon: '🧠',
    name: 'Mental Stimulation',
    frequency: 'Daily (15-20 mins)',
    description: 'Puzzle toys, training, and interactive games.',
    benefits: 'Keeps mind sharp, reduces behavioral issues, combats boredom',
  });

  // Nutrition
  const isLarge = size === 'large' || size === 'extra-large';
  const estimatedCalories = isLarge ? 1800 - (age * 50) : 1000 - (age * 30);

  nutrition = {
    keyNutrients: [
      {
        name: 'Protein',
        reason: 'Essential for muscle maintenance and growth. Senior dogs benefit from high-quality protein.',
      },
      {
        name: 'Omega-3 Fatty Acids',
        reason: 'Support joint health, reduce inflammation, and promote cognitive function.',
      },
      {
        name: 'Glucosamine & Chondroitin',
        reason: 'Crucial for joint health and mobility, especially for aging dogs.',
      },
      {
        name: 'Antioxidants',
        reason: 'Protect cells and support immune function and brain health.',
      },
      ...(isOlderDog
        ? [
            {
              name: 'Joint Support Supplements',
              reason: 'MSM and other supplements help reduce joint pain and improve mobility.',
            },
          ]
        : []),
    ],
    recommendedFoods: [
      'Chicken breast',
      'Fish (salmon)',
      'Sweet potatoes',
      'Carrots',
      'Blueberries',
      'Pumpkin',
      'Eggs',
      'Brown rice',
      ...(isOlderDog ? ['Bone broth'] : []),
    ],
    foodsToAvoid: [
      'Chocolate',
      'Grapes & Raisins',
      'Onions & Garlic',
      'Avocado',
      'Xylitol (sugar-free foods)',
      'Macadamia nuts',
      'Fatty foods',
      'Excessive salt',
    ],
    dailyCalories: `${Math.round(estimatedCalories)} kcal`,
  };

  // General Tips
  generalTips = [
    'Schedule regular vet check-ups - at least annually, or twice yearly for senior dogs.',
    'Keep your dog at a healthy weight to prevent obesity-related issues.',
    'Maintain a consistent exercise routine but adjust intensity based on age and health status.',
    'Provide fresh water at all times.',
    'Keep vaccinations and parasite prevention up to date.',
    'Brush teeth regularly to prevent dental disease.',
    'Monitor for any behavioral or physical changes.',
    'Consider health supplements after consulting your veterinarian.',
    'Provide a comfortable, supportive bed to help with joint health.',
    'Keep your dog mentally stimulated with games and training.',
  ];

  return {
    healthRisks: healthRisks.slice(0, 4), // Limit to 4 main risks for display
    activities,
    nutrition,
    generalTips,
  };
};

export default getPredictions;
