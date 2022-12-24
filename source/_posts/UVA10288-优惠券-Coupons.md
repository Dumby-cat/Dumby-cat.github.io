---
title: UVA10288 优惠券 Coupons
date: 2022-07-18 19:06:24
tags:
- C++
- 概率
- 期望
- DP
- 线性DP
categories: Dumby的OI生涯
---

## 题意

简化题意如下：

每次随机取一个 $\left [ 1,n \right ]$ 的整数，问期望几次能够凑齐所有数。

<!--more-->

## 思路

我们设 $f\_{i}$ 为取出第 $i$ 个数期望需要的次数，$p\_{i}$ 为取出第 $i$ 个数的概率。

已经取出 $i-1$ 个数，所以 $p\_{i}$ 就是 $\frac{n-i+1}{n}$。

我们有个结论：概率为 $p$ 的事件期望 $\frac{1}{p}$ 次后发生。

证明：

设 $E\left( X \right)$ 为发生概率为 $P\left( X \right)$ 的事件 $X$ 发生期望需要的次数。

那么我们有：

$E\left(X\right)=\\sum\_{i=1}^{\infty } i\left(1-P\right)^{i-1}P$

$E\left(X\right)=P\\sum\_{i=1}^{\infty } i\left(1-P\right)^{i-1}$

令：

$S= \\sum\_{i=1}^{\infty}i\left(1-P\right)^{i-1}$

$\therefore S=1+2\left(1-P\right)+3\left(1-P\right)^{2}+...$

$\left(1-P\right)S=\left(1-P\right)+2\left(1-P\right)^{2}+...$

$S-\left(1-P\right)S=1+\left(1-P\right)+\left(1-P\right)^{2}+...$

$P \times S=\frac{1}{1-\left(1-P\right)}=\frac{1}{P}$


$S=\frac{1}{P^{2}}$

$\therefore E\left(X\right)=P\times S=P\times \frac{1}{P^{2}}=\frac{1}{P}$

所以，我们能得到 $f\_{i}=\frac{n}{n-i+1}$。

所以取出所有数期望次数 $F={\textstyle \sum\_{i=1}^{n}f\_{i}}={\textstyle \sum\_{i=1}^{n}\frac{n}{n-i+1}}={\textstyle \sum\_{i=1}^{n}\frac{n}{i}}$。

根据这个式子计算答案就好了。

## 代码
```cpp
#include<bits/stdc++.h>
#define int long long
int n;
int gcd(int a, int b) {
	return b ? gcd(b, a % b) : a;
}
signed main() {
	ios::sync_with_stdio(false);
	while (cin >> n) {
		int son = n, mother = 1;
		for (int i = 2; i <= n; i++) {
			son = son * i + n * mother;
			mother *= i;
			int g = gcd(son, mother);
			son /= g;
			mother /= g;
		}
		//输出部分
		if (son % mother == 0) {
			printf("%lld\n", son / mother);
			continue;
		} else {
			int c = log10(son / mother) + 1;
			int c2 = log10(mother) + 1;
			for (int i = 1; i <= c + 1; i++)printf(" ");
			printf("%lld\n", son % mother);
			printf("%lld ", son / mother);
			for (int i = 1; i <= c2; i++)printf("-");
			puts("");
			for (int i = 1; i <= c + 1; i++)printf(" ");
			printf("%lld\n", mother);
		}
	}
	return 0;
}
```