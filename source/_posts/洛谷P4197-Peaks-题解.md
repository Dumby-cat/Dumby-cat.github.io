---
title: 洛谷P4197 Peaks (Kruskal重构树) 题解
tags:
  - 编程:C++
  - 算法:图论与搜索
  - 算法:基础与复杂度
  - 算法:数据结构
categories: Dumby的OI/算法竞赛
abbrlink: 8ea37269
date: 2022-07-06 21:48:40
---

克鲁斯卡尔重构树介绍以及洛谷P4197 Peaks 题解。

<!--more-->

## 解析

先说下 Kruskal重构树 是啥。

### Kruskal重构树

在一个无向联通图中，按照 Kruskal 求最小生成树的方法找到最小的边。

把这些找出来的边抽象成点，把边的两端所在的集合的根节点作为新点的左右儿子，把边权作为新点的点权。

在加了 $n-1$ 次点后，我们得到一棵符合大（小） 根堆性质的有 $n$ 个节点的二叉树，这棵树就叫Kruskal重构树。

### 思路

得到Kruskal重构树后，我们只需要先处理出叶子节点的 DFS序，然后倍增找到第一个大于 $x$ 的询问节点的祖先节点，再用主席树查一下第 $k$ 大就好了。

整体思路是 Kruskal重构 -> 倍增 -> DFS序 -> 主席树。

## 嗲吗

```cpp
#include<bits/stdc++.h>
#define ll long long
// #define int long long
#define mp(x,y) make_pair(x,y)
#define pb(x) push_back(x)
#define PII pair<int,int>
const int MOD=998244353;
const int N=2000002;
const int M=10000001;
using namespace std;
inline int read(){register char c=getchar();register int s=0,f=1;for(;!isdigit(c);c=getchar())if(c=='-')f=-1;for(;isdigit(c);c=getchar())s=(s<<3)+(s<<1)+c-'0';return s*f;}
int n,m,q;
int h[N],a[N];//离散山高和山高
int tot;//重构树节点数
int v[N];//重构树非叶子节点点权（原道路长度）
int fa[N][21];//父节点（倍增）
struct edge{
	int a,b,d;
	bool operator <(const edge x)const{
		return d<x.d;
	}
}E[M];//用于Kruskal的边
int faf[N];//并查集父节点
int find(int x){return x==faf[x]?x:faf[x]=find(faf[x]);}//并查集找爹，用于Kruskal
int ch[N][2];//重构树中每个节点的儿子
int cnt;//重构树中叶子节点个数
int idl[N];//idl[i]表示重构树中以i为根的子树中最左边的叶子节点的新编号
int idr[N];//同上
void kruskal(){
	stable_sort(E+1,E+m+1);
	for(int i=1;i<=n;i++) faf[i]=i;
	for(int i=1;i<=m;i++){
		int Fa=find(E[i].a),Fb=find(E[i].b);
		if(Fa==Fb)continue;
		v[++tot]=E[i].d;
		faf[tot]=tot;
		ch[tot][0]=Fa,ch[tot][1]=Fb;
		faf[Fa]=faf[Fb]=tot;
	}
}
int rt[N],cn;//主席树
struct node{
	int l,r,cn;
	#define l(x) tr[x].l
	#define r(x) tr[x].r
	#define cn(x) tr[x].cn
}tr[N];
int build(int l,int r,int k,int pr){
	int p=++cn;
	cn(p)=cn(pr)+1;
	if(l==r) return p;
	int mid=(l+r)>>1;
	if(k<=mid)l(p)=build(l,mid,k,l(pr)),r(p)=r(pr);
	else r(p)=build(mid+1,r,k,r(pr)),l(p)=l(pr);
	return p;
}
int ask(int l,int r,int k,int L,int R){
	if(k>cn(R)-cn(L))return -1;
	if(l==r)return a[l];
	int mid=(l+r)>>1;
	int sum=cn(r(R))-cn(r(L));
	if(k<=sum)return ask(mid+1,r,k,r(L),r(R));
	else return ask(l,mid,k-sum,l(L),l(R));
}
void dfs(int p){//求新编号并建起主席树
	if(!ch[p][0]){
		idl[p]=idr[p]=++cnt;
		rt[cnt]=build(1,n,h[p],rt[cnt-1]);
		return ;
	}
	fa[ch[p][0]][0]=fa[ch[p][1]][0]=p;
	dfs(ch[p][0]);dfs(ch[p][1]);
	idl[p]=idl[ch[p][0]];
	idr[p]=idr[ch[p][1]];
}
int main(){
	n=read(),m=read(),q=read();
	for(int i=1;i<=n;i++){h[i]=read();a[i]=h[i];}
	sort(a+1,a+n+1);
	for(int i=1;i<=n;i++)h[i]=lower_bound(a+1,a+n+1,h[i])-a;
	for(int i=1;i<=m;i++) E[i].a=read(),E[i].b=read(),E[i].d=read();
	for(int i=2;i<=n;i++) E[++m].a=1,E[m].b=i,E[m].d=0x7fffffff;
	tot=n; kruskal(); dfs(tot);
	for(int i=1;i<=20;i++) for(int j=1;j<=tot;j++) fa[j][i]=fa[fa[j][i-1]][i-1];
	while(q--){
		int u=read(),x=read(),k=read();
		for(int i=20;i>=0;i--) if(fa[u][i]&&v[fa[u][i]]<=x)u=fa[u][i];
		printf("%d\n",ask(1,n,k,rt[idl[u]-1],rt[idr[u]]));
	}
	return 0;
}
```