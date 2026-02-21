---
title: Git恢复误删文件
tags: 
  - 站务:公告通知
categories: Dumby的硬核折腾笔记
abbrlink: 5dd96eb
date: 2023-02-25 17:27:20
---

放这篇文章给自己看，怕自己又脑瘫整出些逆天操作，因此在这留个后路。

<!--more-->

首先运行 ```$git log```，找到上次的commit的ID，然后运行 ```$git reset --hard <ID>```

然后应该就没问题了。

哦对了，```$git log``` 按 q 键退出。