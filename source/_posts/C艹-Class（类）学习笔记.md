---
title: C艹 Class（类）学习笔记
date: 2022-07-21 18:19:46
tags:
- c++
- 类
- class
categories: Dumby的折腾笔记
---

C艹中的 class 关键字在 OI 中几乎用不上，但是毕竟是C艹中比较重要的一个东西，今后折腾经常要用，所以还是学一下。

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
其中 private 表示内容为私密属性，外界无法直接访问和调用，只能被该类内部访问调用；public 则表示内容为公开属性，外界可以直接访问调用；而 protected 则表示内容为保护属性，其可访问范围比私有大，比公开小。

写成代码就是：
```cpp
class Name{
	public:

	private:
		
	protected:

};
```

## 实现

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

int main() {
	Name Tmp;
	Tmp.setab(1, 2);
	Tmp.print();
	return 0;
}
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

int main() {
	Name Tmp;
	Tmp.setab(1, 2);
	Tmp.print();
	return 0;
}

void Name::setab(int aa, int bb) {
	a = aa, b = bb;
}

void Name::print() {
	printf("%d %d\n", a, b);
}
```

或者：
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

int main() {
	Name Tmp;
	Tmp.setab(1, 2);
	Tmp.print();
	return 0;
}
```

#### 构造函数

通过构造函数来初始化类。

```cpp
class Name {
	public:
		Name(int aa, int bb): a(aa), b(bb) {}
		void print() {
			printf("%d %d\n", a, b);
		}
	private:
		int a, b;
};

int main() {
	Name Tmp(1, 2);
	Tmp.print();
	return 0;
}
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

