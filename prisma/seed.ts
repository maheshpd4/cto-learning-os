import { PrismaClient, SkillArea, PhaseStatus, TaskType } from "@prisma/client";

const prisma = new PrismaClient();

// ============================================================
// HELPERS
// ============================================================
function addDays(date: Date, days: number): Date {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d;
}

function weekStart(base: Date, weekOffset: number): Date {
  return addDays(base, weekOffset * 7);
}

// ============================================================
// ROADMAP DATA
// May 15, 2026 → November 4, 2026 (24 weeks)
// ============================================================
const START = new Date("2026-05-15");

const phases = [
  {
    number: 1,
    title: "Foundation Acceleration",
    description:
      "Audit your current knowledge gaps, refresh core system design patterns, and establish strong fundamentals in modern AI, data, and cloud architecture.",
    focus: "System Design · Cloud Fundamentals · AI Concepts · Gaps Audit",
    startDate: weekStart(START, 0),
    endDate: addDays(weekStart(START, 3), 6),
    status: PhaseStatus.ACTIVE,
    deliverable: "Personal knowledge gap audit document + architecture principles reference",
    weeks: [
      {
        weekNumber: 1,
        title: "Orientation & Gap Analysis",
        goals: [
          "Complete a full skills self-assessment across all 7 areas",
          "Set up development environment and toolchain",
          "Review distributed systems fundamentals",
          "Understand the CTO role expectations in modern orgs",
        ],
        expectedOutput: "Skills gap analysis document with prioritized learning plan",
        tasks: [
          { title: "Complete 7-area skills self-assessment", type: TaskType.REVIEW, skillArea: SkillArea.AI_SYSTEMS, timeBlocks: 2 },
          { title: "Set up local dev environment (Docker, K8s, Python, Go)", type: TaskType.BUILD, skillArea: SkillArea.PLATFORM_ENGINEERING, timeBlocks: 4 },
          { title: "Read: The Architecture of Distributed Systems (CAP theorem, consistency models)", type: TaskType.STUDY, skillArea: SkillArea.CLOUD_ARCHITECTURE, timeBlocks: 3 },
          { title: "Study: Modern CTO responsibilities and technical leadership patterns", type: TaskType.STUDY, skillArea: SkillArea.PRODUCT_FINANCE_LEADERSHIP, timeBlocks: 2 },
          { title: "Explore: LLM landscape (GPT-4, Claude, Gemini, Llama) — capabilities and limitations", type: TaskType.STUDY, skillArea: SkillArea.AI_SYSTEMS, timeBlocks: 3 },
        ],
      },
      {
        weekNumber: 2,
        title: "Cloud Architecture Deep Dive",
        goals: [
          "Master GCP architecture patterns beyond BigQuery/Dataflow",
          "Understand multi-cloud and hybrid cloud patterns",
          "Study IaC with Terraform on GCP",
          "Design a reference cloud architecture",
        ],
        expectedOutput: "Reference architecture diagram: GCP multi-tier application",
        tasks: [
          { title: "GCP: VPC design, private networking, Cloud NAT, Shared VPC", type: TaskType.STUDY, skillArea: SkillArea.CLOUD_ARCHITECTURE, timeBlocks: 3 },
          { title: "Terraform: Provision GCP project, VPC, GKE cluster from scratch", type: TaskType.BUILD, skillArea: SkillArea.PLATFORM_ENGINEERING, timeBlocks: 4 },
          { title: "Study: Cloud Run vs GKE vs Cloud Functions — decision framework", type: TaskType.STUDY, skillArea: SkillArea.CLOUD_ARCHITECTURE, timeBlocks: 2 },
          { title: "Read: AWS vs GCP vs Azure — positioning for enterprise sales", type: TaskType.STUDY, skillArea: SkillArea.CLOUD_ARCHITECTURE, timeBlocks: 2 },
          { title: "Design: Draw a reference 3-tier GCP architecture with security zones", type: TaskType.BUILD, skillArea: SkillArea.CLOUD_ARCHITECTURE, timeBlocks: 3 },
        ],
      },
      {
        weekNumber: 3,
        title: "Data Platform Modernization",
        goals: [
          "Map evolution from Hadoop/Hive to modern lakehouse",
          "Understand Delta Lake, Apache Iceberg, dbt",
          "Study real-time vs batch trade-offs",
          "Design a modern data platform reference architecture",
        ],
        expectedOutput: "Modern data platform architecture diagram with technology selection rationale",
        tasks: [
          { title: "Study: Data Lakehouse architecture (Delta Lake, Iceberg, Hudi) vs old Hadoop", type: TaskType.STUDY, skillArea: SkillArea.DATA_PLATFORMS, timeBlocks: 3 },
          { title: "Hands-on: dbt tutorial — model, test, document a dataset in BigQuery", type: TaskType.BUILD, skillArea: SkillArea.DATA_PLATFORMS, timeBlocks: 4 },
          { title: "Study: Apache Kafka vs Pub/Sub vs Kinesis — when to use what", type: TaskType.STUDY, skillArea: SkillArea.ENTERPRISE_INTEGRATION, timeBlocks: 2 },
          { title: "Read: Data mesh vs data fabric — CTO-level positioning", type: TaskType.STUDY, skillArea: SkillArea.DATA_PLATFORMS, timeBlocks: 2 },
          { title: "Practice: Design a streaming + batch hybrid pipeline (Lambda/Kappa architecture)", type: TaskType.PRACTICE, skillArea: SkillArea.DATA_PLATFORMS, timeBlocks: 3 },
        ],
      },
      {
        weekNumber: 4,
        title: "Review & Foundation Solidification",
        goals: [
          "Consolidate Phase 1 knowledge",
          "Write personal architecture principles document",
          "Begin Phase 2 prep — AI platform deep dive",
          "Complete first check-in review with AI Coach",
        ],
        expectedOutput: "Personal Architecture Principles v1 document (5-10 principles with rationale)",
        tasks: [
          { title: "Write: Architecture Principles doc — 10 principles from Phase 1 learnings", type: TaskType.BUILD, skillArea: SkillArea.CLOUD_ARCHITECTURE, timeBlocks: 4 },
          { title: "Mock interview: 5 system design questions from Phase 1 topics", type: TaskType.PRACTICE, skillArea: SkillArea.CLOUD_ARCHITECTURE, timeBlocks: 3 },
          { title: "Study: Introduction to LLM RAG architecture (embedding, chunking, retrieval)", type: TaskType.STUDY, skillArea: SkillArea.AI_SYSTEMS, timeBlocks: 3 },
          { title: "Review: Update skills self-assessment — what improved?", type: TaskType.REVIEW, skillArea: SkillArea.AI_SYSTEMS, timeBlocks: 2 },
        ],
      },
    ],
  },
  {
    number: 2,
    title: "AI + Data Platform Mastery",
    description:
      "Deep dive into LLMs, RAG architecture, vector databases, AI agent patterns, and streaming data pipelines. Build the Enterprise AI RAG Platform project.",
    focus: "LLMs · RAG · Vector DBs · Kafka · Flink · AI Agents",
    startDate: weekStart(START, 4),
    endDate: addDays(weekStart(START, 7), 6),
    status: PhaseStatus.UPCOMING,
    deliverable: "Enterprise AI RAG Platform — working prototype on GitHub",
    weeks: [
      {
        weekNumber: 5,
        title: "LLM Architecture & Prompt Engineering",
        goals: [
          "Understand transformer architecture at a CTO level",
          "Master prompt engineering patterns for production systems",
          "Study LLM evaluation frameworks",
          "Understand cost and latency trade-offs",
        ],
        expectedOutput: "Prompt engineering playbook with 20+ production patterns",
        tasks: [
          { title: "Study: Transformer architecture — attention, context windows, tokenization", type: TaskType.STUDY, skillArea: SkillArea.AI_SYSTEMS, timeBlocks: 3 },
          { title: "Hands-on: Build 5 production prompt templates (RAG, summarization, extraction, classification, generation)", type: TaskType.BUILD, skillArea: SkillArea.AI_SYSTEMS, timeBlocks: 4 },
          { title: "Study: LLM evaluation — RAGAS, DeepEval, custom evals", type: TaskType.STUDY, skillArea: SkillArea.AI_SYSTEMS, timeBlocks: 3 },
          { title: "Research: LLM cost optimization — caching, batching, model routing", type: TaskType.STUDY, skillArea: SkillArea.AI_SYSTEMS, timeBlocks: 2 },
        ],
      },
      {
        weekNumber: 6,
        title: "RAG Systems & Vector Databases",
        goals: [
          "Build end-to-end RAG pipeline from scratch",
          "Master vector database selection (Pinecone, Weaviate, pgvector)",
          "Understand chunking strategies and embedding models",
          "Design enterprise RAG with security and multi-tenancy",
        ],
        expectedOutput: "Working RAG application with document ingestion and query API",
        tasks: [
          { title: "Build: RAG pipeline — ingest PDFs, chunk, embed (text-embedding-004), store in pgvector", type: TaskType.BUILD, skillArea: SkillArea.AI_SYSTEMS, timeBlocks: 5 },
          { title: "Study: Vector DB comparison — Pinecone, Weaviate, Qdrant, pgvector trade-offs", type: TaskType.STUDY, skillArea: SkillArea.AI_SYSTEMS, timeBlocks: 2 },
          { title: "Study: Advanced RAG — HyDE, multi-query, re-ranking, contextual compression", type: TaskType.STUDY, skillArea: SkillArea.AI_SYSTEMS, timeBlocks: 3 },
          { title: "Design: Multi-tenant RAG architecture with data isolation", type: TaskType.BUILD, skillArea: SkillArea.AI_SYSTEMS, timeBlocks: 3 },
        ],
      },
      {
        weekNumber: 7,
        title: "AI Agents & Orchestration",
        goals: [
          "Build autonomous AI agents with tool use",
          "Study LangGraph, LangChain, CrewAI patterns",
          "Understand agent memory and state management",
          "Design production-safe agent guardrails",
        ],
        expectedOutput: "Multi-agent workflow prototype with tool calling and memory",
        tasks: [
          { title: "Build: LangGraph multi-agent workflow — research, write, review agents", type: TaskType.BUILD, skillArea: SkillArea.AI_SYSTEMS, timeBlocks: 5 },
          { title: "Study: Agent memory patterns — short-term, long-term, episodic, semantic", type: TaskType.STUDY, skillArea: SkillArea.AI_SYSTEMS, timeBlocks: 2 },
          { title: "Study: AI safety in production — hallucination detection, guardrails, PII handling", type: TaskType.STUDY, skillArea: SkillArea.SECURITY, timeBlocks: 2 },
          { title: "Build: Tool-use agent that queries APIs, summarizes, and takes actions", type: TaskType.BUILD, skillArea: SkillArea.AI_SYSTEMS, timeBlocks: 4 },
        ],
      },
      {
        weekNumber: 8,
        title: "Streaming Pipelines & Phase 2 Project",
        goals: [
          "Complete Enterprise AI RAG Platform MVP",
          "Wire Kafka for real-time document ingestion",
          "Add observability and cost tracking",
          "Push to GitHub with architecture docs",
        ],
        expectedOutput: "Enterprise AI RAG Platform v1 on GitHub with README and architecture diagram",
        tasks: [
          { title: "Build: Kafka producer → document processor → vector store pipeline", type: TaskType.BUILD, skillArea: SkillArea.DATA_PLATFORMS, timeBlocks: 5 },
          { title: "Build: Cost tracking dashboard — tokens used, cost per query, SLA metrics", type: TaskType.BUILD, skillArea: SkillArea.AI_SYSTEMS, timeBlocks: 3 },
          { title: "Build: OpenTelemetry traces for RAG pipeline (latency per stage)", type: TaskType.BUILD, skillArea: SkillArea.PLATFORM_ENGINEERING, timeBlocks: 3 },
          { title: "Write: Architecture doc + README + resume bullet for RAG Platform", type: TaskType.BUILD, skillArea: SkillArea.PRODUCT_FINANCE_LEADERSHIP, timeBlocks: 2 },
        ],
      },
    ],
  },
  {
    number: 3,
    title: "Enterprise Integration Mastery",
    description:
      "Master API design, event-driven architecture, Kafka at scale, microservice patterns, and enterprise middleware. Build the Travel Booking Event Platform.",
    focus: "Kafka · API Design · Event-Driven · Microservices · ESB patterns",
    startDate: weekStart(START, 8),
    endDate: addDays(weekStart(START, 11), 6),
    status: PhaseStatus.UPCOMING,
    deliverable: "Travel Booking Event-Driven Platform on GitHub",
    weeks: [
      { weekNumber: 9, title: "Apache Kafka at Scale", goals: ["Master Kafka internals — partitions, replication, consumer groups", "Design topics for enterprise workloads", "Implement exactly-once semantics", "Kafka security — SASL, ACLs, TLS"], expectedOutput: "Kafka cluster design document for 10M events/day workload", tasks: [
        { title: "Study: Kafka internals — log segments, compaction, ISR, leader election", type: TaskType.STUDY, skillArea: SkillArea.ENTERPRISE_INTEGRATION, timeBlocks: 3 },
        { title: "Hands-on: Deploy Kafka cluster (KRaft mode), create topics, producer/consumer in Python", type: TaskType.BUILD, skillArea: SkillArea.ENTERPRISE_INTEGRATION, timeBlocks: 4 },
        { title: "Study: Exactly-once semantics, idempotent producers, transactions", type: TaskType.STUDY, skillArea: SkillArea.ENTERPRISE_INTEGRATION, timeBlocks: 2 },
        { title: "Build: Kafka retry + DLQ pattern — simulate failures, route to DLQ", type: TaskType.BUILD, skillArea: SkillArea.ENTERPRISE_INTEGRATION, timeBlocks: 3 },
      ]},
      { weekNumber: 10, title: "API Design & GraphQL", goals: ["Master REST API best practices at enterprise scale", "Design GraphQL schema for complex domains", "Study API gateway patterns (Kong, Apigee)", "Implement rate limiting, auth, versioning"], expectedOutput: "OpenAPI spec for Travel Booking API + GraphQL schema", tasks: [
        { title: "Study: REST API design — versioning, pagination, HATEOAS, error standards", type: TaskType.STUDY, skillArea: SkillArea.ENTERPRISE_INTEGRATION, timeBlocks: 2 },
        { title: "Build: Full REST API for booking system with OpenAPI spec", type: TaskType.BUILD, skillArea: SkillArea.ENTERPRISE_INTEGRATION, timeBlocks: 4 },
        { title: "Build: GraphQL API with subscriptions for real-time booking updates", type: TaskType.BUILD, skillArea: SkillArea.ENTERPRISE_INTEGRATION, timeBlocks: 3 },
        { title: "Study: API gateway — Kong, Apigee, AWS API Gateway comparison", type: TaskType.STUDY, skillArea: SkillArea.ENTERPRISE_INTEGRATION, timeBlocks: 2 },
      ]},
      { weekNumber: 11, title: "Event-Driven Architecture Patterns", goals: ["Master CQRS and Event Sourcing", "Implement Saga pattern for distributed transactions", "Study outbox pattern for reliable messaging", "Design event schema registry"], expectedOutput: "Event-driven microservices design for Travel Booking with Saga pattern", tasks: [
        { title: "Study: CQRS + Event Sourcing — when to use, trade-offs, implementation patterns", type: TaskType.STUDY, skillArea: SkillArea.ENTERPRISE_INTEGRATION, timeBlocks: 3 },
        { title: "Build: Saga orchestration for multi-step booking (flight + hotel + payment)", type: TaskType.BUILD, skillArea: SkillArea.ENTERPRISE_INTEGRATION, timeBlocks: 5 },
        { title: "Build: Transactional outbox pattern — reliable event publishing from database", type: TaskType.BUILD, skillArea: SkillArea.ENTERPRISE_INTEGRATION, timeBlocks: 3 },
        { title: "Study: Schema registry (Confluent) — Avro, Protobuf, schema evolution", type: TaskType.STUDY, skillArea: SkillArea.ENTERPRISE_INTEGRATION, timeBlocks: 2 },
      ]},
      { weekNumber: 12, title: "Phase 3 Project Completion", goals: ["Complete Travel Booking Event Platform", "Add Kafka, Saga, REST API, and observability", "Write architecture documentation", "Record demo video"], expectedOutput: "Travel Booking Event Platform on GitHub — production-quality code with tests", tasks: [
        { title: "Integrate: Kafka + REST API + Saga + database into unified Travel Booking Platform", type: TaskType.BUILD, skillArea: SkillArea.ENTERPRISE_INTEGRATION, timeBlocks: 5 },
        { title: "Add: Integration tests, Postman collection, Docker Compose", type: TaskType.BUILD, skillArea: SkillArea.PLATFORM_ENGINEERING, timeBlocks: 3 },
        { title: "Write: Architecture ADRs + sequence diagrams + README", type: TaskType.BUILD, skillArea: SkillArea.ENTERPRISE_INTEGRATION, timeBlocks: 2 },
        { title: "Mock interview: 5 enterprise integration design questions", type: TaskType.PRACTICE, skillArea: SkillArea.ENTERPRISE_INTEGRATION, timeBlocks: 2 },
      ]},
    ],
  },
  {
    number: 4,
    title: "Platform Engineering + DevSecOps",
    description:
      "Master Kubernetes at production scale, Terraform for multi-cloud, GitOps with ArgoCD, and security posture management. Build the Secure SaaS Multi-tenant Platform.",
    focus: "Kubernetes · Terraform · GitOps · ArgoCD · Zero-Trust · DevSecOps",
    startDate: weekStart(START, 12),
    endDate: addDays(weekStart(START, 15), 6),
    status: PhaseStatus.UPCOMING,
    deliverable: "Secure SaaS Multi-tenant Platform with full GitOps pipeline",
    weeks: [
      { weekNumber: 13, title: "Kubernetes Production Patterns", goals: ["Master K8s resource model beyond deployments", "Study HPA, KEDA, cluster autoscaler", "Understand network policies and RBAC", "Multi-tenant K8s cluster design"], expectedOutput: "Multi-tenant K8s cluster design with namespace isolation and RBAC", tasks: [
        { title: "Study: K8s workloads — StatefulSets, DaemonSets, Jobs, CronJobs — when to use each", type: TaskType.STUDY, skillArea: SkillArea.PLATFORM_ENGINEERING, timeBlocks: 2 },
        { title: "Hands-on: Deploy multi-tenant app with namespace isolation, resource quotas, RBAC", type: TaskType.BUILD, skillArea: SkillArea.PLATFORM_ENGINEERING, timeBlocks: 4 },
        { title: "Study: KEDA (Kubernetes Event-Driven Autoscaling) — scale on Kafka lag, queue depth", type: TaskType.STUDY, skillArea: SkillArea.PLATFORM_ENGINEERING, timeBlocks: 2 },
        { title: "Build: Service mesh with Istio — mTLS, traffic management, observability", type: TaskType.BUILD, skillArea: SkillArea.PLATFORM_ENGINEERING, timeBlocks: 4 },
      ]},
      { weekNumber: 14, title: "Infrastructure as Code & GitOps", goals: ["Master Terraform modules and state management", "Implement GitOps with ArgoCD", "CI/CD pipeline for infrastructure", "Policy as code with OPA/Conftest"], expectedOutput: "Terraform module library + ArgoCD GitOps pipeline on GCP", tasks: [
        { title: "Build: Terraform modules for GCP: VPC, GKE, Cloud SQL, Redis (reusable)", type: TaskType.BUILD, skillArea: SkillArea.PLATFORM_ENGINEERING, timeBlocks: 5 },
        { title: "Set up: ArgoCD + App of Apps pattern for multi-environment GitOps", type: TaskType.BUILD, skillArea: SkillArea.PLATFORM_ENGINEERING, timeBlocks: 4 },
        { title: "Study: Terraform remote state, workspaces, Atlantis for PR-based plans", type: TaskType.STUDY, skillArea: SkillArea.PLATFORM_ENGINEERING, timeBlocks: 2 },
        { title: "Build: GitHub Actions CI/CD — lint, test, build, push, deploy to GKE via ArgoCD", type: TaskType.BUILD, skillArea: SkillArea.PLATFORM_ENGINEERING, timeBlocks: 3 },
      ]},
      { weekNumber: 15, title: "Security Architecture & Zero-Trust", goals: ["Design zero-trust network architecture", "Implement secrets management (Vault/Secret Manager)", "Study SAST/DAST in CI/CD pipelines", "Cloud security posture management"], expectedOutput: "Security architecture document for multi-tenant SaaS platform", tasks: [
        { title: "Study: Zero-trust architecture — BeyondCorp, SPIFFE/SPIRE, identity-aware proxy", type: TaskType.STUDY, skillArea: SkillArea.SECURITY, timeBlocks: 3 },
        { title: "Build: HashiCorp Vault — dynamic secrets, PKI, K8s integration", type: TaskType.BUILD, skillArea: SkillArea.SECURITY, timeBlocks: 4 },
        { title: "Set up: SAST (Semgrep) + DAST (OWASP ZAP) in GitHub Actions pipeline", type: TaskType.BUILD, skillArea: SkillArea.SECURITY, timeBlocks: 3 },
        { title: "Study: Cloud IAM deep dive — least privilege, service account design, org policies", type: TaskType.STUDY, skillArea: SkillArea.SECURITY, timeBlocks: 2 },
      ]},
      { weekNumber: 16, title: "Phase 4 Project Completion", goals: ["Complete Secure SaaS Multi-tenant Platform", "Full GitOps pipeline, security hardened", "SOC2-ready controls documented", "Architecture review simulation"], expectedOutput: "Secure SaaS Platform GitHub repo with GitOps pipeline + security runbook", tasks: [
        { title: "Integrate: Complete SaaS platform with multi-tenancy, GitOps, and security controls", type: TaskType.BUILD, skillArea: SkillArea.PLATFORM_ENGINEERING, timeBlocks: 5 },
        { title: "Write: Threat model document using STRIDE methodology", type: TaskType.BUILD, skillArea: SkillArea.SECURITY, timeBlocks: 3 },
        { title: "Practice: Architecture review presentation (15 min) for the SaaS platform", type: TaskType.PRACTICE, skillArea: SkillArea.PRODUCT_FINANCE_LEADERSHIP, timeBlocks: 3 },
        { title: "Mock interview: 5 platform engineering + security interview questions", type: TaskType.PRACTICE, skillArea: SkillArea.PLATFORM_ENGINEERING, timeBlocks: 2 },
      ]},
    ],
  },
  {
    number: 5,
    title: "CTO Business Leadership",
    description:
      "Develop executive-level thinking: product strategy, build-vs-buy decisions, engineering org design, P&L awareness, and technology vendor evaluation. Build the AI Observability Platform.",
    focus: "Product Strategy · Team Design · P&L · Build-vs-Buy · Architecture Review",
    startDate: weekStart(START, 16),
    endDate: addDays(weekStart(START, 19), 6),
    status: PhaseStatus.UPCOMING,
    deliverable: "AI Observability & Cost Control Platform + CTO Portfolio Document",
    weeks: [
      { weekNumber: 17, title: "Engineering Strategy & Organization Design", goals: ["Study engineering team topologies", "Understand platform vs product team model", "Learn OKR and tech roadmap creation", "Study technology decision frameworks"], expectedOutput: "Sample engineering org design + technology strategy document", tasks: [
        { title: "Read: Team Topologies — stream-aligned, platform, enabling, complicated-subsystem teams", type: TaskType.STUDY, skillArea: SkillArea.PRODUCT_FINANCE_LEADERSHIP, timeBlocks: 4 },
        { title: "Write: Sample 12-month technology strategy for a fictional fintech scaleup", type: TaskType.BUILD, skillArea: SkillArea.PRODUCT_FINANCE_LEADERSHIP, timeBlocks: 4 },
        { title: "Study: Build vs buy vs partner decision framework — TCO, make-or-buy matrix", type: TaskType.STUDY, skillArea: SkillArea.PRODUCT_FINANCE_LEADERSHIP, timeBlocks: 2 },
        { title: "Study: Engineering metrics — DORA, SPACE, Accelerate — what CTOs measure", type: TaskType.STUDY, skillArea: SkillArea.PRODUCT_FINANCE_LEADERSHIP, timeBlocks: 2 },
      ]},
      { weekNumber: 18, title: "Product & Financial Thinking", goals: ["Understand SaaS financial model from CTO perspective", "Learn technical product management", "Study pricing and packaging decisions", "Understand cloud cost optimization at enterprise scale"], expectedOutput: "Cloud cost optimization playbook + unit economics model", tasks: [
        { title: "Study: SaaS unit economics — CAC, LTV, gross margin, infrastructure cost as % of revenue", type: TaskType.STUDY, skillArea: SkillArea.PRODUCT_FINANCE_LEADERSHIP, timeBlocks: 3 },
        { title: "Build: FinOps dashboard — GCP billing breakdown, cost per feature, anomaly detection", type: TaskType.BUILD, skillArea: SkillArea.PLATFORM_ENGINEERING, timeBlocks: 4 },
        { title: "Study: Technical product management — how to write good engineering specs (RFC, ADR)", type: TaskType.STUDY, skillArea: SkillArea.PRODUCT_FINANCE_LEADERSHIP, timeBlocks: 2 },
        { title: "Write: RFC for a technical decision (your choice) using standard RFC template", type: TaskType.BUILD, skillArea: SkillArea.PRODUCT_FINANCE_LEADERSHIP, timeBlocks: 3 },
      ]},
      { weekNumber: 19, title: "Architecture Review Leadership", goals: ["Lead mock architecture review sessions", "Study enterprise architecture patterns (TOGAF basics)", "Develop executive communication style", "Practice whiteboard architecture sessions"], expectedOutput: "Architecture review framework document + 3 recorded architecture presentations", tasks: [
        { title: "Study: Enterprise architecture frameworks — TOGAF, C4 model, ArchiMate at CTO level", type: TaskType.STUDY, skillArea: SkillArea.CLOUD_ARCHITECTURE, timeBlocks: 3 },
        { title: "Practice: 3 whiteboard architecture sessions (recorded) with AI Coach feedback", type: TaskType.PRACTICE, skillArea: SkillArea.CLOUD_ARCHITECTURE, timeBlocks: 4 },
        { title: "Write: Architecture review checklist for evaluating vendor proposals", type: TaskType.BUILD, skillArea: SkillArea.PRODUCT_FINANCE_LEADERSHIP, timeBlocks: 2 },
        { title: "Study: Managing technical debt — classification, remediation roadmaps, stakeholder communication", type: TaskType.STUDY, skillArea: SkillArea.PRODUCT_FINANCE_LEADERSHIP, timeBlocks: 2 },
      ]},
      { weekNumber: 20, title: "AI Observability Platform + Phase 5 Review", goals: ["Complete AI Observability & Cost Control Platform", "Full LLM monitoring, cost tracking, quality evaluation", "Phase 5 synthesis and review", "Update all skill scores"], expectedOutput: "AI Observability Platform on GitHub + updated skills assessment", tasks: [
        { title: "Build: AI Observability Platform — token tracking, latency P99, quality scores, cost alerts", type: TaskType.BUILD, skillArea: SkillArea.AI_SYSTEMS, timeBlocks: 5 },
        { title: "Integrate: OpenTelemetry + Grafana + custom LLM evaluation metrics", type: TaskType.BUILD, skillArea: SkillArea.PLATFORM_ENGINEERING, timeBlocks: 4 },
        { title: "Review: Full Phase 5 mock interview — leadership and strategy questions", type: TaskType.PRACTICE, skillArea: SkillArea.PRODUCT_FINANCE_LEADERSHIP, timeBlocks: 3 },
        { title: "Update: Skills assessment + portfolio review — what's interview-ready?", type: TaskType.REVIEW, skillArea: SkillArea.PRODUCT_FINANCE_LEADERSHIP, timeBlocks: 2 },
      ]},
    ],
  },
  {
    number: 6,
    title: "Market Readiness",
    description:
      "Polish your portfolio, sharpen your story, practice interviews intensively, build your network, and prepare all materials for CTO/Principal Architect job applications.",
    focus: "Portfolio · Mock Interviews · Resume · Networking · Storytelling",
    startDate: weekStart(START, 20),
    endDate: addDays(weekStart(START, 24), 2), // Nov 4
    status: PhaseStatus.UPCOMING,
    deliverable: "Complete job-ready portfolio + resume + interview preparation package",
    weeks: [
      { weekNumber: 21, title: "Portfolio Polish & Resume Crafting", goals: ["Polish all 5 GitHub projects to production standard", "Write compelling README for each project", "Create AI-generated resume bullets for each", "Craft executive-level resume and LinkedIn"], expectedOutput: "5 polished GitHub repos + updated resume + LinkedIn profile", tasks: [
        { title: "Polish: Each of 5 GitHub projects — README, architecture diagram, demo GIF/video", type: TaskType.BUILD, skillArea: SkillArea.PRODUCT_FINANCE_LEADERSHIP, timeBlocks: 6 },
        { title: "Write: Executive resume targeting CTO / Principal Architect / AI Solutions Architect", type: TaskType.BUILD, skillArea: SkillArea.PRODUCT_FINANCE_LEADERSHIP, timeBlocks: 4 },
        { title: "Update: LinkedIn profile — headline, about, featured projects, skills endorsements", type: TaskType.BUILD, skillArea: SkillArea.PRODUCT_FINANCE_LEADERSHIP, timeBlocks: 2 },
      ]},
      { weekNumber: 22, title: "Technical Interview Intensive", goals: ["Complete 20+ system design mock interviews", "Practice live coding (Python, distributed systems)", "Study common CTO interview questions", "Record and review your own answers"], expectedOutput: "Interview prep playbook + 10 recorded mock answers", tasks: [
        { title: "Practice: 10 system design interviews (AI Coach generates questions + evaluates)", type: TaskType.PRACTICE, skillArea: SkillArea.CLOUD_ARCHITECTURE, timeBlocks: 6 },
        { title: "Practice: 5 behavioral / leadership interviews — STAR format", type: TaskType.PRACTICE, skillArea: SkillArea.PRODUCT_FINANCE_LEADERSHIP, timeBlocks: 3 },
        { title: "Study: 50 CTO interview questions — compile with your answer frameworks", type: TaskType.STUDY, skillArea: SkillArea.PRODUCT_FINANCE_LEADERSHIP, timeBlocks: 3 },
        { title: "Record: 10 video answers to top interview questions — review and refine", type: TaskType.BUILD, skillArea: SkillArea.PRODUCT_FINANCE_LEADERSHIP, timeBlocks: 4 },
      ]},
      { weekNumber: 23, title: "Networking & Company Research", goals: ["Identify 20 target companies/roles", "Reach out to 10 people in your network", "Attend 2 virtual events or Meetups", "Research company tech stacks and challenges"], expectedOutput: "Target company list with research notes + 10 active conversations", tasks: [
        { title: "Research: 20 target companies — tech stack, CTO challenges, culture", type: TaskType.STUDY, skillArea: SkillArea.PRODUCT_FINANCE_LEADERSHIP, timeBlocks: 4 },
        { title: "Network: LinkedIn outreach to 10 CTOs / architects — personalised messages", type: TaskType.BUILD, skillArea: SkillArea.PRODUCT_FINANCE_LEADERSHIP, timeBlocks: 2 },
        { title: "Write: 3 technical blog posts (AI, Data Platform, Platform Engineering) for LinkedIn/Medium", type: TaskType.BUILD, skillArea: SkillArea.PRODUCT_FINANCE_LEADERSHIP, timeBlocks: 6 },
        { title: "Practice: 5 company-specific architecture discussions with AI Coach", type: TaskType.PRACTICE, skillArea: SkillArea.CLOUD_ARCHITECTURE, timeBlocks: 3 },
      ]},
      { weekNumber: 24, title: "Final Readiness & Launch", goals: ["Complete final skills assessment", "Final interview practice sprint", "Apply to 10+ roles", "Celebrate milestone achievement"], expectedOutput: "Applications submitted + final skills scorecard + career launch document", tasks: [
        { title: "Final: Complete 7-area skills self-assessment — compare to Week 1 baseline", type: TaskType.REVIEW, skillArea: SkillArea.AI_SYSTEMS, timeBlocks: 2 },
        { title: "Final: 5 mock interviews with AI Coach — full simulation", type: TaskType.PRACTICE, skillArea: SkillArea.PRODUCT_FINANCE_LEADERSHIP, timeBlocks: 5 },
        { title: "Apply: Submit applications to 10 curated roles", type: TaskType.BUILD, skillArea: SkillArea.PRODUCT_FINANCE_LEADERSHIP, timeBlocks: 4 },
        { title: "Write: Career transformation story — from data engineer to CTO, 6-month journey", type: TaskType.BUILD, skillArea: SkillArea.PRODUCT_FINANCE_LEADERSHIP, timeBlocks: 3 },
      ]},
    ],
  },
];

