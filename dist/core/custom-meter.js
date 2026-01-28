"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CustomMeter = exports.CustomObservableUpDownCounter = exports.CustomObservableGauge = exports.CustomObservableCounter = exports.CustomUpDownCounter = exports.CustomHistogram = exports.CustomCounter = void 0;
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
class CustomObservableCounter {
}
exports.CustomObservableCounter = CustomObservableCounter;
class CustomObservableGauge {
}
exports.CustomObservableGauge = CustomObservableGauge;
class CustomObservableUpDownCounter {
}
exports.CustomObservableUpDownCounter = CustomObservableUpDownCounter;
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
    createObservableCounter(name, options) {
        // Simplified - would need callback implementation for full functionality
        return new CustomObservableCounter();
    }
    createObservableGauge(name, options) {
        // Simplified - would need callback implementation for full functionality
        return new CustomObservableGauge();
    }
    createObservableUpDownCounter(name, options) {
        // Simplified - would need callback implementation for full functionality
        return new CustomObservableUpDownCounter();
    }
}
exports.CustomMeter = CustomMeter;
//# sourceMappingURL=custom-meter.js.map