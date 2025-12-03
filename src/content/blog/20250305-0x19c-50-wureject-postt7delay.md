---
title: "0x19C.50 WuReject PostT7Delay"
meta_title: ""
description: ""
date: 2025-03-05T12:00:00Z
image: ""
categories: ["BSOD Analysis"]
author: "Nick Kuo"
tags: ["Windows", "BSOD", "0x19C"]
draft: false
---

![](/images/blog/20250305-0x19c-50-wureject-postt7delay/1.png)

In dce110_edp_backlight_control, we request a wait of "post_T7_delay". This wait was never satisfied before system BSOD 0x19C.

![](/images/blog/20250305-0x19c-50-wureject-postt7delay/2.png)

In our case, **post_T7_delay** was 100ms.

![](/images/blog/20250305-0x19c-50-wureject-postt7delay/3.png)

We could get the tick count when the thread had started waiting.

![](/images/blog/20250305-0x19c-50-wureject-postt7delay/4.png)

Since this is a mini kernel dump, we do not have KUSER_SHARED_DATA to immediately tell us the current tick count.
But OS actually stores interrupt time in the header of dump file, and it is derived by tick count.
For your dump file, it is the value of "0000005a`60dc49e1"

![](/images/blog/20250305-0x19c-50-wureject-postt7delay/5.png)

To convert this into tick count, divide it with "interrupts per tick" denominator. In our platform it is "0x2625a"

The current tick count is **0x25e84d.**

We started waiting on **0x25e84a**, and BSOD on **0x25e84d**. It means that we have only waited for **~46.875ms** until this point. The wait not satisfying is expected and is not due to schedule pressure causing no CPU time.

Given 0x19C.50 timeout is significantly longer, it is something else running before this wait, spent too much time, and caused the BSOD.
