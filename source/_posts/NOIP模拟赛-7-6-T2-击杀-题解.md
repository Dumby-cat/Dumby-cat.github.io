---
title: NOIP模拟赛 7.6 T2 击杀 题解
date: 2022-07-07 19:10:15
tags:
- DP
categories: 一只蒟蒻的c++学习笔记
---
<!--more-->
## 题面

武士藤藤准备击杀地图上的幽灵。

地图为 $n \times m$（行，列）的整点网格图，坐标从左向右从下到上从 $0$ 编号。

开始藤藤可以从地图的任意的左侧进入，最后藤藤将从地图的右侧离开。

藤藤地图上的行进有一些奇妙的性质：

1．藤藤每单位时间会向右移动一单位长度，以尽快从地图上离开。
2．当一只幽灵与藤藤坐标重合，藤藤就会将其击杀。

在纵向，每单位时间藤藤可以快速移动[-delta,+delta]单位长度。

藤藤的移动速度极快，可以认为移动时不与任何幽灵坐标重合。

每只幽灵都有一定的能力值，第i行j列幽灵的能力值记为 $A_{i j}$。

藤藤希望其击杀的幽灵能力值之和最大。

## 解析

比较简单的 DP，考虑到地图的数据范围较大但幽灵数少，可用幽灵来做决策。

## 嗲吗
```cpp
#include<bits/stdc++.h>
#define ll long long
// #define int long long
#define mp(x,y) make_pair(x,y)
#define pb(x) push_back(x)
#define PII pair<int,int>
const int MOD=998244353;
const int N=10002;
const int M=10000001;
using namespace std;
inline int read(){register char c=getchar();register int s=0,f=1;for(;!isdigit(c);c=getchar())if(c=='-')f=-1;for(;isdigit(c);c=getchar())s=(s<<3)+(s<<1)+c-'0';return s*f;}
int n,m,delta,num;
struct node{
	int x,y,d;
	bool operator <(const node xx)const{
		return x<xx.x;
	}
}p[N];
int f[N],ans;
int main(){
	n=read(),m=read(),delta=read(),num=read();
	for(int i=1;i<=num;i++) p[i].y=read(),p[i].x=read(),p[i].d=read();
	sort(p+1,p+num+1);
	for(int i=1;i<=num;i++){
		for(int j=1;j<i;j++){
			if(abs(p[i].y-p[j].y)<=delta*(p[i].x-p[j].x)){
				f[i]=max(f[i],f[j]);
			}
		}
		f[i]+=p[i].d;
		ans=max(ans,f[i]);
	}
	printf("%d",ans);
	return 0;
}
```