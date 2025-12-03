---
title: "0x0 Live AcpWdfWorkItem Leak"
meta_title: ""
description: ""
date: 2024-11-14T12:00:00Z
image: ""
categories: ["BSOD Analysis"]
author: "Nick Kuo"
tags: ["Windows", "BSOD", "Live"]
draft: false
---

Customer observed higher memory usage after using Edge to play music overnight.

Captured live dump after playing music for a while.

```cpp
0: kd> !poolused 2
....................
 Sorting by NonPaged Pool Consumed

               NonPaged                  Paged
 Tag     Allocs         Used     Allocs         Used

 amda   5768754   1938325232         32         9360	UNKNOWN pooltag 'amda', please update pooltag.txt
 IoWI   5769999    646239888          0            0	Io work items , Binary: nt!io
 EtwB      1428    254173440          6       196608	Etw Buffer , Binary: nt!etw
 HalD       118    230549312          0            0	Hardware Abstraction Layer: DMA , Binary: hal.dll
 DAL3      1854    132887776          0            0	UNKNOWN pooltag 'DAL3', please update pooltag.txt
 NxRx    131587     80019584          0            0	UNKNOWN pooltag 'NxRx', please update pooltag.txt
 MKCx       190     25463552          3          288	UNKNOWN pooltag 'MKCx', please update pooltag.txt
 DAL2       877     25073840       1560      6288352	UNKNOWN pooltag 'DAL2', please update pooltag.txt
```

# Pool Tag

Look at `amda` first. Searched through our codebase, didn’t find anything pointing to this tag. 

I’m lazy, so I’m just going to grab a live machine and find out who uses this tag.

```cpp
bp nt!ExAllocatePool2 ".if(@r8 == 0x61646d61) {} .else {gc}"
```

```cpp
8: kd> k
 # Child-SP          RetAddr               Call Site
00 ffffd68d`7952edb8 fffff804`0591d831     nt!ExAllocatePool2 [minkernel\ntos\ex\pool.c @ 4255] 
01 (Inline Function) --------`--------     Wdf01000!MxMemory::MxAllocatePool2+0x10 [minkernel\wdf\framework\shared\inc\primitives\km\MxMemoryKm.h @ 86] 
02 ffffd68d`7952edc0 fffff804`0591e433     Wdf01000!FxPoolAllocator+0x81 [minkernel\wdf\framework\shared\object\wdfpool.cpp @ 379] 
03 (Inline Function) --------`--------     Wdf01000!FxPoolAllocateWithTag2+0x4e [minkernel\wdf\framework\shared\inc\private\common\FxGlobals.h @ 746] 
04 (Inline Function) --------`--------     Wdf01000!FxObjectHandleAllocCommon+0x143 [minkernel\wdf\framework\shared\object\handleapi.cpp @ 237] 
05 ffffd68d`7952ee30 fffff804`05932273     Wdf01000!FxObjectHandleAlloc2+0x157 [minkernel\wdf\framework\shared\object\handleapi.cpp @ 296] 
06 (Inline Function) --------`--------     Wdf01000!FxObject::operator new+0x2a [minkernel\wdf\framework\shared\inc\private\common\fxobject.hpp @ 577] 
07 ffffd68d`7952eed0 fffff804`05932083     Wdf01000!FxWorkItem::_Create+0x43 [minkernel\wdf\framework\shared\core\fxworkitem.cpp @ 120] 
08 ffffd68d`7952ef20 fffff804`0ffb5254     Wdf01000!imp_WdfWorkItemCreate+0xd3 [minkernel\wdf\framework\shared\core\fxworkitemapi.cpp @ 143] 
09 (Inline Function) --------`--------     amdacpbus2!WdfWorkItemCreate+0x26 [C:\constructicon\builds\dk\win\ms_wdk\e26020\include\wdf\kmdf\1.33\wdfworkitem.h @ 130] 
0a ffffd68d`7952efb0 fffff804`0ffa4568     amdacpbus2!AcpWorkItemCreate+0xd0 [c:\constructicon\builds\gfx\five\24.20\drivers\acp\amdacpbus2\src\acp_device.c @ 1345] 
0b ffffd68d`7952f030 fffff804`0595dc88     amdacpbus2!AcpDspSwInterruptDpc+0x13c [c:\constructicon\builds\gfx\five\24.20\drivers\acp\amdacpbus2\src\acp_7_0.c @ 2038] 
0c (Inline Function) --------`--------     Wdf01000!FxDpc::DpcHandler+0x73 [minkernel\wdf\framework\kmdf\src\core\fxdpc.cpp @ 319] 
0d ffffd68d`7952f090 fffff804`73a8248e     Wdf01000!FxDpc::FxDpcThunk+0x88 [minkernel\wdf\framework\kmdf\src\core\fxdpc.cpp @ 361] 
0e ffffd68d`7952f0e0 fffff804`73af9a5b     nt!KiExecuteAllDpcs+0x67e [minkernel\ntos\ke\dpcsup.c @ 2963] 
0f ffffd68d`7952f330 fffff804`73e74b6e     nt!KiRetireDpcList+0x36b [minkernel\ntos\ke\dpcsup.c @ 3421] 
10 ffffd68d`7952f5c0 00000000`00000000     nt!KiIdleLoop+0x9e [minkernel\ntos\ke\amd64\idle.asm @ 177] 
```

