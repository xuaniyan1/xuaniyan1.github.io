---
layout: post
title: "我终于开始理解 DFS：参数、vis 与 path 到底在记录什么"
date: 2026-09-26 15:20:00 +0800
description: "从全排列、组合、有向图路径到迷宫，重新理解 DFS 每一层究竟负责什么。"
tags: [C++, 算法, DFS, 回溯]
---

以前写 DFS 时，我总能记住这样的结构：

```cpp
做出选择;
dfs(下一层);
撤销选择;
```

但我并不真正清楚：`dfs(...)` 的参数为什么这样写，`vis` 到底标记了什么，`path` 为什么要 `push_back()` 和 `pop_back()`。题目稍微变化，我就容易重新陷入混乱。

这篇文章记录我目前对 DFS 的理解。重点不是背四份代码，而是弄清楚一件事：**进入一次 DFS 调用时，当前状态是什么；这一层负责做什么；函数返回时又应该恢复成什么状态。**

下面的代码保留了我练习时使用的变量名、调试输出和原注释。它们不一定像标准题解一样整齐，但能留下我当时究竟卡在哪里、后来又是怎样理解的。补充说明放在代码后面，不用“标准答案”覆盖掉自己的思考过程。

## 先分清：参数含义与 DFS 含义

这是我之前最容易混在一起的地方。

参数含义描述的是：

> 进入这一次函数调用时，我已经掌握了哪些状态信息？

整个 DFS 的含义描述的是：

> 拿到这些状态以后，这一次函数调用负责完成什么搜索任务？

例如：

```cpp
void dfs(int nextIndex, int remaining, int currentSum)
```

三个参数分别表示：

- `nextIndex`：下一次允许选择的最小下标；
- `remaining`：还需要选择几个数字；
- `currentSum`：当前已经选择的数字之和。

而整个函数的任务是：

> 在当前 `path` 的基础上，从 `nextIndex` 及其右边的数字中，再选择 `remaining` 个数字，枚举满足目标和的所有方案。

所以，**参数是状态，DFS 是处理这个状态并搜索所有后续可能性的任务。**

这里的“当前”，指的是刚刚进入本次函数调用的那一刻。父层眼中的“下一步”，在进入子层以后，就会成为子层的“当前状态”。

---

## 题目一：全排列

对应代码：`dfsAndbinary/dfsplus.cpp`。

### 题目描述

给定一个正整数 `n`，将数字 `0,1,2,...,n-1` 各使用一次，输出它们的所有排列。

### 输入格式

输入两个整数 `n` 和 `k`。当前这版全排列代码实际上只使用了 `n`，`k` 是我练习时保留下来的变量。

```text
3 0
```

### 输出格式

每行输出一种排列，数字之间使用空格分隔。

```text
0 1 2
0 2 1
1 0 2
1 2 0
2 0 1
2 1 0
```

输出顺序可能因为枚举顺序不同而有所变化，但所有合法排列都应该出现且只出现一次。

### 我的代码（保留当时的注释）

```cpp
#include <bits/stdc++.h>
using namespace std;
using ll = long long;
int n, k;
const int maxn = 2e5 + 10;
vector<ll> a;
vector<ll> sum;  // x:下一次需要选第几个数 排列问题
vector<ll> path; // 当前准备填写排列中的第x个数字  from gpt
int vis[100000];
void dfs(int x) // 我要选第0个数 然后我可以从0->n-1来选 但是如果遇到了我曾经选过了 那就不要选了
{
    if (x == n)
    {
        for (auto k : path)
            cout << k << " ";
        cout << endl;
    }
    else
    {
        for (int i = 0; i < n; i++)
        {
            if (vis[i]) // vis的意思是 在我当前的选择下 我选过了这个点
                continue;
            vis[i] = true;
            path.push_back(i);
            dfs(x + 1);      /*
                  dfs(1) 的含义是：
      在排列第 0 个位置已经确定为 0 的前提下，把后面所有可能的排列全部枚举出来。*/
                             // 所有以0开始的都处理完了
            path.pop_back(); // 那我这一层不选i了 我要把i退掉，我选择其他的 其实你就是不要去管dfs(x+1)在干啥 ：from lytion:你已经选了第x个数之后 把剩下的过程处理完了 然后你现在不选这第x个数i选择其他的数字
            vis[i] = false;
        }
    }
}
void solve()
{
    cin >> n >> k;
    dfs(0);
}
int main()
{
    ios::sync_with_stdio(false);
    cin.tie(0);
    solve();
    return 0;
}
```

