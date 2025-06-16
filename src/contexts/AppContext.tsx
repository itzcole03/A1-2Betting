import React, { createContext, useContext, useReducer, ReactNode } from 'react';
import { Player, AIModel, DataSource, Game, PatternRecognition } from '../types';

interface AppState {
  darkMode: boolean;
  selectedProps: Map<string, any>;
  realDataSources: Map<string, DataSource>;
  aiModels: Map<string, AIModel>;
  predictionCache: Map<string, any>;
  patternRecognition: Map<string, PatternRecognition>;
  dataQualityMetrics: Map<string, number>;
  currentGames: Game[];
  currentProps: Player[];
  liveStats: {
    liveGames: number;
    dataPoints: number;
    aiPredictions: number;
    realTimeAccuracy: number;
    ensembleAccuracy: number;
  };
  connectionStatus: string;
  loading: boolean;
}

type AppAction = 
  | { type: 'TOGGLE_DARK_MODE' }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'UPDATE_CONNECTION_STATUS'; payload: string }
  | { type: 'UPDATE_LIVE_STATS'; payload: Partial<AppState['liveStats']> }
  | { type: 'SET_REAL_DATA_SOURCES'; payload: Map<string, DataSource> }
  | { type: 'SET_CURRENT_GAMES'; payload: Game[] }
  | { type: 'SET_CURRENT_PROPS'; payload: Player[] }
  | { type: 'ADD_SELECTED_PROP'; payload: { key: string; value: any } }
  | { type: 'REMOVE_SELECTED_PROP'; payload: string }
  | { type: 'CLEAR_SELECTED_PROPS' }
  | { type: 'UPDATE_DATA_QUALITY'; payload: { key: string; value: number } };

const initialState: AppState = {
  darkMode: false,
  selectedProps: new Map(),
  realDataSources: new Map(),
  aiModels: new Map(),
  predictionCache: new Map(),
  patternRecognition: new Map(),
  dataQualityMetrics: new Map(),
  currentGames: [],
  currentProps: [],
  liveStats: {
    liveGames: 0,
    dataPoints: 0,
    aiPredictions: 0,
    realTimeAccuracy: 94.7,
    ensembleAccuracy: 94.7,
  },
  connectionStatus: 'Connecting...',
  loading: false,
};

function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'TOGGLE_DARK_MODE':
      return { ...state, darkMode: !state.darkMode };
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'UPDATE_CONNECTION_STATUS':
      return { ...state, connectionStatus: action.payload };
    case 'UPDATE_LIVE_STATS':
      return { 
        ...state, 
        liveStats: { ...state.liveStats, ...action.payload } 
      };
    case 'SET_REAL_DATA_SOURCES':
      return { ...state, realDataSources: action.payload };
    case 'SET_CURRENT_GAMES':
      return { ...state, currentGames: action.payload };
    case 'SET_CURRENT_PROPS':
      return { ...state, currentProps: action.payload };
    case 'ADD_SELECTED_PROP':
      const newSelectedProps = new Map(state.selectedProps);
      newSelectedProps.set(action.payload.key, action.payload.value);
      return { ...state, selectedProps: newSelectedProps };
    case 'REMOVE_SELECTED_PROP':
      const updatedProps = new Map(state.selectedProps);
      updatedProps.delete(action.payload);
      return { ...state, selectedProps: updatedProps };
    case 'CLEAR_SELECTED_PROPS':
      return { ...state, selectedProps: new Map() };
    case 'UPDATE_DATA_QUALITY':
      const newDataQuality = new Map(state.dataQualityMetrics);
      newDataQuality.set(action.payload.key, action.payload.value);
      return { ...state, dataQualityMetrics: newDataQuality };
    default:
      return state;
  }
}

interface AppContextType {
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
  toggleDarkMode: () => void;
  updateLiveStats: (stats: Partial<AppState['liveStats']>) => void;
  addSelectedProp: (key: string, value: any) => void;
  removeSelectedProp: (key: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  const toggleDarkMode = () => {
    dispatch({ type: 'TOGGLE_DARK_MODE' });
  };

  const updateLiveStats = (stats: Partial<AppState['liveStats']>) => {
    dispatch({ type: 'UPDATE_LIVE_STATS', payload: stats });
  };

  const addSelectedProp = (key: string, value: any) => {
    dispatch({ type: 'ADD_SELECTED_PROP', payload: { key, value } });
  };

  const removeSelectedProp = (key: string) => {
    dispatch({ type: 'REMOVE_SELECTED_PROP', payload: key });
  };

  return (
    <AppContext.Provider value={{
      state,
      dispatch,
      toggleDarkMode,
      updateLiveStats,
      addSelectedProp,
      removeSelectedProp,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}