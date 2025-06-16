// Production-ready logging utility

type LogLevel = "debug" | "info" | "warn" | "error";

export class Logger {
  private static isDevelopment = process.env.NODE_ENV === "development";

  static debug(message: string, data?: any) {
    if (this.isDevelopment) {
      console.log(`🔍 ${message}`, data || "");
    }
  }

  static info(message: string, data?: any) {
    if (this.isDevelopment) {
      console.log(`ℹ️ ${message}`, data || "");
    }
    // In production, would send to analytics service
  }

  static warn(message: string, data?: any) {
    if (this.isDevelopment) {
      console.warn(`⚠️ ${message}`, data || "");
    }
    // In production, would send to monitoring service
  }

  static error(message: string, error?: any) {
    console.error(`❌ ${message}`, error || "");
    // In production, would send to error tracking service
  }

  static aiSystemActivated(totalConnected: number, predictionsCount: number) {
    this.info("AI System Activated with real data sources");
    this.info(`Connected Sources: ${totalConnected}`);
    this.info(`Available Predictions: ${predictionsCount}`);
  }

  static prizePicksDataLoaded(count: number) {
    this.info(`Loading real PrizePicks data: ${count} projections`);
  }

  static propsGenerated(playersCount: number) {
    this.info(`Generating props from ${playersCount} real players`);
  }

  static lineupSubmitted(details: any) {
    this.info("Lineup Submission Details:", details);
  }
}
