---
title: "Rundown Protection"
meta_title: ""
description: ""
date: 2024-10-21T12:00:00Z
image: ""
categories: ["OS"]
author: "Nick Kuo"
tags: ["Windows"]
draft: false
---
Acquire with nt!ExAcquireRundownProtection.

```jsx
0: kd> uf fffff802`148c8d80
nt!ExAcquireRundownProtection [minkernel\ntos\ex\rundown.c @ 333]:
  333 fffff802`148c8d80 4883ec28        sub     rsp,28h
  337 fffff802`148c8d84 0f0d09          prefetchw [rcx]
  338 fffff802`148c8d87 488b01          mov     rax,qword ptr [rcx]
  339 fffff802`148c8d8a 4883e0fe        and     rax,0FFFFFFFFFFFFFFFEh
  340 fffff802`148c8d8e 488d5002        lea     rdx,[rax+2]
  341 fffff802`148c8d92 f0480fb111      lock cmpxchg qword ptr [rcx],rdx
  345 fffff802`148c8d97 7508            jne     nt!ExAcquireRundownProtection+0x21 (fffff802`148c8da1)  Branch

nt!ExAcquireRundownProtection+0x19 [minkernel\ntos\ex\rundown.c @ 346]:
  346 fffff802`148c8d99 b001            mov     al,1

nt!ExAcquireRundownProtection+0x1b [minkernel\ntos\ex\rundown.c @ 351]:
  351 fffff802`148c8d9b 4883c428        add     rsp,28h
  351 fffff802`148c8d9f c3              ret

nt!ExAcquireRundownProtection+0x21 [minkernel\ntos\ex\rundown.c @ 349]:
  349 fffff802`148c8da1 e80a000000      call    nt!ExfAcquireRundownProtection (fffff802`148c8db0)
  349 fffff802`148c8da6 ebf3            jmp     nt!ExAcquireRundownProtection+0x1b (fffff802`148c8d9b)  Branch

```

Doesn’t seem like the user will be tracked in any type of way…

```jsx
0: kd> uf fffff802`148c8ee0
nt!ExReleaseRundownProtection [minkernel\ntos\ex\rundown.c @ 538]:
  538 fffff802`148c8ee0 4883ec28        sub     rsp,28h
  542 fffff802`148c8ee4 0f0d09          prefetchw [rcx]
  543 fffff802`148c8ee7 488b01          mov     rax,qword ptr [rcx]
  544 fffff802`148c8eea 4883e0fe        and     rax,0FFFFFFFFFFFFFFFEh
  545 fffff802`148c8eee 488d50fe        lea     rdx,[rax-2]
  546 fffff802`148c8ef2 f0480fb111      lock cmpxchg qword ptr [rcx],rdx
  550 fffff802`148c8ef7 7506            jne     nt!ExReleaseRundownProtection+0x1f (fffff802`148c8eff)  Branch

nt!ExReleaseRundownProtection+0x19 [minkernel\ntos\ex\rundown.c @ 563]:
  563 fffff802`148c8ef9 4883c428        add     rsp,28h
  563 fffff802`148c8efd c3              ret

nt!ExReleaseRundownProtection+0x1f [minkernel\ntos\ex\rundown.c @ 551]:
  551 fffff802`148c8eff e83c070000      call    nt!ExfReleaseRundownProtection (fffff802`148c9640)
  551 fffff802`148c8f04 ebf3            jmp     nt!ExReleaseRundownProtection+0x19 (fffff802`148c8ef9)  Branch

```

Release code is basically same.

```jsx

0: kd> uf fffff802`1491dea0
nt!ExWaitForRundownProtectionRelease [minkernel\ntos\ex\rundown.c @ 974]:
  974 fffff802`1491dea0 4883ec28        sub     rsp,28h
  985 fffff802`1491dea4 ba01000000      mov     edx,1
  985 fffff802`1491dea9 33c0            xor     eax,eax
  985 fffff802`1491deab f0480fb111      lock cmpxchg qword ptr [rcx],rdx
  989 fffff802`1491deb0 4883f802        cmp     rax,2
  989 fffff802`1491deb4 7306            jae     nt!ExWaitForRundownProtectionRelease+0x1c (fffff802`1491debc)  Branch

nt!ExWaitForRundownProtectionRelease+0x16 [minkernel\ntos\ex\rundown.c @ 992]:
  992 fffff802`1491deb6 4883c428        add     rsp,28h
  992 fffff802`1491deba c3              ret

