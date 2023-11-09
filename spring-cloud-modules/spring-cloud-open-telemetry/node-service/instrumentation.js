
const {
    BasicTracerProvider,
    ConsoleSpanExporter,
    SimpleSpanProcessor,
} = require("@opentelemetry/tracing");
const { OTLPTraceExporter } = require("@opentelemetry/exporter-trace-otlp-http");
const { Resource } = require("@opentelemetry/resources");
const {
    SemanticResourceAttributes,
} = require("@opentelemetry/semantic-conventions");

const opentelemetry = require("@opentelemetry/sdk-node");
const {
    getNodeAutoInstrumentations,
} = require("@opentelemetry/auto-instrumentations-node");
const { WinstonInstrumentation } = require('@opentelemetry/instrumentation-winston');

const exporter = new OTLPTraceExporter({
    url: "http://172.19.0.5:4317/v1/traces"
});

const provider = new BasicTracerProvider({
    resource: new Resource({
        [SemanticResourceAttributes.SERVICE_NAME]:
            "node-service",
    }),
});
// export spans to console (useful for debugging)
//provider.addSpanProcessor(new SimpleSpanProcessor(new ConsoleSpanExporter()));
// export spans to opentelemetry collector
provider.addSpanProcessor(new SimpleSpanProcessor(exporter));

provider.register();


const sdk = new opentelemetry.NodeSDK({
    traceExporter: exporter,
    instrumentations: [getNodeAutoInstrumentations(), new WinstonInstrumentation()],
});

sdk.start()

process.on("SIGTERM", () => {
    sdk
        .shutdown()
        .then(() => console.log("Tracing terminated"))
        .catch((error) => console.log("Error terminating tracing", error))
        .finally(() => process.exit(0));
});

const winston = require('winston');
const logger = winston.createLogger({
  transports: [new winston.transports.Console(),new (winston.transports.File) ({filename: '../logs/node-service.log'})],
})

module.exports = logger