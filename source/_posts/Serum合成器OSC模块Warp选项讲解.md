---
title: Serum合成器OSC模块Warp选项讲解
date: 2023-01-07 12:28:58
tags:
- 合成器
categories: Dumby的折腾笔记
---

本帖用于介绍 Serum 的振荡器模块中的 Warp 选项。

<!--more-->

之前讲到 WT POS 选项边上有个 Warp 选项，就是这个：

{% asset_img 位置.png 位置 %}

Warp：弯曲、变形。

这个选项的功能对着波形图边调边看很容易就明白了。

官方给出的解释是：

{% asset_img 功能解释.png 功能 %}

即基于当前的Warp选择调整当前的波形。

我们拿正弦波来举例子（波形选择目录里选择Analog\Basic Shapes，调整WT POS 可以得到几个基础波形）。

{% asset_img 正弦波.png 正弦波 %}

## Warp Menu 总览

点击默认的OFF，打开一个目录（即Warp Menu），如图：

{% asset_img 目录.png Warp_Menu %}

每一个选项都有很有意思的功能，下面一个一个看。

## SYNC

SYNC：同步（？）。

调一下旋钮就知道这东西干嘛用的了。

{% asset_img 调整SYNC.gif 调整SYNC %}

应该不会注意不到波形的变化吧。

很显然，SYNC调的越高，波的周期越小，频率越大，单位时间内出现的同样的波形越多，音调越高。

但要注意，如果用的是正弦波这种连续变化的波形，在调到这种位置的时候：

{% asset_img 调SYNC.jpg 调到这种位置 %}

由于右边的波形被截掉了，相当于有一个突变（和锯齿波的那种类似），声音就会夹杂着类似锯齿波的声音，比较刺耳。

但如果用锯齿波来调的话，因为本身就是这种声音，所以除了音调变化听不大出来其他的变化。

### SYNC WINDOW

如果不想有刚才的“突变”的问题，可以选择 SYNC WINDOW 这个选项。

这个选项分两种： SYNC 1/2 WIN. 和 SYNC WINDOW。

这个东西就相当于在波形的两侧加上淡入淡出，使声音变得更平滑，不会使连续变化的波形出现突变的情况。

当然如果你用锯齿波的话，当 Warp 的数值低的时候，锯齿波会被柔和成类似正弦波的东西。

SYNC 1/2 WIN. 相当于是淡入淡出更快的 SYNC WINDOW。

SYNC WINDOW：

{% asset_img SYNC_WINDOW.jpg SYNC_WINDOW %}

{% asset_img SYNC_WINDOW.gif SYNC_WINDOW %}

SYNC 1/2 WIN.：

{% asset_img SYNC_1-2_WIN.jpg SYNC_1/2_WIN. %}

{% asset_img SYNC_1-2_WIN.gif SYNC_1/2_WIN. %}

## BEND

BEND：弯曲。

### BEND +

将波形向内弯曲，效果如下：

{% asset_img BEND+.gif BEND+ %}

### BEND -

将波形向外弯曲，效果如下：

{% asset_img BEND-.gif BEND- %}

### BEND +/-

数值为负时向内弯曲，为正时向外弯曲，效果如下：

{% asset_img BEND+-.gif BEND+/- %}

## PWM

PWM：脉冲宽度调制（Pulse Width Modulation）。

相当于将波形宽度（即“脉冲宽度”）变窄，效果如下：

{% asset_img 正弦PWM.gif 正弦波PWM %}

{% asset_img 方波PWM.gif 方波PWM %}

## ASYM

ASYM：非对称（即非对称弯曲）。

ASYM 的作用大概就是将波形左右两边分别压缩或拉伸。

### ASYM +

将波形左半边压缩，右半边拉伸，效果如下：

{% asset_img ASYM+.gif ASYM+ %}

### ASYM -

将波形左半边拉伸，右半边压缩，效果如下：

{% asset_img ASYM-.gif ASYM- %}

### ASYM +/-

数值为负时，将波形左半边压缩，右半边拉伸；数值为正时，将波形左半边拉伸，右半边压缩，效果如下：

{% asset_img ASYM+-.gif ASYM+- %}

## FLIP

FLIP：翻转。

将波形进行相位反转，效果如下：

{% asset_img FLIP.gif FLIP %}

未完待续。。。