"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CustomMeter = exports.CustomUpDownCounter = exports.CustomHistogram = exports.CustomCounter = void 0;
class CustomCounter {
    constructor(otelCounter) {
        this.otelCounter = otelCounter;
    }
    add(value, attributes) {
        this.otelCounter.add(value, attributes);
    }
}
exports.CustomCounter = CustomCounter;
class CustomHistogram {
    constructor(otelHistogram) {
        this.otelHistogram = otelHistogram;
    }
    record(value, attributes) {
        this.otelHistogram.record(value, attributes);
    }
}
exports.CustomHistogram = CustomHistogram;
class CustomUpDownCounter {
    constructor(otelUpDownCounter) {
        this.otelUpDownCounter = otelUpDownCounter;
    }
    add(value, attributes) {
        this.otelUpDownCounter.add(value, attributes);
    }
}
exports.CustomUpDownCounter = CustomUpDownCounter;
// export class CustomObservableCounter implements ObservableCounter {
//   // Simplified implementation - observable instruments are more complex
// }
// export class CustomObservableGauge implements ObservableGauge {
//   // Simplified implementation - observable instruments are more complex
// }
// export class CustomObservableUpDownCounter implements ObservableUpDownCounter {
//   // Simplified implementation - observable instruments are more complex
// }
class CustomMeter {
    constructor(otelMeter) {
        this.otelMeter = otelMeter;
    }
    createCounter(name, options) {
        const otelCounter = this.otelMeter.createCounter(name, options);
        return new CustomCounter(otelCounter);
    }
    createHistogram(name, options) {
        const otelHistogram = this.otelMeter.createHistogram(name, options);
        return new CustomHistogram(otelHistogram);
    }
    createUpDownCounter(name, options) {
        const otelUpDownCounter = this.otelMeter.createUpDownCounter(name, options);
        return new CustomUpDownCounter(otelUpDownCounter);
    }
}
exports.CustomMeter = CustomMeter;
//# sourceMappingURL=custom-meter.js.map