// ============================================================
// INITIAL SKILL SCORES
// ============================================================
const initialSkillScores = [
  { area: SkillArea.AI_SYSTEMS, score: 35 },
  { area: SkillArea.DATA_PLATFORMS, score: 72 },
  { area: SkillArea.CLOUD_ARCHITECTURE, score: 55 },
  { area: SkillArea.ENTERPRISE_INTEGRATION, score: 68 },
  { area: SkillArea.PLATFORM_ENGINEERING, score: 42 },
  { area: SkillArea.SECURITY, score: 38 },
  { area: SkillArea.PRODUCT_FINANCE_LEADERSHIP, score: 50 },
];

// ============================================================
// PROJECTS
// ============================================================
const projects = [
  {
    title: "Enterprise AI RAG Platform",
    description:
      "A production-grade Retrieval-Augmented Generation platform with multi-tenant document ingestion, semantic search, streaming responses, LLM observability, and cost tracking. Built on GCP with Kafka, pgvector, and LangGraph.",
    status: "PLANNING" as const,
    completionPct: 0,
    skillAreas: [SkillArea.AI_SYSTEMS, SkillArea.DATA_PLATFORMS, SkillArea.CLOUD_ARCHITECTURE],
    tasks: [
      { title: "Set up GCP project, VPC, and GKE cluster", priority: "HIGH" as const },
      { title: "Design document ingestion pipeline (Kafka → processor → pgvector)", priority: "HIGH" as const },
      { title: "Build RAG API with FastAPI + LangChain", priority: "HIGH" as const },
      { title: "Implement multi-tenant data isolation", priority: "MEDIUM" as const },
      { title: "Add LLM cost tracking and budget alerts", priority: "MEDIUM" as const },
      { title: "Write architecture documentation and README", priority: "LOW" as const },
    ],
  },
  {
    title: "Travel Booking Event Platform",
    description:
      "An event-driven microservices platform for travel bookings using Kafka, Saga orchestration, CQRS, and event sourcing. Supports flight + hotel + payment booking with retry, DLQ, and exactly-once semantics.",
    status: "PLANNING" as const,
    completionPct: 0,
    skillAreas: [SkillArea.ENTERPRISE_INTEGRATION, SkillArea.DATA_PLATFORMS, SkillArea.CLOUD_ARCHITECTURE],
    tasks: [
      { title: "Design domain model and event schema (Avro + Schema Registry)", priority: "HIGH" as const },
      { title: "Implement Saga orchestrator for booking workflow", priority: "HIGH" as const },
      { title: "Build REST + GraphQL API layer", priority: "HIGH" as const },
      { title: "Implement transactional outbox pattern", priority: "MEDIUM" as const },
      { title: "Add OpenTelemetry tracing end-to-end", priority: "MEDIUM" as const },
    ],
  },
  {
    title: "Modern Data Platform",
    description:
      "A lakehouse architecture on GCP with Delta Lake on GCS, dbt transformations, Apache Flink for streaming, and a self-service analytics layer. Demonstrates migration from Hadoop/Hive to modern data stack.",
    status: "PLANNING" as const,
    completionPct: 0,
    skillAreas: [SkillArea.DATA_PLATFORMS, SkillArea.CLOUD_ARCHITECTURE, SkillArea.PLATFORM_ENGINEERING],
    tasks: [
      { title: "Design lakehouse schema: bronze/silver/gold layers", priority: "HIGH" as const },
      { title: "Build dbt models for silver and gold transformations", priority: "HIGH" as const },
      { title: "Implement Flink streaming job for real-time aggregations", priority: "MEDIUM" as const },
      { title: "Set up Metabase/Looker Studio for self-service analytics", priority: "LOW" as const },
    ],
  },
  {
    title: "AI Observability & Cost Control Platform",
    description:
      "Production monitoring platform for LLM applications: per-request cost tracking, latency P50/P99, hallucination detection, quality scoring, and budget alerting across multiple AI providers.",
    status: "PLANNING" as const,
    completionPct: 0,
    skillAreas: [SkillArea.AI_SYSTEMS, SkillArea.PLATFORM_ENGINEERING, SkillArea.SECURITY],
    tasks: [
      { title: "OpenTelemetry SDK instrumentation for LLM calls", priority: "HIGH" as const },
      { title: "Build cost aggregation pipeline by model/feature/team", priority: "HIGH" as const },
      { title: "Grafana dashboards: token usage, latency, quality scores", priority: "MEDIUM" as const },
      { title: "Budget alerting and automatic model routing (cost vs quality)", priority: "MEDIUM" as const },
    ],
  },
  {
    title: "Secure SaaS Multi-tenant Platform",
    description:
      "A full GitOps-deployed, zero-trust secured, multi-tenant SaaS platform on GKE. Features namespace isolation, Vault secrets management, Istio service mesh, SAST/DAST in CI/CD, and SOC2-ready audit logging.",
    status: "PLANNING" as const,
    completionPct: 0,
    skillAreas: [SkillArea.PLATFORM_ENGINEERING, SkillArea.SECURITY, SkillArea.CLOUD_ARCHITECTURE],
    tasks: [
      { title: "Terraform: GKE, VPC, Cloud SQL, Redis, Secret Manager", priority: "HIGH" as const },
      { title: "ArgoCD App of Apps GitOps pattern for all environments", priority: "HIGH" as const },
      { title: "Istio service mesh with mTLS and traffic policies", priority: "HIGH" as const },
      { title: "Vault integration for dynamic database credentials", priority: "MEDIUM" as const },
      { title: "GitHub Actions pipeline with SAST, DAST, image scanning", priority: "MEDIUM" as const },
      { title: "Audit logging to BigQuery + alerting for compliance", priority: "LOW" as const },
    ],
  },
];

