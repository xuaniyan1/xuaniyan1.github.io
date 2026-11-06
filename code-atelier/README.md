# Code Atelier · 北航复试机试真题库

入口：<https://xuaniyan1.github.io/code-atelier/buaa-exams/>

## 当前内容
- 31 道可判题，101 组公开测试数据。
- 支持 C11、C++17、Python 3；在线编译通过 Wandbox API。
- 题目按来源标注：公开代码重建、回忆版、公开题解重建、训练版。年份或输入输出未核实的题目不开放判题。

## 本轮 Review 与修复
- 2018 三叉树：将节点选择规则明确为“孩子数降序、深度降序、先序序号升序”；补充“较浅但孩子更多”的反例测试。参考代码原实现中的条件容易把两个优先级错误地写成必须同时增加。
- 2023 手机基站：题目要求同一基站且时间区间重叠，两个条件必须同时满足；区间端点相等算重叠。
- 2024 运动记录：公开题面只规定同类别按总时长升序，没有说明平局次级排序；补充测试不再用未定义的平局顺序判答案。
- 评测流程：编译/运行失败会明确中止，不再把未执行测试误算进总通过率；显示首个输出差异，并为 Wandbox 请求设置超时。
- 练习体验：增加本地通过进度和状态筛选；切换题目时保留所选语言；代码与通过记录按题目、语言保存在当前浏览器。
- 2019 复杂计算器仍放在待核验区：公开回忆材料对中缀转后缀和输出格式的说明不完整，暂不拿猜测题面判题。
- 2025 Huffman 继续标注为训练重建版，不将补充的平局规则和样例冒充官方原题。

## 测评说明与限制
- 测试数据为本站整理和补充的公开用例，不是北航官方隐藏测试。
- GitHub Pages 是静态网站，公开测试数据可以被查看；它不是保密的服务端 OJ。
- 在线提交会把代码和测试输入发送到第三方 Wandbox 编译运行服务。服务可能限流、超时或暂时不可用。
- 代码与通过状态保存在当前浏览器的 localStorage，不会云同步；清理浏览器站点数据会清除本地记录。
- 原题资料存在回忆版本差异，尤其是年份、空节点标记、平局规则和输出格式。页面优先标出不确定性，不用推测补齐官方规则。

## 来源
- https://github.com/finlay-liu/BuaaMasterQuestion
- https://github.com/Muyiyunzi/BUAA-CS-Codes
- https://www.cnblogs.com/sybil-hxl/p/10428806.html
- https://www.cnblogs.com/moonout/p/16456422.html
- https://www.cnblogs.com/moonout/p/16454166.html
- https://gitcode.com/gcw_MmtUyYoi/pgcode/blob/master/北京航空航天大学计算机保研机试真题.md
- https://noobdream.com//DreamJudge/Issue/page/0/?algorithm_type=All&page=1&problem_id_name=&problem_source=%E5%8C%97%E4%BA%AC%E8%88%AA%E7%A9%BA%E8%88%AA%E5%A4%A7%E5%AD%A6
- https://www.nowcoder.com/practice/21484c3d217644a6bcea4a6d45a96a94
- https://icode.best/i/416871376865994
- https://www.cnblogs.com/moonout/p/16453347.html
- https://noobdream.com/post/404429/
