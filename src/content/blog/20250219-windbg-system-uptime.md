---
title: "WDF"
meta_title: ""
description: ""
date: 2025-02-19T12:00:00Z
image: ""
categories: ["OS"]
author: "Nick Kuo"
tags: ["Windows"]
draft: false
---
Trace print code of “System Uptime” unicode string.

```cpp
0:007> !for_each_module s-u @#Base @#End "System Uptime"
00007ffe`d8ec8e30  0053 0079 0073 0074 0065 006d 0020 0055  S.y.s.t.e.m. .U.
00007ffe`d8ec8e80  0053 0079 0073 0074 0065 006d 0020 0055  S.y.s.t.e.m. .U.
```

Full disassembly and cross reference, or HW BP. Find printing in `dbgeng!TargetInfo::OutputTime` 

```
0:007> k
 # Child-SP          RetAddr               Call Site
00 0000007e`04aff750 00007ffe`d8a3cee1     dbgeng!KernelDumpTargetInfo::GetCurrentSystemUpTimeN+0x5d
01 0000007e`04aff760 00007ffe`d8a5b6e4     dbgeng!TargetInfo::OutputTime+0x61
02 0000007e`04aff7c0 00007ffe`d894fabb     dbgeng!TargetInfo::RunInitializeEvent+0x4c
03 0000007e`04aff7f0 00007ffe`d88b9929     dbgeng!DumpTargetInfo::WaitForEvent+0x5b
04 0000007e`04aff860 00007ffe`d88bc2b8     dbgeng!RawWaitForEvent+0x3f1
05 0000007e`04aff920 00007ff7`4c21c80a     dbgeng!DebugClient::WaitForEvent+0xa8
06 0000007e`04aff950 00007fff`3033e8d7     windbg+0x1c80a
07 0000007e`04aff9c0 00007fff`3065fbcc     KERNEL32!BaseThreadInitThunk+0x17
08 0000007e`04aff9f0 00000000`00000000     ntdll!RtlUserThreadStart+0x2c
```

WinDbg get from `dbgeng!KernelDumpTargetInfo::GetCurrentSystemUpTimeN` 

Step-by-step trace: Return is from:

```cpp
rdx = *(dbgeng!KernelDumpTargetInfo+0x878)
rax = *(rdx+0x1030)
return rax
```

![image.png](attachment:f9a2eb64-99f5-4ecd-ad17-ea22babd46c2:image.png)

Accessing member, start from beginning. Trace ctor

```cpp
Breakpoint 0 hit
dbgeng!KernelDumpTargetInfo::KernelDumpTargetInfo:
00007ffe`d890432c 4053            push    rbx
0:007> k
 # Child-SP          RetAddr               Call Site
00 000000e7`c4dfdca8 00007ffe`d890442b     dbgeng!KernelDumpTargetInfo::KernelDumpTargetInfo
01 000000e7`c4dfdcb0 00007ffe`d8a53d6c     dbgeng!KernelSummaryDumpTargetInfo::KernelSummaryDumpTargetInfo+0x13
02 000000e7`c4dfdce0 00007ffe`d8bbc21b     dbgeng!NewFileTargetInfo+0x13c
03 000000e7`c4dfdd20 00007ffe`d8bbd1ed     dbgeng!ReptKernelTargetInfo::CreateNestedDumpTarget+0x3b
04 000000e7`c4dfdd60 00007ffe`d8a50564     dbgeng!ReptTargetInfo::IdentifyFromFile+0xcd
05 000000e7`c4dfde20 00007ffe`d8a507e6     dbgeng!IdentifyTargetFromDbsSource+0x138
06 000000e7`c4dfdea0 00007ffe`d8895179     dbgeng!IdentifyTargetFromFile+0x6e
07 000000e7`c4dfdee0 00007ffe`d888c5e6     dbgeng!<lambda_971da40fc4babb2db9c8959f73232322>::operator()+0x81d
08 000000e7`c4dff500 00007ffe`d889c7f0     dbgeng!Debugger::DataModel::ConvertException<<lambda_971da40fc4babb2db9c8959f73232322> >+0x12
09 000000e7`c4dff540 00007ffe`d88a232c     dbgeng!FileInitialize+0x5c
0a 000000e7`c4dff5b0 00007ffe`d88a226a     dbgeng!DebugClient::OpenDumpFileWithPrivateDumpHeader+0xb4
0b 000000e7`c4dff630 00007ff7`4c21f971     dbgeng!DebugClient::OpenDumpFileWide+0x1a
0c 000000e7`c4dff670 00007ff7`4c21c641     windbg+0x1f971
0d 000000e7`c4dffb40 00007fff`3033e8d7     windbg+0x1c641
0e 000000e7`c4dffbb0 00007fff`3065fbcc     KERNEL32!BaseThreadInitThunk+0x17
0f 000000e7`c4dffbe0 00000000`00000000     ntdll!RtlUserThreadStart+0x2c