nt!ExWaitForRundownProtectionRelease+0x1c [minkernel\ntos\ex\rundown.c @ 990]:
  990 fffff802`1491debc 488bd0          mov     rdx,rax
  990 fffff802`1491debf e8b4950c00      call    nt!ExfWaitForRundownProtectionRelease (fffff802`149e7478)
  990 fffff802`1491dec4 ebf0            jmp     nt!ExWaitForRundownProtectionRelease+0x16 (fffff802`1491deb6)  Branch
  
  
0: kd> uf fffff802`149e7478
nt!ExfWaitForRundownProtectionRelease [minkernel\ntos\ex\rundown.c @ 845]:
  845 fffff802`149e7478 48895c2410      mov     qword ptr [rsp+10h],rbx
  845 fffff802`149e747d 48897c2418      mov     qword ptr [rsp+18h],rdi
  845 fffff802`149e7482 55              push    rbp
  845 fffff802`149e7483 488bec          mov     rbp,rsp
  845 fffff802`149e7486 4883ec60        sub     rsp,60h
  846 fffff802`149e748a 4533d2          xor     r10d,r10d
  862 fffff802`149e748d 48c745f001000000 mov     qword ptr [rbp-10h],1
  870 fffff802`149e7495 488bda          mov     rbx,rdx
  846 fffff802`149e7498 4c8955e8        mov     qword ptr [rbp-18h],r10
  846 fffff802`149e749c 0f57c0          xorps   xmm0,xmm0
  870 fffff802`149e749f 48d1eb          shr     rbx,1
  880 fffff802`149e74a2 4c8d45d0        lea     r8,[rbp-30h]
  881 fffff802`149e74a6 488bc2          mov     rax,rdx
  862 fffff802`149e74a9 418d7a01        lea     edi,[r10+1]
  880 fffff802`149e74ad 4c0bc7          or      r8,rdi
  846 fffff802`149e74b0 f30f7f45d8      movdqu  xmmword ptr [rbp-28h],xmm0

nt!ExfWaitForRundownProtectionRelease+0x3d [minkernel\ntos\ex\rundown.c @ 881]:
  881 fffff802`149e74b5 48895dd0        mov     qword ptr [rbp-30h],rbx
  881 fffff802`149e74b9 f04c0fb101      lock cmpxchg qword ptr [rcx],r8
  885 fffff802`149e74be 0f8495000000    je      nt!ExfWaitForRundownProtectionRelease+0xe1 (fffff802`149e7559)  Branch

nt!ExfWaitForRundownProtectionRelease+0x4c [minkernel\ntos\ex\rundown.c @ 870]:
  870 fffff802`149e74c4 488bd8          mov     rbx,rax
  870 fffff802`149e74c7 48d1eb          shr     rbx,1
  870 fffff802`149e74ca ebe9            jmp     nt!ExfWaitForRundownProtectionRelease+0x3d (fffff802`149e74b5)  Branch

nt!ExfWaitForRundownProtectionRelease+0x54 [minkernel\ntos\ex\rundown.c @ 926]:
  926 fffff802`149e74cc 8b1d5602a800    mov     ebx,dword ptr [nt!ExpSpinCycleCount (fffff802`15467728)]
  926 fffff802`149e74d2 48b86a03000080f7ffff mov rax,0FFFFF7800000036Ah
  926 fffff802`149e74dc 663938          cmp     word ptr [rax],di
  926 fffff802`149e74df 0f869c000000    jbe     nt!ExfWaitForRundownProtectionRelease+0x109 (fffff802`149e7581)  Branch

nt!ExfWaitForRundownProtectionRelease+0x6d [minkernel\ntos\ex\rundown.c @ 926]:
  926 fffff802`149e74e5 48b89702000080f7ffff mov rax,0FFFFF78000000297h
  926 fffff802`149e74ef 443810          cmp     byte ptr [rax],r10b
  926 fffff802`149e74f2 0f84c8000000    je      nt!ExfWaitForRundownProtectionRelease+0x148 (fffff802`149e75c0)  Branch