We’re on the chopping block now. Let’s see why it is this tag instead of some tag in ACP code.

Based on function name, the pool tag is likely passed into `FxPoolAllocateWithTag2` , but this frame is inlined. So, let’s inspect  `Wdf01000!FxPoolAllocator` signature and see if possibly the tag is passed as a parameter down as well.

```cpp
8: kd> x Wdf01000!FxPoolAllocator
fffff804`0591d7b0 Wdf01000!FxPoolAllocator (struct _FX_DRIVER_GLOBALS *, struct FX_POOL *, struct FxPoolTypeOrPoolFlags *, unsigned int64, unsigned long, void *)
```

The last 2 unsigned int64 and unsigned long seems promising. We already knew we break in when the tag is `amda` . So simply dump out them and find which one is `amda`.

For 1st unsigned int64, it is in R9.

```cpp
8: kd> .frame /c /r 0n5
Reset base frame from 5 to 3, which points to the inner-most inline function frame.
03 (Inline Function) --------`--------     Wdf01000!FxPoolAllocateWithTag2+0x4e [minkernel\wdf\framework\shared\inc\private\common\FxGlobals.h @ 746] 
rax=0000000000001000 rbx=0000000000000000 rcx=0000000000000040
rdx=0000000000000138 rsi=0000000000000000 rdi=0000000000000128
rip=fffff8040591e433 rsp=ffffd68d7952ee30 rbp=00000000000000d0
 r8=0000000061646d61  r9=0000000000000128 r10=fffff804743300f0
r11=0000000000000028 r12=0000000000000000 r13=0000000061646d61
r14=ffffd68d7952efe8 r15=ffffac0e4c604db0
iopl=0         nv up ei pl zr na po nc
cs=0010  ss=0018  ds=002b  es=002b  fs=0053  gs=002b             efl=00000246
Wdf01000!FxPoolAllocateWithTag2+0x4e [inlined in Wdf01000!FxObjectHandleAlloc2+0x157]:
fffff804`0591e433 488bf8          mov     rdi,rax
```

R9=128. Seems like some kind of flag, not who we’re looking for.

The next parameter is spilled on stack. x64 fastcall convension pushes onto stack right to left, with first 4 parameter space reserved as shadow space.

So, from the point of view of `FxPoolAllocateWithTag2` , calling `FxPoolAllocator` will mean pushing 6th parameter on `rsp+28`, and 5th parameter on `rsp+20`. RSP means the stack ptr of `FxPoolAllocateWithTag2` . Keep in mind higher the stack, the lesser the memory address. 

```
8: kd> db rsp+20
ffffd68d`7952ee50  61 6d 64 61 00 00 00 00-00 00 00 00 00 00 00 00  amda............
```

Bingo. Now just follow it to find out where rsp+20 came from.

![](/images/blog/20241114-0x0-acpwdfworkitem-leak/1.png)

It came from r13d.

![](/images/blog/20241114-0x0-acpwdfworkitem-leak/2.png)

