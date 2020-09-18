import NewRelicRNModule from './NewRelicRNModule.js';

export function nrInit(firstScreen) {
	NewRelicRNModule.nrInit(firstScreen);
}

export function nrAddUserId(userId) {
	NewRelicRNModule.addUserId(userId);
}

export function nrRecordMetric(inEventType, inJson) {
	NewRelicRNModule.recordMetric(inEventType, JSON.stringify(inJson));
}

export function nrInteraction(screen) {
	console.log(screen)
	NewRelicRNModule.interaction(screen);
}

export function nrLog(inError) {
	NewRelicRNModule.logSend("log", inError.message, inError.stack, inError.lineNumber, inError.fileName, inError.columnNumber, inError.name);
}

export function nrError(inError) {
	NewRelicRNModule.logSend("error", inError.message, inError.stack, inError.lineNumber, inError.fileName, inError.columnNumber, inError.name);
}

export function nrWarning(inError) {
	NewRelicRNModule.logSend("warning", inError.message, inError.stack, inError.lineNumber, inError.fileName, inError.columnNumber, inError.name);
}

export function nrCritical(inError) {
	NewRelicRNModule.logSend("critical", inError.message, inError.stack, inError.lineNumber, inError.fileName, inError.columnNumber, inError.name);
}

