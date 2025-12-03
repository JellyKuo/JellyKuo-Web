---
title: "0x19C.50 Stx S4 Resume Video Playing"
meta_title: ""
description: ""
date: 2024-02-21T12:00:00Z
image: ""
categories: ["BSOD Analysis"]
author: "Nick Kuo"
tags: ["Windows", "BSOD", "0x19C"]
draft: false
---
```
5: kd> .bugcheck
Bugcheck code 0000019C
Arguments 00000000`00000050 ffff808e`23621380 00000000`00000000 00000000`00000000
```

```
5: kd> !thread ffff808e23621380
THREAD ffff808e23621380  Cid 06a0.086c  Teb: 000000782844a000 Win32Thread: ffff808e29cf89b0 WAIT: (Executive) KernelMode Non-Alertable
    ffff808e1e89c060  SynchronizationEvent
IRP List:
    ffff808e38366a40: (0006,0118) Flags: 00060000  Mdl: 00000000
Not impersonating
DeviceMap                 ffffb909f7465770
Owning Process            ffff808e29add140       Image:         csrss.exe
Attached Process          N/A            Image:         N/A
Wait Start TickCount      72649          Ticks: 641 (0:00:00:10.015)
Context Switch Count      1647           IdealProcessor: 12
UserTime                  00:00:00.000
KernelTime                00:00:00.250
Win32 Start Address winsrvext!PowerNotificationThread (0x00007ffce51e3950)
Stack Init ffffa58b1e9625f0 Current ffffa58b1e960ea0
Base ffffa58b1e963000 Limit ffffa58b1e95c000 Call 0000000000000000
Priority 15 BasePriority 13 PriorityDecrement 32 IoPriority 2 PagePriority 5
Child-SP          RetAddr               : Args to Child                                                           : Call Site
ffffa58b`1e960ee0 fffff802`29a6c9d5     : ffffdd80`51bd1180 00000000`00000000 ffff808e`0818d040 00000000`00000000 : nt!KiSwapContext+0x76 [minkernel\ntos\ke\amd64\ctxswap.asm @ 134]
ffffa58b`1e961020 fffff802`29a6ebb7     : 00000000`00000000 fffff802`29a69954 ffffa58b`1e961590 00000000`00000000 : nt!KiSwapThread+0xab5 [minkernel\ntos\ke\thredsup.c @ 14700]
ffffa58b`1e961170 fffff802`29a70ad6     : 00000000`00000000 00000000`00000001 00000000`00000000 00000000`00000000 : nt!KiCommitThreadWait+0x137 [minkernel\ntos\ke\waitsup.c @ 795]
ffffa58b`1e961220 fffff802`30580f55     : 00000000`00000000 ffffb909`fadeb080 ffff808e`23621380 fffff802`29a31902 : nt!KeWaitForSingleObject+0x256 [minkernel\ntos\ke\wait.c @ 867]
ffffa58b`1e9615c0 fffff802`30580ebd     : 00000000`00000001 00000000`00000000 ffff808e`0000000c 00000000`00000004 : dxgmms2!VIDMM_WORKER_THREAD::TransitionToState+0x4d [onecoreuap\windows\core\dxkernel\dxgkrnl\dxgmms2\vidmm\mmworker.cxx @ 145]
ffffa58b`1e961600 fffff802`30580e41     : ffff808e`289a2760 00000000`ffffff00 00000000`00000001 00000000`00000000 : dxgmms2!VIDMM_WORKER_THREAD::RequestWorkerThreadStatus+0x5d [onecoreuap\windows\core\dxkernel\dxgkrnl\dxgmms2\vidmm\mmworker.cxx @ 130]
ffffa58b`1e961660 fffff802`304ec339     : 00000000`00000000 00000000`00000000 00000000`00000000 00000000`00000000 : dxgmms2!VIDMM_GLOBAL::SuspendWorkerThread+0x1d [onecoreuap\windows\core\dxkernel\dxgkrnl\dxgmms2\vidmm\mmworker.cxx @ 2838]
ffffa58b`1e961690 fffff802`66648c94     : 00000000`00000000 00000000`00000000 00000000`00000000 00000000`00000000 : dxgmms2!VidMmSuspendWorkerThread+0x9 [onecoreuap\windows\core\dxkernel\dxgkrnl\inc\dxgmms.hxx @ 893]
(Inline Function) --------`--------     : --------`-------- --------`-------- --------`-------- --------`-------- : dxgkrnl!VIDMM_EXPORT::VidMmSuspendWorkerThread+0x20 (Inline Function @ fffff802`66648c94) [onecoreuap\windows\core\dxkernel\dxgkrnl\inc\mmsthunk.hxx @ 1600]
ffffa58b`1e9616c0 fffff802`66648b8a     : ffff808e`289a2760 00000000`00000000 00000000`00000001 00000000`00000000 : dxgkrnl!ADAPTER_RENDER::SuspendVidMmWorkerThread+0x48 [onecoreuap\windows\core\dxkernel\dxgkrnl\core\adapterrender.cxx @ 3076]
ffffa58b`1e961720 fffff802`66648e85     : 00000000`00000006 00000000`ffffffff 00000000`00000000 ffff808e`11e15730 : dxgkrnl!ADAPTER_RENDER::SuspendScheduler+0x4e [onecoreuap\windows\core\dxkernel\dxgkrnl\core\adapterrender.cxx @ 2980]
ffffa58b`1e961760 fffff802`6665ac7a     : ffffffff`c000000d ffffffff`c000000d ffff808e`13dea180 00000000`00000002 : dxgkrnl!ADAPTER_RENDER::FlushScheduler+0x11d [onecoreuap\windows\core\dxkernel\dxgkrnl\core\adapterrender.cxx @ 2814]
ffffa58b`1e9617e0 fffff802`6665aace     : ffffffff`c000000d ffff808e`296a2000 ffff808e`123b4001 ffff808e`13deb060 : dxgkrnl!DXGADAPTER::AcquireCoreSync+0xa2 [onecoreuap\windows\core\dxkernel\dxgkrnl\core\adapter.cxx @ 3669]
ffffa58b`1e961840 fffff802`6665945c     : ffff808e`13dea180 00000000`00000000 00000000`00000000 00000000`00000000 : dxgkrnl!DxgkAcquireAdapterCoreSync+0x62 [onecoreuap\windows\core\dxkernel\dxgkrnl\core\adapterport.cxx @ 450]
ffffa58b`1e9618c0 fffff802`664e0c9a     : ffff808e`13dea180 ffffa58b`1e961a00 ffff808e`13dea101 ffff808e`13dea180 : dxgkrnl!DpiAcquireCoreSyncAccessSafe+0xe8 [onecoreuap\windows\core\dxkernel\dxgkrnl\port\dpsup.cxx @ 241]
ffffa58b`1e961900 fffff802`666a7a9c     : ffffa58b`1e961c20 ffffa58b`1e961c20 ffff808e`13dea180 fffff802`29a65d4c : dxgkrnl!DxgkQueryConnectionChanges+0xda [onecoreuap\windows\core\dxkernel\dxgkrnl\port\dpfdo.cxx @ 17307]
ffffa58b`1e961ba0 fffff802`666a7891     : 00000002`a498b6aa ffffa58b`1e961c79 ffffa58b`1e9622b0 00000000`00000000 : dxgkrnl!DpiDxgkDdiDisplayDetectControl+0x138 [onecoreuap\windows\core\dxkernel\dxgkrnl\port\dpetw.cxx @ 757]
ffffa58b`1e961c00 fffff802`6674d0ea     : ffff808e`13dea180 ffff808e`13dea180 ffff808e`13dea180 ffff808e`114fe201 : dxgkrnl!DpiFdoInvalidateChildRelations+0x111 [onecoreuap\windows\core\dxkernel\dxgkrnl\port\dpfdo.cxx @ 10059]
ffffa58b`1e961ce0 fffff802`6663efa8     : 00000000`00000001 00000000`00000421 00000000`000000f0 00000000`00000000 : dxgkrnl!DxgkPowerOnOffMonitor+0xab16e [onecoreuap\windows\core\dxkernel\dxgkrnl\port\dpfdo.cxx @ 10688]
ffffa58b`1e961e10 fffff802`6668c08f     : ffff808e`ffffffff ffff808e`38366a40 ffff808e`296dcdf0 fffff802`29ade901 : dxgkrnl!DpiGdoDispatchInternalIoctl+0x578 [onecoreuap\windows\core\dxkernel\dxgkrnl\port\dpgdo.cxx @ 1297]
ffffa58b`1e961ec0 fffff802`29aebef5     : 00000000`c0000002 00000000`00000010 00000000`c0000002 00000000`00000010 : dxgkrnl!DpiDispatchInternalIoctl+0xff [onecoreuap\windows\core\dxkernel\dxgkrnl\port\dpport.cxx @ 2788]
(Inline Function) --------`--------     : --------`-------- --------`-------- --------`-------- --------`-------- : nt!IopfCallDriver+0x40 (Inline Function @ fffff802`29aebef5) [minkernel\ntos\io\iomgr\mp\objfre\amd64\iomgr.h @ 3709]
ffffa58b`1e961ff0 ffffed99`a3e17b50     : ffffb90a`058acb10 ffffcd7d`eb200000 ffffb90a`058acb10 ffffed99`a3e9151a : nt!IofCallDriver+0x55 [minkernel\ntos\io\iomgr\iosubs.c @ 3384]
ffffa58b`1e962030 ffffed99`a3ece640     : ffffb90a`058acb10 ffffa58b`1e962150 ffffb90a`058acb10 00000000`00000001 : win32kbase!GreDeviceIoControlImpl+0x100
ffffa58b`1e9620d0 ffffed99`a3ece3df     : ffffa58b`1e9622b0 00000000`706d7447 00000000`00000001 00000000`00000000 : win32kbase!DrvSetWddmDeviceMonitorPowerState+0x240
ffffa58b`1e962180 ffffed99`a3e8f86b     : 00000000`00000000 00000000`00000000 00000000`00000000 00000000`00000000 : win32kbase!DrvSetMonitorPowerState+0x2f
ffffa58b`1e9621b0 ffffed99`a3e8e9d6     : 00000000`00000000 ffffa58b`1e9622c9 00000000`00000004 00000000`00000001 : win32kbase!PowerOnMonitor+0x21b
ffffa58b`1e962220 ffffed99`a3e8e594     : ffff808e`38917360 ffff808e`38917360 00000000`00000001 00000000`00000001 : win32kbase!xxxUserPowerEventCalloutWorker+0x33e
ffffa58b`1e962330 ffffed99`a42053c2     : ffff808e`23621380 00000000`00000000 00000000`00000020 fffff802`29f3f6fe : win32kbase!xxxUserPowerCalloutWorker+0x264
ffffa58b`1e962400 ffffed99`a46a6ed5     : 00000000`00000000 fffff802`29c2babf 00000000`00000000 00000000`00040246 : win32kfull!NtUserUserPowerCalloutWorker+0x22
ffffa58b`1e962430 fffff802`29c2bbe8     : ffff808e`000005a2 aeb12c45`fe330000 00000000`00000000 00000000`00000000 : win32k!NtUserUserPowerCalloutWorker+0x15
ffffa58b`1e962460 00007ffc`e533c8f4     : 00007ffc`e51e39b6 00000050`000000fe 00000000`00000000 00000000`00000000 : nt!KiSystemServiceCopyEnd+0x28 (TrapFrame @ ffffa58b`1e962460) [minkernel\ntos\ke\amd64\trap.asm @ 3605]
00000078`289bf998 00007ffc`e51e39b6     : 00000050`000000fe 00000000`00000000 00000000`00000000 00000000`00000000 : win32u!NtUserUserPowerCalloutWorker+0x14
00000078`289bf9a0 00007ffc`e7f8aa65     : 00000000`00000000 00000000`0000000f 00000000`00000000 00000000`00000000 : winsrvext!PowerNotificationThread+0x66
00000078`289bf9d0 00000000`00000000     : 00000000`00000000 00000000`00000000 00000000`00000000 00000000`00000000 : ntdll!RtlUserThreadStart+0x35 [minkernel\ntdll\rtlstrt.c @ 1162]

```

`!disasm "dxgmms2!VIDMM_WORKER_THREAD::TransitionToState"`

![](/images/blog/20240221-0x19c-50-stx-s4resume-video-playing/1.png)

```
5: kd> x dxgmms2!VIDMM_WORKER_THREAD::TransitionToState
fffff802`30580f08 dxgmms2!VIDMM_WORKER_THREAD::TransitionToState (VIDMM_WORKER_THREAD_STATUS)
```

However, this should be a this call.

```
5: kd> .frame /r 4
04 ffffa58b`1e9615c0 fffff802`30580ebd     dxgmms2!VIDMM_WORKER_THREAD::TransitionToState+0x4d [onecoreuap\windows\core\dxkernel\dxgkrnl\dxgmms2\vidmm\mmworker.cxx @ 145]
rax=0000000000000000 rbx=ffffb909fadeb080 rcx=0000000000000000
rdx=0000000000000000 rsi=0000000000000001 rdi=ffffb909fadeb080
rip=fffff80230580f55 rsp=ffffa58b1e9615c0 rbp=00000000ffffff00
 r8=0000000000000000  r9=0000000000000000 r10=0000000000000000
r11=0000000000000000 r12=0000000000000000 r13=0000000000000001
r14=0000000000000009 r15=ffff808e123b4001
iopl=0         nv up di pl nz na pe nc
cs=0000  ss=0000  ds=0000  es=0000  fs=0000  gs=0000             efl=00000000
dxgmms2!VIDMM_WORKER_THREAD::TransitionToState+0x4d:
fffff802`30580f55 4883c430        add     rsp,30h
```

```
5: kd> dt dxgmms2!VIDMM_WORKER_THREAD ffffb909fadeb080
   +0x000 _VidMmGlobal     : 0xffff808e`2997a000 VIDMM_GLOBAL
   +0x008 _KernelThread    : 0xffff808e`2779a500 _KTHREAD
   +0x010 _SelectedDevice  : 0xffff808e`1e73c180 VIDMM_DEVICE
   +0x018 _CurrentStatus   : 1 ( VidMmWorkerThreadRunning )
   +0x01c _RequestStatus   : 4 ( VidMmWorkerThreadSuspendForPower )
   +0x020 _RequestStatusLock : DXGPUSHLOCKFAST
   +0x038 _WorkerThreadLock : DXGPUSHLOCKFAST
   +0x050 _ReadyPagingQueueListHead : _LIST_ENTRY [ 0xffffb909`fadeb0d0 - 0xffffb909`fadeb0d0 ]
   +0x060 _ReadyDwmCsrssPagingQueueListHead : _LIST_ENTRY [ 0xffffb909`fadeb0e0 - 0xffffb909`fadeb0e0 ]
   +0x070 _ReadySystemPagingQueueListHead : _LIST_ENTRY [ 0xffffb909`fadeb0f0 - 0xffffb909`fadeb0f0 ]
   +0x080 _SuspendedPagingQueueListHead : _LIST_ENTRY [ 0xffffb90a`04dc26b8 - 0xffffb90a`0f8bd0e0 ]
   +0x090 _PacketListLock  : DXGPUSHLOCKFAST
   +0x0a8 _NumReadyPacketsInAllPagingQueues : 7
   +0x0b0 _Events          : 0xffff808e`1e89c030 _KEVENT
   +0x0b8 _ForceBudgetRecalculation : 0
   +0x0c0 _CurrentTimeout  : _LARGE_INTEGER 0x0
   +0x0c8 _WakeReason      : 6 ( VidMmWakeReason_ResumeDevice )
   +0x0d0 _CommitTelemetry : VIDMM_COMMIT_TELEMETRY
   +0x0f0 _BeginNewPagingQueuePeriod : 1
   +0x0f8 _LastPagingQueuePeriodStart : 0n11350468750
   +0x100 _CurrentOperationUniqueness : 0x9ba8
   +0x108 _OperationStats  : VIDMM_WORKER_THREAD_OPERATION_STATS
   +0x1a0 _TelemetryPagingCosts : VIDMM_TELEMETRY_PAGING_COSTS
```

Wait for [RBX+0b0h]+30 = `ffff808e`1e89c060`, this is a SyncEvent. Aligns with !thread.

```
5: kd> !thread ffff808e`23621380
THREAD ffff808e23621380  Cid 06a0.086c  Teb: 000000782844a000 Win32Thread: ffff808e29cf89b0 WAIT: (Executive) KernelMode Non-Alertable
    ffff808e1e89c060  SynchronizationEvent
```

Problem is from the type, I don’t know what the event means. Try addressMap also no luck

Fine, use a live machine. Ba on the event to see who handled it

```
Breakpoint 1 hit
nt!KiAcquireKobjectLockSafe+0x14:
fffff805`1b8e3db4 720c            jb      nt!KiAcquireKobjectLockSafe+0x22 (fffff805`1b8e3dc2)
4: kd> k
 # Child-SP          RetAddr               Call Site