R13d came from [rcx+44]. We know RCX is `_FX_DRIVER_GLOBALS` . So basically voila.

```
8: kd> dt Wdf01000!_FX_DRIVER_GLOBALS
   +0x000 Linkage          : _LIST_ENTRY
   +0x010 Refcnt           : Int4B
   +0x018 DestroyEvent     : MxEvent
   +0x038 WdfHandleMask    : Uint8B
   +0x040 WdfVerifierAllocateFailCount : Int4B
   +0x044 Tag              : Uint4B
   +0x048 DriverObject     : MxDriverObject
   ...
```

Find the address of `_FX_DRIVER_GLOBALS` in our context (It’s in R15 of `FxPoolAllocateWithTag2` ). We can validate this.

```
8: kd> dt Wdf01000!_FX_DRIVER_GLOBALS ffffac0e4c604db0
   +0x000 Linkage          : _LIST_ENTRY [ 0xffffac0e`4c68edb0 - 0xffffac0e`4c52a920 ]
   +0x010 Refcnt           : 0n1
   +0x018 DestroyEvent     : MxEvent
   +0x038 WdfHandleMask    : 0xffffffff`fffffff8
   +0x040 WdfVerifierAllocateFailCount : 0n-1
   +0x044 Tag              : 0x61646d61
   +0x048 DriverObject     : MxDriverObject
   +0x050 Driver           : 0xffffac0e`46565830 FxDriver
```

Cool.

# Generalize debugging of WDF

Based on this information, we could roughly identify that all WDF objects created and associated with this set of `_FX_DRIVER_GLOBALS` will have the same pool tag.

