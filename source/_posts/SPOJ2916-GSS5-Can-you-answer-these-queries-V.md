---
title: SPOJ2916 GSS5-Can you answer these queries V
date: 2022-07-09 20:52:29
tags:
- 线段树
- 数据结构
- c++
categories: 一只蒟蒻的c++学习笔记
---

## 解析

题目很坑，题中的子段是不能为空的。

其余就是一个比较裸的线段树维护区间最大值，在左右区间是否重合、包含上讨论一下就好了（虽然我调了快一晚上）。
<!--more-->
## 码

```cpp
#include<bits/stdc++.h>
#define ll long long
#define int long long
#define mp(x,y) make_pair(x,y)
#define pb(x) push_back(x)
#define PII pair<int,int>
const int MOD=998244353;
const int N=1000002;
const int M=10000001;
using namespace std;
inline int read(){register char c=getchar();register int s=0,f=1;for(;!isdigit(c);c=getchar())if(c=='-')f=-1;for(;isdigit(c);c=getchar())s=(s<<3)+(s<<1)+c-'0';return s*f;}
int n,m;
int a[N];
struct node{
	int l,r,s,mm,ml,mr;
	#define l(x) tr[x].l
	#define r(x) tr[x].r
	#define s(x) tr[x].s
	#define mm(x) tr[x].mm
	#define ml(x) tr[x].ml
	#define mr(x) tr[x].mr
}tr[N];
void push_up(int p){
	mm(p)=max(mm(p*2),max(mm(p*2+1),mr(p*2)+ml(p*2+1)));
	ml(p)=max(ml(p*2),s(p*2)+ml(p*2+1));
	mr(p)=max(mr(p*2+1),s(p*2+1)+mr(p*2));
	s(p)=s(p*2)+s(p*2+1);
}
void build(int p,int l,int r){
	l(p)=l,r(p)=r;
	if(l==r){
		s(p)=mm(p)=ml(p)=mr(p)=a[l];
		return ;
	}
	int mid=(l+r)>>1;
	build(p*2,l,mid);
	build(p*2+1,mid+1,r);
	push_up(p);
}
void change(int p,int k,int d){
	if(l(p)==r(p)){
		s(p)=mm(p)=ml(p)=mr(p)=d;
		return ;
	}
	int mid=(l(p)+r(p))>>1;
	if(k<=mid)change(p*2,k,d);
	else change(p*2+1,k,d);
	push_up(p);
}
node ask(int p,int l,int r){
	if(l>r)return {0,0,0,0,0,0};
	if(l<=l(p)&&r(p)<=r) return tr[p];
	int mid=(l(p)+r(p))>>1;
	if(l>mid) return ask(p*2+1,l,r);
	if(r<=mid)return ask(p*2,l,r);
	node ls=ask(p*2,l,mid),rs=ask(p*2+1,mid+1,r),ans;
	ans.s=ls.s+rs.s;
	ans.ml=max(ls.ml,ls.s+rs.ml);
	ans.mr=max(rs.s+ls.mr,rs.mr);
	ans.mm=max(ls.mr+rs.ml,max(ls.mm,rs.mm));
	return ans;
}
signed main(){
	int T=read();
	while(T--){
		n=read();
		for(int i=1;i<=n;i++)a[i]=read();
		m=read();
		build(1,1,n);
		while(m--){
			int l1=read(),r1=read(),l2=read(),r2=read();
			if(l1>r1)swap(l1,r1);
			if(l2>r2)swap(l2,r2);
			if(l1>l2)swap(l1,l2),swap(r1,r2);
			if(r1<l2){
				printf("%lld\n",ask(1,l1,r1).mr+ask(1,r1+1,l2-1).s+ask(1,l2,r2).ml);
			}
			else if(r2>r1){
				printf("%lld\n",max(ask(1,l2,r1).mm,max(ask(1,l1,l2-1).mr+ask(1,l2,r2).ml,ask(1,l1,r1).mr+ask(1,r1+1,r2).ml))); 
			}
			else {
				printf("%lld\n",max(ask(1,l1,l2-1).mr+ask(1,l2,r2).ml,ask(1,l2,r2).mm)); 
			}
		}
	}
	return 0;
}
```