```

We set write bp on first assignment: "rdx = *(dbgeng!KernelDumpTargetInfo+0x878)"

```cpp
0:007> r rcx
rcx=000002a669facb60
0:007> ba w 8 000002a669facb60+878
0:007> g
Breakpoint 1 hit
dbgeng!TargetInfo::TargetInfo+0x220:
00007ffe`d8a45430 4989bf10070000  mov     qword ptr [r15+710h],rdi ds:000002a6`69fad270=baadf00dbaadf00d
0:007> k
 # Child-SP          RetAddr               Call Site
00 000000e7`c4dfdbd0 00007ffe`d8903f16     dbgeng!TargetInfo::TargetInfo+0x220
01 000000e7`c4dfdc40 00007ffe`d8904347     dbgeng!DumpTargetInfo::DumpTargetInfo+0x2e
02 000000e7`c4dfdc80 00007ffe`d890442b     dbgeng!KernelDumpTargetInfo::KernelDumpTargetInfo+0x1b
03 000000e7`c4dfdcb0 00007ffe`d8a53d6c     dbgeng!KernelSummaryDumpTargetInfo::KernelSummaryDumpTargetInfo+0x13
04 000000e7`c4dfdce0 00007ffe`d8bbc21b     dbgeng!NewFileTargetInfo+0x13c
05 000000e7`c4dfdd20 00007ffe`d8bbd1ed     dbgeng!ReptKernelTargetInfo::CreateNestedDumpTarget+0x3b
06 000000e7`c4dfdd60 00007ffe`d8a50564     dbgeng!ReptTargetInfo::IdentifyFromFile+0xcd
07 000000e7`c4dfde20 00007ffe`d8a507e6     dbgeng!IdentifyTargetFromDbsSource+0x138
08 000000e7`c4dfdea0 00007ffe`d8895179     dbgeng!IdentifyTargetFromFile+0x6e
09 000000e7`c4dfdee0 00007ffe`d888c5e6     dbgeng!<lambda_971da40fc4babb2db9c8959f73232322>::operator()+0x81d
0a 000000e7`c4dff500 00007ffe`d889c7f0     dbgeng!Debugger::DataModel::ConvertException<<lambda_971da40fc4babb2db9c8959f73232322> >+0x12
0b 000000e7`c4dff540 00007ffe`d88a232c     dbgeng!FileInitialize+0x5c
0c 000000e7`c4dff5b0 00007ffe`d88a226a     dbgeng!DebugClient::OpenDumpFileWithPrivateDumpHeader+0xb4
0d 000000e7`c4dff630 00007ff7`4c21f971     dbgeng!DebugClient::OpenDumpFileWide+0x1a
0e 000000e7`c4dff670 00007ff7`4c21c641     windbg+0x1f971
0f 000000e7`c4dffb40 00007fff`3033e8d7     windbg+0x1c641
10 000000e7`c4dffbb0 00007fff`3065fbcc     KERNEL32!BaseThreadInitThunk+0x17
11 000000e7`c4dffbe0 00000000`00000000     ntdll!RtlUserThreadStart+0x2c
// Actually the previous is just zeroing. Let's go again

0:007> g
Breakpoint 1 hit
dbgeng!ReptKernelTargetInfo::CreateNestedDumpTarget+0x57:
00007ffe`d8bbc237 488b0e          mov     rcx,qword ptr [rsi] ds:000002a6`69facb60={dbgeng!KernelSummary32DumpTargetInfo::`vftable' (00007ffe`d8df0798)}
0:007> k
 # Child-SP          RetAddr               Call Site
