---
title: Luogu P5136 sequence 题解报告
tags:
  - 编程:C++
  - 算法:数论与数学
categories: Dumby的OI/算法竞赛
abbrlink: c69d20bb
date: 2021-08-27 15:25:29
---

Luogu P5136 sequence 题解。

<!--more-->

## 题目描述

~~试~~求出：

$\left \lceil \left ( \frac{1+\sqrt{5}}{2}  \right )^{n}  \right \rceil \bmod 998244353$

多测

## 题解报告

有一道本题的进阶版：[洛谷 P3263 有意义的字符串](https://www.luogu.com.cn/problem/P3263)。

看楼下大佬们都是找规律推递推式，我来一个略有不同的解法（不一样的递推式，主体都为矩乘）。

先不考虑向上取整和取模运算。首先需要将根号去掉，否则会有小数。

可以想到在原式后加上一个 $\left ( \frac{1-\sqrt{5}}{2}  \right )^{n}$，使式子变为：

$ \left ( \frac{1+\sqrt{5}}{2}  \right )^{n} + \left ( \frac{1-\sqrt{5}}{2}  \right )^{n} $

此时便可以将根号消掉。（注意最后需要减去一个 $\left ( \frac{1-\sqrt{5}}{2}  \right )^{n}$）

我们设 $x= \left ( \frac{1+\sqrt{5}}{2}  \right )$，$y=\left ( \frac{1-\sqrt{5}}{2}  \right )$。

再设 $f\_{n}=x^{n}+y^{n}$。

稍微考虑一下便可得到：

$x^{n}+y^{n}=\left ( x+y \right ) \left ( x^{n-1}+y^{n-1} \right ) -xy \times \left ( x^{n-2}+y^{n-2} \right )$

$f\_{n}=\left ( x+y \right )f\_{n-1}-xy \times f\_{n-2} $

这个就是我们的递推式啦。

其中有些东西可以直接算出来：$x+y=1$，$xy=-1$，$f\_{0}=1$，$f\_{1}=2$，$f\_{2}=3$。

于是乎我们的矩阵就~~很容易~~地得出来了：

需要由 $\begin{bmatrix} f\_{n-1} &f\_{n-2}\end{bmatrix}$ 推得 $\begin{bmatrix} f\_{n} &f\_{n-1}\end{bmatrix}$。

转移矩阵如下：

$\begin{bmatrix} 1 &1 \\\ 1 &0\end{bmatrix}$

最后再来看看减去的那个式子对最终答案的影响：

> 注意最后需要减去一个 $\left ( \frac{1-\sqrt{5}}{2}  \right )^{n}$

注意到 $\left ( \frac{1-\sqrt{5}}{2}  \right )$ 是一个在 $\left ( -1,0 \right ]$ 上的负小数。

当 $n$ 为偶数时，$-\left ( \frac{1-\sqrt{5}}{2}  \right )$ 为负，由于是向上取整，所以此时该式对答案没有影响。

当 $n$ 为奇数时，$-\left ( \frac{1-\sqrt{5}}{2}  \right )$ 为正，因为向上取整，最终答案需要加一。

综上，该式对答案有影响，当且仅当 $n$ 为奇数。

最后到了~~大家最爱的~~代码时光。

## 嗲吗
```cpp
#define int long long
const int MOD = 998244353;
struct mat 
{
	int a[2][2];
	mat() { memset(a, 0, sizeof a); }
	mat operator *(const mat &b)const 
	{
		mat op;
		for (int i = 0; i < 2; i++)
			for (int k = 0; k < 2; k++)
				for (int j = 0; j < 2; j++)
					op.a[i][j] = (op.a[i][j] + a[i][k] * b.a[k][j]) % MOD;
		return op;
	}
} ans, I;
void init() 
{
	I.a[0][0] = I.a[0][1] = I.a[1][0] = 1;
	I.a[1][1] = 0;
	ans.a[0][0] = 3, ans.a[0][1] = 1;
	ans.a[1][0] = ans.a[1][1] = 0;
}
signed main() 
{
	int T = read();
	while (T--) 
	{
		n = read();
		init();
		if (n == 0) 
		{
			printf("1\n");
			continue;
		}else if (n == 1) 
		{
			printf("2\n");
			continue;
		}
		int ff = 0;
		if (n % 2 == 1)ff++;
		n -= 2;
		while (n) 
		{
			if (n & 1)ans = ans * I;
			I = I * I;
			n >>= 1;
		}
		ans.a[0][0] += ff;
		printf("%lld \n", ans.a[0][0]);
	}
	return 0;
}
```
有错误请 D 我。