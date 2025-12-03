---
title: "!pte \"Levels not implemented for this platform\""
meta_title: ""
description: ""
date: 2024-07-17T12:00:00Z
image: ""
categories: ["OS"]
author: "Nick Kuo"
tags: ["Windows"]
draft: false
---
`!pte` command comes from extension `kdexts.dll`, which is bundled with debuggers for Windows package.

The command performs machine type check with the following code:

![](/images/blog/20240717-pte-levels-not-implemented/1.png)

`g_TargetMachine` is `0x8664` indicates x86 64-bit processors. The x86 64bit Windows kernel uses 4 level paging as defined in AMD64 architecture.

`DbgPagingLevels` should indicate the levels of paging the operating system is using, `!pte` only supports 4 level paging on x86-64, otherwise it will outputs “Levels not implemented for this platform”.

The `DbgPagingLevels` is a global preloaded in `kdexts`, it is read by the following code:

![](/images/blog/20240717-pte-levels-not-implemented/2.png)

In `nt!MiState` global, the field `Vs.PagingLevels` stores the paging level in a byte. Inspecting the value reveals it value is 0xff, leading up to the error message since `0xff` > 5 in dump.

![](/images/blog/20240717-pte-levels-not-implemented/3.png)

To get `!pte` working, you could directly patch the value to 4 with `ed`. Keep in mind the value is cached as global in `kdexts`, if it is cached, you need to reload the extension or just restart the debug session.

![](/images/blog/20240717-pte-levels-not-implemented/4.png)