### 参数含义

```cpp
x
```

表示前面已经填写了多少个位置，也表示现在准备填写排列中的第 `x` 个位置。

### 整个 DFS 的含义

```cpp
dfs(x)
```

表示：

> 前 `x` 个位置已经填写完成，在此基础上，把后面的所有排列枚举出来。

### 进入函数时的状态

进入 `dfs(x)` 时，应该始终满足：

```cpp
path.size() == x;
```

并且：

- `path` 保存当前排列已经填写的部分；
- `vis[i]` 表示数字 `i` 是否已经出现在当前排列中。

这里的 `vis` 不是“这个数字在整个程序中是否出现过”，而是“这个数字是否出现在当前这条选择路径中”。

### 为什么需要撤销？

假设第 `0` 个位置选择了 `0`：

```cpp
vis[0] = true;
path.push_back(0);
dfs(1);
```

`dfs(1)` 会处理所有以 `0` 开头的排列。它返回时，表示这一整类方案已经枚举完毕。现在第 `0` 个位置需要尝试 `1`、`2` 等其他数字，所以必须撤销刚才的选择：

```cpp
path.pop_back();
vis[0] = false;
```

`pop_back()` 并不表示刚才选择错了，而是表示：**所有建立在这次选择之上的方案都已经处理完，现在换一个选择。**

---

## 题目二：从 n 个数字中选择 k 个，使总和等于 target

对应代码：`dfsAndbinary/sovle.cpp`。

### 题目描述

给定 `n` 个整数，从中选择恰好 `k` 个数，使它们的和等于 `target`。同一个下标只能选择一次，并且任意两个被选择的下标不能相邻。

本题保存并输出的是数组下标，下标从 `0` 开始。

### 输入格式

第一行输入三个整数：

```text
n k target
```

第二行输入 `n` 个整数：

```text
nums[0] nums[1] ... nums[n-1]
```

样例输入：

```text
4 2 7
2 4 3 5
```

### 输出格式

每行输出一组满足条件的下标。如果没有合法方案，则不输出任何内容。

样例输出：

```text
0 3
```

因为：

```text
nums[0] + nums[3] = 2 + 5 = 7
```

下标 `1` 和下标 `2` 虽然对应的数之和也是 `7`，但它们相邻，因此不能同时选择。

### 我的代码（保留当时的注释）

```cpp
#include <bits/stdc++.h>
using namespace std;

struct edge
{
    int id;
    int to;
};
int start, n, k;
int target;
int sum;
// vector(<int>, <int>) dir;
vector<vector<edge>> g(100005);
vector<bool> vis(100005);
vector<int> path;
vector<int> num;
vector<vector<int>> ans;
// vector<int> ans;
/*start：下一次从哪个下标开始选择
left：还需要选择几个数
sum：当前已经选择的数字之和
path：当前选择的下标
*/
void dfs(int start, int left, int sum)//下一次从哪个下标开始选数字，剩下几个没选当前sum是多少
//不是你自己的含义是这些参数的含义
/*
参数含义：
nextIndex：下一次选择的最小下标
remaining：还需要选择几个数字
currentSum：当前已经选择的数字之和

函数任务：
在当前 path 的基础上，
从 nextIndex 及其右边的数字中，
再选择 remaining 个数字，
枚举满足目标和的所有方案。
*/

{
    if (left == 0 && sum == target)
    {
        ans.push_back(path);
        return;
    }
    if (start >= n || left == 0)
        return;
    for (int i = start; i < n; i++)
    {
        path.push_back(i);

        dfs(i + 2, left - 1, sum + num[i]);

        path.pop_back();
    }
}
void solve()
{
    cin >> n >> k >> target;
    int l;
    for (int i = 0; i < n; i++)
    {
        cin >> l;
        num.push_back(l);
    }
    dfs(0, k, 0);
}

int main()
{
    ios::sync_with_stdio(false);
    solve();
    for (auto p : ans)
    {
        for (auto x : p)
        {
            cout << x << " ";
        }
        cout << endl;
    }
}
```

