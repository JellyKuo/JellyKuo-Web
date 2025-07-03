---
title: "Block Linux driver with PCI Device ID"
meta_title: ""
description: ""
date: 2024-01-10T12:00:00Z
image: ""
categories: ["OS"]
author: "Nick Kuo"
tags: ["Linux"]
draft: false
---

# 1. Find the device ID to blacklist
```cpp
nick@swae-ws:~$ lspci | grep VGA
43:00.0 VGA compatible controller: Advanced Micro Devices, Inc. [AMD/ATI] Device 7448
63:00.0 VGA compatible controller: Advanced Micro Devices, Inc. [AMD/ATI] Device 7448
```

In this case let’s blacklist 43:00

# 2. Find all devices on bus
Look for the bus ID, which should reveal all devices attached to the GPU PCI-E bus

```cpp
nick@swae-ws:~$ lspci -nn | grep 43:00
43:00.0 VGA compatible controller [0300]: Advanced Micro Devices, Inc. [AMD/ATI] Device [1002:7448]
43:00.1 Audio device [0403]: Advanced Micro Devices, Inc. [AMD/ATI] Device [1002:ab30] 
```

Note down the device IDs, in this case its `1002:7448` and `1002:ab30`

# 3. Update GRUB boot args
```bash
sudo nano /etc/default/grub
# Update the line that starts with "GRUB_CMDLINE_LINUX_DEFAULT"
# Append to the end: "vfio-pci.ids=1002:7448,1002:ab30"
# The result should look like this:
GRUB_CMDLINE_LINUX_DEFAULT="quiet splash vfio-pci.ids=1002:7448,1002:ab30"
# Ctrl+X -> Y -> Enter
sudo update-grub
```

Reboot the system, after reboot, the device will not be handed over to the driver. **Make sure displays continue to work (Eg connect to another adapter)**

# 4. Validate
```bash
lspci -nnv
```

Find the device in question, find the line **`Kernel driver in use:` . It should show `vfio-pci`**