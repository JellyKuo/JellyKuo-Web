---
title: "DISPATCHER_HEADER"
meta_title: ""
description: ""
date: 2024-03-28T12:00:00Z
image: ""
categories: ["OS"]
author: "Nick Kuo"
tags: ["Windows"]
draft: false
---
See [DISPATCHER_HEADER (geoffchappell.com)](https://www.geoffchappell.com/studies/windows/km/ntoskrnl/inc/ntos/ntosdef_x/dispatcher_header/index.htm) for more info for dispatcher header.

```
0: kd> dt nt!_DISPATCHER_HEADER ffff848d`b817f580+0x40
   +0x000 Lock             : 0n393217
   +0x000 LockNV           : 0n393217
   +0x000 Type             : 0x1 ''
   +0x001 Signalling       : 0 ''
   +0x002 Size             : 0x6 ''
   +0x003 Reserved1        : 0 ''
   +0x000 TimerType        : 0x1 ''
   +0x001 TimerControlFlags : 0 ''
   +0x001 Absolute         : 0y0
```

Any object with `DISPATCHER_HEADER` on its head can be waited upon. The kernel waiting API `KeWaitForSingleObject` and `KeWaitForMultipleObjects`.

Waiting here refers to dispatcher waiting. Meaning if the wait cannot be satisfied immediately, the thread would be placed into a waiting state with a `KWAIT_BLOCK` chaining all waiters of said resource. The thread is then context-switched out of the processor.

# Type

The `Type` field is an enumeration with type `KOBJECTS`. WDK does not contain the definition of `KOBJECTS`.

The following table lists the `KOBJECTS` enumeration, captured from [ReactOS](https://github.com/reactos/reactos/blob/6c93f3ca6b95fa5e1806fc29295d3bc8ada979f9/sdk/include/ndk/ketypes.h#L404):

```cpp
//
// Kernel Object Types
//
typedef enum _KOBJECTS
{
    EventNotificationObject = 0,
    EventSynchronizationObject = 1,
    MutantObject = 2,
    ProcessObject = 3,
    QueueObject = 4,
    SemaphoreObject = 5,
    ThreadObject = 6,
    GateObject = 7,
    TimerNotificationObject = 8,
    TimerSynchronizationObject = 9,
    Spare2Object = 10,
    Spare3Object = 11,
    Spare4Object = 12,
    Spare5Object = 13,
    Spare6Object = 14,
    Spare7Object = 15,
    Spare8Object = 16,
    Spare9Object = 17,
    ApcObject = 18,
    DpcObject = 19,
    DeviceQueueObject = 20,
    EventPairObject = 21,
    InterruptObject = 22,
    ProfileObject = 23,
    ThreadedDpcObject = 24,
    MaximumKernelObject = 25
} KOBJECTS;
```

| Value | Name | Structure | Versions |
| --- | --- | --- | --- |
| 0x00 | **EventNotificationObject** | **KEVENT** | all |
| 0x01 | **EventSynchronizationObject** | **KEVENT** | all |
| 0x02 | **MutantObject** | **KMUTANT** | all |
| 0x03 | **MutexObject** (proposed) | [**KMUTEX**](https://www.geoffchappell.com/studies/windows/km/ntoskrnl/inc/ntos/ke_x/kmutex.htm) | 3.10 only |
|  | **ProcessObject** | **KPROCESS** | 3.50 and higher |
| 0x04 | **QueueObject** | **KQUEUE** | 3.50 and higher |
| 0x04 (3.10);0x05 | **SemaphoreObject** | **KSEMAPHORE** | all |
| 0x05 (3.10);0x06 | **ThreadObject** | [**KTHREAD**](https://www.geoffchappell.com/studies/windows/km/ntoskrnl/inc/ntos/ke/kthread/index.htm) | all |
| 0x07 | **SpareObject** (proposed) |  | 4.0 to early 5.2 |
|  | **GateObject** | **KGATE** | late 5.2 and higher |
| 0x06 (3.10);0x07 (3.50 to 3.51);0x08 | **TimerObject** (proposed) | [**KTIMER**](https://www.geoffchappell.com/studies/windows/km/ntoskrnl/inc/ntos/ntosdef_x/ktimer.htm) | 3.10 to 3.51 |
|  | **TimerNotificationObject** | **KTIMER** | 4.0 and higher |
| 0x09 | **TimerSynchronizationObject** | **KTIMER** | 4.0 and higher |
| 0x0A | **Spare2Object** |  | 4.0 and higher |
| 0x0B | **Spare3Object** |  | 4.0 and higher |
| 0x0C | **Spare4Object** |  | 4.0 and higher |
| 0x0D | **Spare5Object** |  | 4.0 and higher |
| 0x0E | **Spare6Object** |  | 4.0 and higher |
| 0x0F | **Spare7Object** |  | 4.0 and higher |
| 0x10 | **Spare8Object** |  | 4.0 and higher |
| 0x11 | **Spare9Object** |  | 4.0 to 6.1 |
|  | **ProfileCallbackObject** | [**KPROFILE**](https://www.geoffchappell.com/studies/windows/km/ntoskrnl/inc/ntos/ke/kprofile.htm) | 6.2 and higher |
| 0x07 (3.10);0x08 (3.50 to 3.51);0x12 | **ApcObject** | **KAPC** | all |
| 0x08 (3.10);0x09 (3.50 to 3.51);0x13 | **DpcObject** | [**KDPC**](https://www.geoffchappell.com/studies/windows/km/ntoskrnl/inc/ntos/ntosdef_x/kdpc.htm) | all |
| 0x09 (3.10);0x0A (3.50 to 3.51);0x14 | **DeviceQueueObject** | **KDEVICE_QUEUE** | all |
| 0x0A (3.10);0x0B (3.50 to 3.51);0x15 | **EventPairObject** | [**KEVENT_PAIR**](https://www.geoffchappell.com/studies/windows/km/ntoskrnl/inc/ntos/ke/kevent_pair.htm) | 3.10 to 6.2 |
|  | **PriQueueObject** | **KPRIQUEUE** | 6.3 and higher |
| 0x0B (3.10);0x0C (3.50 to 3.51);0x16 | **InterruptObject** | [**KINTERRUPT**](https://www.geoffchappell.com/studies/windows/km/ntoskrnl/inc/ntos/ke_x/kinterrupt.htm) | all |
| 0x0C (3.10) | apparently unused |  | 3.10 only |
| 0x0D (3.10 to 3.51) | **PowerStatusObject** (proposed) | **KPOWER_STATUS** (proposed) | 3.10 only |
|  | apparently unused |  | 3.50 to 3.51 |
| 0x0E (3.10 to 3.51) | **ProcessObject** | **KPROCESS** | 3.10 only |
|  | apparently unused |  | 3.50 to 3.51 |
| 0x0F (3.10 to 3.51);0x17 | **ProfileObject** | **KPROFILE** | all |
| 0x18 | **Timer2NotificationObject** | **KTIMER2** | 6.3 and higher |
| 0x19 | **Timer2SynchronizationObject** | **KTIMER2** | 6.3 and higher |
| 0x18 (5.2 to 6.2);0x1A | **ThreadedDpcObject** | **KDPC** | 5.2 and higher |
| 0x10 (3.10 to 3.51);0x18 (4.0 to 5.1);0x19 (5.2 to 6.2);0x1B | **MaximumKernelObject** |  |  |