这一版还留着前一次图搜索练习中的 `edge`、`g` 和 `vis` 等变量，它们没有参与本题。这里暂时保留原代码，提醒自己以后完成一种题型后也要清理无关状态。

### 参数含义

- `start`：下一次允许选择的最小下标，相当于前文中的 `nextIndex`；
- `left`：还需要选择几个数字，相当于 `remaining`；
- `sum`：当前已经选择的数字之和，相当于 `currentSum`。

`start` 不是“当前已经选择的下标”。当前选择了哪些下标，是由 `path` 保存的。`start` 只是下一次搜索范围的左边界。

### 整个 DFS 的含义

```cpp
dfs(start, left, sum)
```

表示：

> 当前已经形成了 `path`，数字之和为 `sum`；接下来从 `start` 开始，再选择 `left` 个数字，寻找所有满足条件的方案。

### 为什么这里不需要 vis？

组合不关心选择顺序。选择下标 `{0, 3}` 和 `{3, 0}` 是同一个组合，因此可以人为规定：

> 所有组合都必须按照下标从小到大的顺序生成。

选择下标 `i` 后，普通组合下一次从 `i + 1` 开始：

```cpp
dfs(i + 1, left - 1, sum + num[i]);
```

这样以后只能继续向右选择，同一个下标不会再次出现，也不会同时生成 `{0,3}` 和 `{3,0}`，所以不需要 `vis`。

本题还要求不能选择相邻下标，因此不是 `i + 1`，而是：

```cpp
dfs(i + 2, left - 1, sum + num[i]);
```

这里真正应该记住的不是 `i + 2`，而是：

> 题目对下一次选择范围的限制，决定递归时把哪个值传给 `nextIndex`。

`path` 中保存的是下标。如果想输出对应数值，应写成：

```cpp
for (int index : answer)
    cout << num[index] << ' ';
```

---

## 题目三：输出有向图中从起点到终点的所有简单路径

对应代码：`dfsAndbinary/dfs.cpp`。

### 题目描述

给定一张有向图、起点和终点。每条边按照输入顺序从 `1` 开始编号，输出从起点到终点的所有简单路径。

简单路径表示同一条路径中不能重复经过同一个顶点。每条路径输出经过的边 ID，而不是顶点编号。

### 输入格式

第一行输入：

```text
start target m
```

其中 `start` 是起点，`target` 是终点，`m` 是边数。

接下来 `m` 行，每行输入一条有向边：

```text
u v
```

第 `i` 行边的 ID 就是 `i`。

样例输入：

```text
1 4 5
1 2
2 4
1 3
3 4
2 3
```

这些边对应：

```text
边 1：1 -> 2
边 2：2 -> 4
边 3：1 -> 3
边 4：3 -> 4
边 5：2 -> 3
```

### 输出格式

每行输出一条路径经过的边 ID。下面展示的是去掉调试信息后真正关心的答案；当前代码还会额外输出 `begin to v`、`revert this operation` 等递归过程，方便观察调用与回退。

```text
1 2
1 5 4
3 4
```

三条路径分别是：

```text
1 -> 2 -> 4
1 -> 2 -> 3 -> 4
1 -> 3 -> 4
```

### 我的代码（保留调试输出和原注释）

```cpp
#include <bits/stdc++.h>
using namespace std;

struct edge
{
    int id;
    int to;
};
int start, n;
int target;
// vector(<int>, <int>) dir;
vector<vector<edge>> g(100005);
vector<bool> vis(100005);
vector<int> ans;
void dfs(int v)//v:下次我要从v顶点开始找路径
{
    if (v == target)
    {
        for (int x : ans)
        {
            cout << x << " ";
        }
        cout << endl;
    }
    else
    {
        cout << "begin to v" << " " << v << "\n";
        for (edge e : g[v])
        {
            if (!vis[e.to])
            {
                vis[e.to] = true;//那我就选了这个点 把边push
                cout << "because vis[e.to] is false I  vis it : " << e.to << " id is " << e.id << endl;
                ans.push_back(e.id);



                dfs(e.to);


                cout << "revert this operation " << "e.to is " << e.to << " is not to flag" << endl;
                vis[e.to] = false;
                ans.pop_back();//不选这个点了我从另外的边去选
            }
        }
    }
}
void solve()
{
    cin >> start >> target >> n;
    for (int i = 1; i <= n; i++)
    {
        int u, v;
        cin >> u >> v;
        g[u].push_back({i, v});
    }
    vis[start] = true;
    dfs(start);
}

int main()
{
    ios::sync_with_stdio(false);
    solve();
}
```

