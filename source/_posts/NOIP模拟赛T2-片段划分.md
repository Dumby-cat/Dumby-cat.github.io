---
title: NOIP模拟赛T2 片段划分
tags:
  - C++
  - 栈
  - 数据结构
categories: Dumby的OI生涯
abbrlink: 6ebd43b
date: 2022-07-05 19:22:03
---

## 解析

记录一下每个数前面第一个比它大的和比它小的数的位置，然后从后往前跳。

先把比它大的找到，然后让比它小的在范围内向前跳，跳得越前越好。

每次跳完答案加一。

<!--more-->

## 嗲吗

```cpp
#include<bits/stdc++.h>
// #define ll long long
// #define int long long
#define mp(x,y) make_pair(x,y)
#define pb(x) push_back(x)
#define PII pair<int,int>
const int MOD=998244353;
const int N=300002;
const int M=998244353;
using namespace std;
inline int read(){register char c=getchar();register int s=0,f=1;for(;!isdigit(c);c=getchar())if(c=='-')f=-1;for(;isdigit(c);c=getchar())s=(s<<3)+(s<<1)+c-'0';return s*f;}
int n;
int a[N];
int cnt1,cnt2;
int st1[N],st2[N];
int l[N],r[N];
int main(){
	n=read();
	st2[0]=-1;st1[0]=-2;
	for(int i=1;i<=n;i++){
		a[i]=read();
		while(cnt1&&a[st1[cnt1]]>a[i])cnt1--;
		while(cnt2&&a[st2[cnt2]]<=a[i])cnt2--;
		l[i]=st1[cnt1];
		r[i]=st2[cnt2];
		st1[++cnt1]=st2[++cnt2]=i;
	}
	int ans=0;
	int ll,rr=n;
	while(rr>0){
		ll=rr;
		while(r[rr]<=l[ll])ll=l[ll];
		ans++;
		rr=ll-1;
	}
	printf("%d",ans);
	return 0;
}
```