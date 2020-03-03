import NewRelicAgentRN from './NewRelicAgentRN.js';

export function nrlog(inError){
  NewRelicAgentRN.logSend("log",inError.message,inError.stack,inError.lineNumber,inError.fileName,inError.columnNumber,inError.name);
}
export function nrerror(inError){
  NewRelicAgentRN.logSend("error",inError.message,inError.stack,inError.lineNumber,inError.fileName,inError.columnNumber,inError.name);
}
export function nrwarning(inError){
  NewRelicAgentRN.logSend("warning",inError.message,inError.stack,inError.lineNumber,inError.fileName,inError.columnNumber,inError.name);
}
export function nrcritical(inError){
  NewRelicAgentRN.logSend("critical",inError.message,inError.stack,inError.lineNumber,inError.fileName,inError.columnNumber,inError.name);
}

export function nraddUserId(userId){
  NewRelicAgentRN.addUserId(userId);
}

export function nrInit(FirstScreen){
  NewRelicAgentRN.nrInit(FirstScreen);
}

export function nrinteraction(screen){
  console.log(screen)
  NewRelicAgentRN.interaction(screen);

}

export function nrRecordMetric(inEventType, inJson){
  NewRelicAgentRN.RecordMetric(inEventType, JSON.stringify(inJson));
}