See [WDF](https://www.notion.so/WDF-13e25dabbe4c8044995eeb00901a1fb1?pvs=21), and you will realize that all WDF object starts in `FxObject`, and oh boy, that base class has a `m_Type` field. So, you can just dump out the memory, read the type and determine what to cast that object as.

# Issue

Let’s apply what we know so far on the dump file.

1. Pool tag `amda` refers to WDF objects belonging to ACP driver.
2. All WDF objects have the base class of `FxObject`, and it contains a `m_Type` field.

We can find some instance of object, check its `m_Type` and understand more on where it came from.

```cpp
0: kd> !poolfind amda -nonpaged

Scanning large pool allocation table for tag 0x61646d61 (amda) (ffffda0fe5b10000 : ffffda0fe5f10000)

ffffda0ff9791000 : tag amda, size    0x18f0, Nonpaged pool
ffffda0ff7ce01d0 : tag amda, size     0x3f0, Nonpaged pool
ffffda001accb5f0 : tag amda, size     0x140, Nonpaged pool
ffffda001accb740 : tag amda, size     0x140, Nonpaged pool
ffffda001accb890 : tag amda, size     0x140, Nonpaged pool
ffffda001accb9e0 : tag amda, size     0x140, Nonpaged pool
ffffda001accbb30 : tag amda, size     0x140, Nonpaged pool
ffffda001accbc80 : tag amda, size     0x140, Nonpaged pool
ffffda001accbdd0 : tag amda, size     0x140, Nonpaged pool
ffffda0ff9793000 : tag amda, size    0x18f0, Nonpaged pool
ffffda001acda620 : tag amda, size     0x140, Nonpaged pool
ffffda001acda770 : tag amda, size     0x140, Nonpaged pool
ffffda001acda8c0 : tag amda, size     0x140, Nonpaged pool
ffffda001acdaa10 : tag amda, size     0x140, Nonpaged pool
ffffda001acdab60 : tag amda, size     0x140, Nonpaged pool
ffffda001acdacb0 : tag amda, size     0x140, Nonpaged pool
ffffda001acdae00 : tag amda, size     0x140, Nonpaged pool
ffffda0ff7cde3f0 : tag amda, size     0x3f0, Nonpaged pool
ffffda0ff7cde800 : tag amda, size     0x300, Nonpaged pool
ffffda0ff7ce3000 : tag amda, size    0x3420, Nonpaged pool
ffffda0ff7ce6440 : tag amda, size     0x730, Nonpaged pool
ffffda0ff7ce6b90 : tag amda, size     0x3d0, Nonpaged pool

Searching nonpaged pool (ffffda0000000000 : ffffea0000000000) for tag 0x61646d61 (amda)

ffffda000a9b6d30 : tag amda, size     0x140, Nonpaged pool
ffffda000a9e0010 : tag amda, size     0x140, Nonpaged pool
ffffda000a9e0400 : tag amda, size     0x140, Nonpaged pool
ffffda000a9e07f0 : tag amda, size     0x140, Nonpaged pool
ffffda000a9e0be0 : tag amda, size     0x140, Nonpaged pool
ffffda000f102140 : tag amda, size     0x140, Nonpaged pool
ffffda000f102290 : tag amda, size     0x140, Nonpaged pool
ffffda000f1023e0 : tag amda, size     0x140, Nonpaged pool
... All 0x140 nonpaged
ffffda000f198e80 : tag amda, size     0x140, Nonpaged pool

...terminating - searched pool to ffffda000fb7df50
 
```

We should have a good idea now, whatever is running away is probably nonpaged, 0x140 in size.

Just take whatever one and find out what it is based on knowledge of WDF.

Take `ffffda000f16ed30` as example, remember, all pool entry contains a HEADER of size `0x10`. So we need to offset that.

```
8: kd> dt -v nt!_POOL_HEADER
struct _POOL_HEADER, 9 elements, 0x10 bytes
   +0x000 PreviousSize     : Bitfield Pos 0, 8 Bits
   +0x000 PoolIndex        : Bitfield Pos 8, 8 Bits
   +0x002 BlockSize        : Bitfield Pos 0, 8 Bits
   +0x002 PoolType         : Bitfield Pos 8, 8 Bits
   +0x000 Ulong1           : Uint4B
   +0x004 PoolTag          : Uint4B
   +0x008 ProcessBilled    : Ptr64 to struct _EPROCESS, 260 elements, 0x840 bytes
   +0x008 AllocatorBackTraceIndex : Uint2B
   +0x00a PoolTagHash      : Uint2B
```

```cpp
0: kd> dt Wdf01000!FxObject ffffda000f16ed30+10
   +0x000 __VFN_table : 0xfffff800`5980dc30 
   +0x008 m_Type           : 0x1025
   +0x00a m_ObjectSize     : 0xd0
   +0x00c m_Refcnt         : 0n2
   +0x010 m_Globals        : 0xffffda0f`f0157710 _FX_DRIVER_GLOBALS
   +0x018 m_ObjectFlags    : 0x819
   +0x018 m_ObjectFlagsByName : FxObject::<unnamed-tag>::<unnamed-type-m_ObjectFlagsByName>
   +0x01a m_ObjectState    : 1
   +0x020 m_ChildListHead  : _LIST_ENTRY [ 0xffffda00`0f16ed60 - 0xffffda00`0f16ed60 ]
   +0x030 m_SpinLock       : MxLock
   +0x040 m_ParentObject   : 0xffffda0f`f7ce3000 FxObject
   +0x048 m_ChildEntry     : _LIST_ENTRY [ 0xffffda00`0f171cc8 - 0xffffda00`0f170288 ]
   +0x058 m_DisposeSingleEntry : _SINGLE_LIST_ENTRY
   +0x060 m_DeviceBase     : 0xffffda0f`f7ce3000 FxDeviceBase
   +0x060 m_Device         : 0xffffda0f`f7ce3000 FxDevice
```

We see type is `0x1025`, so go to ReactOS reference and find the definition.

```cpp
    FX_TYPE_WORKITEM             = FX_TYPES_BASE+0x25,
```

It is a work item. We can cast it to get more details now.

```
0: kd> dt Wdf01000!FxWorkItem ffffda000f16ed30+10
   +0x000 __VFN_table : 0xfffff800`5980dc30
   +0x008 m_Type           : 0x1025
   +0x00a m_ObjectSize     : 0xd0
   +0x00c m_Refcnt         : 0n2
   +0x010 m_Globals        : 0xffffda0f`f0157710 _FX_DRIVER_GLOBALS
   +0x018 m_ObjectFlags    : 0x819
   +0x018 m_ObjectFlagsByName : FxObject::<unnamed-tag>::<unnamed-type-m_ObjectFlagsByName>
   +0x01a m_ObjectState    : 1
   +0x020 m_ChildListHead  : _LIST_ENTRY [ 0xffffda00`0f16ed60 - 0xffffda00`0f16ed60 ]
   +0x030 m_SpinLock       : MxLock
   +0x040 m_ParentObject   : 0xffffda0f`f7ce3000 FxObject
   +0x048 m_ChildEntry     : _LIST_ENTRY [ 0xffffda00`0f171cc8 - 0xffffda00`0f170288 ]
   +0x058 m_DisposeSingleEntry : _SINGLE_LIST_ENTRY
   +0x060 m_DeviceBase     : 0xffffda0f`f7ce3000 FxDeviceBase
   +0x060 m_Device         : 0xffffda0f`f7ce3000 FxDevice
   +0x068 m_NPLock         : MxLock
   +0x078 m_WorkItem       : MxWorkItem
   +0x080 m_RunningDown    : 0 ''
   +0x081 m_Enqueued       : 0 ''
   +0x084 m_WorkItemRunningCount : 0
   +0x088 m_Object         : 0xffffda0f`f7ce3000 FxObject
   +0x090 m_CallbackLock   : (null)
   +0x098 m_CallbackLockObject : (null)
   +0x0a0 m_Callback       : 0xfffff800`9f760a28     void  amdacpbus2!AcpDspResponseWorkItem+0
   +0x0a8 m_WorkItemCompleted : FxCREvent
   +0x0c8 m_WorkItemThread : (null)
```

See https://learn.microsoft.com/en-us/windows-hardware/drivers/wdf/using-framework-work-items for more info on work item.

 We must be queueing work item somewhere in our code, with `amdacpbus2!AcpDspResponseWorkItem` as callback. Search code on what we’re doing.

```cpp
NTSTATUS
AcpCreateDspResponseWorkItems(
    _In_ AcpDeviceContext_t* _pDevCtx
)
{
    NTSTATUS Status = STATUS_UNSUCCESSFUL;
    ULONG Dspindex = 0;
    AcpWorkItemContext_t* workitemContext = NULL;

    if (_pDevCtx &&
        _pDevCtx->dsp_count > 0)
    {
        _pDevCtx->pDspResponseWorkItemHandles = (WDFWORKITEM*)AcpAlloc((sizeof(WDFWORKITEM) * _pDevCtx->dsp_count),
            ACP_TAG_DSP_RESPONSE_WORKITEM,
                NonPagedPool);
        if (_pDevCtx->pDspResponseWorkItemHandles)
        {
            for (Dspindex = 0; Dspindex < _pDevCtx->dsp_count; Dspindex++)
            {
                //work-item to process command response
                Status = AcpWorkItemCreate(_pDevCtx->AcpWdfDevice,
                    AcpDspResponseWorkItem,
                    &_pDevCtx->pDspResponseWorkItemHandles[Dspindex]);
                if (NT_SUCCESS(Status)) {
                    workitemContext = AcpGetWorkItemContext(_pDevCtx->pDspResponseWorkItemHandles[Dspindex]);
                    workitemContext->pDevCtx = _pDevCtx;
                    workitemContext->dsp_id = Dspindex;
                }
                else
                {
                    DBG_MSG(DBG_ERR, "AcpWorkItemCreate failed, DspId %d!!!", Dspindex);
                    goto Exit;
                }
            }
        }
        else
        {
            DBG_MSG(DBG_ERR, "AcpAlloc failed");
        }
    }

Exit:
    return Status;
}
```

Take a look on what we’re doing in the work item callback.

```cpp
VOID
AcpDspResponseWorkItem(
    IN WDFWORKITEM _WorkItem
)
{
    AcpWorkItemContext_t* item;

    item = AcpGetWorkItemContext(_WorkItem);
    if (item)
    {
        EvGetResponse(item->pDevCtx,
            item->dsp_id);
    }
    else
    {
        DBG_MSG(DBG_WARN, "Invalid Workiten Context :0x%p", item);
    }
    return;
}
```

![](/images/blog/20241114-0x0-acpwdfworkitem-leak/3.png)