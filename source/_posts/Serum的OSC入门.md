---
title: Serum的OSC入门
date: 2022-11-27 19:17:03
tags:
- 合成器
categories: Dumby的折腾笔记
---

本帖用于自习Serum的振荡器模块。

<!--more-->

还是这张图。

{% asset_img serum的osc.png OSC %}

一个一个看。

{% asset_img 波形.png 波形 %}

最上面这个自然是**波形（Waveform）**了（红框里的）。

两个红框之间的是**音高（Pitch）**调整。

OCT（Octave）：八度音高

SEM（Semi）：半音音高

FIN（fine）：微调

CRS（CoarsePit）：粗调

接下来有这些东西：

{% asset_img 下方.png 其他参数 %}

UNISON：合奏，即同时演奏的声音数量。

DETUNE：失谐，即同时演奏的声音之间相差的音高大小。

BLEND：同时演奏的声音之间相差的音量（**实际上是电平**，两者并不一样，但是改变电平的直观感受是改变音量）大小。

{% asset_img unison.png 调节的界面 %}

这几个东西右边的有这两个：PHASE、RAND。

PHASE：相位，之前在FFT（傅里叶分析）的那篇博客里提到过，即“用来确定一个波在循环中的位置的东西”。再说简单点，就是声音开始的位置。

RAND（RANDOM）：随机，就是将每个同时演奏的声音的相位随机改变一点。这样可以改变一些奇奇怪怪的问题（比如将一个锯齿波的UNISON调高后，你把RANDOM为0和最高时发出的两种声音对比一下）。

对于Serum合成器来说，每个波形最多有256帧（Frame）。

你可以单击波形显示的地方，然后它的波形的显示界面会变成这样：

{% asset_img 子波形.png 默认波形的所有帧 %}

默认的锯齿波看这个并不明显，我们可以随便切换一个别的波形（这里拿Acid举例子），它的所有帧叠起来是这样的：

{% asset_img acid子波形.png Acid的所有帧 %}

而下面的WT POS，就是调整帧用的。

WT POS（WaveTable Position）：波形位置，即当前选中的是波形的哪一帧。

WT POS右边有一个默认是OFF的旋钮，它是Warp，这个之后细讲一下，这里先略过。

PAN：声像，即左右声道，带上耳机开个立体声调下就知道了。

LEVEL：电平，通常拿来当音量用，上面说了，“两者并不一样，但是改变电平的直观感受是改变音量”。

在波形显示的地方右上角有个笔的图案，点击后进入波形编辑界面，比较复杂，这里也先略过。

之后（可能）会详细讲一下Serum的振荡器中各个部分。

参考：
- [B站UP主@Mask不是马赛克的文章《电子音乐人必备合成器战法之Serum新手完全入门教学》](https://www.bilibili.com/read/cv758489)
- [B站UP主@AndreChen的教学视频 《【合辑】【合成器基础教学】入门/通用/必备知识——Abletive教学视频站》](https://www.bilibili.com/video/BV1Ys411i7hF)
- [B站UP主@泰迪Ted-E的教学视频 《【Xfer Records SERUM 血清合成器系列教程】》](https://www.bilibili.com/video/BV1op411f7Dr)