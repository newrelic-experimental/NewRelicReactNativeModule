#import "NewRelicModule.h"
#import <Foundation/Foundation.h>
#import "NewRelic/NewRelic.h"       // "NewRelicAgent/NewRelic.h" for versions < 7.0

@implementation NewRelicModule

RCT_EXPORT_MODULE();

RCT_EXPORT_METHOD(nrInit:(NSString *)screen){
  [NewRelic recordCustomEvent:@"RNInteraction" attributes:@{@"Screen":screen}];
}

RCT_EXPORT_METHOD(addUserId:(NSString *)userId){
  [NewRelic recordCustomEvent:@"RnUserId" attributes:@{@"UserId":userId}];
}

RCT_EXPORT_METHOD(recordMetric:(NSString *)inEventType inJson:(NSString *)inJson){
  NSData *jsonData = [inJson dataUsingEncoding:NSUTF8StringEncoding];
  NSError *error;

  id jsonObject = [NSJSONSerialization JSONObjectWithData:jsonData options:0 error:&error];

  if (error) {
      NSLog(@"Error parsing JSON: %@", error);
  }
  else {
      NSDictionary *jsonDictionary = (NSDictionary *)jsonObject;
      BOOL eventRecorded = [NewRelic recordCustomEvent:inEventType attributes:jsonDictionary];
  }
}

RCT_EXPORT_METHOD(interaction:(NSString *)screen){
  [NewRelic recordCustomEvent:@"RNInteraction" attributes:@{@"Screen":screen}];
}

RCT_EXPORT_METHOD(nrRecordMetricNumber:(NSString *)name catagory:(NSString *)catagory inValue:(double)inValue){
  
  NSNumber *number = [NSNumber numberWithDouble:inValue];
  [NewRelic recordMetricWithName:(NSString *)name
    category:(NSString *)catagory
     value:(NSNumber *)number];
}

RCT_EXPORT_METHOD(logSend:(NSString *)loglevel message:(NSString *)message stack:(NSString *)stack lineNumber:(NSString *)lineNumber fileName:(NSString *)fileName columnNumber:(NSString *)columnNumber name:(NSString *)name)
{
  if (loglevel == nil) {
    loglevel = @"missing";
  }

  if (message == nil) {
    message = @"missing";
  }

  if (stack == nil) {
    stack = @"missing";
  }

  if (lineNumber == nil) {
    lineNumber = @"missing";
  }

  if (fileName == nil) {
    fileName = @"missing";
  }

  if (columnNumber == nil) {
    columnNumber = @"missing";
  }

  if (loglevel == nil) {
    name = @"missing";
  }

  id objects[] = {loglevel, message, stack, lineNumber,fileName, columnNumber, name, @"ios"};
  id keys[] = {@"logLevel", @"message", @"stack", @"lineNumber", @"fileName", @"columnNumber", @"name", @"platform"};
  NSUInteger count = sizeof(objects) / sizeof(id);
  NSDictionary *nrdictionary = [NSDictionary dictionaryWithObjects:objects
                                                         forKeys:keys
                                                           count:count];

   [NewRelic recordCustomEvent:@"RNError" attributes:nrdictionary];
}

@end
