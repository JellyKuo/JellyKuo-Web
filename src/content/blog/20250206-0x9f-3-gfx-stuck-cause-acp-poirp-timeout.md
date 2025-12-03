---
title: "0x9F.3 Gfx Stuck Cause Acp PoIrp Timeout"
meta_title: ""
description: ""
date: 2025-02-06T12:00:00Z
image: ""
categories: ["BSOD Analysis"]
author: "Nick Kuo"
tags: ["Windows", "BSOD", "0x9F"]
draft: false
---
```cpp
5: kd> .bugcheck
Bugcheck code 0000009F
Arguments 00000000`00000003 ffffcf07`04d3caf0 ffffcd04`6bb4f010 ffffcf07`0dec88a0
9: kd> k
 # Child-SP          RetAddr               Call Site
00 ffffcd04`6bb4efb8 fffff807`9098f10d     nt!KeBugCheckEx [minkernel\ntos\ke\amd64\procstat.asm @ 140] 
01 ffffcd04`6bb4efc0 fffff807`9098ef0c     nt!PopIrpWatchdogBugcheck+0x1f5 [minkernel\ntos\po\misc.c @ 2776] 
02 ffffcd04`6bb4f0a0 fffff807`906ef83a     nt!PopIrpWatchdog+0xc [minkernel\ntos\po\misc.c @ 2659] 
03 ffffcd04`6bb4f0d0 fffff807`906f0353     nt!KiProcessExpiredTimerList+0x26a [minkernel\ntos\ke\dpcsup.c @ 4109] 
04 (Inline Function) --------`--------     nt!KiExpireTimerTable+0x9d [minkernel\ntos\ke\dpcsup.c @ 4417] 
05 ffffcd04`6bb4f200 fffff807`906b9d61     nt!KiTimerExpiration+0x2e3 [minkernel\ntos\ke\dpcsup.c @ 4603] 
06 ffffcd04`6bb4f330 fffff807`90a7ad2e     nt!KiRetireDpcList+0xaf1 [minkernel\ntos\ke\dpcsup.c @ 3395] 
07 ffffcd04`6bb4f5c0 00000000`00000000     nt!KiIdleLoop+0x9e [minkernel\ntos\ke\amd64\idle.asm @ 177] 
```

This is a real 9F.

```cpp
9: kd> !irp ffffcf07`0dec88a0
Irp is active with 10 stacks 8 is current (= 0xffffcf070dec8b68)
 No Mdl: No System Buffer: Thread 00000000:  Irp stack trace.  
     cmd  flg cl Device   File     Completion-Context
 [N/A(0), N/A(0)]
            0  0 00000000 00000000 00000000-00000000    

			Args: 00000000 00000000 00000000 00000000
 [N/A(0), N/A(0)]
            0  0 00000000 00000000 00000000-00000000    

			Args: 00000000 00000000 00000000 00000000
 [N/A(0), N/A(0)]
            0  0 00000000 00000000 00000000-00000000    

			Args: 00000000 00000000 00000000 00000000
 [N/A(0), N/A(0)]
            0  0 00000000 00000000 00000000-00000000    

			Args: 00000000 00000000 00000000 00000000
 [N/A(0), N/A(0)]
            0  0 00000000 00000000 00000000-00000000    

			Args: 00000000 00000000 00000000 00000000
 [N/A(0), N/A(0)]
            0  0 00000000 00000000 00000000-00000000    

			Args: 00000000 00000000 00000000 00000000
 [N/A(0), N/A(0)]
            0  0 00000000 00000000 00000000-00000000    

			Args: 00000000 00000000 00000000 00000000
>[IRP_MJ_POWER(16), IRP_MN_SET_POWER(2)]
            0  1 ffffcf0704d3caf0 00000000 00000000-00000000    pending
	      Unable to load image \SystemRoot\System32\DriverStore\FileRepository\amdacpbtacx.inf_amd64_1dbc83dfc3de57f5\amdacpbtacx.sys, Win32 error 0n2
 \Driver\AMDAcpBtAudioService
			Args: 00000000 00000001 00000001 00000000
 [IRP_MJ_POWER(16), IRP_MN_SET_POWER(2)]
            0 e1 ffffcf0707dd4360 00000000 fffff8079079cdd0-ffffcf07044c1278 Success Error Cancel pending
	       \Driver\ksthunk	nt!PopRequestCompletion
			Args: 00000000 00000001 00000001 00000000
 [N/A(0), N/A(0)]
            0  0 00000000 00000000 00000000-ffffcf07044c1278    

			Args: 00000000 00000000 00000000 00000000
```

