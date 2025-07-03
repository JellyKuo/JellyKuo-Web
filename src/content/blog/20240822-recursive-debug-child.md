---
title: "Recursively Debug User-Mode Child Process"
meta_title: ""
description: ""
date: 2024-08-22T12:00:00Z
image: ""
categories: ["OS"]
author: "Nick Kuo"
tags: ["Windows"]
draft: false
---
When you enable “debug child process” in WinDbg, it only attempts to debug the children. 

```
0:000> sxe -c ".childdbg 1;bu wlanapi!WlanQueryInterface;bu wlanapi!WlanGetAvailableNetworkList;bu wlanapi!WlanGetNetworkBssList;bu wlanapi!WlanScan;g" ibp
0:000> sxd epr
```