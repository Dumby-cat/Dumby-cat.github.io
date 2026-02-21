---
title: C++ goto语句
tags:
  - 编程:C++
categories: Dumby的C++编程开发
abbrlink: b001cc58
date: 2022-12-24 14:32:57
---

关于C++中的goto语句。

<!--more-->

用法和批处理中的GOTO一样，只不过C++中打标签是分号放后面。

如下：

```cpp
#include<bits/stdc++.h>
int main(){
	printf("!!");
	goto t;
	printf("22");
	t:
	return 0;
}
```

输出：

```
!!
```

用这个可以比较方便的跳出多重循环：

```cpp
#include<bits/stdc++.h>
int main(){
	for(int i=1;i<=10;i++){
		for(int j=1;j<=10;j++){
			for(int k=1;k<=10;k++){
				printf("!!\n");
				if(k==1){
					goto tag;
				}
			}
		}
	}
	tag:
    return 0;
}
```

输出：

```
!!

```