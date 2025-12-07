# Dog Aging App — Frontend Documentation

This document explains the frontend structure, how data flows through the app, the simple prediction logic used for demo purposes, how to run the app locally, and recommended next steps to connect it to a real ML model or backend.

**Note:** File and component names are wrapped in backticks below so you can easily locate them in the project.

---

**Overview**

- Purpose: a React frontend that collects basic dog information (name, breed, size, age, weight) and shows health risk predictions, recommended activities, and nutrition tips.
- Main UI flow: `DogForm` -> `App` (collects form data) -> `getPredictions` (local heuristic) -> `PredictionResults` (visual display).

---

**File map & responsibilities**

- `src/App.js`
  - Root React component.
  - Renders the header and switches between showing `DogForm` and `PredictionResults` depending on whether predictions exist.
  - Currently calls the local `getPredictions` utility and passes results down to `PredictionResults`.

- `src/components/DogForm.js`
  - A controlled React form component that collects: dog's name, breed (dropdown), size, age, and weight.
  - Performs client-side validation and calls the `onSubmit(formData)` callback provided by `App`.

- `src/components/PredictionResults.js`
  - Receives `dogData` and `predictions` props and renders:
    - Health Risks (cards with severity and symptoms)
    - Recommended Activities (cards with frequency & benefits)
    - Nutrition (key nutrients, foods to include/avoid, estimated daily calories)
    - General tips and action buttons (reset and print)

- `src/utils/getPredictions.js`
  - Demo prediction logic built with simple heuristics.
  - Accepts `dogData` (object with `breed`, `size`, `age`, `weight`, etc.) and returns an object with the shape:

```js
{
  healthRisks: [ { name, level, description, symptoms[] }, ... ],
  activities: [ { icon, name, frequency, description, benefits }, ... ],
  nutrition: { keyNutrients: [...], recommendedFoods: [...], foodsToAvoid: [...], dailyCalories: '1234 kcal' },
  generalTips: [ ... ]
}
```

- `src/styles/DogForm.css`, `src/styles/PredictionResults.css`, `src/App.css`
  - CSS files that style the form, results, and overall layout.
  - Class names used by components map directly to the selectors in these CSS files.

---

**How the frontend works (step-by-step)**

1. The user opens the app and sees `DogForm` rendered by `App`.
2. The user fills the form and clicks **Get Health Insights**.
3. `DogForm` validates inputs and calls `onSubmit(formData)` supplied by `App`.
4. `App` calls the prediction function `getPredictions(formData)` to generate demo predictions (or -- in a production setup -- it would call an API endpoint and await results).
5. `App` stores the returned `predictions` and toggles UI to render `PredictionResults` with the results.
6. `PredictionResults` displays cards and lists based on the returned object. The user can print results or return to the form.

---

**Explanation of demo prediction heuristics in `getPredictions.js`**

The purpose of `getPredictions.js` is to provide reasonable demo outputs so the UI can be built and tested without a backend.

Key heuristics used there:

- isLargeBreed: If the breed is in a small list of known large breeds or the `size` is `large`/`extra-large`.
- isSmallBreed: If the breed or `size` indicates a small dog.
- isOlderDog: `age >= 7` is treated as a senior dog (heuristic — adjust to breed-specific thresholds later).
- isOverweight: `weight > 35` kg flagged as overweight (placeholder threshold).

Based on these flags the function composes:
- `healthRisks`: items like `Hip Dysplasia`, `Arthritis`, `Dental Disease`, `Obesity-Related Issues`. Each risk includes `name`, `level` (HIGH/MEDIUM/LOW), `description`, and `symptoms`.
- `activities`: an array of activity suggestions (icon, frequency, benefits).
- `nutrition`: includes `keyNutrients`, `recommendedFoods`, `foodsToAvoid`, and `dailyCalories` estimated using a crude formula.
- `generalTips`: general veterinary & care tips.

Why this approach?
- Simple heuristics are easy to inspect and modify during frontend development.
- They let you test UI states (e.g., many risks, few risks, senior vs young dog) without waiting for the ML model.

Limitations
- These heuristics are not medically accurate; they are placeholders for UI development only. Replace with a vetted ML model or veterinarian-sourced rules before production.

---

**How to run locally**

From the project root (`/Users/smm/DAP/dog-aging-app`) run:

```bash
npm install
npm start
```

- The app should open at `http://localhost:3000` by default (create-react-app behaviour).
- Use the browser console and React DevTools to inspect props and component state while testing.

---

**How to replace the local prediction logic with a backend API (example)**

Currently `App.js` imports `getPredictions` and calls it synchronously. In production you'll likely want to send `formData` to a backend API (Flask, FastAPI, Node/Express, etc.) that runs the ML model.

Example replacement (async fetch):

```js
// In App.js — replace synchronous call with async API request
async function handleFormSubmit(formData) {
  setDogData(formData);
  setShowResults(false);

  try {
    // Example endpoint — replace with your real endpoint
    const res = await fetch('https://your-backend.example.com/predict', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    });

    if (!res.ok) throw new Error('Prediction API error');

    const predictionData = await res.json();
    setPredictions(predictionData);
    setShowResults(true);
  } catch (err) {
    console.error('Prediction request failed', err);
    // Show an error to the user in the UI
  }
}
```

Server contract recommendations:
- Request: JSON body matching the form fields (`dogName`, `breed`, `size`, `age`, `weight`).
- Response: JSON matching the structure shown earlier (healthRisks, activities, nutrition, generalTips).

Security note: Use HTTPS and protect your API if it contains user data. Consider rate-limiting and authentication if needed.

---

**How to extend or improve the frontend**

- Add more breed-specific rules or a breed lookup to standardize breed names.
- Add unit tests for `getPredictions` (jest) and snapshot tests for components.
- Add TypeScript for stronger typing (convert components and `getPredictions` types).
- Add accessibility checks (label elements, keyboard navigation, color-contrast testing).
- Persist recent predictions to `localStorage` or a small backend so users can view history.
- Add charts to show risk distribution (use `recharts` or `chart.js`).
- Replace placeholder thresholds with data-driven thresholds from your ML model.

---

**Styling notes**

- `DogForm.css` styles the input form and uses `.dog-form-container`, `.form-group`, `.submit-btn`.
- `PredictionResults.css` provides layout and card-style classes used by `PredictionResults.js`.
- `App.css` contains page-level layout and theming.

If you change a class name in a component, update the CSS selector to match.

---

**Debugging tips**

- Use `console.log()` in `handleFormSubmit`, `getPredictions`, or inside `PredictionResults` to inspect the `predictions` shape.
- Use React DevTools to inspect component props and state.
- If CSS doesn't apply, check for typos in class names and ensure the CSS file is imported by the component.

---

**Next recommended tasks**

- (Short term) Add a small `docs` or `README_FRONTEND.md` (this file) and optionally inline comments in the key JS files.
- (Medium term) Build a simple backend endpoint that wraps a trained ML model and update `App.js` to call it.
- (Long term) Add analytics, user accounts, and a vet-reviewed rule-set or validated ML model.

---

If you want, I can also:
- Add brief inline comments to the key files (`getPredictions.js`, `DogForm.js`, `PredictionResults.js`) to explain each block of code.
- Implement the example async API call and a minimal mock backend endpoint for local testing.

Tell me which next step you'd like me to take.
