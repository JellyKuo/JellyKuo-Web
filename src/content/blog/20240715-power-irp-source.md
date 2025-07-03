---
title: "Power IRP Source"
meta_title: ""
description: ""
date: 2024-07-15T12:00:00Z
image: ""
categories: ["OS"]
author: "Nick Kuo"
tags: ["Windows"]
draft: false
---
All Windows drivers / component / internally dispatch Power IRP with the routine.

```cpp
0: kd> dt nt!PoRequestPowerIrp
PoRequestPowerIrp  long (
	_DEVICE_OBJECT*, 
	unsigned char, 
	_POWER_STATE, 
	<function>*, 
	void*, 
	_IRP**)
```

Using conditional bp with `_DEVICE_OBJECT` is a good idea to capture the call with the device you’d like.

# DXG Adapter D0/D3 Transition

DXG adapter calls D3 → D0 by:

## DxgkCreateDevice

```
2: kd> k
 # Child-SP          RetAddr               Call Site
00 fffff50b`3cf2eec8 fffff806`833d4b3e     nt!PoRequestPowerIrp [minkernel\ntos\po\pocall.c @ 124] 
01 fffff50b`3cf2eed0 fffff806`833d4510     dxgkrnl!DpiRequestDevicePowerIrp+0xe6 [onecoreuap\windows\core\dxkernel\dxgkrnl\port\dpshared.cxx @ 4462] 
02 fffff50b`3cf2ef10 fffff806`83615ccb     dxgkrnl!DpiRequestDevicePowerState+0x168 [onecoreuap\windows\core\dxkernel\dxgkrnl\port\dpshared.cxx @ 4902] 
03 (Inline Function) --------`--------     dxgkrnl!DXGADAPTER::WakeUpAdapter+0xb2 [onecoreuap\windows\core\dxkernel\dxgkrnl\core\adapter.cxx @ 3977] 
04 (Inline Function) --------`--------     dxgkrnl!DXGADAPTER::TryWakeUpFromD3State+0x223 [onecoreuap\windows\core\dxkernel\dxgkrnl\core\adapter.cxx @ 4025] 
05 fffff50b`3cf2efa0 fffff806`833b8801     dxgkrnl!DXGADAPTER::AcquireCoreResourceShared+0x2ab [onecoreuap\windows\core\dxkernel\dxgkrnl\core\adapter.cxx @ 4060] 
06 (Inline Function) --------`--------     dxgkrnl!COREACCESS::AcquireShared+0x4c [onecoreuap\windows\core\dxkernel\dxgkrnl\inc\adapter.hxx @ 7611] 
07 fffff50b`3cf2f1d0 fffff806`8370492f     dxgkrnl!COREADAPTERACCESS::AcquireShared+0x61 [onecoreuap\windows\core\dxkernel\dxgkrnl\inc\adapter.hxx @ 7812] 
08 fffff50b`3cf2f210 fffff806`83704551     dxgkrnl!DxgkCreateDeviceImpl+0x3cf [onecoreuap\windows\core\dxkernel\dxgkrnl\core\device.cxx @ 2134] 
09 fffff50b`3cf2f430 fffff806`f0c6e958     dxgkrnl!DxgkCreateDevice+0x11 [onecoreuap\windows\core\dxkernel\dxgkrnl\core\device.cxx @ 2240] 
0a fffff50b`3cf2f460 00007ffc`73de4ae4     nt!KiSystemServiceCopyEnd+0x28 [minkernel\ntos\ke\amd64\trap.asm @ 3648] 
0b 000000e1`53bfe658 00007ffc`5a341ba3     win32u!NtGdiDdDDICreateDevice+0x14
0c (Inline Function) --------`--------     xrt_core_7ffc5a340000!xrt_core::umd::mcdm::create_device+0x65 [W:\src\sw-stack\XRT-MCDM\src\umd\mcdm2\device_mcdm.cpp @ 21] 
0d 000000e1`53bfe660 00000000`00000000     xrt_core_7ffc5a340000!xrt_core::umd::mcdm::device::device+0x113 [W:\src\sw-stack\XRT-MCDM\src\umd\mcdm2\device_mcdm.cpp @ 39] 
```

