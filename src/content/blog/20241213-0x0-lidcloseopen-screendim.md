---
title: "0x0 Live Lid Close Open Screen Dim"
meta_title: ""
description: ""
date: 2024-12-13T12:00:00Z
image: ""
categories: ["BSOD Analysis"]
author: "Nick Kuo"
tags: ["Windows", "BSOD", "Live"]
draft: false
---
# Symptom

The display dims automatically 5s after lid close → open. Issue occurs only on SKUs with ToF sensor (HPD).

# Display

Connect a live system to debug, break at `amdkmdag!ProxyBrightness3SetBrightness` . Capture the following stack:

```
00 ffffbd07`fabef5d8 fffff802`7210f66d     : ffff810a`0cf88020 00000000`00000000 00000000`00000000 00000000`00000000 : amdkmdag!dal3::WindowsDM::setBrightness [c:\constructicon\builds\gfx\one\23.20\drivers\dal\windows_dm\dal3\WindowsDMBrightness.cpp @ 419] 
01 ffffbd07`fabef5e0 fffff802`7212e497     : ffffbd07`fabef6a0 00000000`00000100 ffffbd07`fabef6a0 ffff8109`fe10b9d0 : amdkmdag!DisplayManager2::SetBrightness_v3+0xcd [c:\constructicon\builds\gfx\one\23.20\drivers\kmd\src\dmm_DisplayManager2.cpp @ 6045] 
02 ffffbd07`fabef640 fffff802`71fbaeda     : ffff8109`fe302000 ffffa90a`06ad8570 ffffa90a`06ad8570 ffff8109`fe3573c8 : amdkmdag!FeatureMgr::DdiSetBrightness_v3+0x47 [c:\constructicon\builds\gfx\one\23.20\drivers\kmd\features\FeatureMgr.cpp @ 7939] 
03 ffffbd07`fabef670 fffff802`720c55c3     : 00000000`c0000002 ffff8109`fe1d5d50 ffff8109`fe356180 ffffa90a`06ad8570 : amdkmdag!Dispatch_SetBrightness_v3+0x6a [c:\constructicon\builds\gfx\one\23.20\drivers\kmd\src\dispatcher_interfaces.cpp @ 5794] 
04 ffffbd07`fabef6a0 fffff802`5a114b40     : 00000000`00000000 ffff8109`fe356180 ffff8109`fe3572b8 ffff8109`fe356180 : amdkmdag!ProxyBrightness3SetBrightness+0x53 [c:\constructicon\builds\gfx\one\23.20\drivers\pxproxy\kmd\pinterfaceddi.cpp @ 480] 
05 ffffbd07`fabef6d0 fffff802`5a1153c5     : ffff810a`150ed8c0 ffffbd07`fabef7c9 00000000`00000100 ffff810a`110f5c80 : dxgkrnl!DpiBrightness3Set+0xb0 [onecoreuap\windows\core\dxkernel\dxgkrnl\port\dpbright.cxx @ 400] 
06 ffffbd07`fabef720 fffff802`59fded7b     : 00000000`0000f9b0 ffffbd07`fabef8d1 00000000`00000000 00000000`00000070 : dxgkrnl!DpiBrightnessHandleIoctls+0x3e1 [onecoreuap\windows\core\dxkernel\dxgkrnl\port\dpbright.cxx @ 1691] 
07 ffffbd07`fabef810 fffff802`59f57b69     : ffff810a`00000020 00000000`00000000 ffff810a`0b122850 00000000`00000000 : dxgkrnl!DpiPdoDispatchIoctl+0xb661b [onecoreuap\windows\core\dxkernel\dxgkrnl\port\dppdo.cxx @ 1047] 
08 ffffbd07`fabef890 fffff802`564ec0a5     : ffff810a`0dbc4000 00000000`ffffffff ffff810a`05fc0b20 00000000`00000020 : dxgkrnl!DpiDispatchIoctl+0xd9 [onecoreuap\windows\core\dxkernel\dxgkrnl\port\dpport.cxx @ 2925] 
09 (Inline Function) --------`--------     : --------`-------- --------`-------- --------`-------- --------`-------- : nt!IopfCallDriver+0x40 (Inline Function @ fffff802`564ec0a5) [minkernel\ntos\io\iomgr\mp\objfre\amd64\iomgr.h @ 3709] 
0a ffffbd07`fabef9b0 fffff802`58241342     : 00000000`00000000 00000000`00000020 ffff810a`09720e10 ffffbd07`fabefc38 : nt!IofCallDriver+0x55 [minkernel\ntos\io\iomgr\iosubs.c @ 3384] 
0b ffffbd07`fabef9f0 fffff802`582410da     : ffff8109`f57a2010 00000000`00000007 ffff810a`05fc0b20 ffff810a`05fc0c38 : ACPI!ACPIIrpDispatchDeviceControl+0xb2
0c ffffbd07`fabefa30 fffff802`564ec0a5     : 00000000`00000007 ffff810a`09720e10 00000000`00000020 ffffbd07`fabefc38 : ACPI!ACPIDispatchIrp+0xca
0d (Inline Function) --------`--------     : --------`-------- --------`-------- --------`-------- --------`-------- : nt!IopfCallDriver+0x40 (Inline Function @ fffff802`564ec0a5) [minkernel\ntos\io\iomgr\mp\objfre\amd64\iomgr.h @ 3709] 
0e ffffbd07`fabefab0 fffff802`807d4bd4     : ffff810a`0223b020 fffff802`5647e4ac ffff810a`00000000 ffffbd07`fabefc49 : nt!IofCallDriver+0x55 [minkernel\ntos\io\iomgr\iosubs.c @ 3384] 
0f ffffbd07`fabefaf0 fffff802`807d73d1     : ffffbd07`fabefc38 ffffbd07`fabefc38 00007ef5`fddc4fd8 ffffbd07`fabefc60 : monitor!CallNextLowerDriver+0x104
10 ffffbd07`fabefb80 fffff802`807d42e6     : 00007ef5`fddc4fd8 ffff810a`0223b310 00000000`00000000 ffffbd07`fabefc60 : monitor!IoctlSetBrightness+0x81
11 ffffbd07`fabefbd0 fffff802`807d2534     : 00000000`002324d7 ffffbd07`fabefc61 00000000`00000000 00000000`00000014 : monitor!SetNitsBrightness+0x76
12 ffffbd07`fabefc00 fffff802`58106fa2     : ffff810a`05920dd0 00007ef5`fde23b58 00000000`00000000 ffff810a`05920bf0 : monitor!EvtIoInternalDeviceControl+0x3484
13 ffffbd07`fabefcc0 fffff802`58105303     : ffffa90a`06361e00 ffff810a`021dc4a0 00000000`0000000f ffff810a`02f22df0 : Wdf01000!FxIoQueueIoInternalDeviceControl::Invoke+0x56 [minkernel\wdf\framework\shared\inc\private\common\FxIoQueueCallbacks.hpp @ 267] 
14 ffffbd07`fabefd00 fffff802`58104f06     : 00000000`00000020 00000000`00000000 ffff810a`02f22df0 ffff810a`05920bf0 : Wdf01000!FxIoQueue::DispatchRequestToDriver+0x213 [minkernel\wdf\framework\shared\irphandlers\io\fxioqueue.cpp @ 3350] 
15 ffffbd07`fabefd70 fffff802`58104817     : 00000000`00000600 ffff810a`00000000 00000000`00000000 ffff810a`05920bf0 : Wdf01000!FxIoQueue::DispatchEvents+0x216 [minkernel\wdf\framework\shared\irphandlers\io\fxioqueue.cpp @ 3125] 
16 (Inline Function) --------`--------     : --------`-------- --------`-------- --------`-------- --------`-------- : Wdf01000!FxIoQueue::QueueRequest+0x95 (Inline Function @ fffff802`58104817) [minkernel\wdf\framework\shared\irphandlers\io\fxioqueue.cpp @ 2367] 
17 (Inline Function) --------`--------     : --------`-------- --------`-------- --------`-------- --------`-------- : Wdf01000!FxPkgIo::DispatchStep2+0x4bc (Inline Function @ fffff802`58104817) [minkernel\wdf\framework\shared\irphandlers\io\fxpkgio.cpp @ 469] 
18 ffffbd07`fabefdf0 fffff802`581042ce     : ffffbd07`fabf0100 ffff810a`0bae5b00 ffff8109`f78e8d01 ffff810a`021dc4a0 : Wdf01000!FxPkgIo::DispatchStep1+0x537 [minkernel\wdf\framework\shared\irphandlers\io\fxpkgio.cpp @ 324] 
19 ffffbd07`fabefec0 fffff802`58107b40     : ffff810a`0bae5b60 00000000`00000000 00000000`00000014 ffffbd07`fabf0170 : Wdf01000!FxPkgIo::Dispatch+0x5e [minkernel\wdf\framework\shared\irphandlers\io\fxpkgio.cpp @ 119] 
1a (Inline Function) --------`--------     : --------`-------- --------`-------- --------`-------- --------`-------- : Wdf01000!DispatchWorker+0x2d (Inline Function @ fffff802`58107b40) [minkernel\wdf\framework\shared\core\fxdevice.cpp @ 1587] 
1b (Inline Function) --------`--------     : --------`-------- --------`-------- --------`-------- --------`-------- : Wdf01000!FxDevice::Dispatch+0x3c (Inline Function @ fffff802`58107b40) [minkernel\wdf\framework\shared\core\fxdevice.cpp @ 1601] 
1c ffffbd07`fabeff20 fffff802`564ec0a5     : 00000000`c0000002 ffff810a`0bae5b60 ffff8109`f78e8d50 00000000`00000014 : Wdf01000!FxDevice::DispatchWithLock+0x80 [minkernel\wdf\framework\shared\core\fxdevice.cpp @ 1445] 
1d (Inline Function) --------`--------     : --------`-------- --------`-------- --------`-------- --------`-------- : nt!IopfCallDriver+0x40 (Inline Function @ fffff802`564ec0a5) [minkernel\ntos\io\iomgr\mp\objfre\amd64\iomgr.h @ 3709] 
1e ffffbd07`fabeff70 ffff911a`1d227b70     : ffffffff`ffffffff ffff810a`0dbc4000 ffffbd07`fabf0000 00000000`00000000 : nt!IofCallDriver+0x55 [minkernel\ntos\io\iomgr\iosubs.c @ 3384] 
1f ffffbd07`fabeffb0 ffff911a`1d21eaf3     : ffff8109`f78e8d50 ffffbd07`fabf00d9 00000000`00000000 ffff8109`fddfebf0 : win32kbase!GreDeviceIoControlImpl+0x100
20 ffffbd07`fabf0050 ffff911a`1d33de9a     : ffff810a`0f296000 00000000`00000000 ffff810a`0f296c34 00000000`00000000 : win32kbase!DrvSetMonitorsDimState+0x127
21 ffffbd07`fabf0140 ffff911a`1d2eef4f     : ffff810a`15749d90 00000000`00000007 00000000`00000000 00000000`00000000 : win32kbase!PowerDimMonitor+0x146
22 ffffbd07`fabf0220 ffff911a`1d21bdc4     : ffff810a`15749d60 ffff810a`15749d60 00000000`00000001 00000000`00000001 : win32kbase!xxxUserPowerEventCalloutWorker+0xd3087
23 ffffbd07`fabf0330 ffff911a`1d625302     : ffff810a`0b4e12c0 00000000`00000000 00000000`00000020 fffff802`5693f5de : win32kbase!xxxUserPowerCalloutWorker+0x264
24 ffffbd07`fabf0400 ffff911a`1def6ed5     : 00000000`00000000 00000000`00050213 00000000`00000000 00000000`00000018 : win32kfull!NtUserUserPowerCalloutWorker+0x22
25 ffffbd07`fabf0430 fffff802`5662bbe8     : ffff810a`000005a2 a10ea25e`b6d60000 00000000`00000000 00000000`00000000 : win32k!NtUserUserPowerCalloutWorker+0x15
26 ffffbd07`fabf0460 00007ffd`7ba0c8f4     : 00007ffd`7b2a39b6 00000050`000000fe 00000000`00000000 00000000`00000800 : nt!KiSystemServiceCopyEnd+0x28 (TrapFrame @ ffffbd07`fabf0460) [minkernel\ntos\ke\amd64\trap.asm @ 3605] 
27 000000f7`a713f9e8 00007ffd`7b2a39b6     : 00000050`000000fe 00000000`00000000 00000000`00000800 80000000`00000800 : win32u!NtUserUserPowerCalloutWorker+0x14
28 000000f7`a713f9f0 00007ffd`7e04aa65     : 00000000`00000000 00000000`0000000f 00000000`00000000 00000000`00000000 : winsrvext!PowerNotificationThread+0x66
29 000000f7`a713fa20 00000000`00000000     : 00000000`00000000 00000000`00000000 00000000`00000000 00000000`00000000 : ntdll!RtlUserThreadStart+0x35
```

<aside>
ℹ️ You may need to run `!gflag +ksl`  and `.reload` to load user mode symbol.

</aside>

Our display driver just received a command to turn the brightness down. So our GFX driver is working fine.

Let’s try to find who has requested this brightness dim.

From the other end of the stack, it ends with 

```
21 ffffbd07`fabf0140 ffff911a`1d2eef4f     : ffff810a`15749d90 00000000`00000007 00000000`00000000 00000000`00000000 : win32kbase!PowerDimMonitor+0x146
22 ffffbd07`fabf0220 ffff911a`1d21bdc4     : ffff810a`15749d60 ffff810a`15749d60 00000000`00000001 00000000`00000001 : win32kbase!xxxUserPowerEventCalloutWorker+0xd3087
23 ffffbd07`fabf0330 ffff911a`1d625302     : ffff810a`0b4e12c0 00000000`00000000 00000000`00000020 fffff802`5693f5de : win32kbase!xxxUserPowerCalloutWorker+0x264
24 ffffbd07`fabf0400 ffff911a`1def6ed5     : 00000000`00000000 00000000`00050213 00000000`00000000 00000000`00000018 : win32kfull!NtUserUserPowerCalloutWorker+0x22
25 ffffbd07`fabf0430 fffff802`5662bbe8     : ffff810a`000005a2 a10ea25e`b6d60000 00000000`00000000 00000000`00000000 : win32k!NtUserUserPowerCalloutWorker+0x15
26 ffffbd07`fabf0460 00007ffd`7ba0c8f4     : 00007ffd`7b2a39b6 00000050`000000fe 00000000`00000000 00000000`00000800 : nt!KiSystemServiceCopyEnd+0x28 (TrapFrame @ ffffbd07`fabf0460) [minkernel\ntos\ke\amd64\trap.asm @ 3605] 
27 000000f7`a713f9e8 00007ffd`7b2a39b6     : 00000050`000000fe 00000000`00000000 00000000`00000800 80000000`00000800 : win32u!NtUserUserPowerCalloutWorker+0x14
28 000000f7`a713f9f0 00007ffd`7e04aa65     : 00000000`00000000 00000000`0000000f 00000000`00000000 00000000`00000000 : winsrvext!PowerNotificationThread+0x66
29 000000f7`a713fa20 00000000`00000000     : 00000000`00000000 00000000`00000000 00000000`00000000 00000000`00000000 : ntdll!RtlUserThreadStart+0x35
```

So it’s win32k sending the dim, but why did it do that? 

Judging from the name, PowerNotificationThread, this may just be a worker thread that process power request based on external notification source. Start from here and disassemble it

![](/images/blog/20241213-0x0-lidcloseopen-screendim/1.png)

Looks simple,it waits on a object, when the object is signaled, it calls `winsrvext!HandlePowerCallout` . So it is a worker thread.

The object in question is `winsrvext!ghPowerRequestEvent` . This is a handle, so we need to find the actual kernel object behind it.

![](/images/blog/20241213-0x0-lidcloseopen-screendim/2.png)

Use !handle to look up the handle table. The object is actually ffffb68705cc9260

![](/images/blog/20241213-0x0-lidcloseopen-screendim/3.png)

The object is a KEVENT, and it is raised here:

```
15: kd> k
 # Child-SP          RetAddr               Call Site
00 ffffca8f`4712ef60 fffff804`27e6917b     nt!KiAcquireKobjectLockSafe+0x14 [minkernel\ntos\ke\waitsup.c @ 3230]
01 (Inline Function) --------`--------     nt!KiAcquireKobjectLock+0xd [minkernel\ntos\ke\waitsup.c @ 3266]
02 ffffca8f`4712ef90 ffff905b`b301cc23     nt!KeSetEvent+0x6b [minkernel\ntos\ke\eventobj.c @ 412]
03 ffffca8f`4712f020 ffff905b`b33d55ed     win32kbase!QueuePowerRequest+0x183
04 ffffca8f`4712f140 ffff905b`b33da715     win32kfull!DoPowerStateAndMonitor+0x31d
05 ffffca8f`4712f1b0 ffff905b`b3398a66     win32kfull!<lambda_2bb7a2ff8864d6893c712a9e9ac801fb>::<lambda_invoker_cdecl>+0x15
06 ffffca8f`4712f1e0 ffff905b`b339895e     win32kfull!xxxReadyTimer+0xd2
07 ffffca8f`4712f220 ffff905b`b34412f4     win32kfull!xxxTimersProc+0x25e
08 ffffca8f`4712f290 ffff905b`b308de3d     win32kfull!RawInputThread+0xd34
09 ffffca8f`4712f3d0 ffff905b`b308dd05     win32kbase!xxxCreateSystemThreads+0x11d
0a ffffca8f`4712f400 ffff905b`b379a70d     win32kbase!NtUserCreateSystemThreads+0x75
0b ffffca8f`4712f430 fffff804`2802bbe8     win32k!NtUserCreateSystemThreads+0x15
0c ffffca8f`4712f460 00007ffb`563f8e14     nt!KiSystemServiceCopyEnd+0x28 [minkernel\ntos\ke\amd64\trap.asm @ 3605]
0d 000000c8`2853fd98 00007ffb`5598402a     win32u!NtUserCreateSystemThreads+0x14
0e 000000c8`2853fda0 00007ffb`5872aa65     winsrvext!StartCreateSystemThreads+0x4a
0f 000000c8`2853fdd0 00000000`00000000     ntdll!RtlUserThreadStart+0x35 [minkernel\ntdll\rtlstrt.c @ 1162]
```

<aside>
⚠️ When debugging win32k stuff, make sure your context is correct! win32k lives in session space memory. See Session Space
</aside>

The `win32kfull!DoPowerStateAndMonitor`  is very large and contains several branches. Let’s try to break on that routine.

![](/images/blog/20241213-0x0-lidcloseopen-screendim/4.png)

It hits every second, so perhaps something above is a timer.But it does not call win32kbase!QueuePowerRequest every time. Something branched away.

![](/images/blog/20241213-0x0-lidcloseopen-screendim/5.png)

There are several lines of branch that can jump to the return block. I found the problematic branch.

![](/images/blog/20241213-0x0-lidcloseopen-screendim/6.png)

In normal case, UserSessionState+0B38 and esi are both 0

![](/images/blog/20241213-0x0-lidcloseopen-screendim/7.png)

We now need to identify who set the UserSessionState to non-zero value.

```
9: kd> ba w 4 ffffb68705cb4000+0b38
9: kd> g
Breakpoint 2 hit
win32kbase!ApplyAdaptiveSessionState+0x3e:
ffff905b`b301de2e 695f08e8030000  imul    ebx,dword ptr [rdi+8],3E8h
6: kd> k
 # Child-SP          RetAddr               Call Site
00 ffffca8f`486e6b60 ffff905b`b301dc8f     win32kbase!ApplyAdaptiveSessionState+0x3e
01 ffffca8f`486e6b90 ffff905b`b301b834     win32kbase!UpdateAdaptiveSessionState+0x77
02 ffffca8f`486e6c10 ffff905b`b30e0e09     win32kbase!UserPowerInfoCallout+0x55c
03 ffffca8f`486e6ce0 ffff905b`b37910cb     win32kbase!W32CalloutDispatch+0x199
04 ffffca8f`486e6e30 fffff804`2838a473     win32k!W32CalloutDispatchThunk+0x2b
05 ffffca8f`486e6e60 fffff804`28324832     nt!ExCallSessionCallBack+0xa3 [minkernel\ntos\ex\callback.c @ 1738] 
06 ffffca8f`486e6f20 fffff804`283f0083     nt!PsInvokeWin32Callout+0x82 [minkernel\ntos\ps\callback.c @ 1754] 
07 ffffca8f`486e6f50 fffff804`2827e96b     nt!PopInvokeWin32Callout+0x177 [minkernel\ntos\po\session.c @ 1051] 
08 ffffca8f`486e7030 fffff804`2838cf93     nt!PopSendSessionInfo+0x4f [minkernel\ntos\po\session.c @ 189] 
09 ffffca8f`486e7090 fffff804`2859990d     nt!PopReleaseAdaptiveLock+0x83 [minkernel\ntos\po\poadaptive.c @ 2040] 
0a ffffca8f`486e7100 fffff804`283dd4cd     nt!PopAdaptiveWnfCallback+0x10d [minkernel\ntos\po\poadaptive.c @ 1975] 
0b ffffca8f`486e7160 fffff804`283dd295     nt!ExpWnfDispatchKernelSubscription+0x1d9 [minkernel\ntos\ex\wnfdisp.c @ 559] 
0c ffffca8f`486e71f0 fffff804`282c0edf     nt!ExpWnfStartKernelDispatcher+0x49 [minkernel\ntos\ex\wnfdisp.c @ 829] 
0d ffffca8f`486e7220 fffff804`282bf3e6     nt!ExpWnfNotifyNameSubscribers+0x177 [minkernel\ntos\ex\wnfdisp.c @ 1599] 
0e ffffca8f`486e7290 fffff804`282bf11e     nt!ExpNtUpdateWnfStateData+0x2ba [minkernel\ntos\ex\wnfntapi.c @ 1934] 
0f ffffca8f`486e73a0 fffff804`2802bbe8     nt!NtUpdateWnfStateData+0x2e [minkernel\ntos\ex\wnfntapi.c @ 2051] 
10 ffffca8f`486e73f0 00007ffb`58772f24     nt!KiSystemServiceCopyEnd+0x28 [minkernel\ntos\ke\amd64\trap.asm @ 3605] 
11 00000084`adbff478 00000000`00000000     ntdll!ZwUpdateWnfStateData+0x14 [minkernel\ntdll\daytona\objfre\amd64\usrstubs.asm @ 4043] 

```

```
6: kd> ub
win32kbase!ApplyAdaptiveSessionState+0x10:
ffff905b`b301de00 488bf9          mov     rdi,rcx
ffff905b`b301de03 4c8b1556722a00  mov     r10,qword ptr [win32kbase!_imp_SGDGetUserSessionState (ffff905b`b32c5060)]
ffff905b`b301de0a e811463100      call    ffff905b`b3332420
ffff905b`b301de0f 8998300b0000    mov     dword ptr [rax+0B30h],ebx
ffff905b`b301de15 695f04e8030000  imul    ebx,dword ptr [rdi+4],3E8h
ffff905b`b301de1c 4c8b153d722a00  mov     r10,qword ptr [win32kbase!_imp_SGDGetUserSessionState (ffff905b`b32c5060)]
ffff905b`b301de23 e8f8453100      call    ffff905b`b3332420
ffff905b`b301de28 8998380b0000    mov     dword ptr [rax+0B38h],ebx
6: kd>  r ebx
ebx=1388
```

This call sets it to `1388` . Looking at the stack, it is servicing a Wnf Notification.

# WNF

WNF stands for Windows Notification Facility. It facilitate notification event delivery in both user-mode and kernel-mode.

[Playing with the Windows Notification Facility (WNF) - Quarkslab's blog](https://blog.quarkslab.com/playing-with-the-windows-notification-facility-wnf.html)

[WNF Chronicles I: Introduction - PwnedC0ffee (pwnedcoffee.com)](https://pwnedcoffee.com/blog/wnf-chronicles-i-introduction/)

[Introducing Windows Notification Facility’s (WNF) Code Integrity | Trail of Bits Blog](https://blog.trailofbits.com/2023/05/15/introducing-windows-notification-facilitys-wnf-code-integrity/)

It is not documented and public. 

Components “subscribe” to events by a “event name”, and the publisher “publish” to the event name. The component registered callback will be invoked.

Once the component receives the event, it queries it StateData to learn more about the details of the published event.

## WNF State Name

```
0a ffffca8f`486e7100 fffff804`283dd4cd     nt!PopAdaptiveWnfCallback+0x10d [minkernel\ntos\po\poadaptive.c @ 1975]
0b ffffca8f`486e7160 fffff804`283dd295     nt!ExpWnfDispatchKernelSubscription+0x1d9 [minkernel\ntos\ex\wnfdisp.c @ 559]
0c ffffca8f`486e71f0 fffff804`282c0edf     nt!ExpWnfStartKernelDispatcher+0x49 [minkernel\ntos\ex\wnfdisp.c @ 829]
0d ffffca8f`486e7220 fffff804`282bf3e6     nt!ExpWnfNotifyNameSubscribers+0x177 [minkernel\ntos\ex\wnfdisp.c @ 1599]
0e ffffca8f`486e7290 fffff804`282bf11e     nt!ExpNtUpdateWnfStateData+0x2ba [minkernel\ntos\ex\wnfntapi.c @ 1934]
```

Judging from stack, we are the subscriber in this case, meaning we called `ExSubscribeWnfStateChange` before, and the publisher now updates the state with the name we’ve subscribed.

This causes our registered callback `PopAdaptiveWnfCallback` to be called.

```
6: kd> x nt!ExpWnfNotifyNameSubscribers
fffff804`282c0d68 nt!ExpWnfNotifyNameSubscribers (struct _WNF_NAME_INSTANCE *, unsigned long, unsigned long, unsigned long)
```

In terms of WNF, all WNF “channels” are represented by a Name Instance.

```
6: kd> dt _WNF_NAME_INSTANCE
nt!_WNF_NAME_INSTANCE
   +0x000 Header           : _WNF_NODE_HEADER
   +0x008 RunRef           : _EX_RUNDOWN_REF
   +0x010 TreeLinks        : _RTL_BALANCED_NODE
   +0x028 StateName        : _WNF_STATE_NAME_STRUCT
   +0x030 ScopeInstance    : Ptr64 _WNF_SCOPE_INSTANCE
   +0x038 StateNameInfo    : _WNF_STATE_NAME_REGISTRATION
   +0x050 StateDataLock    : _WNF_LOCK
   +0x058 StateData        : Ptr64 _WNF_STATE_DATA
   +0x060 CurrentChangeStamp : Uint4B
   +0x068 PermanentDataStore : Ptr64 _WNF_PERMANENT_DATA_STORE
   +0x070 StateSubscriptionListLock : _WNF_LOCK
   +0x078 StateSubscriptionListHead : _LIST_ENTRY
   +0x088 TemporaryNameListEntry : _LIST_ENTRY
   +0x098 CreatorProcess   : Ptr64 _EPROCESS
   +0x0a0 DataSubscribersCount : Int4B
   +0x0a4 CurrentDeliveryCount : Int4B
```

When subscribing, it needs to provide a StateName, which is a ID to the event it wish to register. Let’s try to find the ID for our case.

![](/images/blog/20241213-0x0-lidcloseopen-screendim/8.png)

The address of `_WNF_NAMED_INSTANCE` is pushed on stack.

```
0d ffffca8f`486e7220 fffff804`282bf3e6     nt!ExpWnfNotifyNameSubscribers+0x177 [minkernel\ntos\ex\wnfdisp.c @ 1599] 
```

The address of name instance is stored in `ffffca8f486e7220 + 30 + 8*7 + 8 = ffffca8f486e7290` .

```
6: kd> dq ffffca8f`486e7220+30+8*7+8
ffffca8f`486e7290  ffffcc84`1a299aa0
6: kd> dt nt!_WNF_NAME_INSTANCE ffffcc84`1a299aa0
   +0x000 Header           : _WNF_NODE_HEADER
   +0x008 RunRef           : _EX_RUNDOWN_REF
   +0x010 TreeLinks        : _RTL_BALANCED_NODE
   +0x028 StateName        : _WNF_STATE_NAME_STRUCT
   +0x030 ScopeInstance    : 0xffffcc84`19839de0 _WNF_SCOPE_INSTANCE
   +0x038 StateNameInfo    : _WNF_STATE_NAME_REGISTRATION
   +0x050 StateDataLock    : _WNF_LOCK
   +0x058 StateData        : 0xffffcc84`20c6aea0 _WNF_STATE_DATA
   +0x060 CurrentChangeStamp : 0x15
   +0x068 PermanentDataStore : (null) 
   +0x070 StateSubscriptionListLock : _WNF_LOCK
   +0x078 StateSubscriptionListHead : _LIST_ENTRY [ 0xffffcc84`1a312f30 - 0xffffcc84`1a312f30 ]
   +0x088 TemporaryNameListEntry : _LIST_ENTRY [ 0x00000000`00000000 - 0x00000000`00000000 ]
   +0x098 CreatorProcess   : (null) 
   +0x0a0 DataSubscribersCount : 0n1
   +0x0a4 CurrentDeliveryCount : 0n1
```

The `StateName`  is an XOR encoded value of the actual State Name. In our case we have the value of `004d504800000801`

![](/images/blog/20241213-0x0-lidcloseopen-screendim/9.png)

The XOR was done in `NtCreateWnfStateName`

![](/images/blog/20241213-0x0-lidcloseopen-screendim/10.png)

The mask used can also be found by disassembling `nt!ExpWnfDispatchKernelSubscription` . It is `0x41C64E6DA3BC0074`.

![](/images/blog/20241213-0x0-lidcloseopen-screendim/11.png)

In our case `004d504800000801 XOR 41C64E6DA3BC0074 = 418b1e25a3bc0875`

## Definition of WNF State Names

https://github.com/ionescu007/wnfun/blob/master/script_python/WellKnownWnfNames.py

You could query it in symbols, they likely starts with WNF_XXX.

https://github.com/ionescu007/wnfun/blob/master/script_python/WnfNameDumper.py

## WNF Structures

In each EPROCESS, ther is a WnfContext. It’s type is _WNF_PROCESS_CONTEXT.

```
6: kd> dt _WNF_PROCESS_CONTEXT 0xffffcc84`1cede2d0
nt!_WNF_PROCESS_CONTEXT
   +0x000 Header           : _WNF_NODE_HEADER
   +0x008 Process          : 0xffffb687`077b9100 _EPROCESS
   +0x010 WnfProcessesListEntry : _LIST_ENTRY [ 0xffffcc84`1cee09a0 - 0xffffcc84`1cee1300 ]
   +0x020 ImplicitScopeInstances : [3] (null)
   +0x038 TemporaryNamesListLock : _WNF_LOCK
   +0x040 TemporaryNamesListHead : _LIST_ENTRY [ 0xffffcc84`1cede310 - 0xffffcc84`1cede310 ]
   +0x050 ProcessSubscriptionListLock : _WNF_LOCK
   +0x058 ProcessSubscriptionListHead : _LIST_ENTRY [ 0xffffcc84`1cee0cc8 - 0xffffcc84`1cee0e08 ]
   +0x068 DeliveryPendingListLock : _WNF_LOCK
   +0x070 DeliveryPendingListHead : _LIST_ENTRY [ 0xffffcc84`1cede340 - 0xffffcc84`1cede340 ]
   +0x080 NotificationEvent : 0xffffb687`05ccdae0 _KEVENT
```

# Back to the case

```
6: kd> k
 # Child-SP          RetAddr               Call Site
00 ffffca8f`486e6b60 ffff905b`b301dc8f     win32kbase!ApplyAdaptiveSessionState+0x3e
01 ffffca8f`486e6b90 ffff905b`b301b834     win32kbase!UpdateAdaptiveSessionState+0x77
02 ffffca8f`486e6c10 ffff905b`b30e0e09     win32kbase!UserPowerInfoCallout+0x55c
03 ffffca8f`486e6ce0 ffff905b`b37910cb     win32kbase!W32CalloutDispatch+0x199
04 ffffca8f`486e6e30 fffff804`2838a473     win32k!W32CalloutDispatchThunk+0x2b
05 ffffca8f`486e6e60 fffff804`28324832     nt!ExCallSessionCallBack+0xa3 [minkernel\ntos\ex\callback.c @ 1738]
06 ffffca8f`486e6f20 fffff804`283f0083     nt!PsInvokeWin32Callout+0x82 [minkernel\ntos\ps\callback.c @ 1754]
07 ffffca8f`486e6f50 fffff804`2827e96b     nt!PopInvokeWin32Callout+0x177 [minkernel\ntos\po\session.c @ 1051]
08 ffffca8f`486e7030 fffff804`2838cf93     nt!PopSendSessionInfo+0x4f [minkernel\ntos\po\session.c @ 189]
09 ffffca8f`486e7090 fffff804`2859990d     nt!PopReleaseAdaptiveLock+0x83 [minkernel\ntos\po\poadaptive.c @ 2040]
0a ffffca8f`486e7100 fffff804`283dd4cd     nt!PopAdaptiveWnfCallback+0x10d [minkernel\ntos\po\poadaptive.c @ 1975]
0b ffffca8f`486e7160 fffff804`283dd295     nt!ExpWnfDispatchKernelSubscription+0x1d9 [minkernel\ntos\ex\wnfdisp.c @ 559]
0c ffffca8f`486e71f0 fffff804`282c0edf     nt!ExpWnfStartKernelDispatcher+0x49 [minkernel\ntos\ex\wnfdisp.c @ 829]
0d ffffca8f`486e7220 fffff804`282bf3e6     nt!ExpWnfNotifyNameSubscribers+0x177 [minkernel\ntos\ex\wnfdisp.c @ 1599]
0e ffffca8f`486e7290 fffff804`282bf11e     nt!ExpNtUpdateWnfStateData+0x2ba [minkernel\ntos\ex\wnfntapi.c @ 1934]
0f ffffca8f`486e73a0 fffff804`2802bbe8     nt!NtUpdateWnfStateData+0x2e [minkernel\ntos\ex\wnfntapi.c @ 2051]
10 ffffca8f`486e73f0 00007ffb`58772f24     nt!KiSystemServiceCopyEnd+0x28 [minkernel\ntos\ke\amd64\trap.asm @ 3605]
11 00000084`adbff478 00000000`00000000     ntdll!ZwUpdateWnfStateData+0x14 [minkernel\ntdll\daytona\objfre\amd64\usrstubs.asm @ 4043]
```

Do you find something wrong? The start of the stack doesn’t seem possible. Is this routine possible to work as a thread start base?

This thread actually doesn’t start here, it is due to context being wrong. Causing WinDbg unable to fetch further stack memory.

```
6: kd> !thread
THREAD ffffb686f44b50c0  Cid 0ac8.0e78  Teb: 00000084ac62d000 Win32Thread: ffffb687000d9a30 RUNNING on processor 6
Not impersonating
DeviceMap                 ffffcc84198ac1f0
Owning Process            ffffb686f51e00c0       Image:         svchost.exe
Attached Process          ffffb687077b9100       Image:         csrss.exe
Wait Start TickCount      17070          Ticks: 312 (0:00:00:04.875)
Context Switch Count      371            IdealProcessor: 0
UserTime                  00:00:00.187
KernelTime                00:00:00.968
Win32 Start Address ntdll!TppWorkerThread (0x00007ffb58705090)
Stack Init ffffca8f486e75f0 Current ffffca8f486e69c0
Base ffffca8f486e8000 Limit ffffca8f486e1000 Call 0000000000000000
Priority 8  BasePriority 8  IoPriority 2  PagePriority 5
Child-SP          RetAddr               : Args to Child                                                           : Call Site
ffffca8f`486e6b60 ffff905b`b301dc8f     : 00000000`00000000 ffffca8f`486e6b90 fffff804`27f1af40 ffff905b`b305808a : win32kbase!ApplyAdaptiveSessionState+0x3e
ffffca8f`486e6b90 ffff905b`b301b834     : 00000000`00000000 00000000`00000001 00000000`00000000 00000000`00000000 : win32kbase!UpdateAdaptiveSessionState+0x77
ffffca8f`486e6c10 ffff905b`b30e0e09     : 00000000`00000000 ffffca8f`486e7050 00000000`00000001 00000000`00000000 : win32kbase!UserPowerInfoCallout+0x55c
ffffca8f`486e6ce0 ffff905b`b37910cb     : 00000000`00000005 fffff804`28869380 ffffca8f`486e6f60 00000000`00000001 : win32kbase!W32CalloutDispatch+0x199
ffffca8f`486e6e30 fffff804`2838a473     : 00000000`00000000 ffffb686`f406db20 ffffb687`077b9100 fffff804`27e86883 : win32k!W32CalloutDispatchThunk+0x2b
ffffca8f`486e6e60 fffff804`28324832     : 00000000`00000010 00000000`00040082 ffffca8f`486e6f48 00000000`00000000 : nt!ExCallSessionCallBack+0xa3 [minkernel\ntos\ex\callback.c @ 1738]
ffffca8f`486e6f20 fffff804`283f0083     : ffffb686`fd80e010 ffffcc84`198c97a8 ffffca8f`00000000 00000000`00000001 : nt!PsInvokeWin32Callout+0x82 [minkernel\ntos\ps\callback.c @ 1754]
ffffca8f`486e6f50 fffff804`2827e96b     : 00000000`00000005 ffffca8f`486e7050 ffffffff`ffffff01 00000000`000424e9 : nt!PopInvokeWin32Callout+0x177 [minkernel\ntos\po\session.c @ 1051]
ffffca8f`486e7030 fffff804`2838cf93     : ffffcc84`00000001 00000000`00000008 ffffca8f`486e7030 00000000`00000004 : nt!PopSendSessionInfo+0x4f [minkernel\ntos\po\session.c @ 189]
ffffca8f`486e7090 fffff804`2859990d     : ffffffff`ffffffff 00000000`00000001 ffffcc84`1a299aa0 ffffcc84`198c97a8 : nt!PopReleaseAdaptiveLock+0x83 [minkernel\ntos\po\poadaptive.c @ 2040]
ffffca8f`486e7100 fffff804`283dd4cd     : ffffffff`ffffffff 00000000`00000001 ffffcc84`1a299aa0 ffffcc84`198c97a8 : nt!PopAdaptiveWnfCallback+0x10d [minkernel\ntos\po\poadaptive.c @ 1975]
ffffca8f`486e7160 fffff804`283dd295     : 00000000`00000001 00000000`00000000 ffffcc84`1a299b10 ffffcc84`1a299b18 : nt!ExpWnfDispatchKernelSubscription+0x1d9 [minkernel\ntos\ex\wnfdisp.c @ 559]
ffffca8f`486e71f0 fffff804`282c0edf     : 00000000`00000001 00000000`00000000 ffffcc84`1a299b10 ffffcc84`1a299b18 : nt!ExpWnfStartKernelDispatcher+0x49 [minkernel\ntos\ex\wnfdisp.c @ 829]
ffffca8f`486e7220 fffff804`282bf3e6     : ffffcc84`1a299aa0 00000000`00000010 ffffca8f`00000001 ffffb686`00000001 : nt!ExpWnfNotifyNameSubscribers+0x177 [minkernel\ntos\ex\wnfdisp.c @ 1599]
ffffca8f`486e7290 fffff804`282bf11e     : 00000000`00000000 fffff804`27ee6c56 ffffb686`f44b50c0 ffffb686`fa82a548 : nt!ExpNtUpdateWnfStateData+0x2ba [minkernel\ntos\ex\wnfntapi.c @ 1934]
ffffca8f`486e73a0 fffff804`2802bbe8     : ffffffff`feced300 00000000`00000000 ffffb686`fc622940 00007ffb`00000000 : nt!NtUpdateWnfStateData+0x2e [minkernel\ntos\ex\wnfntapi.c @ 2051]
ffffca8f`486e73f0 00007ffb`58772f24     : 00000000`00000000 00000000`00000000 00000000`00000000 00000000`00000000 : nt!KiSystemServiceCopyEnd+0x28 (TrapFrame @ ffffca8f`486e7460) [minkernel\ntos\ke\amd64\trap.asm @ 3605]
00000084`adbff478 00000000`00000000     : 00000000`00000000 00000000`00000000 00000000`00000000 00000000`00000000 : ntdll!ZwUpdateWnfStateData+0x14 [minkernel\ntdll\daytona\objfre\amd64\usrstubs.asm @ 4043]
```

From !thread, we see the owner of this thread is a svchost.exe process, but we’re currently attached to csrss.exe. To view the other portion of the stack, we just need to switch to the other process. (Remember to reload!)

```
6: kd> .process /P ffffb686f51e00c0
Implicit process is now ffffb686`f51e00c0
.cache forcedecodeptes done
6: kd> .reload
Connected to Windows 10 22621 x64 target at (Thu Apr 25 16:45:53.278 2024 (UTC + 8:00)), ptr64 TRUE
Loading Kernel Symbols
...............................................................
................................................................
................................................................
...................................
Loading User Symbols
.....................................................
Loading unloaded module list
.................................
6: kd> k
 # Child-SP          RetAddr               Call Site
00 ffffca8f`486e6b60 ffff905b`b301dc8f     win32kbase!ApplyAdaptiveSessionState+0x3e
01 ffffca8f`486e6b90 ffff905b`b301b834     win32kbase!UpdateAdaptiveSessionState+0x77
02 ffffca8f`486e6c10 ffff905b`b30e0e09     win32kbase!UserPowerInfoCallout+0x55c
03 ffffca8f`486e6ce0 ffff905b`b37910cb     win32kbase!W32CalloutDispatch+0x199
04 ffffca8f`486e6e30 fffff804`2838a473     win32k!W32CalloutDispatchThunk+0x2b
05 ffffca8f`486e6e60 fffff804`28324832     nt!ExCallSessionCallBack+0xa3 [minkernel\ntos\ex\callback.c @ 1738]
06 ffffca8f`486e6f20 fffff804`283f0083     nt!PsInvokeWin32Callout+0x82 [minkernel\ntos\ps\callback.c @ 1754]
07 ffffca8f`486e6f50 fffff804`2827e96b     nt!PopInvokeWin32Callout+0x177 [minkernel\ntos\po\session.c @ 1051]
08 ffffca8f`486e7030 fffff804`2838cf93     nt!PopSendSessionInfo+0x4f [minkernel\ntos\po\session.c @ 189]
09 ffffca8f`486e7090 fffff804`2859990d     nt!PopReleaseAdaptiveLock+0x83 [minkernel\ntos\po\poadaptive.c @ 2040]
0a ffffca8f`486e7100 fffff804`283dd4cd     nt!PopAdaptiveWnfCallback+0x10d [minkernel\ntos\po\poadaptive.c @ 1975]
0b ffffca8f`486e7160 fffff804`283dd295     nt!ExpWnfDispatchKernelSubscription+0x1d9 [minkernel\ntos\ex\wnfdisp.c @ 559]
0c ffffca8f`486e71f0 fffff804`282c0edf     nt!ExpWnfStartKernelDispatcher+0x49 [minkernel\ntos\ex\wnfdisp.c @ 829]
0d ffffca8f`486e7220 fffff804`282bf3e6     nt!ExpWnfNotifyNameSubscribers+0x177 [minkernel\ntos\ex\wnfdisp.c @ 1599]
0e ffffca8f`486e7290 fffff804`282bf11e     nt!ExpNtUpdateWnfStateData+0x2ba [minkernel\ntos\ex\wnfntapi.c @ 1934]
0f ffffca8f`486e73a0 fffff804`2802bbe8     nt!NtUpdateWnfStateData+0x2e [minkernel\ntos\ex\wnfntapi.c @ 2051]
10 ffffca8f`486e73f0 00007ffb`58772f24     nt!KiSystemServiceCopyEnd+0x28 [minkernel\ntos\ke\amd64\trap.asm @ 3605]
11 00000084`adbff478 00007ffb`5875054b     ntdll!ZwUpdateWnfStateData+0x14 [minkernel\ntdll\daytona\objfre\amd64\usrstubs.asm @ 4043]
12 00000084`adbff480 00007ffb`4e423e8b     ntdll!RtlPublishWnfStateData+0x4b [minkernel\ntdll\wnfapi.c @ 910]
13 00000084`adbff4f0 00007ffb`4e43a646     sensorservice!HumanPresenceMonitorStateMachineImpl::PublishUserUnengagedWnfState+0xe7
14 00000084`adbff560 00007ffb`4e43b75e     sensorservice!SmFx::StateMachineEngine::StateMachineEngineImpl::ExecuteCurrentState+0x76
15 00000084`adbff5c0 00007ffb`587323ca     sensorservice!SmFx::StateMachineEngine::StateMachineEngineImpl::WorkerCallback+0x9e
16 00000084`adbff5f0 00007ffb`58705986     ntdll!TppWorkpExecuteCallback+0x13a [minkernel\threadpool\ntdll\work.c @ 671]
17 00000084`adbff640 00007ffb`574c257d     ntdll!TppWorkerThread+0x8f6 [minkernel\threadpool\ntdll\worker.c @ 1149]
18 00000084`adbff920 00007ffb`5872aa58     KERNEL32!BaseThreadInitThunk+0x1d
19 00000084`adbff950 00000000`00000000     ntdll!RtlUserThreadStart+0x28 [minkernel\ntdll\rtlstrt.c @ 1166]
```

Voila! We can see this signal originally came from `sensorservice`  . Which is the user mode component of HPD from MSFT. I will stop here for a moment as this should be enough evidence that sensor fusion hub and HPD team should take a look next.