nt!ExfWaitForRundownProtectionRelease+0x80 [minkernel\ntos\ex\rundown.c @ 926]:
  926 fffff802`149e74f8 0f31            rdtsc
  926 fffff802`149e74fa 48c1e220        shl     rdx,20h
  926 fffff802`149e74fe 480bc2          or      rax,rdx
  926 fffff802`149e7501 4c8bc0          mov     r8,rax
  926 fffff802`149e7504 4c8d0c18        lea     r9,[rax+rbx]

nt!ExfWaitForRundownProtectionRelease+0x90 [minkernel\ntos\ex\rundown.c @ 926]:
  926 fffff802`149e7508 33c9            xor     ecx,ecx
  926 fffff802`149e750a 488d45f0        lea     rax,[rbp-10h]
  926 fffff802`149e750e 33d2            xor     edx,edx
  926 fffff802`149e7510 0f01fa          monitorx rax,rcx,rdx
  926 fffff802`149e7513 8b4df0          mov     ecx,dword ptr [rbp-10h]
  926 fffff802`149e7516 4084cf          test    dil,cl
  926 fffff802`149e7519 742a            je      nt!ExfWaitForRundownProtectionRelease+0xcd (fffff802`149e7545)  Branch

nt!ExfWaitForRundownProtectionRelease+0xa3 [minkernel\ntos\ex\rundown.c @ 926]:
  926 fffff802`149e751b 498bc8          mov     rcx,r8
  926 fffff802`149e751e 0f31            rdtsc
  926 fffff802`149e7520 48c1e220        shl     rdx,20h
  926 fffff802`149e7524 480bc2          or      rax,rdx
  926 fffff802`149e7527 4c8bc0          mov     r8,rax
  926 fffff802`149e752a 483bc1          cmp     rax,rcx
  926 fffff802`149e752d 7252            jb      nt!ExfWaitForRundownProtectionRelease+0x109 (fffff802`149e7581)  Branch

nt!ExfWaitForRundownProtectionRelease+0xb7 [minkernel\ntos\ex\rundown.c @ 926]:
  926 fffff802`149e752f 493bc1          cmp     rax,r9
  926 fffff802`149e7532 734d            jae     nt!ExfWaitForRundownProtectionRelease+0x109 (fffff802`149e7581)  Branch

nt!ExfWaitForRundownProtectionRelease+0xbc [minkernel\ntos\ex\rundown.c @ 926]:
  926 fffff802`149e7534 418bd9          mov     ebx,r9d
  926 fffff802`149e7537 b902000000      mov     ecx,2
  926 fffff802`149e753c 2bd8            sub     ebx,eax
  926 fffff802`149e753e 33c0            xor     eax,eax
  926 fffff802`149e7540 0f01fb          mwaitx  rax,rcx,rbx
  926 fffff802`149e7543 ebc3            jmp     nt!ExfWaitForRundownProtectionRelease+0x90 (fffff802`149e7508)  Branch

nt!ExfWaitForRundownProtectionRelease+0xcd [minkernel\ntos\ex\rundown.c @ 928]:
  928 fffff802`149e7545 90              nop

nt!ExfWaitForRundownProtectionRelease+0xce [minkernel\ntos\ex\rundown.c @ 964]:
  964 fffff802`149e7546 4c8d5c2460      lea     r11,[rsp+60h]
  964 fffff802`149e754b 498b5b18        mov     rbx,qword ptr [r11+18h]
  964 fffff802`149e754f 498b7b20        mov     rdi,qword ptr [r11+20h]
  964 fffff802`149e7553 498be3          mov     rsp,r11
  964 fffff802`149e7556 5d              pop     rbp
  964 fffff802`149e7557 c3              ret

nt!ExfWaitForRundownProtectionRelease+0xe1 [minkernel\ntos\ex\rundown.c @ 886]:
  886 fffff802`149e7559 4885db          test    rbx,rbx
  886 fffff802`149e755c 74e8            je      nt!ExfWaitForRundownProtectionRelease+0xce (fffff802`149e7546)  Branch

nt!ExfWaitForRundownProtectionRelease+0xe6 [minkernel\ntos\ex\rundown.c @ 890]:
  890 fffff802`149e755e 44895510        mov     dword ptr [rbp+10h],r10d
  892 fffff802`149e7562 440f20c0        mov     rax,cr8
  892 fffff802`149e7566 3c02            cmp     al,2
  892 fffff802`149e7568 0f825effffff    jb      nt!ExfWaitForRundownProtectionRelease+0x54 (fffff802`149e74cc)  Branch

nt!ExfWaitForRundownProtectionRelease+0xf6 [minkernel\ntos\ex\rundown.c @ 903]:
  903 fffff802`149e756e 8b45f0          mov     eax,dword ptr [rbp-10h]
  903 fffff802`149e7571 4084c7          test    dil,al
  903 fffff802`149e7574 74cf            je      nt!ExfWaitForRundownProtectionRelease+0xcd (fffff802`149e7545)  Branch

nt!ExfWaitForRundownProtectionRelease+0xfe [minkernel\ntos\ex\rundown.c @ 905]:
  905 fffff802`149e7576 488d4d10        lea     rcx,[rbp+10h]
  905 fffff802`149e757a e8c178faff      call    nt!KeYieldProcessorEx (fffff802`1498ee40)
  906 fffff802`149e757f ebed            jmp     nt!ExfWaitForRundownProtectionRelease+0xf6 (fffff802`149e756e)  Branch

nt!ExfWaitForRundownProtectionRelease+0x109 [minkernel\ntos\ex\rundown.c @ 935]:
  935 fffff802`149e7581 488d45e0        lea     rax,[rbp-20h]
  935 fffff802`149e7585 66897dd8        mov     word ptr [rbp-28h],di
  935 fffff802`149e7589 488945e8        mov     qword ptr [rbp-18h],rax
  935 fffff802`149e758d 488d45e0        lea     rax,[rbp-20h]
  935 fffff802`149e7591 488945e0        mov     qword ptr [rbp-20h],rax
  943 fffff802`149e7595 488d45f0        lea     rax,[rbp-10h]
  935 fffff802`149e7599 c645da06        mov     byte ptr [rbp-26h],6
  935 fffff802`149e759d 448955dc        mov     dword ptr [rbp-24h],r10d
  943 fffff802`149e75a1 f00fba3000      lock btr dword ptr [rax],0
  943 fffff802`149e75a6 739e            jae     nt!ExfWaitForRundownProtectionRelease+0xce (fffff802`149e7546)  Branch

nt!ExfWaitForRundownProtectionRelease+0x130 [minkernel\ntos\ex\rundown.c @ 946]:
  946 fffff802`149e75a8 4533c9          xor     r9d,r9d
  946 fffff802`149e75ab 4c89542420      mov     qword ptr [rsp+20h],r10
  946 fffff802`149e75b0 4533c0          xor     r8d,r8d
  946 fffff802`149e75b3 488d4dd8        lea     rcx,[rbp-28h]
  946 fffff802`149e75b7 33d2            xor     edx,edx
  946 fffff802`149e75b9 e882d9e3ff      call    nt!KeWaitForSingleObject (fffff802`14824f40)
  946 fffff802`149e75be eb86            jmp     nt!ExfWaitForRundownProtectionRelease+0xce (fffff802`149e7546)  Branch

nt!ExfWaitForRundownProtectionRelease+0x148 [minkernel\ntos\ex\rundown.c @ 926]:
  926 fffff802`149e75c0 48b8d602000080f7ffff mov rax,0FFFFF780000002D6h
  926 fffff802`149e75ca 33d2            xor     edx,edx
  926 fffff802`149e75cc 0fb708          movzx   ecx,word ptr [rax]
  926 fffff802`149e75cf 8bc3            mov     eax,ebx
  926 fffff802`149e75d1 f7f1            div     eax,ecx
  926 fffff802`149e75d3 418bd2          mov     edx,r10d
  926 fffff802`149e75d6 e99b512b00      jmp     nt!ExfWaitForRundownProtectionRelease+0x2b52fe (fffff802`14c9c776)  Branch

nt!ExfWaitForRundownProtectionRelease+0x2b52fe [minkernel\ntos\ex\rundown.c @ 926]:
  926 fffff802`14c9c776 8b4df0          mov     ecx,dword ptr [rbp-10h]
  926 fffff802`14c9c779 4084cf          test    dil,cl
  926 fffff802`14c9c77c 0f84c3add4ff    je      nt!ExfWaitForRundownProtectionRelease+0xcd (fffff802`149e7545)  Branch

nt!ExfWaitForRundownProtectionRelease+0x2b530a [minkernel\ntos\ex\rundown.c @ 926]:
  926 fffff802`14c9c782 3bd0            cmp     edx,eax
  926 fffff802`14c9c784 0f84f7add4ff    je      nt!ExfWaitForRundownProtectionRelease+0x109 (fffff802`149e7581)  Branch

nt!ExfWaitForRundownProtectionRelease+0x2b5312 [minkernel\ntos\ex\rundown.c @ 926]:
  926 fffff802`14c9c78a f390            pause
  926 fffff802`14c9c78c 03d7            add     edx,edi
  926 fffff802`14c9c78e ebe6            jmp     nt!ExfWaitForRundownProtectionRelease+0x2b52fe (fffff802`14c9c776)  Branch
```