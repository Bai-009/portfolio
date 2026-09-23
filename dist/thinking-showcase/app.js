// Agent Thinking UI. Every event, value and model message below is synthetic demo data.
(() => {
  "use strict";

  const stage = document.querySelector("#stage");
  const form = document.querySelector("#form");
  const input = document.querySelector("#input");
  const rerunButton = document.querySelector("#rerunBtn");
  const REDUCED_MOTION = Boolean(window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches);


  // Synthetic knowledge-base fixture; no live model or company policy.
  const AGENT_STREAM = [
  {
    "event": "demo.run.started",
    "data": {
      "status": "running",
      "message": "知识库问答演示；文档、条款及调用均为模拟数据。"
    }
  },
  {
    "event": "demo.agent.thinking",
    "data": {
      "turn": 1,
      "delta": "“删除”不一定等于所有副本清除。检索删除时限与备份规则。"
    }
  },
  {
    "event": "demo.agent.llm.call",
    "data": {
      "turn": 1,
      "purpose": "检索删除时限与备份规则",
      "model": "模拟模型",
      "status": "ok"
    }
  },
  {
    "event": "demo.agent.step",
    "data": {
      "turn": 1,
      "call_id": "search",
      "tool_name": "search_knowledge",
      "tool_input": "{\"query\": \"上传文件 删除 清除期限 备份\", \"top_k\": 8}",
      "display_text": "检索产品知识库——召回 8 段，出现 7 天与 30 天两种口径",
      "success": true,
      "summary": "召回 8 段，出现 7 天与 30 天两种口径",
      "source": "",
      "excerpt": ""
    }
  },
  {
    "event": "demo.agent.step",
    "data": {
      "turn": 1,
      "call_id": "rank",
      "tool_name": "rerank",
      "tool_input": "{\"candidates\": 8, \"keep\": 3}",
      "display_text": "按相关性重排——保留现行规范、旧版 FAQ 与备份说明",
      "success": true,
      "summary": "保留现行规范、旧版 FAQ 与备份说明",
      "source": "",
      "excerpt": ""
    }
  },
  {
    "event": "demo.agent.thinking",
    "data": {
      "turn": 1,
      "delta": "“删除”不一定等于所有副本清除。读取条款原文与版本信息。"
    }
  },
  {
    "event": "demo.agent.llm.call",
    "data": {
      "turn": 1,
      "purpose": "读取条款原文与版本信息",
      "model": "模拟模型",
      "status": "ok"
    }
  },
  {
    "event": "demo.agent.step",
    "data": {
      "turn": 1,
      "call_id": "old",
      "tool_name": "read_document",
      "tool_input": "{\"document_id\": \"faq-v1.8\", \"section\": \"2\"}",
      "display_text": "读取旧版 FAQ——删除后 7 天清除，文档已归档",
      "success": true,
      "summary": "删除后 7 天清除，文档已归档",
      "source": "数据删除 FAQ · v1.8 · §2",
      "excerpt": "删除后的文件在 7 天内清除。此文档已归档，由 v2.3 替代。"
    }
  },
  {
    "event": "demo.agent.step",
    "data": {
      "turn": 1,
      "call_id": "new",
      "tool_name": "read_document",
      "tool_input": "{\"document_id\": \"lifecycle-v2.3\", \"section\": \"4\"}",
      "display_text": "读取现行规范——在线文件 24 小时内清除；备份最长保留 30 天",
      "success": true,
      "summary": "在线文件 24 小时内清除；备份最长保留 30 天",
      "source": "文件生命周期规范 · v2.3 · §4",
      "excerpt": "标准云服务：删除请求确认后，在线文件在 24 小时内清除，备份随轮转在 30 天内清除。"
    }
  },
  {
    "event": "demo.agent.thinking",
    "data": {
      "turn": 2,
      "delta": "7 天来自旧版，不能作为当前承诺。核对生效日期与适用范围。"
    }
  },
  {
    "event": "demo.agent.llm.call",
    "data": {
      "turn": 2,
      "purpose": "核对生效日期与适用范围",
      "model": "模拟模型",
      "status": "ok"
    }
  },
  {
    "event": "demo.agent.step",
    "data": {
      "turn": 2,
      "call_id": "version",
      "tool_name": "read_document",
      "tool_input": "{\"document_id\": \"changes-v2.3\"}",
      "display_text": "核对版本变更记录——v2.3 已生效，替代旧版 FAQ",
      "success": true,
      "summary": "v2.3 已生效，替代旧版 FAQ",
      "source": "版本变更记录 · v2.3",
      "excerpt": "v2.3 自 2026-08-01 生效，替代 v1.8 删除时限说明。"
    }
  },
  {
    "event": "demo.agent.step",
    "data": {
      "turn": 2,
      "call_id": "scope",
      "tool_name": "read_document",
      "tool_input": "{\"document_id\": \"lifecycle-v2.3\", \"section\": \"1\"}",
      "display_text": "检查部署范围——仅适用于标准云服务，私有部署另行约定",
      "success": true,
      "summary": "仅适用于标准云服务，私有部署另行约定",
      "source": "文件生命周期规范 · v2.3 · §1",
      "excerpt": "本规范适用于标准云服务。私有部署及专属合同约定不适用。"
    }
  },
  {
    "event": "demo.agent.thinking",
    "data": {
      "turn": 2,
      "delta": "7 天来自旧版，不能作为当前承诺。补查备份保留期间能否访问。"
    }
  },
  {
    "event": "demo.agent.llm.call",
    "data": {
      "turn": 2,
      "purpose": "补查备份保留期间能否访问",
      "model": "模拟模型",
      "status": "ok"
    }
  },
  {
    "event": "demo.agent.step",
    "data": {
      "turn": 2,
      "call_id": "backup-search",
      "tool_name": "search_knowledge",
      "tool_input": "{\"query\": \"删除后 备份 用户访问\", \"top_k\": 5}",
      "display_text": "检索备份访问规则——未命中“删除后访问”的直接说明",
      "success": true,
      "summary": "未命中“删除后访问”的直接说明",
      "source": "",
      "excerpt": ""
    }
  },
  {
    "event": "demo.agent.step",
    "data": {
      "turn": 2,
      "call_id": "backup-retry",
      "tool_name": "search_knowledge",
      "tool_input": "{\"query\": \"隔离副本 灾难恢复 删除标记\", \"top_k\": 5}",
      "display_text": "改用“隔离副本／灾难恢复”检索——命中备份隔离与恢复条款",
      "success": true,
      "summary": "命中备份隔离与恢复条款",
      "source": "",
      "excerpt": ""
    }
  },
  {
    "event": "demo.agent.thinking",
    "data": {
      "turn": 3,
      "delta": "备份尚未清除，不代表用户仍能访问。核验隔离机制与恢复限制。"
    }
  },
  {
    "event": "demo.agent.llm.call",
    "data": {
      "turn": 3,
      "purpose": "核验隔离机制与恢复限制",
      "model": "模拟模型",
      "status": "ok"
    }
  },
  {
    "event": "demo.agent.step",
    "data": {
      "turn": 3,
      "call_id": "isolation",
      "tool_name": "read_document",
      "tool_input": "{\"document_id\": \"backup-policy\", \"section\": \"3\"}",
      "display_text": "读取备份隔离条款——备份不开放用户读取，仅用于灾难恢复",
      "success": true,
      "summary": "备份不开放用户读取，仅用于灾难恢复",
      "source": "备份与恢复规范 · §3",
      "excerpt": "备份副本与在线服务隔离，不提供用户查询或下载入口；仅用于授权的灾难恢复。"
    }
  },
  {
    "event": "demo.agent.step",
    "data": {
      "turn": 3,
      "call_id": "restore",
      "tool_name": "read_document",
      "tool_input": "{\"document_id\": \"backup-policy\", \"section\": \"5\"}",
      "display_text": "核对恢复后的删除处理——恢复前须重放删除标记",
      "success": true,
      "summary": "恢复前须重放删除标记",
      "source": "备份与恢复规范 · §5",
      "excerpt": "灾难恢复时，恢复数据重新提供服务前必须重放删除标记。"
    }
  },
  {
    "event": "demo.agent.thinking",
    "data": {
      "turn": 3,
      "delta": "备份尚未清除，不代表用户仍能访问。检查是否存在保留例外。"
    }
  },
  {
    "event": "demo.agent.llm.call",
    "data": {
      "turn": 3,
      "purpose": "检查是否存在保留例外",
      "model": "模拟模型",
      "status": "ok"
    }
  },
  {
    "event": "demo.agent.step",
    "data": {
      "turn": 3,
      "call_id": "exception",
      "tool_name": "read_document",
      "tool_input": "{\"document_id\": \"lifecycle-v2.3\", \"section\": \"6\"}",
      "display_text": "读取保留例外——法律保留不受常规清除时限约束",
      "success": true,
      "summary": "法律保留不受常规清除时限约束",
      "source": "文件生命周期规范 · v2.3 · §6",
      "excerpt": "已进入法律保留的文件不适用常规清除时限，解除保留后按批准流程处理。"
    }
  },
  {
    "event": "demo.agent.thinking",
    "data": {
      "turn": 4,
      "delta": "可以说明标准时限，尚不能替客户确认适用性。逐项核对结论与引用依据。"
    }
  },
  {
    "event": "demo.agent.llm.call",
    "data": {
      "turn": 4,
      "purpose": "逐项核对结论与引用依据",
      "model": "模拟模型",
      "status": "ok"
    }
  },
  {
    "event": "demo.agent.step",
    "data": {
      "turn": 4,
      "call_id": "verify",
      "tool_name": "verify_citations",
      "tool_input": "{\"claims\": [\"在线清除与备份轮转\", \"备份隔离与删除重放\", \"部署范围与法律保留\"]}",
      "display_text": "核对答案中的时限与例外——3 组结论均有原文依据；部署方式仍需客户确认",
      "success": true,
      "summary": "3 组结论均有原文依据；部署方式仍需客户确认",
      "source": "",
      "excerpt": ""
    }
  },
  {
    "event": "demo.agent.done",
    "data": {
      "reason": "complete",
      "turn_count": 4,
      "tool_calls": 12,
      "tool_errors": 0
    }
  },
  {
    "event": "demo.answer.final",
    "data": {
      "blocks": [
        {
          "type": "text",
          "content": "不能把“删除后多久彻底清除”回答成一个统一时限。按当前知识库，标准云服务的在线文件与备份副本分别处理：在线文件在删除请求确认后 24 小时内清除，备份随轮转在 30 天内清除；法律保留属于例外。①③"
        },
        {
          "type": "text",
          "content": "客户提到的“删除后还能不能访问”，与“所有副本是否已经物理清除”也是两个问题。备份尚在保留期，并不意味着客户仍可查询或下载。以下按文件所在位置、规范版本和适用条件分别说明。"
        },
        {
          "type": "text",
          "content": "1. 在线文件与备份，为什么是两个时限"
        },
        {
          "type": "text",
          "content": "现行《文件生命周期规范》将在线文件和备份分开约定。在线文件的清除从删除请求确认后计算，时限为 24 小时；备份沿既定轮转周期清除，最长为 30 天。因此，在线文件已清除时，备份副本仍可能处于保留期，两者并不矛盾。①"
        },
        {
          "type": "text",
          "content": "对外沟通应保留“请求确认后”这一计时起点，不能直接改成“用户点击删除后”。现有引用没有给出前端点击与后台确认之间的时差，也没有证明某个具体文件此刻已经完成清除。制度规定的最长时限与单个文件的实际处理状态，需要分别核对。"
        },
        {
          "type": "text",
          "content": "2. 备份保留期间，谁还能读取"
        },
        {
          "type": "text",
          "content": "《备份与恢复规范》说明，备份副本与在线服务隔离，不提供用户查询或下载入口，仅用于授权的灾难恢复。这支持“用户不能通过常规产品入口读取备份”的表述，但不能扩展成“任何人、任何情况下都无法访问”，因为授权恢复本身就是规定允许的用途。②"
        },
        {
          "type": "text",
          "content": "恢复还有一道后续约束：数据重新提供服务前，必须重放删除标记。也就是说，从历史备份恢复数据时，需要再次执行已记录的删除要求，不能直接把整个旧快照重新开放给用户。该条款说明了恢复流程应如何处理已删除文件，并不等于本轮已经审计过恢复任务的实际执行。②"
        },
        {
          "type": "text",
          "content": "3. 为什么没有采用 FAQ 中的“7 天”"
        },
        {
          "type": "text",
          "content": "本轮检索同时命中了旧版 FAQ 和现行规范。旧版 FAQ 写的是 7 天，但文档已归档；版本变更记录明确，v2.3 自 2026 年 8 月 1 日生效，并替代 v1.8 的删除时限说明。因此，当前标准云服务应使用 v2.3 的口径，不能将两个版本的数字混在一起，也不能取其中更短的数字作为承诺。④"
        },
        {
          "type": "text",
          "content": "这里的关键依据是明确的版本替代关系，而不仅是文件更新时间更近。如果后续查到客户专属合同或另一部署版本的规范，还需要重新确认适用性，不能只凭当前这份通用文档下结论。"
        },
        {
          "type": "text",
          "content": "4. 两类情况不能直接套用上述时限"
        },
        {
          "type": "text",
          "content": "私有部署或专属合同：现行规范限定于标准云服务，其他部署方式和专属约定需要单独核对。法律保留：已进入法律保留的文件不适用常规清除时限；解除保留后，按批准流程处理。本轮材料没有给出解除后的统一清除天数。"
        },
        {
          "type": "text",
          "content": "因此，在未确认客户部署方式、合同约定和文件保留状态前，可以解释通用规则，但不宜直接承诺“您的文件一定在 30 天内全部清除”。③"
        },
        {
          "type": "text",
          "content": "5. 建议给客户的回复"
        },
        {
          "type": "text",
          "content": "如果您使用的是标准云服务，且文件不涉及法律保留，按现行规范，在线文件会在删除请求确认后 24 小时内清除，备份副本随轮转在 30 天内清除。备份保留期间不提供用户查询或下载入口，仅用于授权的灾难恢复；恢复数据重新提供服务前，还须重放删除标记。我们需要进一步确认您的部署方式、是否存在专属合同约定，以及此次删除请求的确认时间，才能核实具体文件的清除安排。"
        },
        {
          "type": "text",
          "content": "6. 本轮仍未确认的内容"
        },
        {
          "type": "text",
          "content": "本轮核对的是知识库中的规范，并未查询客户实例或实际删除日志。尚未确认客户的部署类型、专属合同、法律保留状态、请求确认时间，以及在线文件和备份的实际清除结果。若客户需要清除完成证明，下一步应查询对应操作记录，而不是将文档时限当成已完成的凭证。"
        }
      ],
      "rag_chunks": [
        {
          "source": "数据删除 FAQ · v1.8 · §2",
          "text": "删除后的文件在 7 天内清除。此文档已归档，由 v2.3 替代。",
          "call_id": "old"
        },
        {
          "source": "文件生命周期规范 · v2.3 · §4",
          "text": "标准云服务：删除请求确认后，在线文件在 24 小时内清除，备份随轮转在 30 天内清除。",
          "call_id": "new"
        },
        {
          "source": "版本变更记录 · v2.3",
          "text": "v2.3 自 2026-08-01 生效，替代 v1.8 删除时限说明。",
          "call_id": "version"
        },
        {
          "source": "文件生命周期规范 · v2.3 · §1",
          "text": "本规范适用于标准云服务。私有部署及专属合同约定不适用。",
          "call_id": "scope"
        },
        {
          "source": "备份与恢复规范 · §3",
          "text": "备份副本与在线服务隔离，不提供用户查询或下载入口；仅用于授权的灾难恢复。",
          "call_id": "isolation"
        },
        {
          "source": "备份与恢复规范 · §5",
          "text": "灾难恢复时，恢复数据重新提供服务前必须重放删除标记。",
          "call_id": "restore"
        },
        {
          "source": "文件生命周期规范 · v2.3 · §6",
          "text": "已进入法律保留的文件不适用常规清除时限，解除保留后按批准流程处理。",
          "call_id": "exception"
        }
      ]
    }
  },
  {
    "event": "demo.run.completed",
    "data": {
      "status": "completed"
    }
  }
];
  const THINKING_COPY = new Map([
  [
    "“删除”不一定等于所有副本清除。检索删除时限与备份规则。",
    {
      "reaction": "“删除”不一定等于所有副本清除",
      "intent": "检索删除时限与备份规则"
    }
  ],
  [
    "“删除”不一定等于所有副本清除。读取条款原文与版本信息。",
    {
      "reaction": "“删除”不一定等于所有副本清除",
      "intent": "读取条款原文与版本信息"
    }
  ],
  [
    "7 天来自旧版，不能作为当前承诺。核对生效日期与适用范围。",
    {
      "reaction": "7 天来自旧版，不能作为当前承诺",
      "intent": "核对生效日期与适用范围"
    }
  ],
  [
    "7 天来自旧版，不能作为当前承诺。补查备份保留期间能否访问。",
    {
      "reaction": "7 天来自旧版，不能作为当前承诺",
      "intent": "补查备份保留期间能否访问"
    }
  ],
  [
    "备份尚未清除，不代表用户仍能访问。核验隔离机制与恢复限制。",
    {
      "reaction": "备份尚未清除，不代表用户仍能访问",
      "intent": "核验隔离机制与恢复限制"
    }
  ],
  [
    "备份尚未清除，不代表用户仍能访问。检查是否存在保留例外。",
    {
      "reaction": "备份尚未清除，不代表用户仍能访问",
      "intent": "检查是否存在保留例外"
    }
  ],
  [
    "可以说明标准时限，尚不能替客户确认适用性。逐项核对结论与引用依据。",
    {
      "reaction": "可以说明标准时限，尚不能替客户确认适用性",
      "intent": "逐项核对结论与引用依据"
    }
  ]
]);

  const GLYPH_D = "M92.4391351,0C77.6527943,0.00399456433 65.6595758,11.9855366 65.646363,26.7755647 L65.646363,26.7755647 L65.646363,27.5056482 C65.646363,30.3491634 67.9515339,32.6543343 70.7944346,32.6543343 L70.7944346,32.6543343 C73.6379498,32.6543343 75.9431207,30.3491634 75.9431207,27.5056482 L75.9431207,27.5056482 L75.9431207,26.7755647 C75.9302152,22.4024386 77.6712307,18.2059951 80.7774654,15.1268006 L80.7774654,15.1268006 C83.8941474,12.0141131 88.1240838,10.2737122 92.5288591,10.2930705 L92.5288591,10.2930705 L93.0736563,10.2930705 C101.811919,10.3029032 108.89336,17.3834222 108.903807,26.1219925 L108.903807,26.1219925 L108.903807,28.6997156 L108.903807,28.7003302 C108.903807,37.8011768 101.525847,45.1791372 92.4250005,45.1791372 L92.4250005,45.1791372 L74.1845906,45.1791372 C65.2837795,45.1689971 58.0711326,37.9566576 58.0609926,29.0561537 L58.0609926,29.0561537 L58.0609926,8.11326744 C58.0609926,6.30526616 57.3401274,4.57193252 56.0575649,3.29766649 L56.0575649,3.29766649 C53.3984142,0.655108551 49.100263,0.668628615 46.457705,3.32777936 L46.457705,3.32777936 L33.6456008,16.2194676 C33.6360753,16.2289931 33.6268571,16.2382113 33.6179462,16.2471222 L33.6179462,16.2471222 C31.0687996,18.7809051 26.9482528,18.7689214 24.4144699,16.2194676 L24.4144699,16.2194676 L11.602673,3.3333103 C10.328407,2.05136242 8.59538062,1.33018992 6.78768663,1.33018992 L6.78768663,1.33018992 C3.03832709,1.33080447 0,4.37036066 0,8.11941292 L0,8.11941292 L0,50.6907141 C0,53.5339221 2.30486362,55.8387857 5.1480716,55.8387857 L5.1480716,55.8387857 L5.14899343,55.8387857 C7.99250868,55.8375566 10.297065,53.5320785 10.2961432,50.6885632 L10.2961432,50.6885632 L10.2961432,16.6213822 L17.1111772,23.4772837 C17.1354519,23.5015583 17.1597266,23.525833 17.1840012,23.5504149 L17.1840012,23.5504149 C23.7661214,30.0919749 34.4051826,30.0594039 40.9470499,23.4772837 L40.9470499,23.4772837 L47.763313,16.6186167 L47.763313,29.0583046 C47.7799058,43.6427663 59.5988999,55.461453 74.1830542,55.4780458 L74.1830542,55.4780458 L92.4237714,55.4780458 C107.211649,55.4780458 119.199643,43.4897437 119.199643,28.7021738 L119.199643,28.7021738 L119.199643,26.1241435 C119.181821,11.7028444 107.494955,0.0165928057 93.073349,0 L93.073349,0 L92.4391351,0 Z";
  const GLYPH_SVG = "<svg viewBox=\"0 0 119.2 55.9\" preserveAspectRatio=\"xMidYMid meet\"><path d=\"" + GLYPH_D + "\"/></svg>";
  const PATH_COLORS = ["#27fef2","#27fef2","#27fff2","#27fef2","#25faf2","#22e8f2","#1fd9f2","#1ccaf2","#18baf1","#18bbf1","#1ac7f1","#20def2","#22ebf2","#25f8f2","#27fff2","#27fef2","#27fff2","#27fff2","#26fcf2","#23eef2","#20def2","#1ccef1","#19bef1","#16b1f1","#14a7f1","#13a2f1","#129ef1","#119bf1","#1096f1","#119af1","#129ff1","#15aef1","#18bbf1","#17b9f0","#0e90e9","#22eaf2","#26fbf2","#27fbf2","#24f1f2","#20e1f2","#1dd5f2","#1ac5f2","#18baf1","#19bef1","#1ac4f1","#1bc9f1","#1dd0f1","#1ed2f2","#1ac6f1","#16b3f0","#0564e5","#0c87f2","#0d88f2","#0a79f1","#0668f0","#0359f0","#004af0","#004bf4","#004ef4","#0150f0","#0562f0","#0975f0","#0b7ff1","#0f90f2","#0d89f2","#15acf1","#13a4f1","#119bf1","#129df1","#13a0f1","#14aaf1","#17b4f1","#1ac4f1","#15aeef","#18b9f1","#15aaf1","#129ef1","#0e8df1","#0d89f1","#0a7cf2","#0a7cf1","#0b7cf2","#0b7ef1","#0c83f1","#0d88f2","#0e8df1","#1095f1","#12a1f1","#15aef1","#18bcf2","#1cccf1","#1fdaf2","#22e6f2","#26f9f2","#27fff2","#27fff2","#27fef2","#26fef2","#26fef2","#27fef2","#27fef2"];

  function colorAt(fraction) {
    const last = PATH_COLORS.length - 1;
    const value = Math.max(0, Math.min(1, fraction)) * last;
    const index = Math.floor(value);
    const mix = value - index;
    const rgb = (hex) => [1, 3, 5].map((offset) => parseInt(hex.slice(offset, offset + 2), 16));
    const start = rgb(PATH_COLORS[index]);
    const end = rgb(PATH_COLORS[Math.min(last, index + 1)]);
    return Math.round(start[0] + (end[0] - start[0]) * mix) + "," + Math.round(start[1] + (end[1] - start[1]) * mix) + "," + Math.round(start[2] + (end[2] - start[2]) * mix);
  }

  const BRAND_IMG = new Image();
  BRAND_IMG.src = "brand/mo-icon-color.png";

  function startGlow(glyphEl) {
    if (REDUCED_MOTION) return;
    const path = glyphEl.querySelector("path");
    const lit = glyphEl.querySelector(".lit");
    const hot = glyphEl.querySelector(".hot");
    if (!path || !lit || !hot) return;

    const length = path.getTotalLength();
    const dpr = Math.min(3, window.devicePixelRatio || 1);
    const width = 119.2;
    const height = 55.9;
    const contextOf = (canvas) => {
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      const context = canvas.getContext("2d");
      context.scale(dpr, dpr);
      return context;
    };
    const litContext = contextOf(lit);
    const hotContext = contextOf(hot);
    const brand = document.createElement("canvas");
    const brandContext = contextOf(brand);
    const clipPath = new Path2D(path.getAttribute("d"));
    const paintBrand = () => {
      brandContext.save();
      brandContext.clip(clipPath);
      brandContext.drawImage(BRAND_IMG, 0, 0, width, height);
      brandContext.restore();
    };
    if (BRAND_IMG.complete && BRAND_IMG.naturalWidth) paintBrand();
    else BRAND_IMG.addEventListener("load", paintBrand, { once: true });

    const radius = 20;
    const patch = document.createElement("canvas");
    patch.width = patch.height = radius * 2 * dpr;
    const patchContext = patch.getContext("2d");
    patchContext.scale(dpr, dpr);
    const keyTimes = [0, .3, .55, 1];
    const keyPoints = [0, .42, .62, 1];
    const curveX = (time) => 3 * time * (1 - time) * (1 - time) * .42 + 3 * time * time * (1 - time) * .58 + time * time * time;
    const curveY = (time) => 3 * time * time * (1 - time) * .58 + time * time * time;
    const ease = (input) => {
      let low = 0;
      let high = 1;
      for (let index = 0; index < 24; index += 1) {
        const middle = (low + high) / 2;
        if (curveX(middle) < input) low = middle;
        else high = middle;
      }
      return curveY((low + high) / 2);
    };
    const pace = (time) => {
      for (let segment = 0; segment < 3; segment += 1) {
        if (time <= keyTimes[segment + 1] || segment === 2) {
          const local = Math.min(1, Math.max(0, (time - keyTimes[segment]) / (keyTimes[segment + 1] - keyTimes[segment])));
          return keyPoints[segment] + (keyPoints[segment + 1] - keyPoints[segment]) * ease(local);
        }
      }
      return 1;
    };
    const fade = (context, amount) => {
      context.globalCompositeOperation = "destination-in";
      context.fillStyle = "rgba(0,0,0," + amount + ")";
      context.fillRect(0, 0, width, height);
      context.globalCompositeOperation = "source-over";
    };
    const blob = (context, blobRadius, rgb, alpha) => {
      const gradient = context.createRadialGradient(0, 0, 0, 0, 0, blobRadius);
      gradient.addColorStop(0, "rgba(" + rgb + "," + alpha + ")");
      gradient.addColorStop(1, "rgba(" + rgb + ",0)");
      context.fillStyle = gradient;
      context.beginPath();
      context.arc(0, 0, blobRadius, 0, Math.PI * 2);
      context.fill();
    };

    const duration = 4500;
    const frameDuration = 1000 / 60;
    let beganAt = null;
    let previousAt = null;
    const frame = (now) => {
      if (!glyphEl.isConnected) return;
      if (beganAt === null) {
        beganAt = now;
        previousAt = now;
      }
      const steps = Math.min(4, Math.max(0, (now - previousAt) / frameDuration));
      previousAt = now;
      const position = pace(((now - beganAt) % duration) / duration);
      fade(litContext, Math.pow(.98, steps));
      fade(hotContext, Math.pow(.9, steps));
      const point = path.getPointAtLength(position * length);
      const next = path.getPointAtLength((position * length + 2) % length);
      const angle = Math.atan2(next.y - point.y, next.x - point.x);

      patchContext.clearRect(0, 0, radius * 2, radius * 2);
      patchContext.drawImage(brand, -(point.x - radius), -(point.y - radius), width, height);
      patchContext.globalCompositeOperation = "destination-in";
      const mask = patchContext.createRadialGradient(radius, radius, 0, radius, radius, radius);
      mask.addColorStop(0, "rgba(0,0,0,1)");
      mask.addColorStop(1, "rgba(0,0,0,0)");
      patchContext.fillStyle = mask;
      patchContext.fillRect(0, 0, radius * 2, radius * 2);
      patchContext.globalCompositeOperation = "source-atop";
      const hx = radius + Math.cos(angle) * 3;
      const hy = radius + Math.sin(angle) * 3;
      const highlight = patchContext.createRadialGradient(hx, hy, 0, hx, hy, radius * .55);
      highlight.addColorStop(0, "rgba(255,255,255,.32)");
      highlight.addColorStop(1, "rgba(255,255,255,0)");
      patchContext.fillStyle = highlight;
      patchContext.fillRect(0, 0, radius * 2, radius * 2);
      patchContext.globalCompositeOperation = "source-over";
      litContext.drawImage(patch, point.x - radius, point.y - radius, radius * 2, radius * 2);

      hotContext.save();
      hotContext.translate(point.x, point.y);
      hotContext.rotate(angle);
      hotContext.globalCompositeOperation = "lighter";
      blob(hotContext, 4, colorAt(position), .32);
      blob(hotContext, 2, "255,255,255", .8);
      hotContext.restore();
      requestAnimationFrame(frame);
    };
    requestAnimationFrame(frame);
  }

  function el(tag, className, text) {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (text !== undefined) node.textContent = text;
    return node;
  }

  function safeJson(value) {
    try { return JSON.stringify(value, null, 2); }
    catch (_) { return String(value); }
  }

  function parseToolInput(value) {
    if (!value || typeof value !== "string") return {};
    try { return JSON.parse(value); }
    catch (_) { return {}; }
  }


  function formatTokens(value) {
    return Number.isFinite(Number(value)) ? Number(value).toLocaleString("en-US") : null;
  }

  function stepFacts(event) {
    const data = event.data || {};
    const input = parseToolInput(data.tool_input);
    if (data.display_text) {
      const rows = [["工具", data.tool_name], ["输入", safeJson(input)], ["返回", data.summary]];
      if (data.source) rows.push(["来源", data.source]);
      if (data.excerpt) rows.push(["原文", data.excerpt]);
      return rows;
    }
    const rows = [["工具", data.tool_name]];
    if (data.tool_name === "get_schema") {
      const tables = Array.isArray(input.tables) ? input.tables : [];
      if (tables.length) rows.push(["输入", tables.join("、")]);
      rows.push(["返回", data.success === false ? "未完成" : tables.length + " 张表的字段结构"]);
    } else {
      if (input.purpose) rows.push(["目的", input.purpose]);
      const count = rowCount(data.summary);
      rows.push(["返回", data.success === false ? "未完成" : count === null ? "已完成" : count + " 行"]);
    }
    if (Number.isFinite(Number(data.latency_ms))) rows.push(["耗时", data.latency_ms + " ms"]);
    return rows;
  }


  function llmFacts(event) {
    const data = event.data || {};
    const rows = [["模型", data.model || "未提供"]];
    const inputTokens = formatTokens(data.prompt_tokens);
    const outputTokens = formatTokens(data.completion_tokens);
    const totalTokens = formatTokens(data.total_tokens);
    const cached = formatTokens(data.cached_tokens);
    if (inputTokens) rows.push(["输入", inputTokens + " tokens"]);
    if (outputTokens) rows.push(["输出", outputTokens + " tokens"]);
    if (totalTokens) rows.push(["合计", totalTokens + " tokens"]);
    if (cached && Number(data.prompt_tokens) > 0) rows.push(["缓存命中", Math.round(Number(data.cached_tokens) / Number(data.prompt_tokens) * 100) + "%（" + cached + " tokens）"]);
    if (Number.isFinite(Number(data.latency_ms))) rows.push(["耗时", data.latency_ms + " ms"]);
    return rows;
  }

  function processFacts(process) {
    const step = [...process.events].reverse().find((event) => event.data && event.data.tool_name);
    if (step) return stepFacts(step);
    return [["记录", "共 " + process.events.length + " 条原始事件，完整内容见工程记录"]];
  }

  function llmCallsOf(generation) {
    const seen = new Set();
    const calls = [];
    const collect = (event) => {
      if (event && event.event === "demo.agent.llm.call" && !seen.has(event)) {
        seen.add(event);
        calls.push(event);
      }
    };
    generation.pendingEvents.forEach(collect);
    generation.intents.forEach((intent) => intent.processes.forEach((process) => process.events.forEach(collect)));
    return calls;
  }

  function eventTurn(event) {
    if (Number.isFinite(Number(event.data && event.data.turn))) return Number(event.data.turn);
    const match = /第\s*(\d+)\s*轮/.exec((event.data && event.data.message) || "");
    return match ? Number(match[1]) : null;
  }

  function thinkingProjection(_turn, delta) {
    const source = String(delta || "").trim();
    if (THINKING_COPY.has(source)) return THINKING_COPY.get(source);
    const sentences = source.split(/[。！？]/).map((item) => item.trim()).filter(Boolean);
    return {
      reaction: sentences[0] || source,
      intent: sentences.slice(1).join("。")
    };
  }

  function stepIdentity(event, order) {
    const data = event.data || {};
    const input = parseToolInput(data.tool_input);
    const externalId = data.call_id || data.tool_call_id || data.id;
    if (externalId) return "call-" + externalId;
    if (data.tool_name === "get_schema") return "schema";
    if (input.purpose === "6月各团队费用") return "june-cost";
    if (input.purpose === "5月各团队费用") return "may-cost";
    const purpose = input.purpose || input.table || input.tables;
    return "step-" + data.turn + "-" + data.tool_name + "-" + (purpose ? String(purpose).replace(/[^\w\u4e00-\u9fff]+/g, "-") : order);
  }

  function rowCount(summary) {
    const match = /^\((\d+) rows?\)/.exec(String(summary || "").trim());
    return match ? Number(match[1]) : null;
  }

  function processCopy(event) {
    const data = event.data || {};
    if (data.display_text) return data.display_text;
    const input = parseToolInput(data.tool_input);
    if (data.tool_name === "get_schema") {
      return data.success === false ? "查看表结构——未完成" : "查看团队与费用表结构——已返回两张表字段结构";
    }
    if (input.purpose) {
      const count = rowCount(data.summary);
      const action = "查询 " + input.purpose;
      if (data.success === false) return action + "——未完成";
      return count === null ? action : action + "——已返回 " + count + " 行";
    }
    return data.success === false ? "执行查询——未完成" : "完成一次数据查询";
  }

  // Event ownership stays with its analysis generation, including late arrivals.
  class TraceStore {
    constructor(question) {
      this.question = question;
      this.generations = [];
      this.byId = new Map();
      this.latestByTurn = new Map();
      this.listeners = new Set();
      this.orphanEvents = [];
      this.pendingByTurn = new Map();
      this.thinkingBuffers = new Map();
      this.terminal = null;
      this.answerFinal = null;
      this.eventOrder = 0;
      this.generationOrder = 0;
    }

    subscribe(listener) {
      this.listeners.add(listener);
      return () => this.listeners.delete(listener);
    }

    emit(change) {
      this.listeners.forEach((listener) => listener(change));
    }

    generationFor(turn) {
      return this.latestByTurn.get(Number(turn));
    }

    lastProcess(generation) {
      const intent = generation && generation.intents[generation.intents.length - 1];
      return intent && intent.processes[intent.processes.length - 1];
    }

    queueForTurn(turn, event) {
      const queued = this.pendingByTurn.get(turn) || [];
      queued.push(event);
      this.pendingByTurn.set(turn, queued);
    }

    attachEvent(generation, event) {
      const process = this.lastProcess(generation);
      if (process) process.events.push(event);
      else generation.pendingEvents.push(event);
    }

    flushPending(generation, process) {
      process.events.push(...generation.pendingEvents);
      generation.pendingEvents.length = 0;
    }

    generationId(turn) {
      const base = Number.isFinite(turn) ? "turn-" + turn : "run";
      if (!this.byId.has(base)) return base;
      let suffix = 2;
      while (this.byId.has(base + "-n" + suffix)) suffix += 1;
      return base + "-n" + suffix;
    }

    consumeThinking(event) {
      const turn = Number(event.data.turn);
      const data = event.data || {};
      const explicitStreaming = data.done === false || data.final === false || data.is_final === false || data.status === "streaming";
      const explicitFinal = data.done === true || data.final === true || data.is_final === true || data.status === "completed" || data.status === "done";
      if (!explicitStreaming && !explicitFinal) return { text: String(data.delta || ""), events: [event] };

      const buffered = this.thinkingBuffers.get(turn) || { text: "", events: [] };
      buffered.text += String(data.delta || "");
      buffered.events.push(event);
      if (!explicitFinal) {
        this.thinkingBuffers.set(turn, buffered);
        return null;
      }
      this.thinkingBuffers.delete(turn);
      return buffered;
    }

    createGeneration(event, sourceText, sourceEvents) {
      const turn = Number(event.data.turn);
      const projection = thinkingProjection(turn, sourceText);
      const previous = this.generations[this.generations.length - 1];
      if (previous) previous.sourceClosed = true;
      const id = this.generationId(turn);
      const intentId = "intent-" + id + "-1";
      const queued = this.pendingByTurn.get(turn) || [];
      const generation = {
        id,
        sequence: ++this.generationOrder,
        turn,
        reaction: projection.reaction,
        intents: [{ id: intentId, text: projection.intent, processes: [] }],
        pendingEvents: [...this.orphanEvents, ...queued.filter((item) => item.event !== "demo.agent.step"), ...sourceEvents],
        sourceClosed: false,
        leftFrontier: false
      };
      this.orphanEvents.length = 0;
      this.pendingByTurn.delete(turn);
      this.generations.push(generation);
      this.byId.set(generation.id, generation);
      this.latestByTurn.set(turn, generation);
      return { generation, queuedSteps: queued.filter((item) => item.event === "demo.agent.step") };
    }

    updateIntent(generation, projection, sourceEvents) {
      const current = generation.intents[generation.intents.length - 1];
      if (projection.intent && projection.intent !== current.text) {
        generation.intents.push({
          id: "intent-" + generation.id + "-" + (generation.intents.length + 1),
          text: projection.intent,
          processes: []
        });
      }
      generation.pendingEvents.push(...sourceEvents);
    }

    attachByTurn(turn, event) {
      const generation = turn ? this.generationFor(turn) : this.generations[this.generations.length - 1];
      if (generation) this.attachEvent(generation, event);
      else if (turn) this.queueForTurn(turn, event);
      else this.orphanEvents.push(event);
      return generation;
    }

    addStep(event) {
      const turn = Number(event.data.turn);
      const generation = this.generationFor(turn);
      if (!generation) {
        this.queueForTurn(turn, event);
        this.emit({ type: "archive", generation: null });
        return;
      }
      const intent = generation.intents[generation.intents.length - 1];
      const id = stepIdentity(event, ++this.eventOrder);
      let ownerIntent = generation.intents.find((candidate) => candidate.processes.some((item) => item.id === id));
      let process = ownerIntent && ownerIntent.processes.find((item) => item.id === id);
      if (!process) {
        ownerIntent = intent;
        process = { id, text: processCopy(event), events: [], deposited: false };
        this.flushPending(generation, process);
        ownerIntent.processes.push(process);
      } else {
        process.text = processCopy(event);
      }
      process.events.push(event);
      this.emit({ type: "process", generation, intent: ownerIntent, process });
    }

    materializeTerminalArchive(event) {
      if (this.generations.length) return;
      const bufferedEvents = Array.from(this.thinkingBuffers.values()).flatMap((buffer) => buffer.events);
      const queuedEvents = Array.from(this.pendingByTurn.values()).flat();
      const events = [...this.orphanEvents, ...queuedEvents, ...bufferedEvents];
      if (event && !events.includes(event)) events.push(event);
      const generation = {
        id: this.generationId(NaN),
        sequence: ++this.generationOrder,
        turn: null,
        reaction: "未形成可核验结论",
        intents: [{
          id: "terminal-state",
          text: "运行未进入可核验步骤",
          processes: [{ id: "run-state", text: "保留实际运行状态", events, deposited: false }]
        }],
        pendingEvents: [],
        sourceClosed: true,
        leftFrontier: false
      };
      this.orphanEvents.length = 0;
      this.pendingByTurn.clear();
      this.thinkingBuffers.clear();
      this.generations.push(generation);
      this.byId.set(generation.id, generation);
    }

    terminalFrom(event) {
      const status = (event.data && event.data.status) || "failed";
      this.materializeTerminalArchive(event);
      this.generations.forEach((generation) => { generation.sourceClosed = true; });
      this.terminal = {
        status,
        hasAnswer: status === "completed" && Boolean(this.answerFinal),
        event
      };
      this.emit({ type: "terminal", terminal: this.terminal });
    }

    apply(event) {
      const turn = eventTurn(event);
      switch (event.event) {
        case "demo.agent.thinking": {
          const committed = this.consumeThinking(event);
          if (!committed) {
            this.emit({ type: "archive", generation: this.generationFor(Number(event.data.turn)) || null });
            break;
          }
          const turnNumber = Number(event.data.turn);
          const projection = thinkingProjection(turnNumber, committed.text);
          const existing = this.generationFor(turnNumber);
          if (existing && existing.reaction === projection.reaction && !existing.sourceClosed) {
            this.updateIntent(existing, projection, committed.events);
            this.emit({ type: "generation-update", generation: existing });
            break;
          }
          const created = this.createGeneration(event, committed.text, committed.events);
          this.emit({ type: "generation", generation: created.generation });
          created.queuedSteps.forEach((step) => this.addStep(step));
          break;
        }
        case "demo.agent.step":
          this.addStep(event);
          break;
        case "demo.answer.final":
          this.answerFinal = event;
          if (this.terminal && this.terminal.status === "completed") this.terminal.hasAnswer = true;
          this.attachByTurn(turn, event);
          this.emit({ type: "archive", generation: this.generations[this.generations.length - 1] || null });
          break;
        case "demo.run.completed":
          this.attachByTurn(turn, event);
          this.terminalFrom(event);
          break;
        case "demo.run.cancelled":
        case "demo.run.failed":
          this.attachByTurn(turn, event);
          this.terminalFrom(event);
          break;
        default:
          this.attachByTurn(turn, event);
          this.emit({ type: "archive", generation: this.generations[this.generations.length - 1] || null });
      }
    }

    finishInput() {
      if (this.terminal) return;
      this.materializeTerminalArchive(null);
      this.generations.forEach((generation) => { generation.sourceClosed = true; });
      this.terminal = { status: "missing", hasAnswer: false, event: null };
      this.emit({ type: "terminal", terminal: this.terminal });
    }
  }

  function readingGate(kind, text) {
    const count = Array.from(text || "").length;
    const rules = {
      l0: { base: 650, per: 55, min: 1500, max: 2800 },
      l1: { base: 450, per: 45, min: 1150, max: 2200 },
      l2: { base: 650, per: 55, min: 1700, max: 3800 }
    }[kind];
    return Math.max(rules.min, Math.min(rules.max, rules.base + rules.per * count));
  }

  // The portfolio pauses this isolated copy when its frame leaves view.
  // Event fixtures, reading gates and hierarchy transitions remain unchanged.
  let showcasePaused = window.parent !== window;
  class Run {
    constructor() {
      this.cancelled = false;
      this.waits = new Set();
    }
    sleep(milliseconds) {
      return new Promise((resolve) => {
        if (this.cancelled) {
          resolve(false);
          return;
        }
        let remaining = milliseconds;
        let last = performance.now();
        const record = { id: null, resolve };
        const tick = () => {
          const now = performance.now();
          if (!showcasePaused && !document.hidden) remaining -= now - last;
          last = now;
          if (this.cancelled || remaining <= 0) {
            this.waits.delete(record);
            resolve(!this.cancelled);
          } else record.id = window.setTimeout(tick, showcasePaused || document.hidden ? 80 : Math.min(25, Math.max(1, remaining)));
        };
        record.id = window.setTimeout(tick, Math.min(25, Math.max(1, milliseconds)));
        this.waits.add(record);
      });
    }
    cancel() {
      this.cancelled = true;
      this.waits.forEach((record) => {
        window.clearTimeout(record.id);
        record.resolve(false);
      });
      this.waits.clear();
    }
  }

  function createMark() {
    const mark = el("span", "thinking-mark");
    mark.setAttribute("aria-hidden", "true");
    const glyph = el("span", "trace-glyph");
    glyph.innerHTML = GLYPH_SVG;
    const lit = document.createElement("canvas");
    lit.className = "lit";
    const hot = document.createElement("canvas");
    hot.className = "hot";
    glyph.append(lit, hot);
    mark.appendChild(glyph);
    mark._glyph = glyph;
    return mark;
  }


  const ICON_COPY = "<svg viewBox=\"0 0 16 16\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.4\" stroke-linecap=\"round\" stroke-linejoin=\"round\" aria-hidden=\"true\"><rect x=\"5.5\" y=\"5.5\" width=\"8\" height=\"8\" rx=\"1.5\"/><path d=\"M3.5 10.5A1.5 1.5 0 0 1 2 9V3.5A1.5 1.5 0 0 1 3.5 2H9a1.5 1.5 0 0 1 1.5 1.5\"/></svg>";
  const ICON_TICK = "<svg viewBox=\"0 0 16 16\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.6\" stroke-linecap=\"round\" stroke-linejoin=\"round\" aria-hidden=\"true\"><path d=\"M3 8.5 6.5 12 13 4.5\"/></svg>";
  const ICON_CODE = "<svg viewBox=\"0 0 16 16\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.4\" stroke-linecap=\"round\" stroke-linejoin=\"round\" aria-hidden=\"true\"><path d=\"M5 4.5 1.8 8 5 11.5\"/><path d=\"M11 4.5 14.2 8 11 11.5\"/><path d=\"M9.2 3 6.8 13\"/></svg>";

  let devDrawer = null;

  function buildDevDrawer() {
    const scrim = el("div", "dev-scrim");
    scrim.hidden = true;
    scrim.addEventListener("click", closeDevDrawer);
    const root = el("aside", "dev-drawer");
    root.hidden = true;
    root.setAttribute("role", "dialog");
    root.setAttribute("aria-label", "工程记录");
    const head = el("div", "dev-head");
    head.appendChild(el("span", "dev-title", "工程记录"));
    const close = el("button", "dev-close", "×");
    close.type = "button";
    close.setAttribute("aria-label", "关闭工程记录");
    close.addEventListener("click", closeDevDrawer);
    head.appendChild(close);
    const body = el("div", "dev-body");
    const summaryEvent = AGENT_STREAM.find((item) => item.event === "demo.trace.summary");
    if (summaryEvent) {
      const data = summaryEvent.data;
      body.appendChild(el("p", "dev-summary",
        "总耗时 " + (data.total_latency_ms / 1000) + " s · LLM 调用 " + data.llm_calls + " 次 · tokens " + formatTokens(data.total_tokens) +
        "。以下为本轮全部模拟事件，共 " + AGENT_STREAM.length + " 条原始事件。"));
    }
    AGENT_STREAM.forEach((event, index) => {
      const section = el("section", "dev-event");
      const headRow = el("div", "dev-event-head");
      headRow.append(el("span", "dev-index", String(index + 1).padStart(2, "0")), el("span", "dev-name", event.event));
      section.append(headRow, el("pre", "", safeJson(event.data)));
      body.appendChild(section);
    });
    root.append(head, body);
    document.body.append(scrim, root);
    return { scrim, root };
  }

  function openDevDrawer() {
    if (!devDrawer) devDrawer = buildDevDrawer();
    devDrawer.scrim.hidden = false;
    devDrawer.root.hidden = false;
    requestAnimationFrame(() => {
      devDrawer.scrim.classList.add("open");
      devDrawer.root.classList.add("open");
    });
  }

  function closeDevDrawer() {
    if (!devDrawer) return;
    devDrawer.scrim.classList.remove("open");
    devDrawer.root.classList.remove("open");
    window.setTimeout(() => {
      if (devDrawer && !devDrawer.root.classList.contains("open")) {
        devDrawer.scrim.hidden = true;
        devDrawer.root.hidden = true;
      }
    }, REDUCED_MOTION ? 0 : 250);
  }

  window.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closeDevDrawer();
  });

  class TraceView {
    constructor(host, run, store) {
      this.host = host;
      this.run = run;
      this.store = store;
      this.visibleGeneration = null;
      this.visibleIntent = null;
      this.visibleRows = new Map();
      this.depositedRows = new Set();
      this.completed = false;
      this.archive = null;
      this.archiveToggle = null;
      this.archiveBranches = new Map();
      this.expandedBranches = new Set();
      this.evidenceKeys = new Set();

      this.root = el("section", "trace");
      this.root.setAttribute("aria-label", "AI 执行过程");
      this.head = el("div", "trace-head");
      this.mark = createMark();
      this.copy = el("span", "head-copy");
      this.reaction = el("span", "reaction");
      this.intent = el("span", "intent");
      this.copy.append(this.reaction, this.intent);
      this.head.append(this.mark, this.copy);
      this.processList = el("ol", "process-list");
      this.processList.setAttribute("aria-label", "当前实际过程");
      this.status = el("span", "sr-only");
      this.status.setAttribute("role", "status");
      this.status.setAttribute("aria-live", "polite");
      this.status.setAttribute("aria-atomic", "true");
      this.root.append(this.head, this.processList, this.status);
      host.appendChild(this.root);
      startGlow(this.mark._glyph);
      this.store.subscribe(() => {
        if (this.completed && this.archive) this.renderArchive(!this.archive.hidden);
      });
    }

    announce(text) {
      this.status.textContent = "";
      window.setTimeout(() => {
        if (!this.run.cancelled) this.status.textContent = text;
      }, REDUCED_MOTION ? 0 : 12);
    }

    async swapGeneration(update) {
      this.copy.classList.add("changing");
      this.processList.classList.add("changing");
      if (!(await this.run.sleep(REDUCED_MOTION ? 0 : 145))) return false;
      update();
      this.copy.classList.add("entering");
      this.processList.classList.add("entering");
      this.copy.classList.remove("changing");
      this.processList.classList.remove("changing");
      if (!(await this.run.sleep(REDUCED_MOTION ? 0 : 73))) return false;
      this.copy.classList.remove("entering");
      this.processList.classList.remove("entering");
      return true;
    }

    async swapIntent(update) {
      this.intent.classList.add("changing");
      this.processList.classList.add("changing");
      if (!(await this.run.sleep(REDUCED_MOTION ? 0 : 145))) return false;
      update();
      this.intent.classList.add("entering");
      this.processList.classList.add("entering");
      this.intent.classList.remove("changing");
      this.processList.classList.remove("changing");
      if (!(await this.run.sleep(REDUCED_MOTION ? 0 : 73))) return false;
      this.intent.classList.remove("entering");
      this.processList.classList.remove("entering");
      return true;
    }

    resetProcessWindow(deposit) {
      if (deposit) this.visibleRows.forEach((_, id) => this.depositedRows.add(id));
      this.processList.replaceChildren();
      this.visibleRows.clear();
    }

    async showGeneration(generation) {
      this.root.classList.add("visible");
      const changed = this.visibleGeneration && this.visibleGeneration.id !== generation.id;
      if (changed && !(await this.run.sleep(REDUCED_MOTION ? 0 : 650))) return false;
      if (changed && !(await this.swapGeneration(() => {
        this.resetProcessWindow(false);
        this.depositedRows.clear();
        this.reaction.textContent = generation.reaction;
        this.intent.textContent = "";
      }))) return false;
      if (!changed && !this.visibleGeneration) {
        this.resetProcessWindow(false);
        this.reaction.textContent = generation.reaction;
        this.intent.textContent = "";
      }
      this.visibleGeneration = generation;
      this.visibleIntent = null;
      this.announce("AI 的反应：" + generation.reaction);
      return true;
    }

    async showIntent(generation, intent) {
      if (!this.visibleGeneration || this.visibleGeneration.id !== generation.id) return false;
      if (this.visibleIntent && this.visibleIntent.id !== intent.id) {
        if (!(await this.run.sleep(REDUCED_MOTION ? 0 : 450))) return false;
        if (!(await this.swapIntent(() => {
          this.resetProcessWindow(true);
          this.intent.textContent = intent.text;
        }))) return false;
      } else {
        this.intent.textContent = intent.text;
      }
      this.visibleIntent = intent;
      this.announce("接下来：" + intent.text);
      return true;
    }

    async addProcess(generation, intent, process) {
      if (!this.visibleGeneration || this.visibleGeneration.id !== generation.id || !this.visibleIntent || this.visibleIntent.id !== intent.id) return true;
      if (this.depositedRows.has(process.id)) return true;
      const existing = this.visibleRows.get(process.id);
      if (existing) {
        if (existing.copy.textContent === process.text) return true;
        existing.copy.classList.add("changing");
        if (!(await this.run.sleep(REDUCED_MOTION ? 0 : 120))) return false;
        existing.copy.textContent = process.text;
        existing.copy.classList.add("entering");
        existing.copy.classList.remove("changing");
        if (!(await this.run.sleep(REDUCED_MOTION ? 0 : 73))) return false;
        existing.copy.classList.remove("entering");
        this.announce(process.text);
        return true;
      }

      while (this.visibleRows.size >= 3) {
        const oldest = this.processList.firstElementChild;
        if (!oldest) break;
        const oldestId = oldest.dataset.processId;
        this.depositedRows.add(oldestId);
        oldest.classList.add("leaving");
        if (!(await this.run.sleep(145))) return false;
        this.visibleRows.delete(oldestId);
        oldest.remove();
      }

      const rowNode = el("li", "process-row");
      rowNode.dataset.processId = process.id;
      const marker = el("span", "process-marker", "·");
      marker.setAttribute("aria-hidden", "true");
      const copy = el("span", "process-copy", process.text);
      rowNode.append(marker, copy);
      this.processList.appendChild(rowNode);
      this.visibleRows.set(process.id, { node: rowNode, copy });
      window.setTimeout(() => rowNode.classList.add("visible"), REDUCED_MOTION ? 0 : 16);
      this.announce(process.text);
      return true;
    }

    branch(key, button, marker, target, section, property) {
      const open = this.expandedBranches.has(key);
      target.hidden = !open;
      marker.textContent = open ? "▾" : "▸";
      button.setAttribute("aria-expanded", String(open));
      const record = { key, button, marker, target, section, property };
      button.addEventListener("click", () => this.setBranch(record, target.hidden));
      this.archiveBranches.set(key, record);
      return record;
    }

    setBranch(branch, open) {
      branch.target.hidden = !open;
      branch.marker.textContent = open ? "▾" : "▸";
      branch.button.setAttribute("aria-expanded", String(open));
      if (open) this.expandedBranches.add(branch.key);
      else this.expandedBranches.delete(branch.key);
    }


    archiveLeaf(section, key, text, facts) {
      const button = el("button", "tree-row");
      button.type = "button";
      const marker = el("span", "tree-marker", "▸");
      marker.setAttribute("aria-hidden", "true");
      button.append(marker, el("span", "", text));
      const detail = el("div", "archive-detail");
      detail.id = "archive-" + key.replace(/[^\w-]+/g, "-");
      const list = el("dl", "call-facts");
      facts.forEach(([term, value]) => list.append(el("dt", "", term), el("dd", "", String(value))));
      detail.appendChild(list);
      button.setAttribute("aria-controls", detail.id);
      if (this.evidenceKeys.has(key)) section.classList.add("evidence-target");
      this.branch(key, button, marker, detail, section, "detail");
      section.append(button, detail);
    }


    renderArchive(open) {
      const archive = el("div", "archive-tree");
      archive.hidden = !open;
      archive.setAttribute("aria-label", "详细证据");
      this.archiveBranches.clear();

      this.store.generations.forEach((generation) => {
        const generationSection = el("section", "archive-generation");
        const generationButton = el("button", "tree-row generation-row");
        generationButton.type = "button";
        const generationMarker = el("span", "tree-marker", "▸");
        generationMarker.setAttribute("aria-hidden", "true");
        const label = el("span", "", generation.reaction);

        generationButton.append(generationMarker, label);
        const children = el("div", "archive-children");
        children.id = "archive-" + generation.id;
        generationButton.setAttribute("aria-controls", children.id);
        this.branch(generation.id, generationButton, generationMarker, children, generationSection, "children");

        generation.intents.forEach((intent) => {
          const intentSection = el("section", "archive-intent");
          const intentButton = el("button", "tree-row");
          intentButton.type = "button";
          const intentMarker = el("span", "tree-marker", "▸");
          intentMarker.setAttribute("aria-hidden", "true");
          intentButton.append(intentMarker, el("span", "", intent.text));
          const intentChildren = el("div", "archive-children");
          intentChildren.id = "archive-" + intent.id;
          intentButton.setAttribute("aria-controls", intentChildren.id);
          this.branch(intent.id, intentButton, intentMarker, intentChildren, intentSection, "children");
          intentSection.append(intentButton, intentChildren);
          children.appendChild(intentSection);
          intent.processes.forEach((process) => {
            const section = el("section", "archive-process");
            this.archiveLeaf(section, generation.id + "/" + process.id, process.text, processFacts(process));
            intentChildren.appendChild(section);
          });
        });
        llmCallsOf(generation).forEach((event, index) => {
          const section = el("section", "archive-process");
          const turn = event.data && Number.isFinite(Number(event.data.turn)) ? event.data.turn : index + 1;
          this.archiveLeaf(section, generation.id + "/llm-" + index, "模型推理——" + ((event.data && event.data.model) || "未提供"), llmFacts(event));
          children.appendChild(section);
        });
        if (!generation.intents.some((intent) => intent.processes.length) && generation.pendingEvents.length) {
          const section = el("section", "archive-process");
          this.archiveLeaf(section, generation.id + "/unresolved", "未形成可完成过程", [["记录", "共 " + generation.pendingEvents.length + " 条原始事件，完整内容见工程记录"]]);
          children.appendChild(section);
        }

        generationSection.append(generationButton, children);
        archive.appendChild(generationSection);
      });

      if (this.archive) this.archive.replaceWith(archive);
      else this.root.appendChild(archive);
      this.archive = archive;
      if (this.archiveToggle) {
        this.archiveToggle.textContent = open ? "收起详细证据" : "详细证据";
        this.archiveToggle.setAttribute("aria-expanded", String(open));
      }
    }

    toggleArchive(force) {
      if (!this.completed) return;
      const open = force === undefined ? !(this.archive && !this.archive.hidden) : force;
      this.renderArchive(open);
    }

    openEvidence(refs) {
      if (!this.completed) return;
      this.evidenceKeys.clear();
      refs.forEach((reference) => this.evidenceKeys.add(reference.generationId + "/" + reference.processId));
      this.renderArchive(true);
      refs.forEach((reference) => {
        const processKey = reference.generationId + "/" + reference.processId;
        const generation = this.store.byId.get(reference.generationId);
        const intent = generation && generation.intents.find((item) => item.processes.some((process) => process.id === reference.processId));
        [reference.generationId, intent && intent.id, processKey].filter(Boolean).forEach((key) => {
          const branch = this.archiveBranches.get(key);
          if (branch) this.setBranch(branch, true);
        });
      });
      const first = refs[0];
      const target = first && this.archiveBranches.get(first.generationId + "/" + first.processId);
      if (target) target.section.scrollIntoView({ behavior: "auto", block: "center" });
    }

    async settle(summary) {
      if (this.completed) return false;
      this.completed = true;
      this.root.classList.add("settling");
      const rows = Array.from(this.processList.children);
      rows.forEach((node) => node.classList.add("leaving"));
      if (rows.length && !(await this.run.sleep(190))) return false;
      this.copy.classList.add("changing");
      this.mark.classList.add("hidden");
      if (!(await this.run.sleep(160))) return false;

      this.processList.replaceChildren();
      this.root.classList.add("settled");
      this.mark.classList.remove("hidden");
      this.mark.classList.add("tick-slot");
      this.mark.replaceChildren(el("span", "", "✓"));
      const finalCopy = el("span", "head-copy");
      finalCopy.appendChild(el("span", "settle-summary", summary));
      const toggle = el("button", "process-toggle", "详细证据");
      toggle.type = "button";
      toggle.setAttribute("aria-expanded", "false");
      toggle.addEventListener("click", () => this.toggleArchive());
      finalCopy.appendChild(toggle);
      this.archiveToggle = toggle;
      this.head.replaceChildren(this.mark, finalCopy);
      this.copy = finalCopy;
      this.announce(summary);
      return true;
    }
  }

  const ANSWER_BITS = [
  "<p class=\"lead\">不能把“删除后多久彻底清除”回答成一个统一时限。按当前知识库，标准云服务的在线文件与备份副本分别处理：在线文件在删除请求确认后 24 小时内清除，备份随轮转在 30 天内清除；法律保留属于例外。<a class=\"cite\" href=\"#evidence\" data-evidence=\"turn-1|call-new,turn-2|call-version\">①</a><a class=\"cite\" href=\"#evidence\" data-evidence=\"turn-2|call-scope,turn-3|call-exception\">③</a></p>",
  "<p>客户提到的“删除后还能不能访问”，与“所有副本是否已经物理清除”也是两个问题。备份尚在保留期，并不意味着客户仍可查询或下载。以下按文件所在位置、规范版本和适用条件分别说明。</p>",
  "<h3>1. 在线文件与备份，为什么是两个时限</h3>",
  "<p>现行《文件生命周期规范》将在线文件和备份分开约定。在线文件的清除从删除请求确认后计算，时限为 24 小时；备份沿既定轮转周期清除，最长为 30 天。因此，在线文件已清除时，备份副本仍可能处于保留期，两者并不矛盾。<a class=\"cite\" href=\"#evidence\" data-evidence=\"turn-1|call-new,turn-2|call-version\">①</a></p>",
  "<p>对外沟通应保留“请求确认后”这一计时起点，不能直接改成“用户点击删除后”。现有引用没有给出前端点击与后台确认之间的时差，也没有证明某个具体文件此刻已经完成清除。制度规定的最长时限与单个文件的实际处理状态，需要分别核对。</p>",
  "<h3>2. 备份保留期间，谁还能读取</h3>",
  "<p>《备份与恢复规范》说明，备份副本与在线服务隔离，不提供用户查询或下载入口，仅用于授权的灾难恢复。这支持“用户不能通过常规产品入口读取备份”的表述，但不能扩展成“任何人、任何情况下都无法访问”，因为授权恢复本身就是规定允许的用途。<a class=\"cite\" href=\"#evidence\" data-evidence=\"turn-3|call-isolation,turn-3|call-restore\">②</a></p>",
  "<p>恢复还有一道后续约束：数据重新提供服务前，必须重放删除标记。也就是说，从历史备份恢复数据时，需要再次执行已记录的删除要求，不能直接把整个旧快照重新开放给用户。该条款说明了恢复流程应如何处理已删除文件，并不等于本轮已经审计过恢复任务的实际执行。<a class=\"cite\" href=\"#evidence\" data-evidence=\"turn-3|call-isolation,turn-3|call-restore\">②</a></p>",
  "<h3>3. 为什么没有采用 FAQ 中的“7 天”</h3>",
  "<p>本轮检索同时命中了旧版 FAQ 和现行规范。旧版 FAQ 写的是 7 天，但文档已归档；版本变更记录明确，v2.3 自 2026 年 8 月 1 日生效，并替代 v1.8 的删除时限说明。因此，当前标准云服务应使用 v2.3 的口径，不能将两个版本的数字混在一起，也不能取其中更短的数字作为承诺。<a class=\"cite\" href=\"#evidence\" data-evidence=\"turn-1|call-old,turn-2|call-version\">④</a></p>",
  "<p>这里的关键依据是明确的版本替代关系，而不仅是文件更新时间更近。如果后续查到客户专属合同或另一部署版本的规范，还需要重新确认适用性，不能只凭当前这份通用文档下结论。</p>",
  "<h3>4. 两类情况不能直接套用上述时限</h3>",
  "<ul><li>私有部署或专属合同：现行规范限定于标准云服务，其他部署方式和专属约定需要单独核对。</li><li>法律保留：已进入法律保留的文件不适用常规清除时限；解除保留后，按批准流程处理。本轮材料没有给出解除后的统一清除天数。</li></ul>",
  "<p>因此，在未确认客户部署方式、合同约定和文件保留状态前，可以解释通用规则，但不宜直接承诺“您的文件一定在 30 天内全部清除”。<a class=\"cite\" href=\"#evidence\" data-evidence=\"turn-2|call-scope,turn-3|call-exception\">③</a></p>",
  "<h3>5. 建议给客户的回复</h3>",
  "<div class=\"witness\"><p>如果您使用的是标准云服务，且文件不涉及法律保留，按现行规范，在线文件会在删除请求确认后 24 小时内清除，备份副本随轮转在 30 天内清除。</p><p>备份保留期间不提供用户查询或下载入口，仅用于授权的灾难恢复；恢复数据重新提供服务前，还须重放删除标记。</p><p>我们需要进一步确认您的部署方式、是否存在专属合同约定，以及此次删除请求的确认时间，才能核实具体文件的清除安排。</p></div>",
  "<h3>6. 本轮仍未确认的内容</h3>",
  "<p>本轮核对的是知识库中的规范，并未查询客户实例或实际删除日志。尚未确认客户的部署类型、专属合同、法律保留状态、请求确认时间，以及在线文件和备份的实际清除结果。若客户需要清除完成证明，下一步应查询对应操作记录，而不是将文档时限当成已完成的凭证。</p>"
];

  function buildAnswerStream(bits) {
    const stream = [];
    bits.forEach((html) => {
      const wrapper = document.createElement("div");
      wrapper.innerHTML = html;
      const root = wrapper.firstElementChild;
      const containers = root.tagName === "UL" || root.classList.contains("witness") ? Array.from(root.children) : [root];
      containers.forEach((container) => {
        Array.from(container.childNodes).forEach((node) => {
          if (node.nodeType === Node.TEXT_NODE) {
            Array.from(node.textContent).forEach((character) => stream.push({ root, container, character }));
          } else if (node.nodeType === Node.ELEMENT_NODE) {
            stream.push({ root, container, element: node });
          }
        });
        container.replaceChildren();
        if (container !== root) container.remove();
      });
      root.remove();
    });
    return stream;
  }

  function parseEvidence(value) {
    return value.split(",").map((entry) => {
      const parts = entry.split("|");
      return { generationId: parts[0], processId: parts[1] };
    });
  }

  function attachEvidenceEvents(root, trace) {
    root.addEventListener("click", (event) => {
      const source = event.target.closest("[data-evidence]");
      if (!source) return;
      event.preventDefault();
      trace.openEvidence(parseEvidence(source.dataset.evidence));
    });
  }

  async function streamAnswer(host, trace, run) {
    const answer = el("article", "answer birth");
    attachEvidenceEvents(answer, trace);
    host.appendChild(answer);
    const stream = buildAnswerStream(ANSWER_BITS);
    if (!(await run.sleep(16))) return false;
    answer.classList.remove("birth");

    let previousContainer = null;
    for (const token of stream) {
      if (previousContainer && previousContainer !== token.container) {
        if (!(await run.sleep(REDUCED_MOTION ? 0 : (previousContainer.tagName === "H3" ? 380 : 650)))) return false;
      }
      previousContainer = token.container;
      if (run.cancelled) return false;
      if (!token.root.parentNode) {
        token.root.classList.add("birth");
        answer.appendChild(token.root);
        window.setTimeout(() => token.root.classList.remove("birth"), REDUCED_MOTION ? 0 : 16);
      }
      if (token.container !== token.root && !token.container.parentNode) {
        token.container.classList.add("birth");
        token.root.appendChild(token.container);
        window.setTimeout(() => token.container.classList.remove("birth"), REDUCED_MOTION ? 0 : 16);
      }
      const character = el("span", "answer-char");
      if (token.character !== undefined) character.textContent = token.character;
      else character.appendChild(token.element);
      token.container.appendChild(character);
      window.setTimeout(() => character.classList.add("visible"), REDUCED_MOTION ? 0 : 16);
      const pause = token.character && /[。！？；]/.test(token.character) ? 130 : token.character && /[，：]/.test(token.character) ? 65 : 22;
      if (!(await run.sleep(REDUCED_MOTION ? 0 : pause))) return false;
    }
    if (!(await run.sleep(REDUCED_MOTION ? 0 : 400))) return false;
    showSources(host, trace);
    return true;
  }

  function showSources(host, trace) {
    const sources = el("section", "sources");
    sources.setAttribute("aria-label", "数据依据");
    const items = [["①", "文件生命周期规范", "现行条款与版本变更", "turn-1|call-new,turn-2|call-version"], ["②", "备份与恢复规范", "隔离访问与删除重放", "turn-3|call-isolation,turn-3|call-restore"], ["③", "适用范围与保留例外", "部署方式与法律保留", "turn-2|call-scope,turn-3|call-exception"], ["④", "旧版 FAQ 与替代记录", "7 天口径的版本核对", "turn-1|call-old,turn-2|call-version"]];
    items.forEach(([number, title, meta, evidence]) => {
      const source = el("div", "source");
      const button = el("button");
      button.type = "button";
      button.append(el("span", "source-index", number), el("span", "source-title", title), el("span", "source-meta", meta));
      button.addEventListener("click", () => trace.openEvidence(parseEvidence(evidence)));
      source.appendChild(button);
      sources.appendChild(source);
    });
    host.appendChild(sources);
    window.setTimeout(() => sources.classList.add("visible"), REDUCED_MOTION ? 0 : 16);

    const tools = el("div", "answer-tools");
    const copy = el("button");
    copy.type = "button";
    copy.title = "复制";
    copy.setAttribute("aria-label", "复制回答");
    copy.innerHTML = ICON_COPY;
    copy.addEventListener("click", async () => {
      try {
        await navigator.clipboard.writeText(host.querySelector(".answer").innerText);
        copy.innerHTML = ICON_TICK;
        window.setTimeout(() => { copy.innerHTML = ICON_COPY; }, 1400);
      } catch (_) {}
    });
    const dev = el("button");
    dev.type = "button";
    dev.title = "工程记录";
    dev.setAttribute("aria-label", "工程记录");
    dev.innerHTML = ICON_CODE;
    dev.addEventListener("click", openDevDrawer);
    tools.append(copy, dev);
    host.appendChild(tools);
    window.setTimeout(() => tools.classList.add("visible"), REDUCED_MOTION ? 0 : 16);
  }

  // Present each generation in reading order before settling into the evidence archive.
  class FrontierPlayer {
    constructor(store, trace, run) {
      this.store = store;
      this.trace = trace;
      this.run = run;
    }

    async waitFor(predicate) {
      while (!predicate()) {
        if (!(await this.run.sleep(24))) return false;
      }
      return true;
    }

    async playIntent(generation, intent, intentIndex) {
      if (!(await this.trace.showIntent(generation, intent))) return false;
      if (!(await this.run.sleep(readingGate("l1", intent.text)))) return false;
      let processIndex = 0;
      const shownTexts = new Map();
      while (!this.run.cancelled) {
        const ready = await this.waitFor(() =>
          intent.processes.length > processIndex ||
          intent.processes.some((process) => shownTexts.has(process.id) && shownTexts.get(process.id) !== process.text) ||
          generation.intents.length > intentIndex + 1 ||
          generation.sourceClosed ||
          Boolean(this.store.terminal)
        );
        if (!ready) return false;
        const changed = intent.processes.find((process) => shownTexts.has(process.id) && shownTexts.get(process.id) !== process.text);
        if (changed) {
          if (!(await this.trace.addProcess(generation, intent, changed))) return false;
          shownTexts.set(changed.id, changed.text);
          if (!(await this.run.sleep(readingGate("l2", changed.text)))) return false;
          continue;
        }
        const process = intent.processes[processIndex];
        if (!process) break;
        if (!(await this.trace.addProcess(generation, intent, process))) return false;
        shownTexts.set(process.id, process.text);
        if (!(await this.run.sleep(readingGate("l2", process.text)))) return false;
        processIndex += 1;
      }
      return true;
    }

    async playGeneration(generation) {
      if (!(await this.trace.showGeneration(generation))) return false;
      if (!(await this.run.sleep(readingGate("l0", generation.reaction)))) return false;
      let intentIndex = 0;
      while (!this.run.cancelled) {
        const ready = await this.waitFor(() =>
          generation.intents.length > intentIndex ||
          generation.sourceClosed ||
          Boolean(this.store.terminal)
        );
        if (!ready) return false;
        const intent = generation.intents[intentIndex];
        if (!intent) break;
        if (!(await this.playIntent(generation, intent, intentIndex))) return false;
        intentIndex += 1;
        if (generation.sourceClosed && intentIndex >= generation.intents.length) break;
      }
      generation.leftFrontier = true;
      return true;
    }

    async playAll() {
      let generationIndex = 0;
      while (!this.run.cancelled) {
        const ready = await this.waitFor(() =>
          this.store.generations.length > generationIndex || Boolean(this.store.terminal)
        );
        if (!ready) return null;
        const generation = this.store.generations[generationIndex];
        if (!generation) break;
        if (!(await this.playGeneration(generation))) return null;
        generationIndex += 1;
      }
      if (!(await this.waitFor(() => Boolean(this.store.terminal)))) return null;
      return this.store.terminal;
    }
  }

  async function feedAgentStream(store, run) {
    for (let index = 0; index < AGENT_STREAM.length; index += 1) {
      if (run.cancelled) return false;
      store.apply(AGENT_STREAM[index]);
      if (index < AGENT_STREAM.length - 1 && !(await run.sleep(82))) return false;
    }
    store.finishInput();
    return true;
  }

  let activeRun = null;
  async function runDemo() {
    if (activeRun) activeRun.cancel();
    const run = new Run();
    activeRun = run;
    stage.replaceChildren();
    document.querySelectorAll(".dev-drawer, .dev-scrim").forEach((node) => node.remove());
    devDrawer = null;

    const store = new TraceStore("客户上传的文件删除后，多久会彻底清除？备份还能访问吗？");
    const turn = el("section", "turn");
    const question = el("div", "question");
    const questionCopy = el("div", "", store.question);
    question.appendChild(questionCopy);
    const host = el("div", "assistant");
    turn.append(question, host);
    stage.appendChild(turn);
    window.setTimeout(() => questionCopy.classList.add("visible"), REDUCED_MOTION ? 0 : 16);
    if (!(await run.sleep(320))) return;

    const trace = new TraceView(host, run, store);
    const player = new FrontierPlayer(store, trace, run);
    const feeder = feedAgentStream(store, run);
    const terminal = await player.playAll();
    if (!terminal || !(await feeder)) return;
    const summary = terminal.hasAnswer ? "已核对删除时限、备份规则与适用范围" : "未形成可核验结论";
    if (!(await run.sleep(REDUCED_MOTION ? 0 : 800))) return;
    if (!(await trace.settle(summary))) return;
    if (!terminal.hasAnswer) return;
    if (!(await run.sleep(180))) return;
    await streamAnswer(host, trace, run);
  }


  // Read-only inspection surface for the prototype state and event fixture.
  window.__THINKING_UI__ = Object.freeze({ AGENT_STREAM, TraceStore, TraceView, FrontierPlayer, readingGate });
  if (window.__THINKING_UI_TEST__) return;

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    if (!input.value.trim()) return;
    input.value = "";
    const original = input.placeholder;
    input.placeholder = "此原型使用固定模拟数据，请点击右上角重新演示";
    window.setTimeout(() => { input.placeholder = original; }, 1800);
  });

  window.addEventListener("message", (event) => {
    if (event.origin !== location.origin || event.source !== parent || event.data?.source !== "portfolio") return;
    if (event.data.type === "pause") showcasePaused = true;
    if (event.data.type === "resume") showcasePaused = false;
    if (event.data.type === "restart") { showcasePaused = false; runDemo(); }
  });
  rerunButton.addEventListener("click", () => {
    if (parent !== window) parent.postMessage({source:"thinking-showcase", type:"restart-request"}, location.origin);
    else {showcasePaused=false;runDemo();}
  });
  runDemo();
})();
