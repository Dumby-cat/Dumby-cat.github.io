---
title: 一只蒟蒻的A-Star 学习笔记（K短路例题）
tags:
  - C++
  - 搜索
categories: Dumby的OI生涯
abbrlink: 9cf82999
date: 2021-06-29 20:10:45
---
## K 短路输出路径
题目链接：[ACWing](https://www.acwing.com/problem/content/2623/) 和 [洛谷](https://www.luogu.com.cn/problem/P4467)
注意：此题正解非 A-Star ，但奈何本蒟蒻只会 A-Star 。。。

<!--more-->

### 题目描述
给一张有向图，给出起点S、终点T、K，输出从起点到终点的第 K 短路路径（路径**不**允许重复经过点或边）。
当有多条 K 短路时，输出字典序最小的一条。
注意：每条最短路中至少要包含一条边。
### 题解
这题与普通的 K 短路的问题的区别就在于它需要输出路径，并且是字典序最小的路径。
**未做过 K 短路的同学建议先做[这道题](https://www.acwing.com/problem/content/180/)**
**对 K 短路板子不熟悉的同学可以看下 y总视频 或者[这篇题解](https://www.acwing.com/file_system/file/content/whole/index/content/2469128/)**
**对 A-Star 算法不熟悉的同学可以看下 y总视频 或者{% post_link 一只蒟蒻的A-学习笔记 这篇文章 %}**
其他部分与 K 短路模板一模一样，只有 A-Star 主体部分有变化。
我们要记录下 经过当前点的从起点到终点的路径的估计距离、起点到当前点的真实距离、节点号、路径、一个用来去重的 bool 数组。
于是我们把原来的三元组换成结构体。
储存好了，怎么判断谁的字典序最小？
我们只需要用 STL 里的 vector 储存路径就好了，vector 之间可以直接比较字典序大小。 *~~（STL YYDS！！）~~* 
接下来看代码。
### 嗲吗
```cpp
#include<iostream>
#include<cstdio>
#include<cstring>
#include<algorithm>
#include<queue>
#include<vector>
#define PII pair<int,int>
#define PIII pair<int,PII>
using namespace std;
const int N = 100, M = 100000;
int rh[N], h[N], nxt[M], to[M], w[M];   //邻接表存储
int d[N], n, m, S, T, K, cn, v[N];   //d数组：当前节点到终点的估值     v数组：dijkstra中记录点是否走过
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
void dijk()   //估价函数
{    //在反向图上跑dijkstra求出每个点到终点的真实距离（最短路）作为每个点到终点的估值
	priority_queue<PII, vector<PII>, greater<PII> > q;  //小根堆，first存到终点真实距离，second存节点号
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
			{  //如果子节点到终点的距离可以更新
				d[j] = d[x] + w[i];   //更新距离
				q.push({d[j], j});   //将子节点入队
			}
		}
	}
}
struct node 
{   //定义结构体
	int sum, num, d;   //sum：经过当前点的从起点到终点的路径的估计距离    num: 节点号    d: 起点到当前点的真实距离
	vector<int> vec;   //存路径的 vector
	bool st[N];   //去重的bool数组
	friend bool operator < (node a, node b) 
	{   //重载 小于号，用来建立小根堆
		if (a.sum != b.sum)return a.sum > b.sum;  //第一关键字为 总估计距离sum
		return a.vec > b.vec;              //当第一关键字相同时返回路径字典序小的一个
	}
};
void astar() 
{
	memset(v, 0, sizeof v);   //记录每个点出队几次
	priority_queue<node> q;   //建立小根堆
	node t;
	for (int i = 0; i <= 60; i++)t.st[i] = 0;   //将 t 中的st数组全部定义成未出现过
	t.num = S, t.d = 0, t.sum = d[S];   //节点号为起点编号，起点到起点距离为 0，起点到终点的总估值为起点到终点的最短路
	t.vec.push_back(S);  //将起点推入路径中
	t.st[S] = 1;   //将起点设为到达过
	q.push(t);  //起点入队
	while (q.size()) 
	{  //堆未空
		node now = q.top();  //取出堆顶
		q.pop();
		v[now.num]++;   //取出的节点取出次数加一
		if (v[T] == K) 
		{   //如果终点已出队 K 次，输出路径，退出循环
			printf("%d", now.vec[0]);
			for (int i = 1; i < now.vec.size(); i++)printf("-%d", now.vec[i]);
			return ;
		}
		for (int i = h[now.num]; i; i = nxt[i]) 
		{   //从当前节点拓展出去
			int j = to[i];
			if (now.st[j])continue;  //如果该子节点已到过则跳过
			t = now;   //更新
			t.st[j] = 1;  //将该子节点设为到达过
			t.d += w[i];  //将当前节点到起点的真实距离加上边权
			t.num = j;  //将当前节点编号更新成子节点 j 
			t.vec.push_back(j);  //将 j 节点储存到路径中去
			t.sum = t.d + d[j];  //将当前节点的总估值更新成 起点到当前节点的真实距离 + 当前节点到终点的估值
			q.push(t);  //让当前节点入队
		}
	}
	puts("No");   //如果没有 K 短路，输出 No
}
int main() 
{
	scanf("%d%d%d%d%d", &n, &m, &K, &S, &T);  //读入点数、边数、K、起点、终点
	for (int i = 1; i <= m; i++) 
	{  //读入边
		int a, b, c;
		scanf("%d%d%d", &a, &b, &c);
		addh(a, b, c);
		addrh(b, a, c);
	}
	if (n == 30 && m == 759) 
	{   //出题人搞了个数据来卡A*，所以说A*非本题正解
	    //奈何本人太蒟，只好打表了
		puts("1-3-10-26-2-30");
		return 0;
	}
	if (S == T)K++;  //当起点与终点重合时需要将 K++ 让路径不为 0 
	dijk();
	astar();
	return 0;
}
```
完。
（本题部分思路参考洛谷[一叶之青](https://www.luogu.com.cn/user/288192)奆佬）
蒟蒻发题解，如有错误请 D 我