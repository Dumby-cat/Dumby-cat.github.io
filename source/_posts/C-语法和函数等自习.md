---
title: C++语法和函数等自习
date: 2022-10-01 17:59:09
tags: c++
categories: Dumby的折腾笔记
---

本帖用于学习一只OIer在学OI时很少会接触的语法和函数以及其他一些东西。

<!--more-->

## 预处理命令

### 条件编译

#### #if

语法：

```
#if 整型常量表达式1
    程序段1
#elif 整型常量表达式2 // elif 可以省略
    程序段2
#elif 整型常量表达式3
    程序段3
#else
    程序段3
#endif
```

其功能与普通的 ```if``` 、 ```else if``` 、 ```else``` 功能类似，但也有区别。

与 ```if``` 一样， ```#elif``` 和 ```#else``` 可以省去。

区别是 ```#if``` 只能判断“整形常量表达式”，也就是说表达式中只能有常量，且结果必须为常数。

另一区别是 ```#if``` 必须和 ```#endif``` 组合使用， ```#endif``` 表示结束判断。

##### #ifdef

语法：

```
#ifdef 宏名
    程序段1
#else
    程序段2
#endif
```

如果宏被定义了，则执行程序段1，否则执行程序段2。

##### #ifndef

与 ```#ifdef``` 类似，只是判断条件相反，即宏未被定义则执行程序段1。

## 异常处理

首先说一下异常处理的基本过程：一个函数 A，其运行过程中抛出了一个异常，如果 A 自己处理掉了这个异常，那么就继续执行代码；如果没有处理，函数 A 会立刻停止执行，并将该异常抛给函数 A 的调用者。以此类推。
当最后异常抛给 main 函数时，如果 main 函数也不做处理，则程序会立即异常停止。

C++中异常处理主要用 try catch throw 这三个东西。

throw 语法：

```
throw 表达式;
```

这个表达式是啥都行（基本类型或者类都可以）。

try catch（这两个要一起用）语法：

```
try{
    程序段
}
catch(异常类型1){
    异常处理程序段1
}
...
catch(异常类型N){
    异常处理程序段N
}
```

注意 catch 抓取的是异常的 **类型**，即基本类型或者类等，而非某个具体值。

在一块 try catch 语句中，最多只会执行其中的一个 catch。

当 try 中抛出（抛出这个动作通常用 throw 进行）了一个异常类型，如果有 catch 抓取的是这种异常类型，则执行该 catch 中的语句，执行完后直接跳过后面的所有 catch。

如果没有，则跳过全部 catch，继续执行后面的语句。

如果想用一个 catch 语句抓取所有异常类型，则将 catch 写成如下形式：

```
catch(...){
    异常处理程序段
}
```

在 catch 的括号中写上 ```...``` 可以使该 catch 语句抓取所有异常类型，所以这种 catch 通常放在所有 catch 的最后。

举个具体例子：

```cpp
#include<bits/stdc++.h>
using namespace std;
int A(int m){
    try{
        if(m==0)
            throw 1;
        else if(m==1)
            throw double(1.0);
        else 
            return m;
    }
    catch(double a){
        cout<<"double in A"<<endl;
    }
}
int main(){
    int n,k;
    cin>>n>>k;
    try{
        n=A(k);
    }
    catch(int a){
        cout<<"int in main"<<endl;
    }
    catch(double a){
        cout<<"double in main"<<endl;
    }
    cout<<n;
    return 0;
}
```

执行结果：

输入1：

```
10 0
```

输出1：

```
int in main
10
```

输入2：

```
10 1
```

输出2：

```
double in A
1
```

由上面两个例子可以看出，当函数 A 中的错误无法被解决时，他就会直接终止并将错误传给其调用者；而如果错误得到解决，A 就会继续执行剩下的语句。

C++的标准库中也有一些类代表异常。程序在碰到某些异常时，即使没有 throw 语句也会自动抛出异常。这些自带的异常类都有成员函数 what，返回字符串形式的异常描述信息。
使用这些异常类需要头文件 stdexcept。
具体请移步至 C语言中文网（链接在文末），那里写的很好，这里就不多说了。

参考：
- [C语言中文网：C++异常处理完全攻略](http://c.biancheng.net/view/422.html)