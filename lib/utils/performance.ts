type PerformanceMetric = {
    name: string;
    startTime: number;
    endTime?: number;
    duration?: number;
};

class PerformanceMonitor {
    private static _metrics: Map<string, PerformanceMetric>;
    private static _enabled: boolean;

    private static get metrics() {
        if (!this._metrics) this._metrics = new Map();
        return this._metrics;
    }
    private static get enabled() {
        if (typeof this._enabled === 'undefined') {
            this._enabled = process.env.NODE_ENV === 'development';
        }
        return this._enabled;
    }
    private static set enabled(val: boolean) {
        this._enabled = val;
    }

    static startMeasure(name: string): void {
        if (!this.enabled) return;
        this.metrics.set(name, {
            name,
            startTime: performance.now(),
        });
    }

    static endMeasure(name: string): number | undefined {
        if (!this.enabled) return undefined;
        const metric = this.metrics.get(name);
        if (!metric) {
            console.warn(`No metric found with name: ${name}`);
            return undefined;
        }
        metric.endTime = performance.now();
        metric.duration = metric.endTime - metric.startTime;
        console.log(`Performance [${name}]: ${metric.duration.toFixed(2)}ms`);
        this.metrics.delete(name);
        return metric.duration;
    }

    static measureAsync<T>(name: string, fn: () => Promise<T>): Promise<T> {
        if (!this.enabled) return fn();
        this.startMeasure(name);
        return fn().finally(() => this.endMeasure(name));
    }

    static measureSync<T>(name: string, fn: () => T): T {
        if (!this.enabled) return fn();
        this.startMeasure(name);
        try {
            return fn();
        } finally {
            this.endMeasure(name);
        }
    }

    static enable(): void {
        this.enabled = true;
    }

    static disable(): void {
        this.enabled = false;
    }
}

export const measurePerformance = PerformanceMonitor.measureSync;
export const measureAsyncPerformance = PerformanceMonitor.measureAsync;
export const startPerformanceMeasure = PerformanceMonitor.startMeasure;
export const endPerformanceMeasure = PerformanceMonitor.endMeasure;