Actually, this node does not process power IRP. Instead it create new PoIRP and pass to parent device node.

![](/images/blog/20250206-0x9f-3-gfx-stuck-cause-acp-poirp-timeout/1.png)

The IRP we’re concerned about is **`ffffcf06f3d4e3d0` .** 

```cpp
9: kd> !irp ffffcf06f3d4e3d0
Irp is active with 6 stacks 5 is current (= 0xffffcf06f3d4e5c0)
 No Mdl: No System Buffer: Thread 00000000:  Irp stack trace.  
     cmd  flg cl Device   File     Completion-Context
 [N/A(0), N/A(0)]
            0  0 00000000 00000000 00000000-00000000    

			Args: 00000000 00000000 00000000 00000000
 [N/A(0), N/A(0)]
            0  0 00000000 00000000 00000000-00000000    

			Args: 00000000 00000000 00000000 00000000
 [N/A(0), N/A(0)]
            0  0 00000000 00000000 00000000-00000000    

			Args: 00000000 00000000 00000000 00000000
 [N/A(0), N/A(0)]
            0  0 00000000 00000000 00000000-00000000    

			Args: 00000000 00000000 00000000 00000000
>[IRP_MJ_POWER(16), IRP_MN_SET_POWER(2)]
            0 e1 ffffcf06e96edb70 00000000 fffff8079079cdd0-ffffcf06f0dad248 Success Error Cancel pending
	       \Driver\amdacpbus	nt!PopRequestCompletion
			Args: 00000000 00000001 00000004 00000000
 [N/A(0), N/A(0)]
            0  0 00000000 00000000 00000000-ffffcf06f0dad248    

			Args: 00000000 00000000 00000000 00000000
```

If we look for the dispatch routine, it is a little bit tricky as Acp is a WDF driver, and all WDF uses the same routine. I will just use AEX AddressMap to find which stack has this IRP address.

```cpp
9: kd> !addrMap 0xffffcf06f3d4e3d0
[INFO]  7 Address maps loaded.
--- Direct Result (Provided address is) ---
Address 0xffffcf06f3d4e3d0 is a value withing a system stack
Found locations:
	Address:ffffcd046ba1f430	Thread 0xffffcf06df697040	Thread Id: 20	Stack Offset: b20
	Address:ffffcd046ba1f460	Thread 0xffffcf06df697040	Thread Id: 20	Stack Offset: b50
	Address:ffffcd046ba1f468	Thread 0xffffcf06df697040	Thread Id: 20	Stack Offset: b58
	Address:ffffcd046ba1f4a0	Thread 0xffffcf06df697040	Thread Id: 20	Stack Offset: b90
	Address:ffffcd046ba1f520	Thread 0xffffcf06df697040	Thread Id: 20	Stack Offset: c10

@$addrMap(0xffffcf06f3d4e3d0)
9: kd> .thread 0xffffcf06df697040
Implicit thread is now ffffcf06`df697040
9: kd> k
  *** Stack trace for last set context - .thread/.cxr resets it
 # Child-SP          RetAddr               Call Site
