---
title: "Session Space"
meta_title: ""
description: ""
date: 2023-12-27T12:00:00Z
image: ""
categories: ["OS"]
author: "Nick Kuo"
tags: ["Windows"]
draft: false
---
When debugging Windows kernels, sometimes you see addresses that “looks” like kernel space memory. It begins with 0xffff, resides within module present in System process (PID 4, win32kbase module). But reading them with d* command shows all ?.

```
12: kd> !thread ffffbc04`06b7a040
THREAD ffffbc0406b7a040  Cid 0004.1374  Teb: 0000000000000000 Win32Thread: ffffa68116596ea0 WAIT: (WrUserRequest) KernelMode Non-Alertable
    ffffbc04157e8c90  SynchronizationEvent
Not impersonating
DeviceMap                 ffffe5096164d8c0
Owning Process            ffffbc03f5b79040       Image:         System
Attached Process          ffffbc040736b140       Image:         csrss.exe
Wait Start TickCount      1883320        Ticks: 38399 (0:00:09:59.984)
Context Switch Count      11102          IdealProcessor: 6             
UserTime                  00:00:00.000
KernelTime                00:00:00.031
Win32 Start Address nt!ExpWorkerThread (0xfffff805390b64d0)
Stack Init ffffa681165975f0 Current ffffa68116596680
Base ffffa68116598000 Limit ffffa68116591000 Call 0000000000000000
Priority 13 BasePriority 12 PriorityDecrement 0 IoPriority 2 PagePriority 5
Child-SP          RetAddr               : Args to Child                                                           : Call Site
ffffa681`165966c0 fffff805`3903f405     : ffff9481`48911180 00000000`00000000 ffffbc03`f5bb0040 00000000`00000000 : nt!KiSwapContext+0x76 [minkernel\ntos\ke\amd64\ctxswap.asm @ 134] 
ffffa681`16596800 fffff805`3903d764     : ffffbc04`06b7a040 ffffbc03`00000000 00000000`00000000 00000000`00000000 : nt!KiSwapThread+0xab5 [minkernel\ntos\ke\thredsup.c @ 14593] 
ffffa681`16596950 fffff805`3903c996     : 00000000`00000000 00000000`00000001 00000000`00000000 00000000`00000000 : nt!KiCommitThreadWait+0x134 [minkernel\ntos\ke\waitsup.c @ 795] 
ffffa681`16596a00 fffff99b`3c078c87     : ffffbc04`00000000 ffffbc04`157e8c80 ffffa681`16597248 ffffbc04`11c49480 : nt!KeWaitForSingleObject+0x256 [minkernel\ntos\ke\wait.c @ 867] 
ffffa681`16596da0 fffff99b`3c0787b2     : ffffa681`16597248 00000000`00000005 00000000`6f707355 00000000`00000044 : **win32kbase!QueuePowerRequest**+0x187
ffffa681`16596e00 fffff99b`3c0e35d6     : 00000000`00000000 00000000`00000001 ffffa681`16597248 00000000`00000000 : win32kbase!UserPowerStateCallout+0x126
ffffa681`16596e50 fffff99b`3c5710cb     : 00000000`00000004 fffff805`39a69600 ffffa681`165970d0 00000000`00000001 : win32kbase!W32CalloutDispatch+0x1a6
ffffa681`16596fa0 fffff805`395f168b     : 00000000`00000000 ffffbc03`ffc7b540 ffffbc04`0736b140 fffff805`3923f970 : win32k!W32CalloutDispatchThunk+0x2b
ffffa681`16596fd0 fffff805`394d3612     : 00000000`00000010 00000000`00040082 ffffa681`165970b8 ffff9481`48911180 : nt!ExCallSessionCallBack+0xa3 [minkernel\ntos\ex\callback.c @ 1738] 
ffffa681`16597090 fffff805`395784b7     : ffffbc04`1c36f640 fffff805`39a3f3e0 00000000`00000000 fffff805`3903fa8b : nt!PsInvokeWin32Callout+0x82 [minkernel\ntos\ps\callback.c @ 1754] 
ffffa681`165970c0 fffff805`39578307     : 00000000`00000004 ffffa681`16597248 ffffa681`16597248 00000000`00000000 : nt!PopInvokeWin32Callout+0x177 [minkernel\ntos\po\session.c @ 1051] 
(Inline Function) --------`--------     : --------`-------- --------`-------- --------`-------- --------`-------- : nt!PerfIsGroupOnInGroupMask+0x25 (Inline Function @ fffff805`39578307) [onecore\internal\sdk\inc\minwin\ntwmi.h @ 4097] 
ffffa681`165971a0 fffff805`395f9630     : 00000000`00000014 00000000`00000000 00000000`00000014 00000000`00000000 : nt!PopDispatchStateCallout+0x5b [minkernel\ntos\po\paction.c @ 2798] 
(Inline Function) --------`--------     : --------`-------- --------`-------- --------`-------- --------`-------- : nt!PoStartPowerStateTasks+0x25 (Inline Function @ fffff805`395f9630) [minkernel\ntos\po\paction.c @ 1574] 
ffffa681`16597210 fffff805`395f9b20     : 00000000`00000000 ffffbc03`f5b06230 ffffbc04`06b7a040 fffff805`390b6bff : nt!PopIssueActionRequest+0x1b8 [minkernel\ntos\po\paction.c @ 1895] 
ffffa681`165972c0 fffff805`3915ac68     : ffffbc04`06b7a000 00000000`00000002 00000000`fffffffb fffff805`39b4aac0 : nt!PopPolicyWorkerAction+0x80 [minkernel\ntos\po\paction.c @ 1093] 
ffffa681`16597340 fffff805`390b6625     : ffffbc03`00000001 ffffbc04`06b7a040 ffffa681`16597480 ffffbc03`f5b06230 : nt!PopPolicyWorkerThread+0xa8 [minkernel\ntos\po\pwork.c @ 271] 
ffffa681`16597380 fffff805`390e5c07     : ffffbc04`06b7a040 00000000`000002f7 ffffbc04`06b7a040 fffff805`390b64d0 : nt!ExpWorkerThread+0x155 [minkernel\ntos\ex\worker.c @ 4308] 
ffffa681`16597570 fffff805`3923f044     : ffff9481`48718180 ffffbc04`06b7a040 fffff805`390e5bb0 00000000`00000000 : nt!PspSystemThreadStartup+0x57 [minkernel\ntos\ps\psexec.c @ 10885] 
ffffa681`165975c0 00000000`00000000     : ffffa681`16598000 ffffa681`16591000 00000000`00000000 00000000`00000000 : nt!KiStartSystemThread+0x34 [minkernel\ntos\ke\amd64\threadbg.asm @ 83]
```

Win32k is in session space memory. In order to view its content, you must switch to the correct session and use hardware breakpoints when live debugging.

To switch session space:

```
11: kd> !session
Sessions on machine: 2
Valid Sessions: 0 1
Current Session 0

11: kd> !session -s 1
Sessions on machine: 2
Implicit process is now ffffce01`1779e080
.cache forcedecodeptes done
Using session 1l
```

If you're coming from a process (e.g. an interactive process you know is in correct session), use `.process /P <PEPROCESS>`

Use hardware breakpoints since the same code VA could point to different physical address due to address space difference.