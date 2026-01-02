# AgriGuard AI - Tamil Nadu Edition

AgriGuard AI is a premium, bilingual (English/Tamil) web application designed for instant crop disease detection and sustainable farming recommendations. This edition is specifically tailored for crops commonly found in Tamil Nadu.

## ✨ Features

- **Instant Detection**: AI-powered analysis for crop diseases from images or live camera.
- **Bilingual Interface**: Seamlessly switch between English and Tamil.
- **Detailed Recommendations**:
  - **Symptoms**: Identifies key signs of common diseases.
  - **Organic Methods**: Natural treatments like Neem oil, Panchagavya, etc.
  - **Chemical Treatments**: Recommended pesticides and fertilizers.
- **Tamil Nadu Specific Crops**:
  - 🍌 Banana (Sigatoka Leaf Spot)
  - 🥥 Coconut (Bud Rot)
  - 🌾 Paddy (Blast)
  - 🥜 Groundnut (Tikka Leaf Spot)
  - 🍅 Tomato (Early Blight)
  - 🥔 Potato (Early Blight)

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn

### Local Development
1. Clone the repository.
2. Run the application:
   ```bash
   run_app.bat
   ```
   *Or manually:*
   ```bash
   cd app
   npm install
   npm run dev
   ```

### Training the Model
To re-train or update the AI model classes:
```bash
node train.js
```

## 🌐 Deployment (Render)

This project is ready for one-click deployment on **Render** using the provided Blueprint configuration.

1. Push your code to a GitHub or GitLab repository.
2. In the Render Dashboard, click **New +** > **Blueprint**.
3. Select this repository.
4. Render will use `render.yaml` to automatically:
   - Build the app using `npm run build` from the root.
   - Serve the static files from `app/dist`.

---
*Empowering Farmers Worldwide.*