00 ffffcd04`6ba1e950 fffff807`9061070e     nt!KiSwapContext+0x76 [minkernel\ntos\ke\amd64\ctxswap.asm @ 144] 
01 (Inline Function) --------`--------     nt!KzCheckForThreadDispatch+0xfe [minkernel\ntos\ke\waitsup.c @ 3141] 
02 ffffcd04`6ba1ea90 fffff807`9072cebe     nt!KiCheckForThreadDispatch+0x112 [minkernel\ntos\ke\waitsup.c @ 605] 
03 (Inline Function) --------`--------     nt!KiProcessDeferredReadyList+0x67 [minkernel\ntos\ke\thredsup.c @ 9338] 
04 ffffcd04`6ba1eac0 fffff807`9072c96e     nt!KeSetSystemGroupAffinityThread+0x18e [minkernel\ntos\ke\thredobj.c @ 4610] 
05 ffffcd04`6ba1eb30 fffff807`9076a01b     nt!KeGenericProcessorCallback+0x14e [minkernel\ntos\ke\miscc.c @ 1984] 
06 ffffcd04`6ba1ed00 fffff807`222d8a99     nt!KeFlushQueuedDpcs+0x11b [minkernel\ntos\ke\dpcobj.c @ 1270] 
07 (Inline Function) --------`--------     Wdf01000!FxInterrupt::FlushQueuedDpcs+0xc [minkernel\wdf\framework\shared\irphandlers\pnp\km\interruptobjectkm.cpp @ 287] 
08 ffffcd04`6ba1ef80 fffff807`222da62b     Wdf01000!FxInterrupt::Disconnect+0x99 [minkernel\wdf\framework\shared\irphandlers\pnp\interruptobject.cpp @ 1418] 
09 ffffcd04`6ba1eff0 fffff807`222da069     Wdf01000!FxPkgPnp::NotifyResourceObjectsDx+0x6f [minkernel\wdf\framework\shared\irphandlers\pnp\fxpkgpnp.cpp @ 6589] 
0a ffffcd04`6ba1f060 fffff807`222d9f6b     Wdf01000!FxPkgPnp::PowerGotoDxIoStoppedCommon+0xe5 [minkernel\wdf\framework\shared\irphandlers\pnp\powerstatemachine.cpp @ 3095] 
0b (Inline Function) --------`--------     Wdf01000!FxPkgPnp::PowerGotoDxIoStopped+0x7 [minkernel\wdf\framework\shared\inc\private\common\FxPkgPnp.hpp @ 2958] 
0c ffffcd04`6ba1f0d0 fffff807`222ddd0a     Wdf01000!FxPkgPnp::PowerGotoDNotZeroIoStopped+0xb [minkernel\wdf\framework\shared\irphandlers\pnp\powerstatemachine.cpp @ 2843] 
0d ffffcd04`6ba1f100 fffff807`222dd9d8     Wdf01000!FxPkgPnp::PowerEnterNewState+0x152 [minkernel\wdf\framework\shared\irphandlers\pnp\powerstatemachine.cpp @ 1705] 
0e ffffcd04`6ba1f250 fffff807`222db569     Wdf01000!FxPkgPnp::PowerProcessEventInner+0xe0 [minkernel\wdf\framework\shared\irphandlers\pnp\powerstatemachine.cpp @ 1617] 
0f ffffcd04`6ba1f2d0 fffff807`222db374     Wdf01000!FxPkgPnp::PowerProcessEvent+0x15d [minkernel\wdf\framework\shared\irphandlers\pnp\powerstatemachine.cpp @ 1396] 
10 (Inline Function) --------`--------     Wdf01000!FxPkgFdo::LowerDevicePower+0x34 [minkernel\wdf\framework\shared\irphandlers\pnp\fdopower.cpp @ 414] 
11 ffffcd04`6ba1f370 fffff807`222d9895     Wdf01000!FxPkgFdo::DispatchDeviceSetPower+0x7c [minkernel\wdf\framework\shared\irphandlers\pnp\fdopower.cpp @ 350] 
12 ffffcd04`6ba1f3c0 fffff807`22309503     Wdf01000!FxPkgFdo::_DispatchSetPower+0x25 [minkernel\wdf\framework\shared\irphandlers\pnp\fdopower.cpp @ 120] 
13 ffffcd04`6ba1f3f0 fffff807`222fdcc2     Wdf01000!FxPkgPnp::Dispatch+0x103 [minkernel\wdf\framework\shared\irphandlers\pnp\fxpkgpnp.cpp @ 794] 
14 (Inline Function) --------`--------     Wdf01000!DispatchWorker+0xea [minkernel\wdf\framework\shared\core\fxdevice.cpp @ 1587] 
15 (Inline Function) --------`--------     Wdf01000!FxDevice::Dispatch+0xf3 [minkernel\wdf\framework\shared\core\fxdevice.cpp @ 1601] 
16 ffffcd04`6ba1f460 fffff807`9079b7be     Wdf01000!FxDevice::DispatchWithLock+0x232 [minkernel\wdf\framework\shared\core\fxdevice.cpp @ 1445] 
17 ffffcd04`6ba1f4c0 fffff807`9085585a     nt!PopIrpWorker+0x2de [minkernel\ntos\po\irpwork.c @ 608] 
18 ffffcd04`6ba1f570 fffff807`90a7ae54     nt!PspSystemThreadStartup+0x5a [minkernel\ntos\ps\psexec.c @ 11931] 
19 ffffcd04`6ba1f5c0 00000000`00000000     nt!KiStartSystemThread+0x34 [minkernel\ntos\ke\amd64\threadbg.asm @ 87] 
```

