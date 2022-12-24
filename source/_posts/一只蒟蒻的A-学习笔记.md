---
title: 一只蒟蒻的A-Star学习笔记
date: 2021-06-29 13:22:38
tags:
- C++
- 搜索
categories: Dumby的OI生涯
---
## A-Star 是啥？？ A-Star 用来干啥？？

首先，**A-Star 算法只能用在数据规模很大的搜索题中**，这时直接用 BFS 会超时，而利用 **启发函数（估价函数）** 优化后的 BFS ——A-Star 算法就能处理这种问题。
A-Star 算法通过一个 **“启发函数（估价函数）”** 来使到达终点需要遍历的状态大大减少，以达到提高运行效率的作用。
<!--more-->
就比如：当普通的 BFS 需要遍历 $10^{8}$、$10^{9}$ 甚至 $10^{20}$ 个状态才能到达终点时，通过 A-Star 的启发函数 则只需要遍历极少的状态就能达到终点。

**注意：** 使用 A-Star 时需要判断是否有解，当**无解**时（或者是**数据规模较小**时） A-Star 的效率可能会比朴素的 BFS 还低。

## A-Star 代码框架

首先，我们要把朴素的 BFS 中的**队列**换成**优先队列**。
伪代码如下：

```cpp
while ( ! q.size() ) 
{
	t = 优先队列（小根堆）队头 ;
	if ( t == 终点 ) break ;
	for ( 枚举 t 的所有邻边 )
	{
		if ( 子节点可取 ) 
		{
			邻边入队；
		}
	}
}
```

那么这个优先队列中存啥呢？
首先，肯定要把该节点到起点的**真实距离**存下来；
此次，要把 真实距离+该节点到终点的**估计距离** 的总和存下来，并作为**优先队列的排序关键字**。
这个总和的含义就是 **起点到终点的总的估计距离** 。
每次取出优先队列的队头出来即每次取一个 估计距离最小的点 来扩展。

## 关于估价函数

估价函数是 A-Star 算法的核心部分。
首先，要知道 **估价函数是针对每个题目具体情况设计的** ，有许多种方法可以算出估值，常用的有 Manhattan 等。

设当前点为 **state** 。
设当前点到起点的**真实距离**为**d[state]**；
设当前点到终点的**估计距离**为 **f[state]**；
设当前点到终点的**真实距离**为 **g[state]**；
那么我们设计的估计函数必须满足如下性质：

1. 对于任意的 **state** ，都必须满足 **f[state] ≤ g[state]**。
2. 如果满足该条件，则当终点第一次出队时一定是**最小值**。

下面给出证明：

我们先证明第 1 点：

可用极限法证明：当估计距离为无限大时（此时估值绝对大于真值），该节点会被压在堆底无法取出；同样的，当最优解的估值被估计成无限大时，最优解的节点也会被压在堆底，导致非最优解上的节点被取出拓展，直到取出了终点产生错误答案。
所以，对于任意的 **state** ，都必须满足 **f[state] ≤ g[state]**。

我们再利用反证法证明第 2 点：

*~~反正他就是这样，我也说不了什么~~*
我们设终点第一次出队时**不是最小值**。
也就是说此时终点的 d[state] 严格大于 d[最优解] 。
此时队列中肯定存在最优解路径上的某一个点，设该点为 u 。
那么最优解的长度就等于 **d[u]+g[u]** 。
由于我们的 **f[u]** 是小于 **g[u]** 的，可以得出 **最优解的长度 = d[最优解] = d[u]+g[u] ≥ d[u]+f[u]** 。
又因为 d[state] 大于 d[最优解] ，所以 d[state] 大于 g[u]+f[u] 。
这也就意味着 **小根堆中还存在一个比队头还小的元素** ，与小根堆的定义矛盾。
所以，如果满足该条件，则当终点第一次出队时一定是**最小值**。

综上：对于任意的 **state** ，都必须满足 **f[state] ≤ g[state]**；如果满足，则当终点第一次出队时一定是**最小值**。

证毕。

**tips：** 估值越接近真值，A-Star 的效率越高。

**注意： 只有在终点第一次被取出时能保证是最小值，其他节点不一定是最小值。**
因为我们的估计函数是针对终点设计的，估值也是针对终点计算出来的，小根堆的排序关键字也是起点到终点的总估值，所以只能保证终点第一次被取出时是最小值。
<bt>

## 例题

### 八数码

