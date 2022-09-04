---
title: Libtcod（1.21.0）学习笔记（C++）之一：配置以及初始的测试
date: 2022-08-02 16:45:17
tags:
- c++
- libtcod
categories: Dumby的RoguelikeDev笔记
---

折腾了好久好久，怎么都跑不起来libtcod，真tm太曹丹了。。

直到我看到这个叫做[TCod Cpp Engine](https://github.com/HexDecimal/tcod-cpp-engine-2022)的项目，最后跟着介绍的步骤终于跑起来了。

{% asset_img 第一次成功运行.png 终于跑起来啦！！！ %}

接下来我们尝试用 VsCode + LibTCod + C++ 制作 Roguelike 游戏。

<!--more-->

## 配置

先要有一些基本工具：VsCode、Cmake，对了，最好再载一下VS（这里用VS2022），因为后面vcpkg使用时要求有VS实例。

然后把[这个库](https://github.com/HexDecimal/tcod-cpp-engine-2022)**克隆**到本地（注意是克隆不是直接复制，用git克隆后面可以免去很多乱七八糟的步骤）。

这里我将库直接克隆到D盘下。（项目主目录为 ```D:\tcod-cpp-engine-2022```）

开始初始化```LibTCod```和```Vcpkg```两个子模块。
子模块是什么具体看[官方文档](https://git-scm.com/book/en/v2/Git-Tools-Submodules)，这里不多说。
我们注意到克隆下来的文件夹中有两个空的文件夹：```libtcod```和```vcpkg```，这两个就是两个子模块的文件夹。
接下来在项目的文件夹下（```D:\tcod-cpp-engine-2022```）运行命令：

```
git submodule update --init --recursive
```

然后就完成了子模块的初始化。
这里如果有什么报错之类的通常都是网络不行，多试几次就行了。
注意子模块一定要正确初始化，刚那两个文件夹有一个空的都会导致编译失败。

接下来打开VsCode，点击打开文件夹，打开项目的主目录（```D:\tcod-cpp-engine-2022```）。

如果你没有下载扩展的话会让你载一些，把VsCode推荐的扩展全都载下来就好了，其中最重要的是这几个：C/C++相关扩展、CMake工具。

VsCode还会提示你选择Kit，这里Win10的话最好选amd64，如果没提示的话可以到底部找到Kit选项打开并选择。

{% asset_img Kit.png 选择Kit %}

最后按 ```F5```，VsCode会自动进行编译。

这样应该就行了，他会跳出一个该项目原作者的一个示例，能运行就说明配置成功。

参考：
- [@HexDecimal 大佬的项目 Libtcod C++ engine 2022](https://github.com/HexDecimal/tcod-cpp-engine-2022)


















---

## 以下为废稿。。。

---


学习用 libtcod（1.21.0） + C++ + VS 制作Roguelike游戏。

环境：Win10 64位。

## 配置

先把 libtcod 配置好再说。

这里不推荐直接下载包，因为后续操作非常曹丹。。

于是我们用vcpkg。

我们创建一个文件夹：```C:\dev```。（其实不创也可以，只是方便描述）

### CMake

由于后面vcpkg下载包时需要用到Cmake，这里先配置好CMake再说。

（其实这里不配置也可以，vcpkg会自动下载，不过速度奇慢，所以还是先配置好比较好）

从[CMake官网](https://cmake.org/)下载对应的版本，安装到目录 ```C:\dev\cmake``` 下，安装过程中最好勾选一下“将CMake加入到环境变量中”的选项。

### vcpkg

vcpkg 是微软开发的用来管理 C 和 C++ 库的工具，我们用这个来配置 libtcod。

#### 配置 vcpkg

官方推荐使用例如 ```C:\src\vcpkg``` 或 ```C:\dev\vcpkg``` 的安装目录,可能遇到某些库构建系统的路径问题。

这里创建了一个 ```C:\dev\vcpkg``` 的目录。

在PowerShell（管理员权限）里运行：

```
git clone https://github.com/microsoft/vcpkg
.\vcpkg\bootstrap-vcpkg.bat
```

#### 使用 vcpkg

进入vcpkg的目录（```C:\dev\vcpkg```）。

用以下命令来查找vcpkg中集成的库:

```
.\vcpkg search [search term]
```

使用以下命令安装您的项目所需要的库：

```
.\vcpkg install [packages to install]
```

请注意: vcpkg在Windows中默认编译并安装x86版本的库。 若要编译并安装x64版本，请执行:

```
.\vcpkg install [package name]:x64-windows
```

#### 安装 libtcod

直接 ```.\vcpkg install libtcod:x64-windows``` 就好了。

#### 安装时常见问题

中途可能会一直卡在这种地方：

```
Downloading xxxx...
  https://xxxx -> [vcpkg root]\downloads\xxxx
```
一直卡着的话说明网卡，可以直接从前一个网址把要载的东西载下来放到后面那个目录里去，然后重新 ```.\vcpkg install libtcod:x64-windows``` 。

如果有 ```error: building stb:x64-windows failed with: BUILD_FAILED``` 这种出现的话通常也是网不行，做法同上。

#### 将vcpkg集成到VS（全局）中

只需要：
```
.\vcpkg integrate install
```

出现 ```Applied user-wide integration for this vcpkg root.``` 说明集成成功。

### SDL

SDL（Simple DirectMedia Layer）是一套开放源代码的跨平台多媒体开发库，提供了数种控制图像、声音、输出入的函数，让开发者只要用相同或是相似的代码就可以开发出跨多个平台的应用软件。

直接从[官网](https://www.libsdl.org/download-2.0.php)上下载（载 ```SDL2-devel-2.0.22-VC.zip (Visual C++ 32/64-bit)``` ）。

安装至目录 ```C:\dev\sdl```。

## 开始项目

打开VS，点击创建创建新项目，选择控制台应用，起个名字，这里创建了一个叫“tmp”的项目。

因为已经将vcpkg集成到全局了，libtcod也可直接引用。

但是SDL并不能直接引用，需要我们进行配置。
先打开项目的属性，找到“VC++目录”选项，进入，找到包含目录，点击右侧箭头，进行编辑。
在上方输入框中输入SDL文件夹中的include文件夹的绝对路径，点击确定即可。
这里用SDL的绝对路径进行配置，所以不能将SDL文件夹进行迁移，如果需要进行迁移，请使用相对路径，具体参考知乎大佬兰話一的文章《SDL库的介绍与安装》，链接在本文底部。
于是SDL配置完成。

然后由于一些兼容问题，我们需要将C++版本改为C++17。
还是项目属性，找到“C/C++”一栏，点开后找到底下的“语言”一栏，将“C++语言标准”改为“ISO C++17 标准 (/std:c++17)”。

以上改完了以后，将我们的源文件（main.cpp）改为如下用于测试是否配置成功：

```cpp
#include <SDL.h>
#include <libtcod.hpp>
int main(int argc, char* argv[]) {
    auto console = tcod::Console{ 80, 25 };
    auto params = TCOD_ContextParams{};
    params.tcod_version = TCOD_COMPILEDVERSION;
    params.console = console.get();
    params.window_title = "Libtcod Project";
    params.sdl_window_flags = SDL_WINDOW_RESIZABLE;
    params.vsync = true;
    params.argc = argc;
    params.argv = argv;
    auto context = tcod::Context(params);
    while (1) {
        TCOD_console_clear(console.get());
        tcod::print(console, { 0, 0 }, "Hello World", std::nullopt, std::nullopt);
        context.present(console);
        SDL_Event event;
        SDL_WaitEvent(nullptr);
        while (SDL_PollEvent(&event)) {
            context.convert_event_coordinates(event);
            switch (event.type) {
            case SDL_QUIT:
                return 0;
            }
        }
    }
}
```



鸽。。。
未完待续。。。



参考：
- [vcpkg官方文档](https://github.com/microsoft/vcpkg/blob/master/README_zh_CN.md#%E5%BF%AB%E9%80%9F%E5%BC%80%E5%A7%8B-windows)
- [RogueBasin Complete roguelike tutorial using C++ and libtcod](http://roguebasin.com/index.php/Complete_roguelike_tutorial_using_C%2B%2B_and_libtcod_-_part_1:_setting_up)
- [知乎大佬Gseal的文章《vscode + cmake + vcpkg搭建c++开发环境》](https://zhuanlan.zhihu.com/p/430835667)
- [知乎大佬兰話一的文章《SDL库的介绍与安装》](https://zhuanlan.zhihu.com/p/428302382)