Actually, this thread is in STANDBY. It is the next thread to run.

```cpp
9: kd> !thread 0xffffcf06df697040
THREAD ffffcf06df697040  Cid 0004.0014  Teb: 0000000000000000 Win32Thread: 0000000000000000 STANDBY
IRP List:
    ffffcf06f23bfa50: (0006,0550) Flags: 00060000  Mdl: 00000000
    ffffcf07089de010: (0006,0550) Flags: 00060000  Mdl: 00000000
    ffffcf070f785920: (0006,0550) Flags: 00060000  Mdl: 00000000
    ffffcf0709e60920: (0006,0550) Flags: 00060000  Mdl: 00000000
    ffffcf06eeed06a0: (0006,0550) Flags: 00060000  Mdl: 00000000
    ffffcf0711e63a70: (0006,0550) Flags: 00060000  Mdl: 00000000
    ffffcf0709a432c0: (0006,0550) Flags: 00060000  Mdl: 00000000
    ffffcf07092dc860: (0006,0550) Flags: 00060000  Mdl: 00000000
Not impersonating
DeviceMap                 ffffbc8d992d0970
Owning Process            ffffcf06df67e040       Image:         System
Attached Process          N/A            Image:         N/A
Wait Start TickCount      5513459        Ticks: 7725 (0:00:02:00.703)
Context Switch Count      94571          IdealProcessor: 5             
UserTime                  00:00:00.000
KernelTime                00:00:22.781
Win32 Start Address nt!PopIrpWorker (0xfffff8079079b4e0)
Stack Init ffffcd046ba1f5f0 Current ffffcd046ba1e910
Base ffffcd046ba20000 Limit ffffcd046ba19000 Call 0000000000000000
Priority 30  BasePriority 13  Priority Floor 30  IoPriority 2  PagePriority 5
```

Check PRCB. It is scheduled to run on core 5.

