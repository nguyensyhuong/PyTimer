//
//  NativeMethod.m
//  SimiCart
//
//  Created by Glenn on 10/5/18.
//  Copyright © 2018 Facebook. All rights reserved.
//

#import "NativeMethod.h"
#import "UIKit/UIKit.h"

@implementation NativeMethod

RCT_EXPORT_MODULE();

RCT_EXPORT_METHOD(openSetting)
{
  [[UIApplication sharedApplication] openURL:[NSURL URLWithString:UIApplicationOpenSettingsURLString]];
}

@end
