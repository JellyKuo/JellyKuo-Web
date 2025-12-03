---
title: "0x9F.3 Strix Stress ACP"
meta_title: ""
description: ""
date: 2024-03-04T12:00:00Z
image: ""
categories: ["BSOD Analysis"]
author: "Nick Kuo"
tags: ["Windows", "BSOD", "0x9F"]
draft: false
---
```
6: kd> .bugcheck
Bugcheck code 0000009F
Arguments 00000000`00000003 ffff948f`e9be4060 ffffe381`3d0ef040 ffff948f`ee90eba0
```

```
6: kd> !addrMap 0xffff948f`ee90eba0
--- Direct Result (Provided address is) ---
Address 0xffff948fee90eba0 is a value withing a system stack
Found locations:
	Address:ffffe3814066f430	Thread 0xffff948ff7b59540	Thread Id: 9048	Stack Offset: 9f0
	Address:ffffe3814066f460	Thread 0xffff948ff7b59540	Thread Id: 9048	Stack Offset: a20
	Address:ffffe3814066f468	Thread 0xffff948ff7b59540	Thread Id: 9048	Stack Offset: a28
	Address:ffffe3814066f4a0	Thread 0xffff948ff7b59540	Thread Id: 9048	Stack Offset: a60
	Address:ffffe3814066f520	Thread 0xffff948ff7b59540	Thread Id: 9048	Stack Offset: ae0