```cpp
9: kd> !corelist
+--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------+
| Core |               PRCB | ClockKeepAlive | DpcWatchdogCount(0x133.1) | DpcWatchdogPeriodTicks(0x133.1) | DpcTimeCount(0x133.0) | DpcTimeLimitTicks(0x133.0) | PacketBarrier | TargetCount | LastTick | ClockOwner |      CurrentThread |         NextThread |         IdleThread | DebuggerSavedIRQL |           DpcStack |           IsrStack | 
+--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------+
|    0 | 0xfffff80721266180 |              1 |                    0x1d5d |                          0x1e00 |                   0x0 |                      0x500 |           0x0 |         0x0 | 0x543f20 |          0 | 0xffffcf06f853b080 | 0xffffcf06f0ef9040 | 0xfffff807913d0640 |               0x0 | 0xfffff80722965fb0 | 0xfffff8072296e000 | 
|    1 | 0xffffa98111283180 |              1 |                       0x0 |                          0x1e00 |                   0x0 |                      0x500 |           0x0 |         0x0 | 0x543f20 |          0 | 0xffffcf06df6b8040 |                0x0 | 0xffffcf06df6b8040 |               0x0 | 0xffffcd046ba47fb0 | 0xffffa981112a0000 | 
|    2 | 0xffffa98111324180 |              1 |                       0x0 |                          0x1e00 |                   0x0 |                      0x500 |           0x0 |         0x0 | 0x543f1f |          0 | 0xffffcf0708fd7040 |                0x0 | 0xffffcf06df6d5280 |               0x0 | 0xffffcd046ba67fb0 | 0xffffa98111399000 | 
|    3 | 0xffffa981113c7180 |              1 |                       0x0 |                          0x1e00 |                   0x0 |                      0x500 |           0x0 |         0x0 | 0x543f20 |          0 | 0xffffcf06df6d9280 |                0x0 | 0xffffcf06df6d9280 |               0x0 | 0xffffcd046ba87fb0 | 0xffffa981113e4000 | 
|    4 | 0xffffa9811146a180 |              1 |                       0x0 |                          0x1e00 |                   0x0 |                      0x500 |           0x0 |         0x0 | 0x543f20 |          0 | 0xffffcf06df757280 |                0x0 | 0xffffcf06df757280 |               0x0 | 0xffffcd046baa7fb0 | 0xffffa981114d9000 | 
|    5 | 0xffffa9811150b180 |              1 |                    0x1d8b |                          0x1e00 |                   0x0 |                      0x500 |           0x0 |         0x0 | 0x543f1f |          0 | 0xffffcf06fa1ba3c0 | 0xffffcf06df697040 | 0xffffcf06df75b280 |               0x0 | 0xffffcd046bac7fb0 | 0xffffa98111528000 | 
|    6 | 0xffffa981115c0180 |              1 |                       0x0 |                          0x1e00 |                   0x0 |                      0x500 |           0x0 |         0x0 | 0x543f20 |          0 | 0xffffcf06df778280 |                0x0 | 0xffffcf06df778280 |               0x0 | 0xffffcd046bae7fb0 | 0xffffa981115b4000 | 
|    7 | 0xffffa981116a2180 |              1 |                       0x0 |                          0x1e00 |                   0x0 |                      0x500 |           0x0 |         0x0 | 0x543f20 |          0 | 0xffffcf06df77c280 |                0x0 | 0xffffcf06df77c280 |               0x0 | 0xffffcd046bb07fb0 | 0xffffa981116bf000 | 
|    8 | 0xffffa98111751180 |              1 |                       0x0 |                          0x1e00 |                   0x0 |                      0x500 |           0x0 |         0x0 | 0x543f20 |          0 | 0xffffcf06df79a280 |                0x0 | 0xffffcf06df79a280 |               0x0 | 0xffffcd046bb27fb0 | 0xffffa981116f9000 | 
|    9 | 0xffffa981117e5180 |              1 |                       0x0 |                          0x1e00 |                   0x0 |                      0x500 |           0x0 |         0x0 | 0x543f20 |          1 | 0xffffcf06df79e280 | 0xffffcf0710fcd0c0 | 0xffffcf06df79e280 |               0x2 | 0xffffcd046bb47fb0 | 0xffffa98111808000 | 
|   10 | 0xffffa98111891180 |              1 |                       0x0 |                          0x1e00 |                   0x0 |                      0x500 |           0x0 |         0x0 | 0x543f20 |          0 | 0xffffcf06df7bd040 |                0x0 | 0xffffcf06df7bd040 |               0x0 | 0xffffcd046bb67fb0 | 0xffffa981118ae000 | 
|   11 | 0xffffa9811192d180 |              1 |                       0x0 |                          0x1e00 |                   0x0 |                      0x500 |           0x0 |         0x0 | 0x543f20 |          0 | 0xffffcf06df7d0280 |                0x0 | 0xffffcf06df7d0280 |               0x0 | 0xffffcd046bb87fb0 | 0xffffa9811194a000 | 
|   12 | 0xffffa981119d1180 |              1 |                       0x0 |                          0x1e00 |                   0x0 |                      0x500 |           0x0 |         0x0 | 0x543f20 |          0 | 0xffffcf06df7df280 |                0x0 | 0xffffcf06df7df280 |               0x0 | 0xffffcd046bba7fb0 | 0xffffa981119ee000 | 
|   13 | 0xffffa98111a71180 |              1 |                       0x0 |                          0x1e00 |                   0x0 |                      0x500 |           0x0 |         0x0 | 0x543f20 |          0 | 0xffffcf06df811280 |                0x0 | 0xffffcf06df811280 |               0x0 | 0xffffcd046bbc7fb0 | 0xffffa98111a8e000 | 
|   14 | 0xffffa98111b11180 |              1 |                       0x0 |                          0x1e00 |                   0x0 |                      0x500 |           0x0 |         0x0 | 0x543f20 |          0 | 0xffffcf06df821280 |                0x0 | 0xffffcf06df821280 |               0x0 | 0xffffcd046bbe7fb0 | 0xffffa98111b2e000 | 
|   15 | 0xffffa98111b61180 |              1 |                       0x0 |                          0x1e00 |                   0x0 |                      0x500 |           0x0 |         0x0 | 0x543f20 |          0 | 0xffffcf06df832280 |                0x0 | 0xffffcf06df832280 |               0x0 | 0xffffcd046bc07fb0 | 0xffffa98111b7e000 | 
|   16 | 0xffffa98111c51180 |              1 |                       0x0 |                          0x1e00 |                   0x0 |                      0x500 |           0x0 |         0x0 | 0x543f20 |          0 | 0xffffcf06df842280 |                0x0 | 0xffffcf06df842280 |               0x0 | 0xffffcd046bc27fb0 | 0xffffa98111c6e000 | 
|   17 | 0xffffa98111ca0180 |              1 |                       0x0 |                          0x1e00 |                   0x0 |                      0x500 |           0x0 |         0x0 | 0x543f20 |          0 | 0xffffcf06df854280 |                0x0 | 0xffffcf06df854280 |               0x0 | 0xffffcd046bc47fb0 | 0xffffa98111cbd000 | 
|   18 | 0xffffa98111d93180 |              1 |                       0x0 |                          0x1e00 |                   0x0 |                      0x500 |           0x0 |         0x0 | 0x543f20 |          0 | 0xffffcf06df7e6280 |                0x0 | 0xffffcf06df7e6280 |               0x0 | 0xffffcd046bc67fb0 | 0xffffa98111db0000 | 
|   19 | 0xffffa98111de2180 |              1 |                       0x0 |                          0x1e00 |                   0x0 |                      0x500 |           0x0 |         0x0 | 0x543f20 |          0 | 0xffffcf06eefc00c0 |                0x0 | 0xffffcf06df869280 |               0x0 | 0xffffcd046bc87fb0 | 0xffffa98111dff000 | 
|   20 | 0xffffa98111e84180 |              1 |                       0x0 |                          0x1e00 |                   0x0 |                      0x500 |           0x0 |         0x0 | 0x543f20 |          0 | 0xffffcf06df876080 |                0x0 | 0xffffcf06df876080 |               0x0 | 0xffffcd046bca7fb0 | 0xffffa98111ea1000 | 
|   21 | 0xffffa98111f78180 |              1 |                       0x0 |                          0x1e00 |                   0x0 |                      0x500 |           0x0 |         0x0 | 0x543f20 |          0 | 0xffffcf06df88b280 |                0x0 | 0xffffcf06df88b280 |               0x0 | 0xffffcd046bcc7fb0 | 0xffffa98111f95000 | 
|   22 | 0xffffa98111fc6180 |              1 |                       0x0 |                          0x1e00 |                   0x0 |                      0x500 |           0x0 |         0x0 | 0x543f20 |          0 | 0xffffcf06df89c280 |                0x0 | 0xffffcf06df89c280 |               0x0 | 0xffffcd046bce7fb0 | 0xffffa98111fe3000 | 
|   23 | 0xffffa981120c0180 |              1 |                       0x0 |                          0x1e00 |                   0x0 |                      0x500 |           0x0 |         0x0 | 0x543f20 |          0 | 0xffffcf06df8ad280 |                0x0 | 0xffffcf06df8ad280 |               0x0 | 0xffffcd046bd07fb0 | 0xffffa981120c0000 | 
+--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------+
```

