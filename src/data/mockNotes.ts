import { NoteItem } from '@/types/lms';

export const MOCK_NOTES: NoteItem[] = [
  {
    id: 'note-cs-301',
    title: 'Advanced Dynamic Programming & Graph Algorithms',
    subject: 'Data Structures & Algorithms',
    subjectCode: 'CS301',
    department: 'Computer Science & Engineering',
    professor: 'Dr. Aris Thorne',
    semester: 'Semester 5',
    uploadDate: 'Yesterday, 4:20 PM',
    pageCount: 38,
    readTime: '25 min',
    price: 0,
    isPurchased: true,
    downloads: 1420,
    rating: 4.9,
    reviewsCount: 128,
    previewSnippet:
      'Comprehensive breakdown of Bellman-Ford, Floyd-Warshall, 0/1 Knapsack, matrix chain multiplication, and optimal binary search trees with worked examples and recursion trees.',
    aiSummary: {
      overview:
        'Focuses on state design for multi-dimensional DP, recurrence relations, and shortest-path graph relaxations. Highly tested in Midterm & End-Sem exams.',
      keyPoints: [
        'Overlapping subproblems vs optimal substructure identification checklist',
        'State transition compression from O(N^2) space to O(N) space',
        'Detecting negative weight cycles using Bellman-Ford nth iteration',
        'Memoization vs Bottom-up tabulation trade-offs in recursive trees'
      ],
      examTips: [
        'Direct question alert: Practice 4-marker Floyd-Warshall all-pairs matrix derivation.',
        'Beware of base cases when index is 0 in 1-indexed DP tables.'
      ],
      formulaSheet: [
        'dp[i][w] = max(dp[i-1][w], val[i-1] + dp[i-1][w - wt[i-1]])',
        'd(k)[i][j] = min(d(k-1)[i][j], d(k-1)[i][k] + d(k-1)[k][j])'
      ]
    },
    tags: ['Dynamic Programming', 'Graph Theory', 'Midterm Prep', 'Algorithms']
  },
  {
    id: 'note-ai-402',
    title: 'Transformers Architecture & Self-Attention Mechanics',
    subject: 'Artificial Intelligence',
    subjectCode: 'AI402',
    department: 'AI & Data Science',
    professor: 'Prof. Elena Rostova',
    semester: 'Semester 7',
    uploadDate: 'Oct 3, 2026',
    pageCount: 44,
    readTime: '30 min',
    price: 149,
    isPurchased: false,
    downloads: 870,
    rating: 4.8,
    reviewsCount: 94,
    previewSnippet:
      'Mathematical foundations of Scaled Dot-Product Attention, Multi-Head projections, Positional Encodings, and Layer Normalization inside the Decoder stack.',
    aiSummary: {
      overview:
        'Detailed step-by-step matrix derivation of Attention(Q, K, V) and why scaling factor 1/√d_k prevents softmax gradients from vanishing.',
      keyPoints: [
        'Query, Key, and Value linear projections explained geometrically',
        'Why scaling by sqrt(d_k) stabilizes softmax gradients for large dimension sizes',
        'Sinusoidal vs learned relative positional embeddings',
        'Causal masking in auto-regressive generative decoders'
      ],
      examTips: [
        'Common viva question: Derive time complexity of standard self-attention (O(N^2 * d)).',
        'Draw the full encoder-decoder block diagram with residual skip connections.'
      ]
    },
    tags: ['Deep Learning', 'Transformers', 'NLP', 'GenAI']
  },
  {
    id: 'note-math-201',
    title: 'Multivariable Calculus & Partial Differential Equations',
    subject: 'Engineering Mathematics',
    subjectCode: 'MATH201',
    department: 'Applied Sciences',
    professor: 'Dr. Suresh Varma',
    semester: 'Semester 3',
    uploadDate: 'Oct 1, 2026',
    pageCount: 52,
    readTime: '35 min',
    price: 0,
    isPurchased: true,
    downloads: 2310,
    rating: 4.7,
    reviewsCount: 215,
    previewSnippet:
      'Green’s Theorem, Stokes’ Theorem, and Gauss Divergence Theorem with 3D coordinate vector fields, surface flux integrals, and Fourier series expansion.',
    aiSummary: {
      overview:
        'Complete handbook for vector calculus integral theorems, boundary orientations, and method of separation of variables for wave/heat equations.',
      keyPoints: [
        'Line integral to double integral transformation via Green’s Theorem',
        'Surface flux calculation using unit normal vectors and projection planes',
        'Dirichlet and Neumann boundary conditions in 1D heat diffusion',
        'Fourier sine and cosine series coefficients calculation tricks'
      ],
      examTips: [
        '100% Guaranteed 7-mark question on verifying Stokes Theorem on paraboloid or hemisphere.',
        'Check curl F = 0 before computing line integrals to exploit conservative fields.'
      ]
    },
    tags: ['Vector Calculus', 'Stokes Theorem', 'PDE', 'Fourier Series']
  },
  {
    id: 'note-os-303',
    title: 'Process Synchronization, Semaphores & Virtual Memory',
    subject: 'Operating Systems',
    subjectCode: 'CS303',
    department: 'Computer Science & Engineering',
    professor: 'Prof. Marcus Chen',
    semester: 'Semester 5',
    uploadDate: 'Sep 29, 2026',
    pageCount: 36,
    readTime: '22 min',
    price: 99,
    isPurchased: false,
    downloads: 1640,
    rating: 4.9,
    reviewsCount: 160,
    previewSnippet:
      'Peterson’s algorithm, mutex locks, counting semaphores, classic IPC problems (Dining Philosophers, Readers-Writers), and 2-level paging TLB hit rates.',
    aiSummary: {
      overview:
        'Thorough breakdown of mutual exclusion conditions, deadlock detection Banker’s algorithm, and effective memory access time calculations.',
      keyPoints: [
        'Four Coffman conditions necessary for deadlock to happen',
        'Semaphores wait() and signal() atomic primitive execution',
        'Effective Memory Access Time (EMAT) formula with TLB hit ratios',
        'Page replacement algorithms: FIFO, LRU, Optimal Belady anomaly'
      ],
      examTips: [
        'Numerical question: Calculate EMAT given TLB search time and main memory access time.',
        'Always verify Safety Algorithm state matrix before granting resource requests.'
      ]
    },
    tags: ['Deadlock', 'Semaphores', 'Virtual Memory', 'Paging']
  },
  {
    id: 'note-ec-204',
    title: 'Digital Logic Design & Finite State Machines',
    subject: 'Digital Electronics',
    subjectCode: 'EC204',
    department: 'Electronics & Communication',
    professor: 'Dr. Radhika Nair',
    semester: 'Semester 4',
    uploadDate: 'Sep 26, 2026',
    pageCount: 30,
    readTime: '18 min',
    price: 0,
    isPurchased: true,
    downloads: 1120,
    rating: 4.6,
    reviewsCount: 88,
    previewSnippet:
      'Karnaugh Maps 4-variable minimization, synchronous and asynchronous counters, Mealy vs Moore state machines, and setup/hold timing violations.',
    aiSummary: {
      overview:
        'High-yield guide for digital circuit design, timing analysis, flip-flop conversions, and sequential circuit state reduction.',
      keyPoints: [
        'K-Map grouping rules with Don’t Care conditions',
        'JK to D and T flip-flop excitation table conversions',
        'Mealy vs Moore machines: Output dependency on inputs vs present state',
        'Setup time (T_setup) and Hold time (T_hold) slack margin calculations'
      ],
      examTips: [
        'Draw clean state transition tables before drawing state diagrams.',
        'Remember that Moore machine outputs are synchronized with clock edges only.'
      ]
    },
    tags: ['K-Maps', 'FSM', 'Flip-Flops', 'Digital Circuits']
  },
  {
    id: 'note-cc-405',
    title: 'Cloud Architecture & Distributed Microservices Patterns',
    subject: 'Cloud Computing',
    subjectCode: 'CS405',
    department: 'Computer Science & Engineering',
    professor: 'Prof. David Vance',
    semester: 'Semester 7',
    uploadDate: 'Sep 24, 2026',
    pageCount: 40,
    readTime: '28 min',
    price: 199,
    isPurchased: false,
    downloads: 730,
    rating: 4.8,
    reviewsCount: 65,
    previewSnippet:
      'CAP Theorem, Circuit Breaker pattern, Event-driven architecture with Kafka, Kubernetes Pod lifecycle, and AWS Serverless Lambda cold start mitigations.',
    aiSummary: {
      overview:
        'Architectural blueprint for distributed systems, consistency models, service meshes, and resilient cloud deployments.',
      keyPoints: [
        'Trade-offs between Strong Consistency (CP) and Eventual Consistency (AP)',
        'Circuit Breaker states: Closed, Open, Half-Open threshold tuning',
        'Saga Orchestration vs Choreography in distributed transactions',
        'Horizontal Pod Autoscaler (HPA) metric targets in K8s clusters'
      ],
      examTips: [
        'Prepare comparison table: Monolith vs Microservices vs Serverless.',
        'Memorize Fallacies of Distributed Computing for case-study questions.'
      ]
    },
    tags: ['Microservices', 'Kubernetes', 'AWS', 'Distributed Systems']
  }
];

export const SUBJECT_CATEGORIES: { name: string; count: number }[] = [
  { name: 'All Subjects', count: 6 },
  { name: 'Data Structures & Algorithms', count: 1 },
  { name: 'Artificial Intelligence', count: 1 },
  { name: 'Engineering Mathematics', count: 1 },
  { name: 'Operating Systems', count: 1 },
  { name: 'Digital Electronics', count: 1 },
  { name: 'Cloud Computing', count: 1 }
];