00 ffffc606`0352f230 fffff805`1b86917b     nt!KiAcquireKobjectLockSafe+0x14 [minkernel\ntos\ke\waitsup.c @ 3230] 
01 (Inline Function) --------`--------     nt!KiAcquireKobjectLock+0xd [minkernel\ntos\ke\waitsup.c @ 3266] 
02 ffffc606`0352f260 fffff805`1aac6750     nt!KeSetEvent+0x6b [minkernel\ntos\ke\eventobj.c @ 412] 
03 (Inline Function) --------`--------     dxgmms2!VIDMM_WORKER_THREAD::SetWorkerThreadStatus+0x1f [onecoreuap\windows\core\dxkernel\dxgkrnl\dxgmms2\vidmm\mmworker.cxx @ 175] 
04 ffffc606`0352f2f0 fffff805`1aac4a59     dxgmms2!VIDMM_WORKER_THREAD::Run+0x1ce0 [onecoreuap\windows\core\dxkernel\dxgkrnl\dxgmms2\vidmm\mmworker.cxx @ 1975] 
05 ffffc606`0352f540 fffff805`1b907167     dxgmms2!VidMmWorkerThreadProc+0x9 [onecoreuap\windows\core\dxkernel\dxgkrnl\dxgmms2\vidmm\mmworker.cxx @ 52] 
06 ffffc606`0352f570 fffff805`1ba1bb94     nt!PspSystemThreadStartup+0x57 [minkernel\ntos\ps\psexec.c @ 10885] 
07 ffffc606`0352f5c0 00000000`00000000     nt!KiStartSystemThread+0x34 [minkernel\ntos\ke\amd64\threadbg.asm @ 83]
```

So my guess is: The SetWorkerThreadStatus function just sets the status to X (parameter 1 VIDMM_WORKER_THREAD_STATUS), then it waits on this event. This event is signaled every time the worker thread finishes a loop and updates stuff.

Judging from Cpp class name, there should be a kernel address in the class to identify the thread (hopefully). And there is (checked with live as well)

```
5: kd> dt dxgmms2!VIDMM_WORKER_THREAD ffffb909fadeb080
   +0x000 _VidMmGlobal     : 0xffff808e`2997a000 VIDMM_GLOBAL
   +0x008 _KernelThread    : 0xffff808e`2779a500 _KTHREAD
   +0x010 _SelectedDevice  : 0xffff808e`1e73c180 VIDMM_DEVICE
   +0x018 _CurrentStatus   : 1 ( VidMmWorkerThreadRunning )
   +0x01c _RequestStatus   : 4 ( VidMmWorkerThreadSuspendForPower )
   +0x020 _RequestStatusLock : DXGPUSHLOCKFAST
   +0x038 _WorkerThreadLock : DXGPUSHLOCKFAST
   +0x050 _ReadyPagingQueueListHead : _LIST_ENTRY [ 0xffffb909`fadeb0d0 - 0xffffb909`fadeb0d0 ]
   +0x060 _ReadyDwmCsrssPagingQueueListHead : _LIST_ENTRY [ 0xffffb909`fadeb0e0 - 0xffffb909`fadeb0e0 ]
   +0x070 _ReadySystemPagingQueueListHead : _LIST_ENTRY [ 0xffffb909`fadeb0f0 - 0xffffb909`fadeb0f0 ]
   +0x080 _SuspendedPagingQueueListHead : _LIST_ENTRY [ 0xffffb90a`04dc26b8 - 0xffffb90a`0f8bd0e0 ]
   +0x090 _PacketListLock  : DXGPUSHLOCKFAST
   +0x0a8 _NumReadyPacketsInAllPagingQueues : 7
   +0x0b0 _Events          : 0xffff808e`1e89c030 _KEVENT
   +0x0b8 _ForceBudgetRecalculation : 0
   +0x0c0 _CurrentTimeout  : _LARGE_INTEGER 0x0
   +0x0c8 _WakeReason      : 6 ( VidMmWakeReason_ResumeDevice )
   +0x0d0 _CommitTelemetry : VIDMM_COMMIT_TELEMETRY
   +0x0f0 _BeginNewPagingQueuePeriod : 1
   +0x0f8 _LastPagingQueuePeriodStart : 0n11350468750
   +0x100 _CurrentOperationUniqueness : 0x9ba8
   +0x108 _OperationStats  : VIDMM_WORKER_THREAD_OPERATION_STATS
   +0x1a0 _TelemetryPagingCosts : VIDMM_TELEMETRY_PAGING_COSTS
