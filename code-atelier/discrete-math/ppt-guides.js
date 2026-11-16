/* 教学口径：来自上传的《总复习.pdf》与 2025 秋各次作业参考答案（课件形式）。每题显示原始资料页码、定义、老师采用的证明路线与第一步提示。不是把《考点-new.pptx》（数理逻辑）误当作本课程课件。 */
window.DM2_PPT_GUIDE = {
  "count": 40,
  "sourceNotes": [
    "总复习.pdf 第 2—27 页：课程定义与定理",
    "2025 秋作业第一至第六次、第八次参考答案：题目+知识点+解答",
    "《考点 - new.pptx》内容为数理逻辑，不是离散数学2的教学依据"
  ],
  "guides": {
    "DM2-HW01-Q01": {
      "ppt": {
        "name": "第一次作业参考答案.pdf",
        "page": 3
      },
      "review": {
        "name": "总复习.pdf",
        "page": 2
      },
      "definition": "幂集定义 P(A)={X | X⊆A}；若 A 有 n 个不同元素，子集数为 2ⁿ。",
      "method": "先区分“元素本身是集合”和“集合的子集”；再按每个元素选或不选枚举。",
      "firstStep": "写出 A 的每一个顶层元素，不拆开它内部的大括号。",
      "pitfall": "原 PDF 第 3 页图片与第 5 页解答一致：b 项是 {∅,{a},{∅}}。纯文本提取可能丢失 {a} 的外层大括号，请始终以原页图像为准。",
      "relatedRecent": []
    },
    "DM2-HW01-Q02": {
      "ppt": {
        "name": "第一次作业参考答案.pdf",
        "page": 8
      },
      "review": {
        "name": "总复习.pdf",
        "page": 2
      },
      "definition": "外延性公理：A=B ⇔ 对所有 x，x∈A ⇔ x∈B。幂集成员关系：X∈P(A) ⇔ X⊆A。",
      "method": "把原集合的元素 x 变成单元素集合 {x}，才可以使用已知的 P(A)=P(B)。",
      "firstStep": "任取 x∈A，如何借助 {x} 把它送进幂集？",
      "pitfall": "不能只写“显然 A=B”；证明两个方向的元素包含。",
      "relatedRecent": []
    },
    "DM2-HW01-Q03": {
      "ppt": {
        "name": "第一次作业参考答案.pdf",
        "page": 16
      },
      "review": {
        "name": "总复习.pdf",
        "page": 2
      },
      "definition": "集合的属于关系 ∈ 与包含关系 ⊆ 是两种不同谓词。",
      "method": "题目问命题是否恒真，先按量词否定构造满足前提却违背结论的最小反例。",
      "firstStep": "把 A 看成一个整体元素放入 C，而不是把 A 的元素都放入 C。",
      "pitfall": "A∈B 与 A⊆B 绝不可互换。",
      "relatedRecent": []
    },
    "DM2-HW01-Q04": {
      "ppt": {
        "name": "第一次作业参考答案.pdf",
        "page": 19
      },
      "review": {
        "name": "总复习.pdf",
        "page": 3
      },
      "definition": "集合并、交、差、补、对称差的定义及运算顺序。",
      "method": "先对全集 U 计算补集，再严格按括号分步运算；对称差按出现奇偶判断。",
      "firstStep": "分别写出 ~A、~B 和 B−C，再处理外层运算。",
      "pitfall": "A−(B−C) 不能擅自更改括号。",
      "relatedRecent": []
    },
    "DM2-HW01-Q05": {
      "ppt": {
        "name": "第一次作业参考答案.pdf",
        "page": 22
      },
      "review": {
        "name": "总复习.pdf",
        "page": 3
      },
      "definition": "集合差 A−B=A∩~B；A⊕B=(A−B)∪(B−A)。",
      "method": "每个“当且仅当”拆成充分性和必要性，用差集为空来翻译包含关系。",
      "firstStep": "先证明 A−B=∅ ⇔ A⊆B；后两问转化为两个差集为空。",
      "pitfall": "不能只证明蕴含的一个方向。",
      "relatedRecent": []
    },
    "DM2-HW01-Q06": {
      "ppt": {
        "name": "第一次作业参考答案.pdf",
        "page": 53
      },
      "review": {
        "name": "总复习.pdf",
        "page": 3
      },
      "definition": "德·摩根律、分配律、差集和对称差定义。",
      "method": "先把差集和对称差拆成 ∩、∪、补，再按集合代数变形；最后用元素法复核。",
      "firstStep": "把 A−(B∩C) 写成 A∩~(B∩C)。",
      "pitfall": "原 PDF 公式括号排版较简略，网页保留明示括号以防歧义。",
      "relatedRecent": []
    },
    "DM2-HW01-Q07": {
      "ppt": {
        "name": "第一次作业参考答案.pdf",
        "page": 57
      },
      "review": {
        "name": "总复习.pdf",
        "page": 3
      },
      "definition": "幂集是所有子集构成的集合。",
      "method": "对 P(A)∪P(B) 与 P(A∪B)，先用任意 X 展开成员条件；遇到不成立的反向包含给小反例。",
      "firstStep": "令 X∈P(A)∪P(B)，它意味着 X⊆A 或 X⊆B。",
      "pitfall": "P(A)∪P(B) 一般只是 P(A∪B) 的子集。",
      "relatedRecent": []
    },
    "DM2-HW02-Q01": {
      "ppt": {
        "name": "第二次作业参考答案.pdf",
        "page": 2
      },
      "review": {
        "name": "总复习.pdf",
        "page": 4
      },
      "definition": "关系作为有序偶集合；定义域取第一分量，值域取第二分量。",
      "method": "先求并交关系，再提取第一、第二分量；逐对计入并去重。",
      "firstStep": "把关系中的有序偶列表列齐再求 dom、ran。",
      "pitfall": "不要把 dom(R∩S) 与 dom(R)∩dom(S) 直接等同。",
      "relatedRecent": []
    },
    "DM2-HW02-Q02": {
      "ppt": {
        "name": "第二次作业参考答案.pdf",
        "page": 5
      },
      "review": {
        "name": "总复习.pdf",
        "page": 4
      },
      "definition": "二元关系是笛卡尔积的子集；按关系式筛选有序偶。",
      "method": "枚举 X×Y，逐个代入条件，并核对第一、第二分量来自正确集合。",
      "firstStep": "对于 x+y∈X∩Y，先求 X∩Y 再列出满足和的有序偶。",
      "pitfall": "满足等式但不满足 x∈X、y∈Y 的点必须舍去。",
      "relatedRecent": []
    },
    "DM2-HW02-Q03": {
      "ppt": {
        "name": "第二次作业参考答案.pdf",
        "page": 6
      },
      "review": {
        "name": "总复习.pdf",
        "page": 3
      },
      "definition": "笛卡尔积 A×B 中 (x,y) 的成员条件是 x∈A 且 y∈B。",
      "method": "判断恒等式先证明容易的包含，寻找反方向的逻辑断点并构造最小反例。",
      "firstStep": "(x,y)∉B×D 只意味着 x∉B 或 y∉D，不是“且”。",
      "pitfall": "把“或”错当“且”会误判整个笛卡尔积恒等式。",
      "relatedRecent": []
    },
    "DM2-HW02-Q04": {
      "ppt": {
        "name": "第二次作业参考答案.pdf",
        "page": 11
      },
      "review": {
        "name": "总复习.pdf",
        "page": 4
      },
      "definition": "有序偶唯一性：⟨u,v⟩=⟨x,y⟩ ⇔ u=x 且 v=y。",
      "method": "外层是无序集合，必须考虑直接匹配、交叉匹配、外层两个成员重合三种情况。",
      "firstStep": "先写出两个编码集合相等，再列出元素匹配的可能性。",
      "pitfall": "不能假设外层集合中的两个成员按顺序一一对应。",
      "relatedRecent": []
    },
    "DM2-HW03-Q01": {
      "ppt": {
        "name": "第三次作业参考答案.pdf",
        "page": 2
      },
      "review": {
        "name": "总复习.pdf",
        "page": 6
      },
      "definition": "关系图、关系矩阵与五性质；矩阵对角线反映自反、反自反，对称性看矩阵转置。",
      "method": "先把图转换成 0–1 矩阵；再按老师课件第 5 页的矩阵判据逐项检查，不凭图形直觉。",
      "firstStep": "先检查三个对角元，再检查对称位置，最后检查长度为 2 的路径。",
      "pitfall": "反对称不等于“不对称”；空关系的蕴含型性质可能空真。",
      "relatedRecent": [
        "DM2-FINAL-2025-Q02"
      ]
    },
    "DM2-HW03-Q02": {
      "ppt": {
        "name": "第三次作业参考答案.pdf",
        "page": 7
      },
      "review": {
        "name": "总复习.pdf",
        "page": 6
      },
      "definition": "五种关系性质的量词定义与“不满足”的存在式。",
      "method": "先把关系条件化简为 |x|≤1/4、|y|≥1，再分别用自环、反向边和长度 2 路径检查。",
      "firstStep": "(x,x)∈S 是否可能？若 xSy 且 ySz，中间元素 y 要同时满足什么？",
      "pitfall": "传递条件的前提不可能发生时，传递性仍为真。",
      "relatedRecent": []
    },
    "DM2-HW03-Q03": {
      "ppt": {
        "name": "第三次作业参考答案.pdf",
        "page": 9
      },
      "review": {
        "name": "总复习.pdf",
        "page": 7
      },
      "definition": "关系运算对自反、对称、反对称、传递等性质的保持性。",
      "method": "老师的方法是“成立的证明，不成立的给反例”，每种运算和每种性质单独判断。",
      "firstStep": "反对称看不同结点双向边；传递看两步链能否闭合。",
      "pitfall": "证一个反例时必须先核对原来的 R、S 都满足题设性质。",
      "relatedRecent": [
        "DM2-FINAL-2025-Q02"
      ]
    },
    "DM2-HW03-Q04": {
      "ppt": {
        "name": "第三次作业参考答案.pdf",
        "page": 18
      },
      "review": {
        "name": "总复习.pdf",
        "page": 6
      },
      "definition": "反对称 R 的定义与逆关系 R⁻¹；恒等关系 I_A。",
      "method": "先证明 R∩R⁻¹⊆I_A，再用 n 个对角线元素给出上界并构造达到上界的关系。",
      "firstStep": "若 (x,y) 同时在 R 与 R⁻¹ 中，会怎样？",
      "pitfall": "反对称允许自环，所以最多是 n 个 1 而不是 0。",
      "relatedRecent": []
    },
    "DM2-HW03-Q05": {
      "ppt": {
        "name": "第三次作业参考答案.pdf",
        "page": 22
      },
      "review": {
        "name": "总复习.pdf",
        "page": 5
      },
      "definition": "关系幂 R²=R∘R；自反与传递。",
      "method": "关系相等用双向包含。传递性负责 R²⊆R，自反性负责 R⊆R²。",
      "firstStep": "先把 (x,z)∈R² 展开成存在中间点 y。",
      "pitfall": "只用传递性不能证明等号。",
      "relatedRecent": [
        "DM2-FINAL-2025-Q02"
      ]
    },
    "DM2-HW03-Q06": {
      "ppt": {
        "name": "第三次作业参考答案.pdf",
        "page": 25
      },
      "review": {
        "name": "总复习.pdf",
        "page": 6
      },
      "definition": "反自反、反对称、传递的定义。",
      "method": "反证法：若存在不同元素双向关联，则传递会迫使出现自环，和反自反矛盾。",
      "firstStep": "假设 x≠y 且 xRy、yRx，再利用传递性。",
      "pitfall": "不要把“反对称”说成“不能有任何对称边”。",
      "relatedRecent": []
    },
    "DM2-HW04-Q01": {
      "ppt": {
        "name": "第四次作业参考答案.pdf",
        "page": 2
      },
      "review": {
        "name": "总复习.pdf",
        "page": 8
      },
      "definition": "偏序、覆盖关系与 Hasse 图；最小/极小、最大/极大、上下界、sup/inf 的量词定义。",
      "method": "按图从底往上读覆盖关系、由传递性读可比；分别检验每个子集的上下界，最后再找最小上界和最大下界。",
      "firstStep": "先列出图中所有可以推导的 x≤y，再判断目标子集有哪些共同上界。",
      "pitfall": "最小元≠极小元；上界允许在目标子集外。",
      "relatedRecent": [
        "DM2-FINAL-2025-Q03"
      ]
    },
    "DM2-HW04-Q02": {
      "ppt": {
        "name": "第四次作业参考答案.pdf",
        "page": 7
      },
      "review": {
        "name": "总复习.pdf",
        "page": 8
      },
      "definition": "有限偏序子集的极小元、极大元定义。",
      "method": "老师使用反证法构造无限严格下降链；有限性迫使反证假设失败。",
      "firstStep": "没有极小元意味着每个元素都能找到一个严格更小的元素。",
      "pitfall": "结论只保证极小/极大元，不能升级为最小/最大元。",
      "relatedRecent": []
    },
    "DM2-HW04-Q03": {
      "ppt": {
        "name": "第四次作业参考答案.pdf",
        "page": 13
      },
      "review": {
        "name": "总复习.pdf",
        "page": 9
      },
      "definition": "等价关系=自反+对称+传递；自反闭包 r、传递闭包 t 与关系复合。",
      "method": "逐项核对定义；不成立时找一种性质失败，成立时对三性质分别证明。",
      "firstStep": "并集保留自反和对称，那么 t(R₁∪R₂) 会怎样？",
      "pitfall": "等价关系复合并非总是等价关系；注意复合的约定次序。",
      "relatedRecent": [
        "DM2-FINAL-2025-Q04"
      ]
    },
    "DM2-HW04-Q04": {
      "ppt": {
        "name": "第四次作业参考答案.pdf",
        "page": 14
      },
      "review": {
        "name": "总复习.pdf",
        "page": 9
      },
      "definition": "“循环关系”的定义；等价关系三性质。",
      "method": "证明充要条件：正向用传递+对称；反向先由自反+循环构造对称，再补传递。",
      "firstStep": "由 xRy 和 xRx 能推出什么反向关系？",
      "pitfall": "两个方向的证明次序不同，要先补出已知条件不足的性质。",
      "relatedRecent": [
        "DM2-FINAL-2025-Q04"
      ]
    },
    "DM2-HW04-Q05": {
      "ppt": {
        "name": "第四次作业参考答案.pdf",
        "page": 16
      },
      "review": {
        "name": "总复习.pdf",
        "page": 9
      },
      "definition": "等价关系的等价刻画：若 aRb 且 aRc，则 bRc。",
      "method": "在已知自反的前提下，用代换先证对称，再用已证对称推传递。",
      "firstStep": "将 a=x、b=y、c=x 代入条件，并利用 xRx。",
      "pitfall": "不能在证明对称性前先使用对称性。",
      "relatedRecent": []
    },
    "DM2-HW04-Q06": {
      "ppt": {
        "name": "第四次作业参考答案.pdf",
        "page": 17
      },
      "review": {
        "name": "总复习.pdf",
        "page": 8
      },
      "definition": "偏序、严格偏序、全序、良序定义；字典序与乘积序。",
      "method": "每个关系先判断偏序三性质，然后任取两个点判断可比性；良序再给出无最小元的子集。",
      "firstStep": "比较 (2,3) 与 (3,2)，乘积序和字典序是否相同？",
      "pitfall": "全序还不意味着良序，尤其在实数区间上。",
      "relatedRecent": []
    },
    "DM2-HW04-Q07": {
      "ppt": {
        "name": "第四次作业参考答案.pdf",
        "page": 21
      },
      "review": {
        "name": "总复习.pdf",
        "page": 8
      },
      "definition": "全序与良序：每个非空子集有最小元；逆关系把最小/最大交换。",
      "method": "有限全序显然有最小、最大；无限情况按老师反证路线，不断从剩余集合选最小元形成无限上升链，在逆关系中变成下降链。",
      "firstStep": "若 R 与 R⁻¹ 同时良序，而集合无限，能按顺序选出 a₀<a₁<… 吗？",
      "pitfall": "良序并非“全序”的另一种叫法；每个非空子集都要检查。",
      "relatedRecent": []
    },
    "DM2-HW05-Q01": {
      "ppt": {
        "name": "第五次作业参考答案.pdf",
        "page": 2
      },
      "review": {
        "name": "总复习.pdf",
        "page": 10
      },
      "definition": "部分函数的像 f[A]，广义并 ∪𝒜 与广义交 ∩𝒜。",
      "method": "课件采用任意元素法：等号证明两个包含；交集像只证包含，再以非单射构造反例。",
      "firstStep": "任取 y∈f[∪𝒜]，写出使 y=f(x) 的那个 x。",
      "pitfall": "像可能把两个不同原像合到同一值，所以像一般不保持交集的等号。",
      "relatedRecent": []
    },
    "DM2-HW05-Q02": {
      "ppt": {
        "name": "第五次作业参考答案.pdf",
        "page": 5
      },
      "review": {
        "name": "总复习.pdf",
        "page": 12
      },
      "definition": "左逆 g∘f=I_A、右逆 f∘g=I_B、可逆与双射。",
      "method": "两方向分开：可逆则逆唯一；唯一左/右逆推出单满射时，通过修改未受限制的逆函数值制造矛盾。",
      "firstStep": "若 f 不满射，找 b′∉f[A]，左逆在 b′ 处能否自由修改？",
      "pitfall": "条件 |A|≥2 在唯一性反证中真正用到了。",
      "relatedRecent": [
        "DM2-FINAL-2025-Q05"
      ]
    },
    "DM2-HW05-Q03": {
      "ppt": {
        "name": "第五次作业参考答案.pdf",
        "page": 7
      },
      "review": {
        "name": "总复习.pdf",
        "page": 11
      },
      "definition": "单射、满射、双射与复合 g∘f。",
      "method": "老师先列出函数复合的单满射基本结论，再用任意目标元素或单射的消去性质补足逆向推理。",
      "firstStep": "要证 f 满射，任取 y∈Y，然后考虑 g(y)∈Z。",
      "pitfall": "复合满射并不自动推出内层满射；额外条件 g 单射很关键。",
      "relatedRecent": []
    },
    "DM2-HW05-Q04": {
      "ppt": {
        "name": "第五次作业参考答案.pdf",
        "page": 10
      },
      "review": {
        "name": "总复习.pdf",
        "page": 12
      },
      "definition": "左可逆⇔单射、右可逆⇔满射；可逆⇔双射。",
      "method": "先按分段定义判断是否一一对应和是否覆盖 N，再构造逆函数或右逆并逐项验证。",
      "firstStep": "偶数 x=2y 可为每个 y 提供原像，奇数都映向 3 会怎样？",
      "pitfall": "不要从函数图形直观猜左右逆；必须验证复合是恒等。",
      "relatedRecent": [
        "DM2-FINAL-2025-Q05"
      ]
    },
    "DM2-HW05-Q05": {
      "ppt": {
        "name": "第五次作业参考答案.pdf",
        "page": 12
      },
      "review": {
        "name": "总复习.pdf",
        "page": 11
      },
      "definition": "部分函数复合的定义域、值域与表达式。",
      "method": "从内到外计算，先核对内层取值进入外层定义域，再写表达式并求值域。",
      "firstStep": "h(g(x))=√(x²) 的结果是什么？不能直接省略绝对值。",
      "pitfall": "x² 的平方根是 |x|；g∘h 的定义域不等于 h∘g。",
      "relatedRecent": []
    },
    "DM2-HW05-Q06": {
      "ppt": {
        "name": "第五次作业参考答案.pdf",
        "page": 15
      },
      "review": {
        "name": "总复习.pdf",
        "page": 10
      },
      "definition": "像 f[A] 与原像 f⁻¹[B]；差集保持性的差异。",
      "method": "对像的差集先用元素法证明包含，再找非单射反例；原像的差集则证明双向包含。",
      "firstStep": "从 y∈f[A]−f[B] 出发，选一个 x∈A 使 f(x)=y。",
      "pitfall": "像与原像的分配性质不同。",
      "relatedRecent": []
    },
    "DM2-HW05-Q07": {
      "ppt": {
        "name": "第五次作业参考答案.pdf",
        "page": 17
      },
      "review": {
        "name": "总复习.pdf",
        "page": 10
      },
      "definition": "特征函数 χ_A∈{0,1}；交 χ_Aχ_B，差 χ_A(1−χ_B)，并 χ_A+χ_B−χ_Aχ_B。",
      "method": "按 PPT 的函数代数法把左右两侧都化为同一个特征函数表达式。",
      "firstStep": "先把 A−(B∩C) 写为 χ_A(1−χ_Bχ_C)。",
      "pitfall": "并集特征函数必须扣掉交集重复计数。",
      "relatedRecent": []
    },
    "DM2-HW05-Q08": {
      "ppt": {
        "name": "第五次作业参考答案.pdf",
        "page": 20
      },
      "review": {
        "name": "总复习.pdf",
        "page": 10
      },
      "definition": "对称差的特征函数与 χ_A²=χ_A。",
      "method": "先把对称差展开成差集的并，再代入特征函数，化到 (χ_A−χ_B)²。",
      "firstStep": "χ_{A⊕B}(x)=0 对所有 x 成立意味着什么？",
      "pitfall": "不要仅凭某一个 x 的函数值为 0 推出集合相等。",
      "relatedRecent": []
    },
    "DM2-HW06-Q01": {
      "ppt": {
        "name": "第六次作业参考答案.pdf",
        "page": 2
      },
      "review": {
        "name": "总复习.pdf",
        "page": 13
      },
      "definition": "von Neumann 自然数：0=∅，n⁺=n∪{n}；n={0,…,n−1}。",
      "method": "先把自然数理解为集合，再代入并交和广义并定义；利用课件定理 ∪(n⁺)=n。",
      "firstStep": "把 2 和 3 展开为集合，再做 2∪3。",
      "pitfall": "这里的数字首先是集合，不是普通四则运算。",
      "relatedRecent": []
    },
    "DM2-HW06-Q02": {
      "ppt": {
        "name": "第六次作业参考答案.pdf",
        "page": 5
      },
      "review": {
        "name": "总复习.pdf",
        "page": 14
      },
      "definition": "基数与等势的定义；双射构造。",
      "method": "把由 a 构成的有限字符串与其长度 n 逐个对应，证明长度映射为双射。",
      "firstStep": "空串 ε 对应哪个自然数？",
      "pitfall": "不要漏掉长度 0 的空串。",
      "relatedRecent": []
    },
    "DM2-HW06-Q03": {
      "ppt": {
        "name": "第六次作业参考答案.pdf",
        "page": 7
      },
      "review": {
        "name": "总复习.pdf",
        "page": 13
      },
      "definition": "第一数学归纳法：基础、归纳假设、归纳步。",
      "method": "课件直接采用关于 n 的第一归纳法；核心桥梁是自然数严格递增至少增加 1。",
      "firstStep": "从 aₖ₊₁>aₖ 怎样推出 aₖ₊₁≥aₖ+1？",
      "pitfall": "必须解释整数性，不能把严格大于直接改写成任意实数的 ≥1。",
      "relatedRecent": []
    },
    "DM2-HW06-Q04": {
      "ppt": {
        "name": "第六次作业参考答案.pdf",
        "page": 8
      },
      "review": {
        "name": "总复习.pdf",
        "page": 14
      },
      "definition": "等势=存在双射；分段借助中间集合构造映射。",
      "method": "课件使用 eˣ 建立 R↔(0,∞)，再用线性缩放和反射把 [0,1) 映到目标半开区间。",
      "firstStep": "先观察开闭端点怎样对应，构造 f(x)=1/2−x/4。",
      "pitfall": "闭端点必须取到，开端点必须不取到。",
      "relatedRecent": [
        "DM2-FINAL-2025-Q06"
      ]
    },
    "DM2-HW08-Q01": {
      "ppt": {
        "name": "第八次作业参考答案.pdf",
        "page": 2
      },
      "review": {
        "name": "总复习.pdf",
        "page": 24
      },
      "definition": "欧拉图、欧拉闭路、边不相交回路、连通性。",
      "method": "原作业按“充分性对回路数第一归纳”“必要性对边数第二归纳”；两方向分别写清归纳变量、基本步和连通分支。",
      "firstStep": "一个回路在任一经过的顶点贡献多少度？删去回路边后剩余图还连通吗？",
      "pitfall": "删除回路后余图可能分成多个分支；不要直接视作连通图。",
      "relatedRecent": [
        "DM2-FINAL-2025-Q08"
      ]
    },
    "DM2-HW08-Q02": {
      "ppt": {
        "name": "第八次作业参考答案.pdf",
        "page": 8
      },
      "review": {
        "name": "总复习.pdf",
        "page": 25
      },
      "definition": "Hamilton 路径经过每个顶点恰一次；基础图完全意味着每对点至少一个方向有边。",
      "method": "采用课件第 9—10 页“删去一个顶点 → 对余图归纳 → 在头、尾、中间插回”的构造性归纳。",
      "firstStep": "旧路径 v₁→…→vₖ，新顶点 v′ 与 v₁、vₖ 的边方向能否直接插入？",
      "pitfall": "证明中间插入位置存在是整个证明的核心，不能只说“显然”。",
      "relatedRecent": [
        "DM2-FINAL-2025-Q08"
      ]
    },
    "DM2-HW08-Q03": {
      "ppt": {
        "name": "第八次作业参考答案.pdf",
        "page": 11
      },
      "review": {
        "name": "总复习.pdf",
        "page": 25
      },
      "definition": "奇数阶完全无向图中的 Hamilton 回路分解；边不相交。",
      "method": "老师用圆周排列和逐次旋转构造 k=(n−1)/2 条 Hamilton 回路；最后以边数一致性检查覆盖。",
      "firstStep": "写 n=2k+1，先固定中心 0，并让其余顶点围成圆。",
      "pitfall": "“旋转”必须保证边没有重复，不是简单画出几条回路就结束。",
      "relatedRecent": [
        "DM2-FINAL-2025-Q08"
      ]
    },
    "DM2-HW08-Q04": {
      "ppt": {
        "name": "第八次作业参考答案.pdf",
        "page": 13
      },
      "review": {
        "name": "总复习.pdf",
        "page": 23
      },
      "definition": "邻接矩阵 X^l 的 (i,j) 项是长度恰为 l 的路径数；强分支要求互相可达。",
      "method": "由反证的可达路径出发，删去重复顶点转为长度 ≤n−1 的基本路径，再与所有 X^l(i,j)=0 矛盾。",
      "firstStep": "如果 u_i 能到 u_j，为什么总能找一条不重复顶点的基本路径？",
      "pitfall": "矩阵幂为 0 只能排除该固定长度；必须说明 1 到 n−1 已足以覆盖全部可达情形。",
      "relatedRecent": [
        "DM2-FINAL-2025-Q07"
      ]
    }
  },
  "recent": {
    "03": [
      "DM2-FINAL-2025-Q02"
    ],
    "04": [
      "DM2-FINAL-2025-Q03",
      "DM2-FINAL-2025-Q04"
    ],
    "05": [
      "DM2-FINAL-2025-Q05"
    ],
    "06": [
      "DM2-FINAL-2025-Q06"
    ],
    "08": [
      "DM2-FINAL-2025-Q07",
      "DM2-FINAL-2025-Q08",
      "DM2-FINAL-2025-Q09"
    ]
  }
};
