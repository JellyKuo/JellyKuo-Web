---
title: "NT Wait Times"
meta_title: ""
description: ""
date: 2025-03-05T12:00:00Z
image: ""
categories: ["OS"]
author: "Nick Kuo"
tags: ["Windows"]
draft: false
---
# NT Wait Time
OS store shared data as `nt!_KUSER_SHARED_DATA` . It is always mapped to `0xfffff78000000000` in all process. It is done through page table mapping to same entry. 

This allows all user mode process to access this structure without syscall to kernel.

In `nt!_KUSER_SHARED_DATA`, +0x320 is `TickCountQuad` . This field is incremented every clock interrupt (15.6ms). Multiply this with 15.6ms and divide to 100ns unit to get “Interrupt time”. On AMD platform, “interrupt time per tick” is `0x2625a`. 

# EResource
EResource wait time cannot be identified by just the wait tick count.
EResource loops `KeWaitForSingleObject` to wait, so need to account in wait loop count.

```
12: kd> k
  *** Stack trace for last set context - .thread/.cxr resets it
 # Child-SP          RetAddr               Call Site
00 ffffa681`140ceb50 fffff805`3903f405     nt!KiSwapContext+0x76 [minkernel\ntos\ke\amd64\ctxswap.asm @ 134] 
01 ffffa681`140cec90 fffff805`3903d764     nt!KiSwapThread+0xab5 [minkernel\ntos\ke\thredsup.c @ 14593] 
02 ffffa681`140cede0 fffff805`3903c996     nt!KiCommitThreadWait+0x134 [minkernel\ntos\ke\waitsup.c @ 795] 
03 ffffa681`140cee90 fffff805`3913dbbb     nt!KeWaitForSingleObject+0x256 [minkernel\ntos\ke\wait.c @ 867] 
04 ffffa681`140cf230 fffff805`39042b87     **nt!ExpWaitForResource**+0x6b [minkernel\ntos\ex\resource_common.c @ 968] 
05 (Inline Function) --------`--------     nt!ExpCommitWaitForResourceExclusive+0x19 [minkernel\ntos\ex\resource_common.c @ 1080] 
06 ffffa681`140cf2c0 fffff805`39131b11     nt!ExpAcquireResourceExclusiveLite+0x317 [minkernel\ntos\ex\resource.c @ 1163] 
07 (Inline Function) --------`--------     nt!ExAcquireResourceExclusiveLite+0xdc [minkernel\ntos\ex\resource.c @ 947] 
08 ffffa681`140cf360 fffff99b`3c04abcb     nt!ExEnterCriticalRegionAndAcquireResourceExclusive+0xf1 [minkernel\ntos\ex\resource.c @ 1213] 
09 ffffa681`140cf3a0 fffff99b`3c04aac6     win32kbase!PrivateAPI::`anonymous namespace'::EnterCritInternal+0x5f
0a ffffa681`140cf3d0 fffff99b`3d542d86     win32kbase!EnterCrit+0x16
0b ffffa681`140cf400 fffff99b`3c576ed5     win32kfull!NtUserUserPowerCalloutWorker+0x16
0c ffffa681`140cf430 fffff805`3924eee8     win32k!NtUserUserPowerCalloutWorker+0x15
0d ffffa681`140cf460 00007ffe`43a0c8f4     nt!KiSystemServiceCopyEnd+0x28 [minkernel\ntos\ke\amd64\trap.asm @ 3605] 
0e 000000a0`1b73fd48 00000000`00000000     0x00007ffe`43a0c8f4
```

```
12: kd> .frame 0n4;dv /t /v
04 ffffa681`140cf230 fffff805`39042b87     nt!ExpWaitForResource+0x6b [minkernel\ntos\ex\resource_common.c @ 968] 
@rbx              struct _ERESOURCE_COMMON * Resource = 0xffffbc04`11b18090
@r13              struct _KWAIT_CHAIN_ENTRY * WaitChainEntry = 0xffffa681`140cf2f8
@r12d             unsigned long WaitType = 0x10224
@r14              <function> * RewaitCallback = 0xfffff805`391b13c0
@esi              unsigned long WaitCount = **0xc**
ffffa681`140cf268 union _LARGE_INTEGER Timeout = {-40000000}
<unavailable>     struct _ERESOURCE_TIMEOUT_WORK_ITEM_CONTEXT * ResourceTimeoutWorkItemContext = <value unavailable>
@edi              unsigned long PerfLogTracingLimit = 0x96
@eax              long Status = 0n0
12: kd> !thread ffffbc04`11c49340
THREAD ffffbc0411c49340  Cid 0504.0554  Teb: 000000a01b301000 Win32Thread: ffffbc0411f0b570 WAIT: (WrResource) KernelMode Non-Alertable
    ffffa681140cf310  SynchronizationEvent
Not impersonating
DeviceMap                 ffffe5096164d8c0
Owning Process            ffffbc040736b140       Image:         csrss.exe
Attached Process          N/A            Image:         N/A
Wait Start TickCount      1921572        Ticks: **147 (0:00:00:02.296)**
```

Each wait is 4 seconds, the first wait is 0.5 seconds.

Formula: **0.5s + (WaitCount - 1) * 4s + Thread wait tick = EResource wait time**

In this case: **0.5s + (0xc-1) * 4s + 2.296s = 46.796s**