```

It is actually thread `0xffff808e`2779a500` that is responsible for running the work, and signals the event.

```
5: kd> !thread 0xffff808e`2779a500
THREAD ffff808e2779a500  Cid 0004.065c  Teb: 0000000000000000 Win32Thread: 0000000000000000 WAIT: (Executive) KernelMode Non-Alertable
    ffffa58b1e5061c0  SynchronizationEvent
Not impersonating
DeviceMap                 ffffb909f7465770
Owning Process            ffff808e081a7040       Image:         System
Attached Process          N/A            Image:         N/A
Wait Start TickCount      73290          Ticks: 0
Context Switch Count      35270          IdealProcessor: 13
UserTime                  00:00:00.000
KernelTime                00:00:08.718
Win32 Start Address dxgmms2!VidMmWorkerThreadProc (0xfffff80230584a50)
Stack Init ffffa58b1e5075f0 Current ffffa58b1e505a70
Base ffffa58b1e508000 Limit ffffa58b1e501000 Call 0000000000000000
Priority 15 BasePriority 15 PriorityDecrement 0 IoPriority 2 PagePriority 5
Child-SP          RetAddr               : Args to Child                                                           : Call Site
ffffa58b`1e505ab0 fffff802`29a6c9d5     : ffffdd80`51bd1180 00000000`00000000 ffff808e`0818d040 00000000`00000000 : nt!KiSwapContext+0x76 [minkernel\ntos\ke\amd64\ctxswap.asm @ 134]
ffffa58b`1e505bf0 fffff802`29a6ebb7     : ffff808e`2779a500 00000000`00000000 00000000`00000000 00000000`00000000 : nt!KiSwapThread+0xab5 [minkernel\ntos\ke\thredsup.c @ 14700]
ffffa58b`1e505d40 fffff802`29a70ad6     : 00000000`00000000 00000000`00000001 00000000`000000a4 00000001`93a58bda : nt!KiCommitThreadWait+0x137 [minkernel\ntos\ke\waitsup.c @ 795]
ffffa58b`1e505df0 fffff802`82fd34ab     : 00000002`af720bf3 ffff808e`121d9e20 fffff802`29bc4ef0 fffff802`29a0f018 : nt!KeWaitForSingleObject+0x256 [minkernel\ntos\ke\wait.c @ 867]
ffffa58b`1e506190 fffff802`82ff0a87     : 00000000`000003de ffffffff`ffffd8f0 00000000`0000000a ffffdd80`51bd1180 : amdkmdag!nsGS::IWrapperOsKrnl::DelayInMilliSecond+0x4b [c:\constructicon\builds\gfx\one\23.40\drivers\kgd\gmx\layers\gs\src\os\IWrapperOsKrnl.cpp @ 171]
ffffa58b`1e5061f0 fffff802`830e2917     : 00000000`00f80001 fffffb00`ba436000 00000000`00000000 fffff802`84126201 : amdkmdag!nsGS::CS_OsKernel::Wait+0x1c7 [c:\constructicon\builds\gfx\one\23.40\drivers\kgd\gmx\layers\gs\src\os\CS_OsKrnl.cpp @ 356]
ffffa58b`1e5062a0 fffff802`830bb746     : 0000001f`ffffffff ffff808e`185fbe00 ffff808e`1e66c240 fffff802`82fcfefe : amdkmdag!nsHW::CS_Tlb_MmHub_3_3_0::InvalidateViaCpu+0xf7 [c:\constructicon\builds\gfx\one\23.40\drivers\kgd\gmx\layers\hw\src\memory\CS_Tlb_MmHub_3_3_0.cpp @ 416]
ffffa58b`1e506300 fffff802`830bb684     : 00000000`00cf0000 00000000`00000cf0 ffff808e`19271030 00000000`00000000 : amdkmdag!nsHW::CO_GartInvalidate::InvalidateGartViaCpu+0x96 [c:\constructicon\builds\gfx\one\23.40\drivers\kgd\gmx\layers\hw\src\env\CO_GartInvalidate.cpp @ 221]
ffffa58b`1e506350 fffff802`82ffb77e     : ffff808e`12120590 00000000`00000001 00000000`00000000 00000000`00000000 : amdkmdag!nsHW::CO_GartInvalidate::InvalidateGart+0x174 [c:\constructicon\builds\gfx\one\23.40\drivers\kgd\gmx\layers\hw\src\env\CO_GartInvalidate.cpp @ 196]
ffffa58b`1e506420 fffff802`83002623     : 00000000`00000001 ffffa58b`1e506d70 00000000`00000000 ffff808e`00000000 : amdkmdag!nsHW::CO_TtlMgr::MapToGart+0x14e [c:\constructicon\builds\gfx\one\23.40\drivers\kgd\gmx\layers\hw\src\components\CO_TtlMgr.cpp @ 1868]
ffffa58b`1e506490 fffff802`83004bfa     : 00000000`00000001 00000000`00000000 ffffdd80`51738180 fffff802`8302bedc : amdkmdag!nsSVC::CS_PageTableActions::MapAperture+0x83 [c:\constructicon\builds\gfx\one\23.40\drivers\kgd\gmx\layers\svc\src\vmPaging\CS_PageTableActions.cpp @ 1785]
ffffa58b`1e5064e0 fffff802`8302b200     : 00000000`00000000 ffffa58b`1e506d70 00000000`00000000 00000000`00000000 : amdkmdag!nsSVC::CS_VmPaging::MapAperture+0x5a [c:\constructicon\builds\gfx\one\23.40\drivers\kgd\gmx\layers\svc\src\vmPaging\CS_VmPaging.cpp @ 995]
ffffa58b`1e506530 fffff802`8302ae17     : 00000000`00000000 ffff808e`12577168 ffffa58b`1e506d70 00000000`00000000 : amdkmdag!nsUSR::CS_OsPagingContext::BuildPagingBuffer_MapAperatureSegment2+0x170 [c:\constructicon\builds\gfx\one\23.40\drivers\kgd\gmx\layers\usr\src\privateFeatures\osFeatures\CS_OsPagingContext.cpp @ 900]
ffffa58b`1e5065b0 fffff802`83120ad3     : 00000000`00000001 fffff802`82fcb8f4 00000001`ffffffff fffff802`29a99cb5 : amdkmdag!nsUSR::CS_OsPagingContext::BuildPagingBuffer+0x167 [c:\constructicon\builds\gfx\one\23.40\drivers\kgd\gmx\layers\usr\src\privateFeatures\osFeatures\CS_OsPagingContext.cpp @ 1236]
ffffa58b`1e5065e0 fffff802`82fc4495     : fffffb00`ba436000 00000000`c0000001 00000001`00000000 ffff808e`33f95000 : amdkmdag!nsUSR::CO_PvtPagingContext::BuildPagingBuffer+0xd3 [c:\constructicon\builds\gfx\one\23.40\drivers\kgd\gmx\layers\usr\src\privateFeatures\CO_PvtPagingContext.cpp @ 262]
ffffa58b`1e506620 fffff802`82cbcae8     : 00000000`00000000 ffff808e`33f95000 ffffa58b`1e506d70 00000000`00000000 : amdkmdag!CO_Dispatcher::DdiBuildPagingBuffer+0x25 [c:\constructicon\builds\gfx\one\23.40\drivers\kgd\gmx\layers\CO_Dispatcher.cpp @ 813]
ffffa58b`1e506650 fffff802`82ab36a5     : 00000000`00000000 ffffa58b`1e5067b0 ffffb909`fa398e10 ffff808e`212fa300 : amdkmdag!CAtl::AtlBuildPagingBuffer+0x1e8 [c:\constructicon\builds\gfx\one\23.40\drivers\kmd\atl\atl.cpp @ 2569]
ffffa58b`1e5066b0 fffff802`82b7a088     : ffffa58b`1e506da0 ffff808e`1238a030 ffff808e`1238a030 fffff802`82b7a837 : amdkmdag!Dispatch_BuildPagingBuffer+0x135 [c:\constructicon\builds\gfx\one\23.40\drivers\kmd\src\dispatcher_interfaces.cpp @ 1478]
ffffa58b`1e506b90 fffff802`66672181     : ffff808e`212f9e00 ffff808e`1907b180 00000000`00000000 ffff808e`2997a000 : amdkmdag!ProxyBuildPagingBuffer_WDDM20+0x128 [c:\constructicon\builds\gfx\one\23.40\drivers\pxproxy\kmd\ddi.cpp @ 3733]
ffffa58b`1e506be0 fffff802`664cf6a9     : fffffb76`c0000000 fffffb76`bfa80ff8 ffffb90a`0cb48ec8 ffffa58b`1e506e20 : dxgkrnl!ADAPTER_RENDER::DdiBuildPagingBuffer+0x101 [onecoreuap\windows\core\dxkernel\dxgkrnl\core\adapterddi.cxx @ 2000]
ffffa58b`1e506cc0 fffff802`304d29a3     : ffffb90a`0cb48da0 fffffb7d`bedf6ed0 00000000`00000009 fffff802`29abc380 : dxgkrnl!ADAPTER_RENDER_DdiBuildPagingBuffer+0x9 [onecoreuap\windows\core\dxkernel\dxgkrnl\core\corethnk.cxx @ 1204]
ffffa58b`1e506cf0 fffff802`30581e69     : ffffb90a`0cb48ec8 ffffa58b`1e506e20 ffff808e`2997a000 ffffb90a`0cb48da0 : dxgmms2!ADAPTER_RENDER::DdiBuildPagingBuffer+0x17 [onecoreuap\windows\core\dxkernel\dxgkrnl\inc\dxgmms.hxx @ 239]
ffffa58b`1e506d20 fffff802`30581caa     : 00000000`00000cf0 00000000`00000000 ffffb90a`00000000 00000000`00000003 : dxgmms2!VIDMM_GLOBAL::MapVideoApertureSegmentInternal+0x16d [onecoreuap\windows\core\dxkernel\dxgkrnl\dxgmms2\vidmm\mmglobal.cxx @ 17637]
(Inline Function) --------`--------     : --------`-------- --------`-------- --------`-------- --------`-------- : dxgmms2!VIDMM_GLOBAL::MapVideoApertureSegment+0x3c (Inline Function @ fffff802`30581caa) [onecoreuap\windows\core\dxkernel\dxgkrnl\dxgmms2\vidmm\mmglobal.cxx @ 17477]
ffffa58b`1e506ef0 fffff802`30582117     : 00000000`00000000 ffffb90a`0cb48da0 ffffb90a`0cb48da0 ffffb90a`0cb48da0 : dxgmms2!VIDMM_APERTURE_SEGMENT::MapApertureRange+0x7a [onecoreuap\windows\core\dxkernel\dxgkrnl\dxgmms2\vidmm\mmappseg.cxx @ 2210]
ffffa58b`1e506f50 fffff802`305689be     : ffffb90a`0cb48de4 00000000`00000000 ffffb90a`0cb48de4 ffffb90a`0cb48de4 : dxgmms2!VIDMM_APERTURE_SEGMENT::CommitResource+0x237 [onecoreuap\windows\core\dxkernel\dxgkrnl\dxgmms2\vidmm\mmappseg.cxx @ 589]
ffffa58b`1e507020 fffff802`305548fb     : ffff808e`2d8ee0f0 ffff808e`2da0df10 00000000`00000000 ffff808e`1e73c180 : dxgmms2!VIDMM_GLOBAL::PageInOneAllocation+0x29e [onecoreuap\windows\core\dxkernel\dxgkrnl\dxgmms2\vidmm\mmglobal.cxx @ 18134]
ffffa58b`1e507150 fffff802`3056f822     : ffff808e`38312b10 00000000`00000001 ffff808e`1e73c180 00000000`00000000 : dxgmms2!VIDMM_GLOBAL::PageInFaultedAllocation+0xbb [onecoreuap\windows\core\dxkernel\dxgkrnl\dxgmms2\vidmm\mmglobal.cxx @ 18642]
ffffa58b`1e5071b0 fffff802`3056f8ec     : ffff808e`2997a000 ffffa58b`1e507341 ffff808e`1e73c101 ffffa58b`1e507341 : dxgmms2!VIDMM_GLOBAL::PageInDeviceInternal+0x19a [onecoreuap\windows\core\dxkernel\dxgkrnl\dxgmms2\vidmm\mmglobal.cxx @ 18848]
ffffa58b`1e507240 fffff802`3056fb1b     : ffffa58b`1e507368 00000000`00000000 ffff808e`1e73c180 fffff802`304e83ac : dxgmms2!VIDMM_GLOBAL::TryPageInDevice+0x50 [onecoreuap\windows\core\dxkernel\dxgkrnl\dxgmms2\vidmm\mmglobal.cxx @ 18592]
ffffa58b`1e507280 fffff802`3058699a     : fffff802`305276f4 ffffa58b`1e5073f0 00000000`00000000 ffffb909`fadeb080 : dxgmms2!VIDMM_DEVICE::Resume+0x87 [onecoreuap\windows\core\dxkernel\dxgkrnl\dxgmms2\vidmm\mmdevice.cxx @ 1034]
ffffa58b`1e5072f0 fffff802`30584a59     : ffffb909`fadeb080 ffff808e`0818d001 ffff808e`2779a501 ffff808e`00000001 : dxgmms2!VIDMM_WORKER_THREAD::Run+0x1f2a [onecoreuap\windows\core\dxkernel\dxgkrnl\dxgmms2\vidmm\mmworker.cxx @ 2150]
ffffa58b`1e507540 fffff802`29b07167     : ffff808e`2779a500 fffff802`30584a50 ffffb909`fadeb080 005fe07f`b8bbbdff : dxgmms2!VidMmWorkerThreadProc+0x9 [onecoreuap\windows\core\dxkernel\dxgkrnl\dxgmms2\vidmm\mmworker.cxx @ 52]
ffffa58b`1e507570 fffff802`29c1bb94     : ffffdd80`51bd1180 ffff808e`2779a500 fffff802`29b07110 00000000`00000000 : nt!PspSystemThreadStartup+0x57 [minkernel\ntos\ps\psexec.c @ 10885]
ffffa58b`1e5075c0 00000000`00000000     : ffffa58b`1e508000 ffffa58b`1e501000 00000000`00000000 00000000`00000000 : nt!KiStartSystemThread+0x34 [minkernel\ntos\ke\amd64\threadbg.asm @ 83]

```

We’re back on the chopping block.

The mission I received is to diagnose if this is a same failure as another dump. I will stop here and check out the other dump first. `MEMORY_20240129_164438.dmp`