---
title: CF558E A Simple Task
tags:
  - 算法:数据结构
  - 编程:C++
  - 算法:基础与复杂度
categories: Dumby的OI/算法竞赛
abbrlink: 1a1ef87d
date: 2022-07-12 12:17:26
---

CF558E A Simple Task题解

<!--more-->

## 思路

开一个 set 维护当前有哪些点是区间的左区间。

对于每个有序区间，开一个权值线段树维护，并记录一下该区间是升序还是降序。

每次排序时就将维护这些区间的线段树分裂再合并，最后查一下每棵树再输出就好了。

## 码
```cpp
#include<bits/stdc++.h>
#define ll long long
//#define int long long
#define mp(x,y) make_pair(x,y)
#define pb(x) push_back(x)
#define PII pair<int,int>
const int MOD=998244353;
const int N=10000002;
const int M=10000001;
using namespace std;
inline int read(){register char c=getchar();register int s=0,f=1;for(;!isdigit(c);c=getchar())if(c=='-')f=-1;for(;isdigit(c);c=getchar())s=(s<<3)+(s<<1)+c-'0';return s*f;}
int n,m;
char s[N];
bool op[N];
int tot,rt[N];
struct node{
	int l,r,cn;
#define l(x) tr[x].l
#define r(x) tr[x].r
#define cn(x) tr[x].cn
}tr[N];
void add(int& p,int l,int r,int k){
	if(!p)p=++tot;
	if(l==r){
		cn(p)++;
		return ;
	}
	int mid=(l+r)>>1;
	if(k<=mid)add(l(p),l,mid,k);
	else add(r(p),mid+1,r,k);
	cn(p)=cn(l(p))+cn(r(p));
}
int merge(int p,int q,int l,int r){
	if(!p)return q;
	if(!q)return p;
	if(l==r){
		cn(p)+=cn(q);
		cn(q)=0;
		return p;
	}
	int mid=(l+r)>>1;
	l(p)=merge(l(p),l(q),l,mid);
	r(p)=merge(r(p),r(q),mid+1,r);
	cn(p)=cn(l(p))+cn(r(p));
	cn(q)=cn(l(q))+cn(r(q));
	return p;
}
void split0(int p,int &q,int k){
	if(!p)return ;
	if(cn(p)==k)return ;
	q=++tot;
	if(k<=cn(l(p)))swap(r(p),r(q)),split0(l(p),l(q),k);
	else split0(r(p),r(q),k-cn(l(p)));
	cn(q)=cn(p)-k;
	cn(p)=k;
}
void split1(int p,int &q,int k){
	if(!p)return ;
	if(cn(p)==k)return ;
	q=++tot;
	if(k<=cn(r(p)))swap(l(p),l(q)),split1(r(p),r(q),k);
	else split1(l(p),l(q),k-cn(r(p)));
	cn(q)=cn(p)-k;
	cn(p)=k;
}
set<int> st;
#define IT set<int>::iterator
IT sp(int p){
	IT it=st.lower_bound(p);
	if(*it==p)return it;
	it--;
	op[p]=op[*it];
	if(op[*it])split1(rt[*it],rt[p],p-*it);
	else split0(rt[*it],rt[p],p-*it);
	return st.insert(p).first;
}
void print0(int p,int l,int r){
	if(l==r){
		for(int i=1;i<=cn(p);i++) printf("%c",l+'a'-1);
		return ;
	}
	int mid=(l+r)>>1;
	if(cn(l(p)))print0(l(p),l,mid);
	if(cn(r(p)))print0(r(p),mid+1,r);
}
void print1(int p,int l,int r){
	if(l==r){
		for(int i=1;i<=cn(p);i++) printf("%c",l+'a'-1);
		return ;
	}
	int mid=(l+r)>>1;
	if(cn(r(p)))print1(r(p),mid+1,r);
	if(cn(l(p)))print1(l(p),l,mid);
}
int main(){
	n=read(),m=read();
	scanf("%s",s+1);
	for(int i=1;i<=n;i++)add(rt[i],1,26,s[i]-'a'+1),st.insert(i);
	while(m--){
		int l=read(),r=read(),tmp=read()^1;
		IT li=sp(l),ri=sp(r+1);
		li++;
		for(IT i=li;i!=ri;i++) merge(rt[l],rt[*i],1,26);
		st.erase(li,ri);op[l]=tmp;
	}
	for(int it:st){
		if(op[it])print1(rt[it],1,26);
		else print0(rt[it],1,26);
	}
	return 0;
}
```