import NewRelicModule from './NewRelicRNModule.js';

export function nrInit(firstScreen) {
	NewRelicModule.nrInit(firstScreen);
}

export function nrAddUserId(userId) {
	NewRelicModule.addUserId(userId);
}

export function nrRecordMetric(inEventType, inJson) {
	NewRelicModule.recordMetric(inEventType, JSON.stringify(inJson));
}

export function nrRecordMeticNumber(name, catagory,inValue){
	NewRelicModule.nrRecordMetricNumber(name, catagory, Number(inValue));

}

export function nrInteraction(screen) {
	console.log(screen)
	NewRelicModule.interaction(screen);
}

export function nrLog(inError) {
	NewRelicModule.logSend("log", inError.message, inError.stack, inError.lineNumber, inError.fileName, inError.columnNumber, inError.name);
}

export function nrError(inError) {
	NewRelicModule.logSend("error", inError.message, inError.stack, inError.lineNumber, inError.fileName, inError.columnNumber, inError.name);
}

export function nrWarning(inError) {
	NewRelicModule.logSend("warning", inError.message, inError.stack, inError.lineNumber, inError.fileName, inError.columnNumber, inError.name);
}

export function nrCritical(inError) {
	NewRelicModule.logSend("critical", inError.message, inError.stack, inError.lineNumber, inError.fileName, inError.columnNumber, inError.name);
}