```

```
6: kd> .thread 0xffff948ff7b59540
Implicit thread is now ffff948f`f7b59540
6: kd> k
  *** Stack trace for last set context - .thread/.cxr resets it
 # Child-SP          RetAddr               Call Site
00 ffffe381`4066ea80 fffff804`d1e2e6ac     nt!KiSwapContext+0x76
01 ffffe381`4066ebc0 fffff804`d1e2d8b6     nt!KiSwapThread+0x4fc
02 ffffe381`4066ec20 fffff804`d1e2ba46     nt!KiCommitThreadWait+0x346
03 ffffe381`4066ece0 fffff804`9cc5d69e     nt!KeWaitForSingleObject+0x316
04 ffffe381`4066edd0 fffff804`9cc98b02     amdacpbus2!acp_send_command+0x7a [c:\constructicon\builds\gfx\five\24.10\drivers\acp\amdacpbus2\src\acp_aaflib_wrapper.c @ 263] 
05 ffffe381`4066eeb0 fffff804`9cc9d379     amdacpbus2!send_ev_acp_pci_power_state+0x7a [c:\constructicon\builds\gfx\five\24.10\drivers\acp\aaf\aaflib\aaf_graph_load.c @ 1216] 
06 ffffe381`4066ef40 fffff804`9cc5c476     amdacpbus2!aaf_set_acp_power_state+0x15 [c:\constructicon\builds\gfx\five\24.10\drivers\acp\aaf\aaflib\aaf_lib_interface.c @ 2019] 
07 ffffe381`4066ef70 fffff804`9cc65420     amdacpbus2!AcpSetDevicePowerState+0x8a [c:\constructicon\builds\gfx\five\24.10\drivers\acp\amdacpbus2\src\acp_aaflib.c @ 1606] 
08 ffffe381`4066efc0 fffff804`9cc62d0f     amdacpbus2!AcpEnterLowPowerMode+0x1c8 [c:\constructicon\builds\gfx\five\24.10\drivers\acp\amdacpbus2\src\acp_device_utils.c @ 2111] 
09 ffffe381`4066f000 fffff804`63b3a01a     amdacpbus2!AcpEvtDeviceD0EntryPreInterruptsDisabled+0x1bb [c:\constructicon\builds\gfx\five\24.10\drivers\acp\amdacpbus2\src\acp_device.c @ 779] 
0a (Inline Function) --------`--------     Wdf01000!FxPnpDeviceD0ExitPreInterruptsDisabled::Invoke+0x2a [minkernel\wdf\framework\shared\irphandlers\pnp\pnpcallbacks.cpp @ 356] 
0b ffffe381`4066f060 fffff804`63b39f5b     Wdf01000!FxPkgPnp::PowerGotoDxIoStoppedCommon+0xa6 [minkernel\wdf\framework\shared\irphandlers\pnp\powerstatemachine.cpp @ 3023] 
0c (Inline Function) --------`--------     Wdf01000!FxPkgPnp::PowerGotoDxIoStopped+0x7 [minkernel\wdf\framework\shared\inc\private\common\FxPkgPnp.hpp @ 2958] 
0d ffffe381`4066f0d0 fffff804`63b3dcfa     Wdf01000!FxPkgPnp::PowerGotoDNotZeroIoStopped+0xb [minkernel\wdf\framework\shared\irphandlers\pnp\powerstatemachine.cpp @ 2843] 
0e ffffe381`4066f100 fffff804`63b3d9c8     Wdf01000!FxPkgPnp::PowerEnterNewState+0x152 [minkernel\wdf\framework\shared\irphandlers\pnp\powerstatemachine.cpp @ 1705] 
0f ffffe381`4066f250 fffff804`63b3b559     Wdf01000!FxPkgPnp::PowerProcessEventInner+0xe0 [minkernel\wdf\framework\shared\irphandlers\pnp\powerstatemachine.cpp @ 1617] 
10 ffffe381`4066f2d0 fffff804`63b3b364     Wdf01000!FxPkgPnp::PowerProcessEvent+0x15d [minkernel\wdf\framework\shared\irphandlers\pnp\powerstatemachine.cpp @ 1396] 
11 (Inline Function) --------`--------     Wdf01000!FxPkgFdo::LowerDevicePower+0x34 [minkernel\wdf\framework\shared\irphandlers\pnp\fdopower.cpp @ 414] 
12 ffffe381`4066f370 fffff804`63b39885     Wdf01000!FxPkgFdo::DispatchDeviceSetPower+0x7c [minkernel\wdf\framework\shared\irphandlers\pnp\fdopower.cpp @ 350] 
13 ffffe381`4066f3c0 fffff804`63b69323     Wdf01000!FxPkgFdo::_DispatchSetPower+0x25 [minkernel\wdf\framework\shared\irphandlers\pnp\fdopower.cpp @ 120] 
14 ffffe381`4066f3f0 fffff804`63b5dcb2     Wdf01000!FxPkgPnp::Dispatch+0x103 [minkernel\wdf\framework\shared\irphandlers\pnp\fxpkgpnp.cpp @ 794] 
15 (Inline Function) --------`--------     Wdf01000!DispatchWorker+0xea [minkernel\wdf\framework\shared\core\fxdevice.cpp @ 1587] 
16 (Inline Function) --------`--------     Wdf01000!FxDevice::Dispatch+0xf3 [minkernel\wdf\framework\shared\core\fxdevice.cpp @ 1601] 
17 ffffe381`4066f460 fffff804`d1eda213     Wdf01000!FxDevice::DispatchWithLock+0x232 [minkernel\wdf\framework\shared\core\fxdevice.cpp @ 1445] 
18 ffffe381`4066f4c0 fffff804`d2011eba     nt!PopIrpWorker+0x2c3
19 ffffe381`4066f570 fffff804`d225b574     nt!PspSystemThreadStartup+0x5a
1a ffffe381`4066f5c0 00000000`00000000     nt!KiStartSystemThread+0x34
```

From code, seems waiting for mutex `&pDevCtx->AcpEvCmdMutex`

```
if (pDevCtx &&
    ev_hdr)
{
    /* If ACP is already power OFF or if DSP get's exception don't send EV*/
    if ((FALSE == AcpGetActiveStatus(pDevCtx)) ||
        (pDevCtx->fwExceptionOccurred))
    {
        return status = STATUS_DEVICE_NOT_READY;
    }

    /** Get exclusive access to ACPs */
    nt_status = KeWaitForMutexObject(&pDevCtx->AcpEvCmdMutex,
        UserRequest,
        KernelMode,
        FALSE,
        NULL);
```

```
6: kd> dt amdacpbus2!AcpDeviceContext_t ffff948f`f718d2f0
...
   +0x318 AcpEvCmdMutex    : _KMUTANT
6: kd> dx -id 0,0,ffff948fe513b040 -r1 (*((amdacpbus2!_KMUTANT *)0xffff948ff718d608))
(*((amdacpbus2!_KMUTANT *)0xffff948ff718d608))                 [Type: _KMUTANT]
    [+0x000] Header           [Type: _DISPATCHER_HEADER]
    [+0x018] MutantListEntry  [Type: _LIST_ENTRY]
    [+0x028] OwnerThread      : 0xffff948ffeb54080 [Type: _KTHREAD *]
    [+0x030] MutantFlags      : 0x0 [Type: unsigned char]
    [+0x030 ( 0: 0)] Abandoned        : 0x0 [Type: unsigned char]
    [+0x030 ( 7: 1)] Spare1           : 0x0 [Type: unsigned char]
    [+0x031] ApcDisable       : 0x1 [Type: unsigned char]
```

Cross validate with !thread

```
6: kd> !thread 0xffff948ff7b59540
THREAD ffff948ff7b59540  Cid 0004.2358  Teb: 0000000000000000 Win32Thread: 0000000000000000 WAIT: (UserRequest) KernelMode Non-Alertable
    ffff948ff718d608  Mutant - owning thread ffff948ffeb54080
Not impersonating
DeviceMap                 ffffab8e778445b0
Owning Process            ffff948fe513b040       Image:         System
Attached Process          N/A            Image:         N/A
Wait Start TickCount      70905          Ticks: 6099 (0:00:01:35.296)
Context Switch Count      4              IdealProcessor: 13             
```

So far so good, continue with blocker

```
6: kd> !thread ffff948ffeb54080
THREAD ffff948ffeb54080  Cid 2b20.1f1c  Teb: 000000f3004f6000 Win32Thread: 0000000000000000 WAIT: (UserRequest) KernelMode Non-Alertable
    ffff948ff718d678  Mutant - owning thread ffff948ffa478040
IRP List:
    ffff94811fec4360: (0006,0430) Flags: 00000404  Mdl: 00000000
Not impersonating
DeviceMap                 ffffab8e7dd8caa0
Owning Process            ffff948fffcc8080       Image:         audiodg.exe
Attached Process          N/A            Image:         N/A
Wait Start TickCount      71545          Ticks: 5459 (0:00:01:25.296)
Context Switch Count      38457          IdealProcessor: 12
UserTime                  00:00:00.156
KernelTime                00:00:00.453
Win32 Start Address 0x00007ff9f6208a40
Stack Init ffffe381433f75f0 Current ffffe381433f64b0
Base ffffe381433f8000 Limit ffffe381433f1000 Call 0000000000000000
Priority 15 BasePriority 8 PriorityDecrement 0 IoPriority 2 PagePriority 5
Child-SP          RetAddr               : Args to Child                                                           : Call Site
ffffe381`433f64f0 fffff804`d1e2e6ac     : ffffd001`383c7180 00000000`00000000 00000000`00000000 ffff948f`e523d280 : nt!KiSwapContext+0x76
ffffe381`433f6630 fffff804`d1e2d8b6     : 00000000`00000000 00000000`00000000 ffff9481`09d290c0 ffffd001`383c7180 : nt!KiSwapThread+0x4fc
ffffe381`433f6690 fffff804`d1e2ba46     : 00000000`00000000 ffff9481`09d290d8 ffff948f`e4800000 00000000`00000000 : nt!KiCommitThreadWait+0x346
ffffe381`433f6750 fffff804`9cc6cb4c     : ffff948f`f718d678 fffff804`00000006 00000000`00000000 00000000`00000000 : nt!KeWaitForSingleObject+0x316
ffffe381`433f6840 fffff804`9cc5d952     : ffffe381`433f6948 ffffe381`00000000 fffff804`9cca1eb0 00000000`000005ec : amdacpbus2!AcpLogFwMessage+0x38 [c:\constructicon\builds\gfx\five\24.10\drivers\acp\amdacpbus2\src\acp_dsp_log.c @ 249]
ffffe381`433f68d0 fffff804`9cc9a05a     : 00000000`00000000 ffffe381`433f6a02 00000000`0000024e ffff948f`00000024 : amdacpbus2!acp_send_command+0x32e [c:\constructicon\builds\gfx\five\24.10\drivers\acp\amdacpbus2\src\acp_aaflib_wrapper.c @ 328]
ffffe381`433f69b0 fffff804`9cc9d58a     : ffffe381`433f6af9 fffff804`9cc87357 ffff948f`f7d68060 ffffe381`433f6ae0 : amdacpbus2!send_ev_steam_state+0x9e [c:\constructicon\builds\gfx\five\24.10\drivers\acp\aaf\aaflib\aaf_graph_load.c @ 960]
ffffe381`433f6a40 fffff804`9cc8aef9     : 00000000`67446441 fffff804`9ccaf2f8 fffff804`9ccaa5e0 ffff948f`f7d68060 : amdacpbus2!aaf_set_stream_state+0x46 [c:\constructicon\builds\gfx\five\24.10\drivers\acp\aaf\aaflib\aaf_lib_interface.c @ 1236]
ffffe381`433f6a80 fffff804`9cc7bb06     : ffff948f`fa4a4a20 00000000`00000000 ffff948f`f6e8f9d0 ffff948f`00000000 : amdacpbus2!AcpNodeSetStreamState+0x139d [c:\constructicon\builds\gfx\five\24.10\drivers\acp\amdacpbus2\src\acp_node_api.c @ 1514]
ffffe381`433f6b60 fffff804`9c049716     : ffff948f`fa4dc050 00000000`00000000 fffff804`00000000 fffff804`00000000 : amdacpbus2!AcpBusSetStreamState+0xb3e [c:\constructicon\builds\gfx\five\24.10\drivers\acp\amdacpbus2\src\acp_internal.c @ 1471]
ffffe381`433f6c40 fffff804`9c544119     : ffff948f`ef483780 00000000`00000000 00000000`00000000 ffff948f`ef483600 : RTKVHD64+0x39716
ffffe381`433f6d60 fffff804`9ca4d47a     : 00000000`00000000 ffff9481`01ffe720 ffffe381`433f6e60 00000000`00000000 : RTKVHD64+0x534119
ffffe381`433f6de0 fffff804`9ca5dbd5     : ffff9481`01ffe720 00000000`00000000 00000000`00000000 fffff804`d2a38501 : portcls!CPortPinWaveRT::DistributeDeviceState+0x8a
ffffe381`433f6ea0 fffff804`9ca55837     : ffffe381`433f7298 ffff9481`1fec4360 00000000`00000000 00000000`00000000 : portcls!CPortPinWaveRT::Close+0x575
ffffe381`433f6f70 fffff804`9caf880b     : ffff9481`1fec4360 ffffe381`433f7100 ffff948f`fa3b8050 ffff948f`fa3b81a0 : portcls!DispatchClose+0x67
ffffe381`433f6fa0 fffff804`9ca4daca     : ffff948f`ffcc8080 ffff948f`fa3b81a0 ffff948f`fa3b8050 ffff9481`1fec4360 : ks!KsDispatchIrp+0x12b
ffffe381`433f6fe0 fffff804`9c557b56     : ffff948f`fa3b8418 ffff948f`00000000 ffff9481`1fec4500 ffff948f`f6e93700 : portcls!PcDispatchIrp+0xaa
ffffe381`433f7010 fffff804`d1e294d1     : ffff9481`1fec4360 ffffe381`433f7110 ffff9481`1fec45e0 ffff948f`f0f47210 : RTKVHD64+0x547b56
ffffe381`433f7050 fffff804`d1e29513     : 00000000`00000000 00000000`00000000 fffff804`d2a38540 fffff804`d1fe23f5 : nt!IopfCallDriver+0x55
ffffe381`433f7090 fffff804`a35c146e     : ffff9481`1fec4360 ffff9481`1fec45e0 fffff804`d1fe23e0 fffff804`d1e294d1 : nt!IofCallDriver+0x13
ffffe381`433f70c0 fffff804`a35c1103     : ffff9481`09437080 ffff9481`1fec4360 00000000`00000000 00000000`00000000 : ksthunk!CKernelFilterDevice::DispatchIrp+0x17e
ffffe381`433f7120 fffff804`d1e294d1     : 00000000`00000000 fffff804`d1ef07f3 00000000`00000010 00000000`00000004 : ksthunk!CKernelFilterDevice::DispatchIrpBridge+0x13
ffffe381`433f7150 fffff804`d1e29513     : 00000000`00000000 00000000`00000000 00000000`00000000 fffff804`a35c1103 : nt!IopfCallDriver+0x55
ffffe381`433f7190 fffff804`d2411483     : ffff9481`09437080 00000000`00000000 ffff9481`1fec4360 fffff804`d1e294d1 : nt!IofCallDriver+0x13
ffffe381`433f71c0 fffff804`d241099b     : ffff9481`09437080 00000000`00000001 ffff9481`09437050 00000000`00000000 : nt!IopDeleteFile+0x133
ffffe381`433f7240 fffff804`d1e1aa05     : 00000000`00000000 ffff9481`09437050 00000000`ffffa32e ffff9481`09437080 : nt!ObpRemoveObjectRoutine+0xab
ffffe381`433f72a0 fffff804`d24373b6     : ffff9481`09437050 00000000`00000000 0000022f`5c2ec760 00000000`00000000 : nt!ObfDereferenceObjectWithTag+0xd5
ffffe381`433f72e0 fffff804`d241a525     : 00000000`00000000 00000000`0000000f 00000000`00000000 00000000`00000000 : nt!ObCloseHandleTableEntry+0x346
ffffe381`433f73f0 fffff804`d226d7d8     : ffff948f`feb54000 ffff948f`feb54080 ffff948f`feb54080 00000000`00000000 : nt!NtClose+0xf5
ffffe381`433f7460 00007ff9`f633e814     : 00000000`00000000 00000000`00000000 00000000`00000000 00000000`00000000 : nt!KiSystemServiceCopyEnd+0x28 (TrapFrame @ ffffe381`433f7460)
000000f3`006fce58 00000000`00000000     : 00000000`00000000 00000000`00000000 00000000`00000000 00000000`00000000 : 0x00007ff9`f633e814
```