// ============================================================
// SEED MAIN
// ============================================================
async function main() {
  console.log("🌱 Starting CTO Learning OS seed...");

  // Clear existing data
  await prisma.projectTask.deleteMany();
  await prisma.project.deleteMany();
  await prisma.dailyTask.deleteMany();
  await prisma.week.deleteMany();
  await prisma.phase.deleteMany();
  await prisma.skillScore.deleteMany();
  await prisma.coachMessage.deleteMany();
  await prisma.coachSession.deleteMany();

  console.log("🗑️  Cleared existing data");

  // Seed phases and weeks
  for (const phaseData of phases) {
    const { weeks: weeksData, ...phaseFields } = phaseData;

    const phase = await prisma.phase.create({ data: phaseFields });
    console.log(`  ✅ Phase ${phase.number}: ${phase.title}`);

    for (const weekData of weeksData) {
      const { tasks: tasksData, ...weekFields } = weekData;

      const weekStartDate = addDays(phaseFields.startDate, (weekFields.weekNumber - 1 - (phaseFields.number - 1) * 4) * 7);
      const weekEndDate = addDays(weekStartDate, 6);

      const week = await prisma.week.create({
        data: {
          ...weekFields,
          phaseId: phase.id,
          startDate: weekStartDate,
          endDate: weekEndDate,
        },
      });

      // Create daily tasks spread across the week
      for (let i = 0; i < tasksData.length; i++) {
        const taskDate = addDays(weekStartDate, Math.min(i, 4)); // spread across Mon-Fri
        await prisma.dailyTask.create({
          data: {
            weekId: week.id,
            title: tasksData[i].title,
            type: tasksData[i].type,
            skillArea: tasksData[i].skillArea,
            timeBlocks: tasksData[i].timeBlocks,
            dueDate: taskDate,
            status: phase.number === 1 && weekData.weekNumber === 1 ? "PENDING" : "PENDING",
          },
        });
      }

      console.log(`    📅 Week ${weekFields.weekNumber}: ${weekFields.title}`);
    }
  }

  // Seed skill scores
  for (const score of initialSkillScores) {
    await prisma.skillScore.create({ data: score });
  }
  console.log("  📊 Initial skill scores created");

  // Seed projects
  for (const proj of projects) {
    const { tasks: taskList, skillAreas, ...projFields } = proj;
    const project = await prisma.project.create({
      data: { ...projFields, skillAreas },
    });
    for (const task of taskList) {
      await prisma.projectTask.create({
        data: { ...task, projectId: project.id },
      });
    }
    console.log(`  🏗️  Project: ${project.title}`);
  }

  // Seed default coach session
  const session = await prisma.coachSession.create({
    data: { title: "CTO Coaching — General" },
  });
  await prisma.coachMessage.create({
    data: {
      sessionId: session.id,
      role: "ASSISTANT",
      content:
        "Welcome to your CTO Learning OS AI Coach! I'm here to help you on your journey to becoming an AI + Data + Cloud CTO by November 4, 2026.\n\nI can help you with:\n• **Architecture deep dives** — explain any concept at CTO level\n• **Mock interviews** — grill you on system design and leadership\n• **Code reviews** — review your practice code and suggest improvements\n• **Daily debriefs** — ask you end-of-day questions and plan tomorrow\n• **Scenario challenges** — present real-world architecture problems to solve\n\nWhere would you like to start today?",
    },
  });
  console.log("  🤖 Default coach session created");

  // Seed today's streak
  await prisma.dailyStreak.upsert({
    where: { date: new Date(new Date().toDateString()) },
    update: {},
    create: {
      date: new Date(new Date().toDateString()),
      completed: false,
      tasksTotal: 5,
      tasksDone: 0,
    },
  });

  console.log("\n✨ Seed complete! CTO Learning OS is ready.");
  console.log("   Run: npm run dev to start the application");
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