调用前：

```cpp
vis[startVertex] = true;
dfs(startVertex);
```

### 参数含义

```cpp
v
```

表示当前已经到达的顶点。

### 整个 DFS 的含义

```cpp
dfs(v)
```

表示：

> 当前已经沿着 `ans` 中记录的边到达顶点 `v`，从这个顶点继续沿边搜索，输出所有能够到达终点且不重复经过当前路径节点的方案。

### 为什么 vis 记录节点，path 却记录边？

它们负责的是不同问题：

- `vis[v]` 防止当前路径重复经过同一顶点，从而避免环；
- `ans` 保存题目最终要求输出的边 ID。虽然变量名叫 `ans`，它在搜索过程中实际扮演的是“当前边路径”。

选择一条边时，两个状态同时改变：

```cpp
vis[e.to] = true;
ans.push_back(e.id);
```

递归返回后也要同时恢复：

```cpp
ans.pop_back();
vis[e.to] = false;
```

因此，`vis` 记录什么与 `path` 保存什么不必相同。一个负责限制搜索，一个负责构造答案。

---

## 题目四：迷宫中的所有简单路径

对应代码：`dfsAndbinary/maze.cpp`。

### 题目描述

给定一个 `n × n` 的迷宫、起点和终点。迷宫中 `1` 表示可以通过，`0` 表示障碍物。

人物每次只能向上、下、左、右移动一格。要求输出从起点到终点的所有简单路径，同一条路径中不能重复经过同一个格子。

这个 DFS 会枚举所有简单路径，路径数量可能非常多，因此更适合规模较小的练习数据。如果题目要求最短路径，一般应该使用 BFS。

### 输入格式

第一行输入：

```text
n startX startY endX endY
```

接下来输入一个 `n × n` 的迷宫矩阵。

样例输入：

```text
3 1 1 3 3
1 1 0
0 1 1
0 0 1
```

### 输出格式

每行输出一条从起点到终点的路径。

样例输出：

```text
(1,1) -> (1,2) -> (2,2) -> (2,3) -> (3,3)
```

### 写代码前记录的伪代码

这是我在完成全排列后，尝试迁移到迷宫时写下的原始想法：

```text
like dfs(pos) pos为下一次我开始搜索的点
in main push_back(pos) vis[pos]=1;
if (istarget(pos))
    pr()
else 从pos走到下一个点
{
    遍历四个方向
    if (可以遍历) {
        那把当前的点push_back 我选了这个点
        dfs(next_pos)
        那这个点做完了他的事情
        我不想选了 pop_back and vis[]=false
    }
}
```

后来需要校正的一点是：进入 `dfs(pos)` 时，`pos` 已经被选中；当前层真正 `push_back()` 的应该是即将前往的 `nextPos`。父层眼中的 `nextPos`，进入子层后才会成为新的当前位置。

### 我的代码（保留当时的注释）

```cpp
#include <bits/stdc++.h>
using namespace std;
using ll = long long;
const int maxn = 2e5 + 10;
struct Pos
{
    int x;
    int y;
};
int maze[1001][1001];
int xend, yend;
int xstart, ystart;
int n;
vector<Pos> path;
bool vis[1001][1001];
Pos dir[4] = { {0, 1}, {1, 0}, {-1, 0}, {0, -1}};
// vector<ll> a(maxn);
// vector<ll> sum(maxn);
void dfs(Pos pos) // 当前人物所在位置 dfs 当前已有的path 和当前vis了哪些点 接下来我以站在pos的位置到达终点的path方法
{
    if (pos.x == xend && pos.y == yend)
    {
        for (auto p = path.begin(); p < path.end(); p++)
        {
            cout << "( " << p->x << "," << p->y << ") ";
            if (next(p) != path.end())
                cout << "->";
        }
        cout << endl;
    }
    else
    {

        for (auto k : dir)
        {

            Pos nextPos = {pos.x + k.x, pos.y + k.y};
            if (nextPos.x < 1 || nextPos.x > n ||
                nextPos.y < 1 || nextPos.y > n)
            {
                continue;
            }
            if (vis[nextPos.x][nextPos.y] || maze[nextPos.x][nextPos.y] == 0) // 如果我已经选过了 或者这个点不能走
                continue;
            vis[nextPos.x][nextPos.y] = true;
            path.push_back(nextPos);
            dfs(nextPos);
            vis[nextPos.x][nextPos.y] = false;
            path.pop_back();
        }
    }
}
void solve()
{
    // int n;
    cin >> n >> xstart >> ystart >> xend >> yend;
    for (int i = 1; i <= n; i++)
    {
        for (int j = 1; j <= n; j++)
        {
            cin >> maze[i][j];
        }
    }
    vis[xstart][ystart] = true;
    Pos s = {xstart, ystart};
    path.push_back(s);
    dfs(s);
}
int main()
{
    ios::sync_with_stdio(false);
    cin.tie(0);
    solve();
    return 0;
}
```