[ACWing题面](https://www.acwing.com/problem/content/181/) 和 [洛谷题面](https://www.luogu.com.cn/problem/P1379)

#### 题目描述

输入一行八个数字和一个 “ x ” （x 表示空格）表示 3 * 3 的一个矩阵。
请问将该矩阵恢复到原状需要如何操作（需要几步）。
原状： 1 2 3 4 5 6 7 8 x

#### 题解

首先判定可解性：计算初态与终态的逆序对个数，如果两者奇偶性相同，则有解，否则无解。
又因为终态已经确定，逆序对个数为 0 ，所以初态的逆序对个数一定要为偶数。
**注意：使用 A-Star 算法前都应判断一下可解性，因为当无解时用 A-Star 效率会非常低。**

~~题目蛮简单的~~，直接在代码中解释吧。
```cpp
#include<iostream>
#include<cstdio>
#include<algorithm>
#include<cstring>
#include<cmath>
#include<queue>
#include<unordered_map>
#include<vector>
#define PIS pair<int,string>
using namespace std;
const int N = 1010;
int f(string s) 
{   //估值函数
    //此处设计的估值为 当前状态各个数字到终态的对应数字处的曼哈顿距离的总和
    //即当前状态的 1 到终态的 1 的曼哈顿距离 加上 当前状态的 2 到终态的 2 的曼哈顿距离 加上......
	int ans = 0;
	for (int i = 0; i < s.size(); i++) 
	{
		if (s[i] != 'x') 
		{
			int t = s[i] - '1';
			ans += abs(i / 3 - t / 3) + abs(i % 3 - t % 3);
		}
	}
	return ans;  //返回估值
}

unordered_map < string, int > d;   //用来记录到达某个状态所需的步数
unordered_map < string, pair<char, string> > pre;   //用来记录到达某状态的前驱状态，三个维度分别表示：当前状态、从前驱状态转移到当前状态所移动的方向、前驱状态
priority_queue < PIS, vector <PIS>, greater<PIS> > heap;   //小根堆：first存储起点到终点的总估计值，second存储当前状态

string bfs(string st) 
{
	string en = "12345678x";   //定义终态
	char op[] = "urdl";   //定义方向
	d[st] = 0;   //将起点到起点的距离设为 0 。
	heap.push({f(st), st});   //将初态入队
	int fx[4] = {-1, 0, 1, 0}, fy[4] = {0, 1, 0, -1};
	while (heap.size()) 
	{  //堆未空
		PIS t = heap.top();  //取出堆顶
		heap.pop();
		string state = t.second;
		if (state == en)break;   //如果终点出队，则结束循环
		int x, y;  //找出空格x的位置
		for (int i = 0; i < 9; i++) 
		{
			if (state[i] == 'x') 
			{
				x = i / 3;
				y = i % 3;
				break;
			}
		}
		string s = state;  //将前驱状态保存，方便还原
		for (int i = 0; i < 4; i++) 
		{
			int a = x + fx[i], b = y + fy[i];
			if (a < 0 || a > 2 || b < 0 || b > 2) continue;  //判断移动位置是否在矩阵内
			state = s;  //还原状态
			swap(state[x * 3 + y], state[a * 3 + b]);   //移动空格
			if (!d.count(state) || d[state] > d[s] + 1) 
			{  //如果当前状态未出现过 或者 当前状态的步数可以更新
				d[state] = d[s] + 1;  //更新步数
				pre[state] = {op[i], s};   //储存前驱
				heap.push({d[state] + f(state), state});  //新状态入队
			}
		}
	}
	string ans;
	while (en != st) 
	{  //求出移动方案
		ans += pre[en].first;
		en = pre[en].second;  //从终态往回求移动方案直到终态等于初态
	}
	reverse(ans.begin(), ans.end());  //由于是从终态开始的，所以方案是倒着的，需要翻转一下。
	return ans;  //返回方案
}
int main() 
{
	string st, seq;
	string c;
	
	for (int i = 1; i <= 9; i++) 
	{
		cin >> c;   //小技巧：让你输入字符时用字符串代替，可以自动滤去空格和回车
		st += c[0];  //记录开始时的矩阵
		if (c[0] != 'x')seq += c[0];   //记录下所有的数字用来计算逆序对
	}
	//计算逆序对对数
	int cn = 0;
	for (int i = 0; i < 8; i++)
		for (int j = i; j < 8; j++)
			if (seq[i] > seq[j])cn++;  //如果前面的数字大于后面的数字，则将个数加一。
	
	if (cn & 1)printf("unsolvable");  //如果逆序对个数为奇数，则无解。
	else cout << bfs(st);  //否则进行 BFS
	
	return 0;
}
```

接下来还有一种题型。

### 第 K 短路

#### 题目描述

给一张有向图，给出起点S、终点T、K，求出从起点到终点的第 K 短路（路径允许重复经过点或边）。
注意：每条最短路中至少要包含一条边。

#### 题解

首先肯定是想到打暴力。
把 S 到 T 的每一条路径长都算出来，再找出第 K 短的路。
但由于数据庞大，暴力只能骗到一点分。
而数据庞大时我们可以用 A-Star 来做。

先考虑估价函数怎么打。
因为估值要小于等于真值，同时又要尽可能接近真值，那么我们可以把 **当前点到终点的最短路** 作为当前点到终点的估值。
而计算这个估值只需要 在反向图上跑一遍 dijkstra 就好了。

估价函数设计出来后怎么求第 K 短路？
~~由数学归纳法易证~~，当终点被第 K 次从队中取出时对应的路径就是第 K 短路。

所以，代码就很好写了。

#### 代码
```cpp
#include<iostream>
#include<cstdio>
#include<algorithm>
#include<cstring>
#include<cmath>
#include<queue>
#include<unordered_map>
#include<vector>
#define PII pair<int,int>
#define PIII pair<int,PII>
using namespace std;
const int N = 1010, M = 200020;
int n, m, cn, h[M], rh[M], nxt[M], to[M], w[M], d[N], v[N], S, T, K;
void addh(int a, int b, int c) 
{   //存正向图
	nxt[++cn] = h[a];
	to[cn] = b;
	w[cn] = c;
	h[a] = cn;
}
void addrh(int a, int b, int c) 
{   //存反向图
	nxt[++cn] = rh[a];
	to[cn] = b;
	w[cn] = c;
	rh[a] = cn;
}
void dijk() 
{    //dijkstra，同时也是估价函数
	priority_queue<PII, vector<PII>, greater<PII> > q;   //小根堆，first存到终点真实距离，second存节点号
	q.push({0, T});   //将终点压入队中，距离为 0 
	memset(d, 0x3f, sizeof d);   //将到终点的距离初始化为正无穷
	d[T] = 0;  //终点到终点的距离为 0
	while (q.size()) 
	{  //堆不空
		PII t = q.top();   //取出堆顶
		q.pop();
		int x = t.second;
		if (v[x])continue;   //防止重复遍历
		v[x] = 1;
		for (int i = rh[x]; i; i = nxt[i]) 
		{
			int j = to[i];
			if (d[j] > d[x] + w[i]) 
			{   //如果子节点到终点的距离可以更新
				d[j] = d[x] + w[i];   //更新距离
				q.push({d[j], j});   //将子节点入队
			}
		}
	}
}
int astar() 
{   // A*
	priority_queue<PIII, vector<PIII>, greater<PIII> > q;  //小根堆，三维分别存 经过当前点的从起点到终点的路径的估计距离、起点到当前点的真实距离、节点号
	memset(v, 0, sizeof v);    // v 数组用来记录节点出队几次
	q.push({d[S], {0, S}});   //将起点入队
	while (q.size()) 
	{
		PIII x = q.top();   //取出堆顶
		q.pop();
		int t = x.second.second, dist = x.second.first;
		//t 为节点号，dist 为起点到当前点的真实距离
		v[t]++;   // t 节点的出队次数加一
		if (v[T] == K) return dist;   //如果终点已经出队 K 次，则停止循环
		for (int i = h[t]; i; i = nxt[i]) 
		{
			int j = to[i];
			if (v[j] < K) q.push({dist + w[i] + d[j], {dist + w[i], j}});
			//如果子节点的出队次数不到 K 次，则将该节点入队
			//不到 K 次才入队是因为 
			//对于任意正整数 i 和任意节点 x ，当 x 被第 i 次取出时，对应的就是起点 S 到该节点的第 K 短路
			//而由于 估值 为 该节点到终点的最短路 
			//所以 经过该节点的 连接起点 S 和终点 T 的路径（长度等于 该点估值 加上 起点到该节点的真实距离）只能更长，不能更短
			//所以当 一个点出队次数大于 K 次后，经过该点的路径就不可能是第 K 短路了，也就没必要再入队了。
		}
	}
	return -1;
}
int main() 
{
	scanf("%d%d", &n, &m);   //输入点数和边数
	for (int i = 1; i <= m; i++) 
	{
		int a, b, c;
		scanf("%d%d%d", &a, &b, &c);
		addh(a, b, c);    //存入正向图
		addrh(b, a, c);   //存入反向图
	}
	scanf("%d%d%d", &S, &T, &K);  //读入 起点、终点、K
	if (S == T)K++;   //当起点与终点重合时不能直接输出 0 ，而应经过任意边后再绕回来
	dijk();   //dijkstra，同时也是估价函数
	printf("%d", astar());  // A*
	return 0;
}
```
ok，笔记结束。
你学废了吗？

本文部分参考 ACWing y总 的讲解以及lyd的《算法竞赛进阶指南》。
如有错误请 @Dumby_cat 这只蒟蒻。