Core 5 is doing some waiting on HW.

```cpp
5: kd> k
 # Child-SP          RetAddr               Call Site
00 (Inline Function) --------`--------     nt!HalpTscQueryCounterOrdered+0x8 [minkernel\hals\lib\timers\pc\tsc.c @ 339] 
01 ffffcd04`6d776690 fffff807`90818ed7     nt!HalpTimerStallExecutionProcessor+0x2a5 [minkernel\hals\lib\timers\common\timer.c @ 2927] 
02 ffffcd04`6d776760 fffff807`2dc77c11     nt!KeStallExecutionProcessor+0x27 [minkernel\hals\lib\timers\common\timer.c @ 973] 
03 ffffcd04`6d7767a0 fffff807`2dd34a04     amdkmdag!nsGS::CS_OsKernel::Wait+0xf1 [C:\constructicon\builds\gfx\one\24.30\drivers\kgd\gmx\layers\gs\src\os\CS_OsKrnl.cpp @ 335] 
04 (Inline Function) --------`--------     amdkmdag!nsHW::CO_TtlMgr::WaitFor+0x62 [C:\constructicon\builds\gfx\one\24.30\drivers\kgd\gmx\layers\hw\src\components\TtlMgrCosIF.cpp @ 1861] 
05 ffffcd04`6d776860 fffff807`2dc2ce22     amdkmdag!nsHW::CO_TtlMgr::CosCbWaitFor+0x94 [C:\constructicon\builds\gfx\one\24.30\drivers\kgd\gmx\layers\hw\src\components\TtlMgrCosIF.cpp @ 821] 
06 ffffcd04`6d7768a0 fffff807`2dc31329     amdkmdag!umsch_mm_cos_wait_for+0x36 [C:\constructicon\builds\gfx\one\24.30\drivers\swip\umsch_mm\src\umsch_mm_cos.c @ 38] 
07 ffffcd04`6d7768f0 fffff807`2dc2eb81     amdkmdag!umsch_mm_check_outstanding_command_and_wait+0x65 [C:\constructicon\builds\gfx\one\24.30\drivers\swip\umsch_mm\src\umsch_mm_util.c @ 158] 
08 ffffcd04`6d776930 fffff807`2dc2ecb6     amdkmdag!umsch_mm_submit+0x11 [C:\constructicon\builds\gfx\one\24.30\drivers\swip\umsch_mm\src\umsch_mm_ip\umsch_mm_ip.c @ 704] 
09 ffffcd04`6d776960 fffff807`2dbda29d     amdkmdag!umsch_mm_suspend_context_api+0xde [C:\constructicon\builds\gfx\one\24.30\drivers\swip\umsch_mm\src\umsch_mm_ip\umsch_mm_ip.c @ 1097] 
0a ffffcd04`6d776a90 fffff807`2dbc6249     amdkmdag!IpiUmsSuspendContext+0x41 [C:\constructicon\builds\gfx\one\24.30\drivers\ttl\src\ipi\ipi_ums.c @ 602] 
0b ffffcd04`6d776ae0 fffff807`2dc8abf9     amdkmdag!TtlUmsSuspendContext+0x45 [C:\constructicon\builds\gfx\one\24.30\drivers\ttl\src\ttl_rts.c @ 5790] 
0c ffffcd04`6d776b10 fffff807`2dc98bcf     amdkmdag!nsHW::CO_TtlMgr::UmsSuspendGang+0x19 [C:\constructicon\builds\gfx\one\24.30\drivers\kgd\gmx\layers\hw\src\components\CO_TtlMgr.cpp @ 3380] 
0d ffffcd04`6d776b40 fffff807`2dca3e27     amdkmdag!nsSVC::CO_UserQueueMgr::CallToUms+0x13f [C:\constructicon\builds\gfx\one\24.30\drivers\kgd\gmx\layers\svc\src\queueService\CO_UserQueueMgr.cpp @ 8401] 
0e ffffcd04`6d776bb0 fffff807`2dd57a0c     amdkmdag!nsSVC::CO_UserQueueMgr::SuspendContext+0x297 [C:\constructicon\builds\gfx\one\24.30\drivers\kgd\gmx\layers\svc\src\queueService\CO_UserQueueMgr.cpp @ 6814] 
0f ffffcd04`6d776d00 fffff807`2d8ca195     amdkmdag!nsUSR::CS_Context::SuspendContext+0x9c [C:\constructicon\builds\gfx\one\24.30\drivers\kgd\gmx\layers\usr\src\privateFeatures\osFeatures\CS_Context.cpp @ 3402] 
10 ffffcd04`6d776d30 fffff807`2d731c1c     amdkmdag!CAtl::AtlSuspendContext+0x65 [C:\constructicon\builds\gfx\one\24.30\drivers\kmd\atl\atl.cpp @ 6768] 
11 ffffcd04`6d776d60 fffff807`2d8f44f3     amdkmdag!Dispatch_SuspendContext+0x10c [C:\constructicon\builds\gfx\one\24.30\drivers\kmd\src\dispatcher_interfaces.cpp @ 9476] 
12 ffffcd04`6d776db0 fffff807`238e8fb4     amdkmdag!ProxySuspendContext+0xe3 [C:\constructicon\builds\gfx\one\24.30\drivers\pxproxy\kmd\ddi.cpp @ 9753] 
13 ffffcd04`6d776df0 fffff807`23578cd9     dxgkrnl!ADAPTER_RENDER::DdiSuspendContext+0xd0 [onecoreuap\windows\core\dxkernel\dxgkrnl\core\adapterddi.cxx @ 642] 
14 ffffcd04`6d776ed0 fffff807`34c980df     dxgkrnl!ADAPTER_RENDER_DdiSuspendContext+0x9 [onecoreuap\windows\core\dxkernel\dxgkrnl\core\corethnk.cxx @ 1251] 
15 (Inline Function) --------`--------     dxgmms2!ADAPTER_RENDER::DdiSuspendContext+0x1b [onecoreuap\windows\core\dxkernel\dxgkrnl\inc\dxgmms.hxx @ 219] 
16 ffffcd04`6d776f00 fffff807`34c994c3     dxgmms2!VidSchiSuspendResumeHwContext+0x16b [onecoreuap\windows\core\dxkernel\dxgkrnl\dxgmms2\vidsch\hwsch.cxx @ 8027] 
17 ffffcd04`6d777000 fffff807`34c991a7     dxgmms2!VidSchiSuspendResumeHwContexts+0x163 [onecoreuap\windows\core\dxkernel\dxgkrnl\dxgmms2\vidsch\hwsch.cxx @ 8213] 
18 ffffcd04`6d777130 fffff807`34d72b35     dxgmms2!VidSchSuspendResumeDevice+0x217 [onecoreuap\windows\core\dxkernel\dxgkrnl\dxgmms2\vidsch\vidsch.cxx @ 4333] 
19 (Inline Function) --------`--------     dxgmms2!VIDMM_DEVICE::SuspendSchedulerDevice+0x1a [onecoreuap\windows\core\dxkernel\dxgkrnl\dxgmms2\vidmm\core\mmdevice.cxx @ 2381] 
1a ffffcd04`6d777230 fffff807`34d72abd     dxgmms2!VIDMM_DEVICE::PartiallySuspend+0x4d [onecoreuap\windows\core\dxkernel\dxgkrnl\dxgmms2\vidmm\core\mmdevice.cxx @ 783] 
1b (Inline Function) --------`--------     dxgmms2!VIDMM_DEVICE::Suspend+0x5 [onecoreuap\windows\core\dxkernel\dxgkrnl\dxgmms2\vidmm\core\mmdevice.cxx @ 751] 
1c ffffcd04`6d777270 fffff807`34d722c2     dxgmms2!VidMmSuspendAccessToAllocation+0x99 [onecoreuap\windows\core\dxkernel\dxgkrnl\dxgmms2\vidmm\core\mmworker.cxx @ 3273] 
1d ffffcd04`6d7772b0 fffff807`34d34dcc     dxgmms2!VIDMM_GLOBAL::HandlePromotionCandidates+0x6e2 [onecoreuap\windows\core\dxkernel\dxgkrnl\dxgmms2\vidmm\core\mmmigrate.cxx @ 361] 
1e ffffcd04`6d7773c0 fffff807`9085585a     dxgmms2!VidMmWorkerThreadProc+0x46c [onecoreuap\windows\core\dxkernel\dxgkrnl\dxgmms2\vidmm\core\mmworker.cxx @ 2887] 
1f ffffcd04`6d777570 fffff807`90a7ae54     nt!PspSystemThreadStartup+0x5a [minkernel\ntos\ps\psexec.c @ 11931] 
20 ffffcd04`6d7775c0 00000000`00000000     nt!KiStartSystemThread+0x34 [minkernel\ntos\ke\amd64\threadbg.asm @ 87] 
```

In short, this is actually not a 0x9F by ACP. It is AMD GFX stuck, causing ACP PoIRP cannot continue.