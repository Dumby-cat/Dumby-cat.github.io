---
title: C艹 Class（类）学习笔记
date: 2022-07-21 18:19:46
tags:
- c++
- 类
- class
categories: Dumby的C++学习笔记
---

C艹中的 class 关键字在 OI 中几乎用不上，但是毕竟是C艹中比较重要的一个东西，今后整活经常要用，所以还是学一下。

<!--more-->

## 定义

类的定义伪代码如下：
```cpp
关键字 类名{
	访问修饰符:
		变量;
		方法(){}
};
```

其中关键字就是class，方法就是一个个函数之类的，访问修饰符分为三种： **private、public、protected**。

## 实现

### 访问修饰符

#### 私有（private）成员

私有成员类外部无法直接访问调用，只能类本身和友元函数能访问和调用。
类的成员默认都是私有的。

#### 公有（public）成员

共有成员类外部可直接访问调用。

#### 保护（protected）成员

保护成员与私有成员十分相似，但是相比私有成员，保护成员可以被派生类（子类）访问。

### 成员函数

两种写法

一：
```cpp
class Name {
	public:
		void setab(int aa, int bb) {
			a = aa, b = bb;
		}
		void print() {
			printf("%d %d\n", a, b);
		}
	private:
		int a, b;
};
```

二：
```cpp
class Name {
	public:
		void setab(int aa, int bb);
		void print();
	private:
		int a, b;
};

void Name::setab(int aa, int bb) {
	a = aa, b = bb;
}

void Name::print() {
	printf("%d %d\n", a, b);
}
```

调用：
```cpp
int main() {
	Name Tmp;
	Tmp.setab(1, 2);
	Tmp.print();
	return 0;
}
```

#### 构造函数

构造函数不会返回任何值，也不返回void。

构造函数的名字与类名相同。

例子：
可以通过构造函数来初始化类的成员变量。

```cpp
class Name {
	public:
		Name(int aa, int bb): a(aa), b(bb) {} //构造函数
		void print() {
			printf("%d %d\n", a, b);
		}
	private:
		int a, b;
};
```

也可写成：
```cpp
class Name {
	public:
		Name(int aa, int bb);
		void print();
	private:
		int a, b;
};

Name::Name(int aa, int bb): a(aa), b(bb) {}

void Name::print() {
	printf("%d %d\n", a, b);
}
```

以下两种是等价的：
```cpp
Name(int aa, int bb): a(aa), b(bb) {}

Name(int aa, int bb) {a = aa; b = bb;}
```

但是前一种会快一些。

调用：
```cpp
int main() {
	Name Tmp(1, 2);
	Tmp.print();
	return 0;
}
```

要注意在构造函数中变量初始化的顺序是变量定义的顺序而不是函数中变量出现的顺序。

举个例子：
```cpp
class Name {
	public:
		Name(): a(5), b(a + 1) {}
		void print() {
			printf("%d %d\n", a, b);
		}
	private:
		int a, b;
};

int main() {
	Name Tmp;
	Tmp.print();
	return 0;
}
```

注意变量定义顺序是先 a 后 b，构造函数内变量赋值也是先 a 后 b，该代码输出的是
```
5 6

```

而以下代码：
```cpp
class Name {
	public:
		Name(): a(5), b(a + 1) {}
		void print() {
			printf("%d %d\n", a, b);
		}
	private:
		int b, a;
};

int main() {
	Name Tmp;
	Tmp.print();
	return 0;
}
```

输出则变成了
```
5 1
```

原因是改变了变量定义顺序后，构造函数内变量赋值顺序变成了先 b 后 a，所以会出现错误。

当然构造函数还可以用来干别的事情，这里不多讲。

##### 拷贝构造函数

其实没什么特别的，就是在构造函数里传入了一个对象。

如下：
```cpp
class Name {
	public:
		Name(const Name &Tmp) {
			*a = *Tmp.a;
		}
	private:
		int *a;
};
```

#### 构析函数

构析函数会在每次删除所创建的对象时执行。

构造函数的名字是类名前面加个波浪号。

例子：

```cpp
class Name {
	public:
		Name() {a = new int[10]();} //构造函数在对象创建时开了一个动态数组
		~Name() {delete []a;} //构析函数在对象删除时将动态数组删除
	private:
		int *a;
};
```