## DxgkCreateContextVirtual

```
7: kd> k
 # Child-SP          RetAddr               Call Site
00 fffff50b`3f857118 fffff806`833d4b3e     nt!PoRequestPowerIrp [minkernel\ntos\po\pocall.c @ 124] 
01 fffff50b`3f857120 fffff806`833d4510     dxgkrnl!DpiRequestDevicePowerIrp+0xe6 [onecoreuap\windows\core\dxkernel\dxgkrnl\port\dpshared.cxx @ 4462] 
02 fffff50b`3f857160 fffff806`8361606b     dxgkrnl!DpiRequestDevicePowerState+0x168 [onecoreuap\windows\core\dxkernel\dxgkrnl\port\dpshared.cxx @ 4902] 
03 (Inline Function) --------`--------     dxgkrnl!DXGADAPTER::WakeUpAdapter+0xbc [onecoreuap\windows\core\dxkernel\dxgkrnl\core\adapter.cxx @ 3977] 
04 fffff50b`3f8571f0 fffff806`833b7e27     dxgkrnl!DXGADAPTER::TryWakeUpFromD3State+0x18b [onecoreuap\windows\core\dxkernel\dxgkrnl\core\adapter.cxx @ 4025] 
05 (Inline Function) --------`--------     dxgkrnl!ADAPTER_RENDER::TryWakeUpFromD3State+0xd [onecoreuap\windows\core\dxkernel\dxgkrnl\inc\adapter.hxx @ 4009] 
06 (Inline Function) --------`--------     dxgkrnl!DXGDEVICE::AcquireDeviceLockExclusive+0x82 [onecoreuap\windows\core\dxkernel\dxgkrnl\inc\device.inl @ 236] 
07 (Inline Function) --------`--------     dxgkrnl!DXGDEVICEACCESSLOCKEXCLUSIVE::Acquire+0xa6 [onecoreuap\windows\core\dxkernel\dxgkrnl\inc\device.hxx @ 1597] 
08 fffff50b`3f857240 fffff806`8366e2dc     dxgkrnl!DXGDEVICEACCESSLOCKEXCLUSIVE::DXGDEVICEACCESSLOCKEXCLUSIVE+0xbf [onecoreuap\windows\core\dxkernel\dxgkrnl\inc\device.hxx @ 1567] 
09 fffff50b`3f857280 fffff806`8366e9db     dxgkrnl!DxgkCreateContextVirtualImpl+0x37c [onecoreuap\windows\core\dxkernel\dxgkrnl\core\context.cxx @ 336] 
0a fffff50b`3f857430 fffff806`f0c6e958     dxgkrnl!DxgkCreateContextVirtual+0xb [onecoreuap\windows\core\dxkernel\dxgkrnl\core\context.cxx @ 479] 
0b fffff50b`3f857460 00007ffc`73de4aa4     nt!KiSystemServiceCopyEnd+0x28 [minkernel\ntos\ke\amd64\trap.asm @ 3648] 
0c 000000e1`547f4b68 00007ffc`5a3437d2     win32u!NtGdiDdDDICreateContextVirtual+0x14
```

D0 → D3:

The power arbiter thread will do this for us:

```
6: kd> k
 # Child-SP          RetAddr               Call Site
00 fffff50b`3b34f448 fffff806`833d4b3e     nt!PoRequestPowerIrp [minkernel\ntos\po\pocall.c @ 124] 
01 fffff50b`3b34f450 fffff806`833d48fa     dxgkrnl!DpiRequestDevicePowerIrp+0xe6 [onecoreuap\windows\core\dxkernel\dxgkrnl\port\dpshared.cxx @ 4462] 
02 fffff50b`3b34f490 fffff806`8360eb79     dxgkrnl!DpiFinishSuspendAdapter+0xba [onecoreuap\windows\core\dxkernel\dxgkrnl\port\dppower.cxx @ 1958] 
03 fffff50b`3b34f4e0 fffff806`f0a1d19a     dxgkrnl!DpiPowerArbiterThread+0x289 [onecoreuap\windows\core\dxkernel\dxgkrnl\port\dppower.cxx @ 2201] 
04 fffff50b`3b34f570 fffff806`f0c5c3e4     nt!PspSystemThreadStartup+0x5a [minkernel\ntos\ps\psexec.c @ 11878] 
05 fffff50b`3b34f5c0 00000000`00000000     nt!KiStartSystemThread+0x34 [minkernel\ntos\ke\amd64\threadbg.asm @ 87] 
```