### 参数含义

```cpp
void dfs(Pos pos)
```

`pos` 表示人物当前已经到达的位置。

### 进入 DFS 时必须成立的状态

进入 `dfs(pos)` 时：

1. `path` 保存从起点到 `pos` 的完整路径；
2. `path.back()` 就是 `pos`；
3. `vis[pos.x][pos.y] == true`；
4. `vis` 标记的正好是当前 `path` 中经过的位置。

### 整个 DFS 的含义

```cpp
dfs(pos)
```

表示：

> 人物当前已经站在 `pos`，从 `pos` 的四个方向中选择下一步，输出所有不重复经过当前路径节点并最终到达终点的路线。

在父层中，`nextPos` 是准备选择的“下一步”；执行 `dfs(nextPos)` 后，它就成为子层的“当前位置”。

### 使用迭代器输出路径

```cpp
void printPath()
{
    for (auto it = path.begin(); it != path.end(); ++it)
    {
        cout << "(" << it->x << "," << it->y << ")";

        if (next(it) != path.end())
            cout << " -> ";
    }

    cout << '\n';
}
```

`path.end()` 指向最后一个元素之后的位置，不能被解引用。`next(it) != path.end()` 表示当前元素后面仍然有元素，因此需要输出箭头。

我原代码中循环条件写的是 `p < path.end()`。因为 `vector` 的迭代器支持大小比较，所以可以工作；写成 `p != path.end()` 更符合通用迭代器的习惯，也适用于更多容器。

---

## 四道题放在一起看

| 问题 | DFS 参数记录什么 | path 保存什么 | vis 限制什么 |
| --- | --- | --- | --- |
| 全排列 | 当前准备填写的位置 `depth` | 当前排列 | 当前排列已经使用的数字 |
| 组合与目标和 | 下次最小下标、剩余数量、当前和 | 已选下标 | 不需要，`nextIndex` 已保证只向右选 |
| 有向图路径 | 当前顶点 `vertex` | 经过的边 ID | 当前路径经过的顶点 |
| 迷宫路径 | 当前坐标 `pos` | 从起点到当前位置的坐标 | 当前路径经过的格子 |

表面上，这些题目差异很大，但每一层都在做同一件事：

```cpp
枚举这一层可以进行的选择;

修改当前状态;
dfs(修改后的状态);
恢复当前状态;
```

真正会变化的是：

- 什么叫“当前状态”；
- 下一步有哪些选择；
- 哪些选择不合法；
- 哪些状态属于当前分支，递归回来后需要恢复。

## 我现在用来检查 DFS 的问题

以后写 DFS 前，我会先回答下面几个问题：

1. 每个参数分别记录什么状态？
2. 整个 `dfs(...)` 调用负责完成什么任务？
3. 刚进入函数时，`path` 和 `vis` 应该是什么状态？
4. 当前这一层负责选择什么？
5. 我在递归前修改了哪些状态？
6. 递归返回后，哪些状态需要恢复？
7. 函数返回时，能否保证 `path` 和 `vis` 与进入时一致？

其中最有用的一句话是：

> 进入 DFS 时，当前节点或当前位置已经选择好了；这一层负责枚举下一步。哪一层做出的选择，就由哪一层在递归返回后撤销。

我现在还不能说自己完全掌握了 DFS，但至少不再只记得 `push_back → dfs → pop_back`。开始写之前，先说清楚参数、状态和这一层的任务，代码就不再像凭空出现的模板。