00 000000e7`c4dfdd20 00007ffe`d8bbd1ed     dbgeng!ReptKernelTargetInfo::CreateNestedDumpTarget+0x57
01 000000e7`c4dfdd60 00007ffe`d8a50564     dbgeng!ReptTargetInfo::IdentifyFromFile+0xcd
02 000000e7`c4dfde20 00007ffe`d8a507e6     dbgeng!IdentifyTargetFromDbsSource+0x138
03 000000e7`c4dfdea0 00007ffe`d8895179     dbgeng!IdentifyTargetFromFile+0x6e
04 000000e7`c4dfdee0 00007ffe`d888c5e6     dbgeng!<lambda_971da40fc4babb2db9c8959f73232322>::operator()+0x81d
05 000000e7`c4dff500 00007ffe`d889c7f0     dbgeng!Debugger::DataModel::ConvertException<<lambda_971da40fc4babb2db9c8959f73232322> >+0x12
06 000000e7`c4dff540 00007ffe`d88a232c     dbgeng!FileInitialize+0x5c
07 000000e7`c4dff5b0 00007ffe`d88a226a     dbgeng!DebugClient::OpenDumpFileWithPrivateDumpHeader+0xb4
08 000000e7`c4dff630 00007ff7`4c21f971     dbgeng!DebugClient::OpenDumpFileWide+0x1a
09 000000e7`c4dff670 00007ff7`4c21c641     windbg+0x1f971
0a 000000e7`c4dffb40 00007fff`3033e8d7     windbg+0x1c641
0b 000000e7`c4dffbb0 00007fff`3065fbcc     KERNEL32!BaseThreadInitThunk+0x17
0c 000000e7`c4dffbe0 00000000`00000000     ntdll!RtlUserThreadStart+0x2c
```

At this point the stage is already set. RCX is already pointing to a populated struct with uptime. We need to backtrace where RCX came from.

![image.png](attachment:a1ebdb9e-7c60-4f75-902f-11d6ebf1cb2a:image.png)

We trace all the way back, RCX came from IdentifyTargetFromDbsSource. In fact, the ReptKernelTargetInfo and ReptTargetInfo is the same thing. (ReptKernelTargetInfo inherit ReptTargetInfo)

Let’s break on the icall that leads to `ReptTargetInfo::IdentifyFromFile` , and see if at that stage if it is already assigned.

```cpp
0:000> bp dbgeng!IdentifyTargetFromDbsSource
0:000> bp dbgeng!IdentifyTargetFromDbsSource+133
0:000> g
Breakpoint 0 hit
dbgeng!IdentifyTargetFromDbsSource:
00007ffe`d8a5042c 488bc4          mov     rax,rsp
0:007> k
 # Child-SP          RetAddr               Call Site
00 000000e3`8e57e078 00007ffe`d8a507e6     dbgeng!IdentifyTargetFromDbsSource
01 000000e3`8e57e080 00007ffe`d8895179     dbgeng!IdentifyTargetFromFile+0x6e
02 000000e3`8e57e0c0 00007ffe`d888c5e6     dbgeng!<lambda_971da40fc4babb2db9c8959f73232322>::operator()+0x81d
03 000000e3`8e57f6e0 00007ffe`d889c7f0     dbgeng!Debugger::DataModel::ConvertException<<lambda_971da40fc4babb2db9c8959f73232322> >+0x12
04 000000e3`8e57f720 00007ffe`d88a232c     dbgeng!FileInitialize+0x5c
05 000000e3`8e57f790 00007ffe`d88a226a     dbgeng!DebugClient::OpenDumpFileWithPrivateDumpHeader+0xb4
06 000000e3`8e57f810 00007ff7`4c21f971     dbgeng!DebugClient::OpenDumpFileWide+0x1a
07 000000e3`8e57f850 00007ff7`4c21c641     windbg!StartSession+0x931
08 000000e3`8e57fd20 00007fff`3033e8d7     windbg!EngineLoop+0xb1
09 000000e3`8e57fd90 00007fff`3065fbcc     KERNEL32!BaseThreadInitThunk+0x17
0a 000000e3`8e57fdc0 00000000`00000000     ntdll!RtlUserThreadStart+0x2c
0:007> g
Breakpoint 1 hit
dbgeng!IdentifyTargetFromDbsSource+0x133:
00007ffe`d8a5055f e8ac4a3200      call    dbgeng!guard_dispatch_icall$thunk$10345483385596137414 (00007ffe`d8d75010)
0:007> r rax
rax=00007ffed8bbd120
0:007> ln 00007ffed8bbd120
Browse module
Set bu breakpoint

(00007ffe`d8bbd120)   dbgeng!ReptTargetInfo::IdentifyFromFile   |  (00007ffe`d8bbd2f0)   dbgeng!ReptTargetInfo::InitNestedDumpTarget
Exact matches:
// Cool, looks fine
0:007> r rcx
rcx=000001fe89f0af40
0:007> dq 000001fe89f0af40+1030
000001fe`89f0bf70  00000000`00000000 00000000`00000000
000001fe`89f0bf80  00000000`00000000 00000000`00000000
000001fe`89f0bf90  00000000`00000000 000001fe`81ed2550
000001fe`89f0bfa0  00000000`00000000 00007ffe`d8e00c78
000001fe`89f0bfb0  00000000`00000000 00000000`00000000
000001fe`89f0bfc0  00000000`00000000 baadf00d`baad0000
000001fe`89f0bfd0  00000000`00000000 00000000`00000000
000001fe`89f0bfe0  00000000`00000000 00000000`00000000
```

Looks not assigned! Write ba here