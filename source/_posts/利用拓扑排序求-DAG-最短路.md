---
title: 利用拓扑排序求 DAG 最短路
date: 2022-02-14 17:56:33
tags: 
- c++
- 拓扑排序
- 图论
- DAG
- 最短路
categories: Dumby的OI生涯
---

## 背景
给定一张带负权边的有向无环图（DAG），$N$ 个点，$M$ 条边，求源点到各点的最短路。

## 分析
因为有负权边，无法用 dijkstra 直接求最短路。

用 SPFA 又容易被出题人卡成**傻子**。

考虑到是 **DAG**，可以使用**拓扑排序**在 $O\left( N+M \right)$ 时间范围内求出最短路。
<!--more-->
步骤如下：

设源点为 $s$，点到源点的最短路用数组 $d[]$ 来储存，建一个队列 $q[]$ 给拓扑排序用，再建一个数组 $deg[]$ 用来存储每个点的入度。

初始化：将除了 $d[s]$ 以外的所有 $d[]$ 赋值为 $+\infty$，$d[s]$ 赋值为 $0$，队列 $q[]$ 为空，提前处理出每个点的 $deg$。

一、找出**所有入度为 $0$ 的节点**加入队列 $q[]$。

二、取出队首节点，设队首节点为 $p$，该点指向的点为 $j$，两点间的边的边权为 $w$。

三、将 $deg[j]$ 减一（删边），并用 $d[p]+w$ 来更新 $d[j]$。若 $deg[j]$ 被减为零，则让 $j$ 入队。

重复二到三，直到所有点的 $deg[]$ 都变成 $0$，即所有点都被访问过（此时队空）。

过程中所有的点和边都只被扫描了一次，时间复杂度为 $O\left( N+M \right)$。

其实仔细看整个过程会发现**这就是在拓扑排序模板上加了一小点东西，也是在 SPFA 模板上加了一小点东西**。

## 喜闻乐见，代码时间
```cpp
#include<bits/stdc++.h>
const int N=114514;
using namespace std;
int n,m,s;
int h[N],nxt[N],to[N],w[N],cn;
int d[N];
int deg[N];
queue<int> q;
//变量名与前面一一对应
void add(int a,int b,int c){
	to[++cn]=b;
	w[cn]=c;
	nxt[cn]=h[a];
	h[a]=cn;
	deg[b]++;//在加边时顺便将 deg[] 处理出来
}
void topsort(int s){//拓扑排序，长得几乎和 SPFA 一模一样
	memset(d,0x3f,sizeof d);
	for(int i=1;i<=n;i++){
		if(!deg[i])q.push(i);
	}
	d[s]=0;
	while(q.size()){
		int p=q.front();
		q.pop();
		for(int i=h[p];i;i=nxt[i]){
			int j=to[i];
			d[j]=min(d[j],d[p]+w[i]);
			if(--deg[j]==0)q.push(j);
		}
	}
}
int main(){
	scanf("%d%d%d",&n,&m,&s);
	for(int i=1;i<=m;i++){
		int a,b,c;
		scanf("%d%d%d",&a,&b,&c);
		add(a,b,c);
	}
	topsort(s);
	for(int i=1;i<=n;i++){
		printf("%d\n",d[i]);
	}
	return 0;
}
```

${\Huge \mathfrak{The\  End}}$