//
//  NativeMethod.m
//  SimiCart
//
//  Created by Glenn on 9/13/18.
//  Copyright © 2018 Facebook. All rights reserved.
//

#import "NativeEvent.h"

@implementation NativeEvent

RCT_EXPORT_MODULE();

+ (id)allocWithZone:(NSZone *)zone {
  static NativeEvent *sharedInstance = nil;
  static dispatch_once_t onceToken;
  dispatch_once(&onceToken, ^{
    sharedInstance = [super allocWithZone:zone];
  });
  return sharedInstance;
}

- (NSArray<NSString *> *)supportedEvents
{
  return @[@"TokenReceived"];
}

- (void)dispatchTokenReceived:(NSString *)token
{
  [self sendEventWithName:@"TokenReceived" body:@{@"token": token}];
}

@end
