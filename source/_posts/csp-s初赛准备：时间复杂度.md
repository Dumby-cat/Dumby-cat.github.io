---
title: csp-s初赛准备：时间复杂度
tags:
  - 算法:基础与复杂度
categories: Dumby的OI/算法竞赛
abbrlink: 4ce99d46
date: 2022-09-18 09:57:51
---

初赛似乎是必考一题时间复杂度计算，现在在考前抱下佛脚。

<!--more-->

## 主定理

给定这样一个式子：

$T \left ( n \right ) = a T\left ( \frac{n}{b}  \right )+ n^{d}P$

其中 $P$ 表示一个式子，通常 $P=\log^{k}{n},k \ge 0$，如 $T \left ( n \right ) = 2 T\left ( \frac{n}{2}  \right )+ n\log{n}$ 时，则 $d=1, P=log{n}$

然后分三种情况：

1. $n^{\\log\_{b}{a}} > n^{d}$，则 $T \left ( n \right ) = n^{\\log\_{b}{a}}$
2. $n^{\\log\_{b}{a}} < n^{d}$，则 $T \left ( n \right ) = n^{d}$
3. $n^{\\log\_{b}{a}} = n^{d}$，当 $P=\log^{k}{n}$ 时，即后面带的那个式子是 $n^{d}\log^{k}{n}$ 时，$T \left ( n \right ) = n^{d}\log^{k+1}{n}$

这样初赛中绝大多数时间复杂度题应该都能过了。

## 递归、递归树

最好懂最无脑，考场上时间够可以用这个。