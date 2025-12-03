---
title: "0x133.0 NPU Line Interrupt"
meta_title: ""
description: ""
date: 2025-03-31T12:00:00Z
image: ""
categories: ["BSOD Analysis"]
author: "Nick Kuo"
tags: ["Windows", "BSOD", "0x133"]
draft: false
---

The BSOD sequence of event looks like this:
1. OS is starting up NPU device.
![](/images/blog/20250331-0x133-0-npu-lineinterrupt/1.png)
2. Something went wrong with NPU side, causing firmware to send line interrupts on core 2.
![](/images/blog/20250331-0x133-0-npu-lineinterrupt/2.png)
3. GFX TDR on core 0.
![](/images/blog/20250331-0x133-0-npu-lineinterrupt/3.png)
4. TDR process capture live dump, it queues DPCs to capture each core's state, and waits on this completion.
5. Core 1 received this DPC, completes it and wait for the rest of cores to complete.
6. Core 2 is still stuck on line interrupts from NPU, it never completes the DPC.
7. Core 1 triggered DPC watchdog as it has spun on core for too long.

On core 2, it is attempting to handle line interrupt from NPU, but NPU isn't setup to receive line interrupt.

In our driver code, our ISR picks the context based on message number. This had returned nullptr and we simply returned from ISR.

(Actually, we should return false here, but it makes no difference to this case.)