Oof.. Still waiting for another mutex.

The wait time roughly matches the previous mutex, so the real blocker seems deeper within.

```
6: kd> !thread ffff948ffa478040
THREAD ffff948ffa478040  Cid 0004.0500  Teb: 0000000000000000 Win32Thread: 0000000000000000 WAIT: (DelayExecution) KernelMode Non-Alertable
    ffffffffffffffff  NotificationEvent
Not impersonating
DeviceMap                 ffffab8e778445b0
Owning Process            ffff948fe513b040       Image:         System
Attached Process          N/A            Image:         N/A
Wait Start TickCount      77004          Ticks: 0
Context Switch Count      17206          IdealProcessor: 9
UserTime                  00:00:00.000
KernelTime                00:00:00.375
Win32 Start Address nt!ExpWorkerThread (0xfffff804d2066930)
Stack Init ffffe3813e7af5f0 Current ffffe3813e7aece0
Base ffffe3813e7b0000 Limit ffffe3813e7a9000 Call 0000000000000000
Priority 12 BasePriority 12 PriorityDecrement 0 IoPriority 2 PagePriority 5
Child-SP          RetAddr               : Args to Child                                                           : Call Site
ffffe381`3e7aed20 fffff804`d1e2e6ac     : ffffd001`38324180 00000000`00000000 00000000`00000000 ffff948f`e5221280 : nt!KiSwapContext+0x76
ffffe381`3e7aee60 fffff804`d1e2d8b6     : 00000000`00000000 00000000`00000000 ffff948f`e5176b20 ffffd001`38324180 : nt!KiSwapThread+0x4fc
ffffe381`3e7aeec0 fffff804`d1e7f265     : ffffe381`00000000 ffffd001`00000000 00000000`00000000 00000000`00000000 : nt!KiCommitThreadWait+0x346
ffffe381`3e7aef80 fffff804`9cc51591     : 00000000`00000001 00000000`00000000 ffffe381`3e7af070 ffffe381`3e5ce300 : nt!KeDelayExecutionThread+0x3b5
ffffe381`3e7af020 fffff804`9cc67cc5     : 00000000`00000001 00000000`00000000 00000000`04600000 ffff948f`f0e59f00 : amdacpbus2!AcpConfigDmaChannel+0xb1 [c:\constructicon\builds\gfx\five\24.10\drivers\acp\amdacpbus2\src\acp_7_0.c @ 1201]
(Inline Function) --------`--------     : --------`-------- --------`-------- --------`-------- --------`-------- : amdacpbus2!AcpStartDma+0x69 (Inline Function @ fffff804`9cc67cc5) [c:\constructicon\builds\gfx\five\24.10\drivers\acp\amdacpbus2\src\acp_dma.c @ 62]
ffffe381`3e7af0c0 fffff804`9cc6cc10     : ffff948f`f718d678 ffff948f`00000006 00000000`00000000 ffff948f`fa478100 : amdacpbus2!AcpProcessDma+0xf5 [c:\constructicon\builds\gfx\five\24.10\drivers\acp\amdacpbus2\src\acp_dma.c @ 180]
ffffe381`3e7af240 fffff804`63b67da3     : ffff948f`00000cbd 00000000`00000000 00000000`00000d8e 00000000`00000000 : amdacpbus2!AcpLogFwMessage+0xfc [c:\constructicon\builds\gfx\five\24.10\drivers\acp\amdacpbus2\src\acp_dsp_log.c @ 285]
ffffe381`3e7af2d0 fffff804`63b67c69     : 00000000`ffffff00 ffff948f`ef4bfaf0 00000000`00000000 ffff948f`f6e9e060 : Wdf01000!FxWorkItem::WorkItemHandler+0xd7 [minkernel\wdf\framework\shared\core\fxworkitem.cpp @ 374]
ffffe381`3e7af310 fffff804`d1e273aa     : ffff948f`eae24120 00000000`00000000 ffffe381`00000000 00000000`00000000 : Wdf01000!FxWorkItem::WorkItemThunk+0x29 [minkernel\wdf\framework\shared\core\fxworkitem.cpp @ 439]
ffffe381`3e7af350 fffff804`d2066afa     : ffff948f`e5176b20 fffff804`d2bd2b00 ffff948f`e5176b20 ffff948f`eae24120 : nt!IopProcessWorkItem+0x26a
ffffe381`3e7af3d0 fffff804`d2011eba     : ffff948f`fa478040 ffff948f`fa478040 00000000`00000080 fffff804`d2066930 : nt!ExpWorkerThread+0x1ca
ffffe381`3e7af570 fffff804`d225b574     : ffffd001`3846b180 ffff948f`fa478040 fffff804`d2011e60 00000000`00000000 : nt!PspSystemThreadStartup+0x5a
ffffe381`3e7af5c0 00000000`00000000     : ffffe381`3e7b0000 ffffe381`3e7a9000 00000000`00000000 00000000`00000000 : nt!KiStartSystemThread+0x34
```
![](/images/blog/20240304-0x9f-3-stx-acp-stress/1.png)

The problem is that `TimeOut` is 0x17c4, that’s not really a long time to cause the real issue.

In ideal wait period, 0x17c4 → 6804n, 6.8ms is really short.

The mutex was acquired in `AcpLogFwMessage` of the last thread. There’s no more loops into that.