Power arbiter waits for queued object in `_FDO_CONTEXT.PowerActionQueue`

```
21: kd> dx -id 0,0,ffffc58ba8553040 -r1 ((dxgkrnl!_FDO_CONTEXT *)0xffffc58bb7da8180)
((dxgkrnl!_FDO_CONTEXT *)0xffffc58bb7da8180)                 : 0xffffc58bb7da8180 [Type: _FDO_CONTEXT *]
    [+0xfc8] DxgSchedulerCallbackState : 0x3 [Type: unsigned long]
    [+0xfd0] PowerArbiterThread : 0xffffc58bb7da3480 [Type: void *]
    [+0xfd8] PowerActionEvent [Type: _KEVENT]
    [+0xff0] PowerArbiterThreadPointer : 0xffffc58bb7da3480 [Type: _ETHREAD *]
    [+0xff8] PowerActionQueue [Type: _LIST_ENTRY]
    [+0x1008] DeviceThreadState : StateSuspended (1) [Type: _POWER_ACTION_STATE]
    [+0x100c] DeviceThreadPowerFlags : 0x0 [Type: unsigned long]
    [+0x1010] AsyncPowerActionRequest [Type: _DPI_POWER_ACTION]
    [+0x1070] PowerActionSpinLock : 0xfffff50b3b34f4b0 [Type: unsigned __int64]
    [+0x1078] DisableD3Requests : 0x0 [Type: unsigned int]
```

The device is PoFx, so OS queues the power down by PoFx callback

```
19: kd> k
 # Child-SP          RetAddr               Call Site
00 fffff50b`39c27170 fffff806`833d42a9     dxgkrnl!DpiRequestDevicePowerState+0x29f [onecoreuap\windows\core\dxkernel\dxgkrnl\port\dpshared.cxx @ 5040] 
01 (Inline Function) --------`--------     dxgkrnl!DXGADAPTER::PowerRuntimeDevicePowerRequiredCallback+0x1e [onecoreuap\windows\core\dxkernel\dxgkrnl\core\adapter.cxx @ 1275] 
02 fffff50b`39c27200 fffff806`f091f2be     dxgkrnl!DxgkPowerRuntimeDevicePowerNotRequiredCallback+0x39 [onecoreuap\windows\core\dxkernel\dxgkrnl\core\adapterpublic.cxx @ 179] 
03 fffff50b`39c27240 fffff806`f095f8d2     nt!PopFxProcessWork+0x8de [minkernel\ntos\po\runtime.c @ 9476] 
04 fffff50b`39c27350 fffff806`f095f63b     nt!PopFxDispatchPluginWorkOnce+0x226 [minkernel\ntos\po\runtime.c @ 19818] 
05 fffff50b`39c274d0 fffff806`f0b60714     nt!PopFxProcessWorkPool+0x13b [minkernel\ntos\po\runtime.c @ 9913] 
06 fffff50b`39c27540 fffff806`f0a1d19a     nt!PopFxStaticWorkPoolThread+0x44 [minkernel\ntos\po\runtime.c @ 8747] 
07 fffff50b`39c27570 fffff806`f0c5c3e4     nt!PspSystemThreadStartup+0x5a [minkernel\ntos\ps\psexec.c @ 11878] 
08 fffff50b`39c275c0 00000000`00000000     nt!KiStartSystemThread+0x34 [minkernel\ntos\ke\amd64\threadbg.asm @ 87] 
```

https://learn.microsoft.com/en-us/windows-hardware/drivers/ddi/wdm/nc-wdm-po_fx_device_power_not_required_callback