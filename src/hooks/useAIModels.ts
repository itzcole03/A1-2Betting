import { useEffect, useState } from 'react';
import { AIModel } from '../types';

export function useAIModels() {
  const [aiModels, setAIModels] = useState<Map<string, AIModel>>(new Map());
  const [ensembleAccuracy, setEnsembleAccuracy] = useState(94.7);

  useEffect(() => {
    initializeAIModels();
    
    const interval = setInterval(() => {
      updateModelPerformance();
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const initializeAIModels = () => {
    const modelCategories = {
      traditional: ['XGBoost', 'Random Forest', 'SVM', 'Gradient Boosting', 'LogisticRegression', 'Decision Tree', 'Naive Bayes', 'K-Means', 'Linear Regression'],
      deepLearning: ['LSTM', 'CNN', 'Transformer', 'RNN', 'Autoencoder', 'GAN', 'BERT', 'ResNet', 'VGG', 'GPT'],
      timeSeries: ['ARIMA', 'Prophet', 'GARCH', 'VAR', 'Kalman Filter', 'Exponential Smoothing', 'SARIMA', 'LSTM-TS'],
      ensemble: ['Voting Classifier', 'Stacking', 'Blending', 'AdaBoost', 'Bagging', 'Random Forests', 'Gradient Boosting', 'XGBoost Ensemble'],
      reinforcement: ['Q-Learning', 'Deep Q-Network', 'Policy Gradient', 'Actor-Critic', 'PPO', 'A3C', 'DDPG'],
      neuralNetworks: ['MLP', 'Perceptron', 'Radial Basis Function', 'Self-Organizing Map', 'Hopfield Network']
    };

    const models = new Map<string, AIModel>();
    Object.entries(modelCategories).forEach(([category, modelNames]) => {
      modelNames.forEach(model => {
        models.set(`${category}_${model}`, {
          accuracy: 0.85 + Math.random() * 0.13,
          confidence: 0.80 + Math.random() * 0.20,
          predictions: Math.floor(Math.random() * 1000),
          category,
          lastUpdate: new Date()
        });
      });
    });

    setAIModels(models);
    updateEnsembleAccuracy(models);
  };

  const updateModelPerformance = () => {
    setAIModels(currentModels => {
      const updatedModels = new Map(currentModels);
      updatedModels.forEach((model, key) => {
        const newAccuracy = Math.max(0.70, Math.min(0.99, 
          model.accuracy + (Math.random() - 0.5) * 0.02
        ));
        updatedModels.set(key, {
          ...model,
          accuracy: newAccuracy,
          predictions: model.predictions + Math.floor(Math.random() * 10),
          lastUpdate: new Date()
        });
      });
      updateEnsembleAccuracy(updatedModels);
      return updatedModels;
    });
  };

  const updateEnsembleAccuracy = (models: Map<string, AIModel>) => {
    const totalAccuracy = Array.from(models.values())
      .reduce((sum, model) => sum + model.accuracy, 0);
    const avgAccuracy = totalAccuracy / models.size;
    setEnsembleAccuracy(avgAccuracy * 100);
  };

  const runModelPrediction = (player: any, statType: string, baseLine: number) => {
    const modelPredictions: any[] = [];
    
    aiModels.forEach((model, modelKey) => {
      const baseAccuracy = model.accuracy;
      const playerRating = player.rating / 100;
      const statAverage = player.stats[statType.toLowerCase()] || baseLine;
      
      let adjustment = 0;
      if (model.category === 'traditional') {
        adjustment = (playerRating - 0.85) * 2;
      } else if (model.category === 'deepLearning') {
        adjustment = (Math.random() - 0.5) * 3;
      } else if (model.category === 'timeSeries') {
        adjustment = (statAverage - baseLine) * 0.3;
      }

      const prediction = baseLine + adjustment + (Math.random() - 0.5) * 2;
      const confidence = baseAccuracy * (0.8 + Math.random() * 0.2);

      modelPredictions.push({
        model: modelKey,
        prediction: {
          value: Math.max(0, prediction),
          confidence: confidence,
          adjustment: adjustment
        },
        weight: model.accuracy
      });
    });

    return ensemblePredictions(modelPredictions);
  };

  const ensemblePredictions = (predictions: any[]) => {
    let weightedSum = 0;
    let totalWeight = 0;

    predictions.forEach(p => {
      const weight = p.weight * p.prediction.confidence;
      weightedSum += p.prediction.value * weight;
      totalWeight += weight;
    });

    return {
      value: weightedSum / totalWeight,
      confidence: predictions.reduce((sum, p) => sum + p.prediction.confidence, 0) / predictions.length,
      consensus: calculateConsensusStrength(predictions),
      modelCount: predictions.length,
      averageConfidence: predictions.reduce((sum, p) => sum + p.prediction.confidence, 0) / predictions.length,
    };
  };

  const calculateConsensusStrength = (predictions: any[]) => {
    const values = predictions.map(p => p.prediction.value);
    const mean = values.reduce((sum, v) => sum + v, 0) / values.length;
    const variance = values.reduce((sum, v) => sum + Math.pow(v - mean, 2), 0) / values.length;
    const standardDeviation = Math.sqrt(variance);
    
    return Math.max(0, 1 - (standardDeviation / mean));
  };

  return {
    aiModels,
    ensembleAccuracy,
    modelCount: aiModels.size,
    runModelPrediction,
    ensemblePredictions,
  };
}