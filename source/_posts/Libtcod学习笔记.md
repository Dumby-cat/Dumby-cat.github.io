---
title: Libtcod学习笔记
date: 2022-08-02 16:45:17
tags:
- c++
- libtcod
categories: Dumby的折腾笔记
---

学习用 libtcod + c++ 制作Roguelike游戏。

<!--more-->

## 配置

先把 libtcod 配置好再说。

### vcpkg

vcpkg 是微软开发的用来管理 C 和 C++ 库的工具，我们用这个来配置 libtcod。

#### 配置 vcpkg

官方推荐使用例如 ```C:\src\vcpkg``` 或 ```C:\dev\vcpkg``` 的安装目录,可能遇到某些库构建系统的路径问题。

这里创建了一个 ```C:\dev\vcpkg``` 的目录。

在cmd里运行：

```
git clone https://github.com/microsoft/vcpkg
.\vcpkg\bootstrap-vcpkg.bat
```

#### 使用 vcpkg

使用以下命令安装您的项目所需要的库：

```
.\vcpkg\vcpkg install [packages to install]
```

请注意: vcpkg在Windows中默认编译并安装x86版本的库。 若要编译并安装x64版本，请执行:

```
> .\vcpkg\vcpkg install [package name]:x64-windows
```


用以下命令来查找vcpkg中集成的库:

```
.\vcpkg\vcpkg search [search term]
```

### 搭建环境

搭建一个基于VSCode的c++开发环境。

首先将vcpkg集成到vscode中：

1. 在vscode中按下F1或者ctrl+shift+p；
2. 输入 ```settings.json``` ，打开设置；
3. 添加：
```
"cmake.configureSettings": {
    "CMAKE_TOOLCHAIN_FILE": "C:/dev/vcpkg/vcpkg/scripts/buildsystems/vcpkg.cmake",
    "VCPKG_TARGET_TRIPLET": "x64-windows"
}
```
其中 ```CMAKE_TOOLCHAIN_FILE``` 是vcpkg的安装目录下vcpkg.cmake文件的位置， ```VCPKG_TARGET_TRIPLET``` 是你的系统。

鸽。。。
未完待续。。。
















参考：
- [vcpkg官方文档](https://github.com/microsoft/vcpkg/blob/master/README_zh_CN.md#%E5%BF%AB%E9%80%9F%E5%BC%80%E5%A7%8B-windows)
- [RogueBasin Complete roguelike tutorial using C++ and libtcod](http://roguebasin.com/index.php/Complete_roguelike_tutorial_using_C%2B%2B_and_libtcod_-_part_1:_setting_up)
- [知乎大佬Gseal的文章《vscode + cmake + vcpkg搭建c++开发环境》](https://zhuanlan.zhihu.com/p/430835667)